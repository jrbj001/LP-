import { formatCadenceSummaryForPrompt, getCadenceSummary, type CadenceSummary } from '@/lib/cadence/summary'
import { seedCadenceClient } from '@/lib/cadence/seed'
import {
  formatCopilotSqlContext,
  gatherCopilotSqlContext,
} from '@/lib/cadence/copilot-sql-context'
import { CADENCE_SCHEMA } from '@/lib/cadence/schema'
import type { RepoConfig } from '@/lib/delivery/types'
import {
  formatGithubContextForPrompt,
  gatherGithubContextForQuery,
  type GithubContextBundle,
} from './github-context'
import { asDiagram, asStringArray, callOpenAiJson } from './llm'
import {
  type BacklogBoardId,
  type BacklogCard,
  type BacklogDiagram,
  type CopilotMessage,
  type CopilotSqlEvidence,
  type CopilotThread,
  type GithubRef,
  type StoryDraft,
} from './types'
import { getBacklogBoards } from './boards'
import { getBacklogSnapshot } from './store'

export interface CopilotTurn {
  reply: string
  diagram: BacklogDiagram
  storyDraft?: StoryDraft
  flowNotes: string[]
  sqlEvidence?: CopilotSqlEvidence
  followUps: string[]
  sources: GithubRef[]
}

function systemPrompt(clientId: string, clientName: string, sector: string): string {
  const specialization =
    clientId === 'likeme'
      ? 'Especialize-se em saúde, marketplace, comunidade e nas integrações relevantes Tabia, pagamentos e Social Plus. Não presuma detalhes de implementação que não apareçam no contexto fornecido.'
      : 'Especialize-se no domínio de mídia exterior (OOH) e nos produtos Colmeia, Banco de Ativos, agentes e teste de visibilidade.'

  return `Você é o copiloto de produto de ${clientName} (${sector}). ${specialization}

Você conversa com um Product Manager em português do Brasil. A user story é o destino — não o primeiro passo.

Como trabalhar:
1. Enriquecer: entender o fluxo real da empresa (atores, sistemas, regras, exceções, o que já existe no código e no board).
2. Aprender: acumule fatos em "flowNotes" a cada turno. Não descarte o que já foi aprendido.
3. Só então escrever a story: persona, objetivo, valor e critérios de aceite testáveis, ancorados no fluxo aprendido.

Regras:
- Sempre responda em português do Brasil, direto e concreto, sem preâmbulo.
- SEMPRE devolva um "diagram" do fluxo da empresa (como é hoje, o trecho que está em discussão, ou o to-be). O desenho é obrigatório em toda resposta.
- Deixe "storyDraft" como null enquanto faltar fluxo, persona, valor ou aceite verificável. Faça 1 a 3 perguntas objetivas e avance o entendimento. Não invente uma story só para preencher o campo.
- Proponha "storyDraft" somente quando (a) o PM pedir explicitamente a user story / rascunho, ou (b) o fluxo da empresa já estiver claro o bastante para uma story útil. Se já existir rascunho, refine-o — não recomece do zero.
- Use GitHub, cards do board, o resumo Cadence e, quando houver, a consulta ao banco de produção (Colmeia ou Banco de Ativos). Cite arquivos reais. Não invente números.
- Quando houver "Consulta SQL deste turno", use seus resultados como evidência factual e explique o que eles confirmam. Diferencie workspace Cadence de dados de produção. Se não houver consulta, não invente volumes operacionais.
- Critérios de aceite devem ser verificáveis (Dado/Quando/Então ou afirmações checáveis).
- Nunca invente nomes de arquivos ou endpoints que não estejam no contexto; se for hipótese, deixe claro no texto.
- "followUps" aprofundam o fluxo da empresa (exceções, sistemas, papéis, regras). Não sugira "aplicar no board" — isso é um botão na interface.
- "flowNotes": 3 a 8 fatos curtos sobre o fluxo da empresa, mesclando o que já foi aprendido com o que este turno revelou.

Responda SOMENTE com um objeto JSON:
{
  "reply": "resposta em markdown simples (sem títulos H1), 2 a 6 parágrafos curtos ou bullets",
  "diagram": {
    "title": "string",
    "nodes": [{ "id": "n1", "label": "string", "detail": "string opcional", "kind": "actor|input|process|system|output" }],
    "edges": [{ "from": "n1", "to": "n2", "label": "string opcional" }]
  },
  "flowNotes": ["fato curto sobre o fluxo da empresa"],
  "storyDraft": {
    "title": "string",
    "persona": "string",
    "want": "string",
    "soThat": "string",
    "acceptance": ["string"],
    "priority": "Alta|Média|Baixa"
  } | null,
  "followUps": ["pergunta curta para aprofundar o fluxo"]
}
O diagrama precisa ter entre 3 e 8 nós e arestas coerentes com os ids dos nós.`
}

function boardLabel(clientId: string, boardId: BacklogBoardId): string {
  return getBacklogBoards(clientId).find(b => b.id === boardId)?.productLabel ?? boardId
}

function cardBrief(card?: BacklogCard | null): string {
  if (!card) return 'Nenhum card vinculado a esta conversa.'
  return JSON.stringify(
    {
      id: card.id,
      title: card.title,
      level: card.level,
      column: card.column,
      persona: card.persona,
      want: card.want,
      soThat: card.soThat,
      acceptance: card.acceptance,
      context: card.context,
      priority: card.priority,
    },
    null,
    2
  )
}

/** Histórico compacto: só texto, sem diagramas, para economizar tokens. */
function historyBrief(messages: CopilotMessage[]): string {
  const recent = messages.slice(-10)
  if (recent.length === 0) return 'Início da conversa.'
  return recent
    .map(m => {
      const who = m.role === 'user' ? 'PM' : 'Copiloto'
      const text = m.content.replace(/\s+/g, ' ').slice(0, 700)
      const draft =
        m.role === 'assistant' && m.storyDraft
          ? ` [rascunho: ${m.storyDraft.title}]`
          : ''
      return `${who}: ${text}${draft}`
    })
    .join('\n')
}

function lastStoryDraftBrief(messages: CopilotMessage[]): string {
  const last = [...messages].reverse().find(m => m.role === 'assistant' && m.storyDraft)
  if (!last?.storyDraft) return 'Nenhum rascunho ainda. Só escreva storyDraft quando o fluxo estiver claro ou o PM pedir.'
  return JSON.stringify(
    {
      title: last.storyDraft.title,
      persona: last.storyDraft.persona,
      want: last.storyDraft.want,
      soThat: last.storyDraft.soThat,
      acceptance: last.storyDraft.acceptance,
      priority: last.storyDraft.priority,
    },
    null,
    2
  )
}

function lastFlowNotes(messages: CopilotMessage[]): string[] {
  const last = [...messages].reverse().find(m => m.role === 'assistant' && (m.flowNotes?.length ?? 0) > 0)
  return last?.flowNotes ?? []
}

function mergeFlowNotes(previous: string[], next: string[]): string[] {
  const seen = new Set<string>()
  const merged: string[] = []
  for (const note of [...previous, ...next]) {
    const key = note.replace(/\s+/g, ' ').trim()
    if (!key) continue
    const norm = key.toLowerCase()
    if (seen.has(norm)) continue
    seen.add(norm)
    merged.push(key)
  }
  return merged.slice(-8)
}

function boardMemoryBrief(cards: BacklogCard[], boardId: BacklogBoardId): string {
  const same = cards.filter(card => card.boardId === boardId).slice(0, 10)
  if (same.length === 0) return 'Nenhum card neste board ainda.'
  return same
    .map(card => {
      const bits = [
        `[${card.column}/${card.level}] ${card.title}`,
        card.persona ? `persona: ${card.persona}` : '',
        card.want ? `quero: ${card.want}` : '',
      ].filter(Boolean)
      return `- ${bits.join(' · ')}`
    })
    .join('\n')
}

function wantsStoryNow(message: string): boolean {
  return /user story|rascunho completo da user story|escreva a user story|escreva uma user story|gerar rascunho|aplicar no board/i.test(
    message
  )
}

const FLOW_FOLLOW_UPS = [
  'Quem dispara e quem aprova neste fluxo?',
  'O que acontece quando a regra de negócio falha?',
  'Qual sistema é a fonte da verdade aqui?',
]

function withFlowFollowUps(followUps: string[]): string[] {
  const merged = followUps.length > 0 ? followUps : FLOW_FOLLOW_UPS
  return [...new Set(merged.map(item => item.trim()).filter(Boolean))].slice(0, 4)
}

function fallbackDiagram(clientId: string, boardId: BacklogBoardId, question: string): BacklogDiagram {
  const focus = question.replace(/\s+/g, ' ').trim().slice(0, 42) || 'Necessidade do PM'
  if (clientId === 'likeme') {
    return {
      title: `Fluxo proposto · ${boardLabel(clientId, boardId)}`,
      nodes: [
        { id: 'pm', label: 'PM / usuário', detail: focus, kind: 'actor' },
        { id: 'produto', label: boardLabel(clientId, boardId), kind: 'process' },
        { id: 'valor', label: 'Resultado esperado', kind: 'output' },
      ],
      edges: [
        { from: 'pm', to: 'produto', label: 'requisito' },
        { from: 'produto', to: 'valor', label: 'entrega' },
      ],
    }
  }
  return {
    title: `Fluxo proposto · ${boardLabel(clientId, boardId)}`,
    nodes: [
      { id: 'pm', label: 'PM / operação', detail: focus, kind: 'actor' },
      { id: 'produto', label: boardLabel(clientId, boardId), kind: 'process' },
      { id: 'layer', label: 'Adaptive Layer', detail: 'Orquestra dados e eventos', kind: 'system' },
      { id: 'valor', label: 'Resultado esperado', kind: 'output' },
    ],
    edges: [
      { from: 'pm', to: 'produto', label: 'requisito' },
      { from: 'produto', to: 'layer', label: 'dados' },
      { from: 'layer', to: 'valor', label: 'entrega' },
    ],
  }
}

function asStoryDraft(value: unknown, boardId: BacklogBoardId): StoryDraft | undefined {
  if (!value || typeof value !== 'object') return undefined
  const v = value as Record<string, unknown>
  const title = typeof v.title === 'string' ? v.title.trim() : ''
  const persona = typeof v.persona === 'string' ? v.persona.trim() : ''
  const want = typeof v.want === 'string' ? v.want.trim() : ''
  const soThat = typeof v.soThat === 'string' ? v.soThat.trim() : ''
  const acceptance = asStringArray(v.acceptance).slice(0, 10)
  if (!title || !want || acceptance.length === 0) return undefined
  const priority =
    v.priority === 'Alta' || v.priority === 'Média' || v.priority === 'Baixa' ? v.priority : undefined
  return { boardId, title, persona, want, soThat, acceptance, priority }
}

function sourcesFromContext(
  bundle: GithubContextBundle,
  summary: CadenceSummary,
  sqlEvidence: CopilotSqlEvidence | null,
  reply: string
): GithubRef[] {
  const cited = bundle.snippets.filter(s => reply.includes(s.path) || reply.includes(s.path.split('/').pop() ?? ''))
  const chosen = cited.length > 0 ? cited : bundle.snippets.slice(0, 4)
  const git = chosen.slice(0, 6).map(s => ({ repo: s.repo, path: s.path, kind: 'git' as const }))
  const queriedTables = sqlEvidence
    ? [
        ...sqlEvidence.sql.matchAll(
          /\b(?:from|join)\s+(?:\[?[a-z_][a-z0-9_]*\]?\.)?\[?([a-z_][a-z0-9_]*)\]?/gi
        ),
      ].map(match => match[1].toLowerCase())
    : []
  const sql: GithubRef[] = [...new Set(queriedTables)].slice(0, 4).map(path => ({
    repo: sqlEvidence?.sourceName ?? 'sql',
    path,
    kind: 'sql' as const,
  }))
  if (sql.length === 0 && sqlEvidence?.sourceName) {
    sql.push({ repo: sqlEvidence.sourceName, path: 'consulta', kind: 'sql' })
  } else if (sql.length === 0 && summary.available) {
    sql.push({ repo: 'cadence', path: 'resumo agregado', kind: 'sql' })
  }
  return [...git, ...sql]
}

export async function runCopilotTurn(input: {
  clientId: string
  clientName: string
  clientSector: string
  thread: CopilotThread
  message: string
  card?: BacklogCard | null
  repos: RepoConfig[]
}): Promise<CopilotTurn> {
  const { clientId, clientName, clientSector, thread, message, card, repos } = input
  const prompt = systemPrompt(clientId, clientName, clientSector)

  const queryParts = [message, card?.title ?? '', thread.title].filter(Boolean)
  const askForStory = wantsStoryNow(message)
  const previousNotes = lastFlowNotes(thread.messages)
  const [bundle, snapshot] = await Promise.all([
    gatherGithubContextForQuery(
      { clientId, boardId: thread.boardId, query: queryParts.join(' ') },
      repos
    ),
    getBacklogSnapshot(clientId),
    seedCadenceClient(clientId),
  ])
  const [summary, sqlEvidence] = await Promise.all([
    getCadenceSummary(clientId),
    gatherCopilotSqlContext({
      clientId,
      boardId: thread.boardId,
      message,
      recentContext: `${historyBrief(thread.messages)}\n${previousNotes.join('\n')}`.slice(0, 4000),
    }),
  ])

  const user = [
    `Cliente: ${clientName} (${clientSector})`,
    `Board / produto: ${boardLabel(clientId, thread.boardId)}`,
    `Modo deste turno: ${askForStory ? 'O PM pediu a user story agora. Devolva storyDraft completo, ancorado no fluxo aprendido.' : 'Enriquecer e aprender o fluxo da empresa. storyDraft só se o fluxo já estiver claro.'}`,
    `Card vinculado:\n${cardBrief(card)}`,
    `Memória do board (como a empresa já descreve o trabalho):\n${boardMemoryBrief(snapshot.cards, thread.boardId)}`,
    `Histórico recente:\n${historyBrief(thread.messages)}`,
    `O que já aprendemos do fluxo da empresa:\n${previousNotes.length ? previousNotes.map(n => `- ${n}`).join('\n') : 'Ainda nada acumulado. Comece a registrar fatos.'}`,
    `Rascunho atual (refine só se for escrever storyDraft):\n${lastStoryDraftBrief(thread.messages)}`,
    `Modelagem do workspace Cadence (não é produção):\n${CADENCE_SCHEMA}`,
    formatCadenceSummaryForPrompt(summary),
    `Consulta SQL deste turno:\n${formatCopilotSqlContext(sqlEvidence)}`,
    `Contexto do código (GitHub):\n${formatGithubContextForPrompt(bundle)}`,
    `Pergunta atual do PM:\n${message}`,
  ].join('\n\n')

  let parsed = (await callOpenAiJson(prompt, user, {
    temperature: 0.3,
    maxTokens: 2600,
  })) as Record<string, unknown>

  let reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : ''
  let diagram = asDiagram(parsed.diagram)
  let storyDraft = asStoryDraft(parsed.storyDraft, thread.boardId)

  if (!reply || !diagram || (askForStory && !storyDraft)) {
    parsed = (await callOpenAiJson(
      prompt,
      `${user}\n\nA resposta anterior veio incompleta. Devolva o JSON completo, com "reply" preenchido, "diagram" com no mínimo 3 nós e arestas ligando ids existentes, e "flowNotes" atualizados.${askForStory ? ' O PM pediu a user story: "storyDraft" é obrigatório neste turno.' : ' Se o fluxo ainda não estiver claro, storyDraft deve ser null.'}`,
      { temperature: 0.2, maxTokens: 2600 }
    )) as Record<string, unknown>
    reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : reply
    diagram = asDiagram(parsed.diagram) ?? diagram
    storyDraft = asStoryDraft(parsed.storyDraft, thread.boardId) ?? storyDraft
  }

  if (!reply) {
    throw new Error('A IA não conseguiu responder. Tente reformular a pergunta.')
  }

  const previousDraft = [...thread.messages].reverse().find(m => m.storyDraft)?.storyDraft
  if (askForStory && !storyDraft && previousDraft) {
    storyDraft = { ...previousDraft, boardId: thread.boardId }
  }

  return {
    reply,
    diagram: diagram ?? fallbackDiagram(clientId, thread.boardId, message),
    storyDraft,
    flowNotes: mergeFlowNotes(previousNotes, asStringArray(parsed.flowNotes)),
    sqlEvidence: sqlEvidence ?? undefined,
    followUps: withFlowFollowUps(asStringArray(parsed.followUps)),
    sources: sourcesFromContext(bundle, summary, sqlEvidence, reply),
  }
}
