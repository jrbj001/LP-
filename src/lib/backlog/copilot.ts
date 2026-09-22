import { formatCadenceSummaryForPrompt, getCadenceSummary, type CadenceSummary } from '@/lib/cadence/summary'
import { seedCadenceClient } from '@/lib/cadence/seed'
import { CADENCE_SCHEMA } from '@/lib/cadence/schema'
import type { RepoConfig } from '@/lib/delivery/types'
import {
  formatKnowledgeResearchForPrompt,
  gatherKnowledgeResearch,
} from '@/lib/knowledge/research'
import type { KnowledgeResearch } from '@/lib/knowledge/types'
import {
  resolveQuestionIntent,
  type QuestionClarification,
} from '@/lib/knowledge/intent'
import { isKnowledgePipelineEnabled } from '@/lib/knowledge/flag'
import { formatCritiqueForPrompt } from '@/lib/knowledge/result-critic'
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
import { BE180_WHATSAPP_BOARD_IDS, getBacklogBoards } from './boards'
import { getBacklogSnapshot } from './store'
import { wantsStoryNow } from './triage'
import {
  firstTurnFooter,
  firstTurnWelcome,
  isOrientationAsk,
  welcomeDiagram,
  welcomeFollowUps,
} from './welcome'

export interface CopilotTurn {
  reply: string
  diagram: BacklogDiagram
  storyDraft?: StoryDraft
  flowNotes: string[]
  followUps: string[]
  sources: GithubRef[]
  sqlEvidence?: CopilotSqlEvidence
  researchEvidence: KnowledgeResearch['evidence']
  sourceStatuses: KnowledgeResearch['statuses']
  clarification?: QuestionClarification
}

function systemPrompt(
  clientId: string,
  clientName: string,
  sector: string,
  channel?: CopilotThread['channel']
): string {
  const whatsapp = channel === 'whatsapp'
  const specialization =
    clientId === 'likeme'
      ? 'Especialize-se em saúde, marketplace, comunidade e nas integrações relevantes Tabia, pagamentos e Social Plus. Não presuma detalhes de implementação que não apareçam no contexto fornecido.'
      : clientId === 'cadence' || clientId === 'pixelpulselab'
        ? 'Especialize-se no Cadence: workspace, copiloto, consultar, backlog e canais (WhatsApp). Responda curto o bastante para caber no WhatsApp.'
        : clientId === 'adaptive-layer'
          ? 'Especialize-se na Adaptive Layer™: sistema operacional de IA, agentes, governança, assessment Adaptive Enterprise™ e rollout em clientes.'
        : clientId === 'be180-ooh'
          ? 'Especialize-se no domínio de mídia exterior (OOH) e nos produtos Colmeia · Meus Roteiros, Banco de Ativos e Teste de Visibilidade. WhatsApp e web são o mesmo Copiloto: só você fala com a pessoa. Se a pergunta for de um produto, foque nele; se for transversal, compare os três. Quando houver números reais, comece por eles em linguagem falada.'
          : 'Especialize-se no domínio de mídia exterior (OOH) e nos produtos Colmeia, Banco de Ativos, agentes e teste de visibilidade.'

  const voice = whatsapp
    ? `Canal WhatsApp: a "reply" é uma mensagem de colega — português do Brasil, 2 a 6 frases curtas. Nunca cole SQL, JSON, nome de tabela, endpoint, boardId ou "user story" (só se a pessoa pedir). Não mande para outra tela. Números em fala: "Olhei agora no Colmeia: são 3.541 roteiros." Saudação: responda humano e ofereça ajuda concreta. Feche com uma pergunta natural quando fizer sentido.`
    : `Canal web: a "reply" é conversa em português do Brasil, direta, sem preâmbulo. Markdown simples. Nunca cole SQL, nome de tabela, endpoint ou boardId — a pessoa só vê a voz do Copiloto. Números em fala: "Olhei agora no Colmeia: são 3.541 roteiros."`

  return `Você é o copiloto da empresa ${clientName} (${sector}). ${specialization}

${voice}

Um agente de dados já pode ter consultado Cadence, Colmeia ou Banco de Ativos neste turno. Use esses números em linguagem natural. Sem evidência, não invente volumes.

Como trabalhar:
1. Se a pergunta pede entendimento de fluxo, enriqueça com código no GitHub, cards do board, reuniões, documentos do workspace e conversa. Acumule fatos em "flowNotes".
2. Se a pergunta pede volume, ranking ou status e houver evidência, responda com o número falado, o produto (Colmeia, Banco de Ativos, Cadence) e o recorte (filtro ou período). Se a evidência trouxer hipótese (vazio por filtro, JOIN duplicado, teto de 100), não trate o número como fato absoluto. Sem evidência, diga que não achou o dado agora — não invente e não mande o usuário para outra tela.
3. A user story só vem quando o PM pedir ou o fluxo já estiver claro o bastante. storyDraft fica null enquanto faltar persona, valor ou aceite.

Regras:
- Sempre responda em português do Brasil, direto e concreto, sem preâmbulo.
- SEMPRE devolva um "diagram" do fluxo ou do recorte em discussão. O desenho é obrigatório em toda resposta (fica no workspace; no WhatsApp só a reply aparece).
- Deixe "storyDraft" como null enquanto faltar fluxo, persona, valor ou aceite verificável. Faça 1 a 3 perguntas objetivas quando estiver no modo de story.
- Proponha "storyDraft" somente quando (a) o PM pedir explicitamente a user story / rascunho, ou (b) o fluxo da empresa já estiver claro o bastante para uma story útil. Se já existir rascunho, refine-o — não recomece do zero.
- Use GitHub, cards do board, reuniões e documentos do workspace Cadence e a evidência do agente de dados. Cite o título da reunião ou do documento em linguagem natural. Cite arquivos reais só no canal web. Não invente números de produção. SQL, nome de tabela e endpoint nunca entram na "reply".
- Critérios de aceite devem ser verificáveis (Dado/Quando/Então ou afirmações checáveis).
- Quando a pesquisa trouxer a resposta, use os nomes concretos que aparecem nela (bibliotecas, serviços, tabelas, decisões) em vez de descrições genéricas como "métodos padrão" ou "boas práticas". Resposta vaga tendo evidência conta como erro.
- Se a pesquisa não cobrir parte da pergunta, diga qual parte ficou sem evidência em vez de preencher com suposição plausível.
- Nunca invente nomes de arquivos ou endpoints que não estejam no contexto; se for hipótese, deixe claro no texto.
- "followUps" são próximas perguntas úteis, em linguagem natural. Não sugira "aplicar no board" — isso é um botão na interface.
- "flowNotes": 3 a 8 fatos curtos sobre a empresa, mesclando o que já foi aprendido com o que este turno revelou.

Responda SOMENTE com um objeto JSON:
{
  "reply": "conversa em português do Brasil, sem SQL e sem jargão de sistema",
  "diagram": {
    "title": "string",
    "nodes": [{ "id": "n1", "label": "string", "detail": "string opcional", "kind": "actor|input|process|system|output" }],
    "edges": [{ "from": "n1", "to": "n2", "label": "string opcional" }]
  },
  "flowNotes": ["fato curto sobre o fluxo da empresa"],
  "storyDraft": {
    "boardId": "colmeia|banco-ativos|visibilidade quando o canal for WhatsApp Be180",
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

function pendingClarification(
  messages: CopilotMessage[]
): QuestionClarification | null {
  const last = messages.at(-1)
  return last?.role === 'assistant' ? last.clarification ?? null : null
}

function clarificationDiagram(
  clientName: string,
  clarification: QuestionClarification
): BacklogDiagram {
  return {
    title: 'Definir antes de consultar',
    nodes: [
      {
        id: 'pergunta',
        label: 'Sua pergunta',
        detail: clarification.originalQuestion.slice(0, 80),
        kind: 'input',
      },
      {
        id: 'definicao',
        label: 'Definição necessária',
        detail: clarification.question.slice(0, 90),
        kind: 'process',
      },
      {
        id: 'consulta',
        label: `Consulta ${clientName}`,
        detail: 'Executada somente após sua confirmação',
        kind: 'system',
      },
    ],
    edges: [
      { from: 'pergunta', to: 'definicao', label: 'ambiguidade' },
      { from: 'definicao', to: 'consulta', label: 'confirmar' },
    ],
  }
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

function boardMemoryBrief(
  cards: BacklogCard[],
  boardId: BacklogBoardId,
  clientId: string,
  channel?: CopilotThread['channel']
): string {
  const ids =
    clientId === 'be180-ooh' && (boardId === 'cadence' || channel === 'whatsapp')
      ? BE180_WHATSAPP_BOARD_IDS
      : [boardId]
  const same = cards.filter(card => ids.includes(card.boardId)).slice(0, 12)
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

function resolveStoryBoardId(
  value: Record<string, unknown>,
  fallback: BacklogBoardId,
  clientId: string
): BacklogBoardId {
  const raw = typeof value.boardId === 'string' ? value.boardId.trim() : ''
  if (
    clientId === 'be180-ooh' &&
    (BE180_WHATSAPP_BOARD_IDS as string[]).includes(raw)
  ) {
    return raw as BacklogBoardId
  }
  return fallback
}

function asStoryDraft(value: unknown, boardId: BacklogBoardId, clientId: string): StoryDraft | undefined {
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
  return {
    boardId: resolveStoryBoardId(v, boardId, clientId),
    title,
    persona,
    want,
    soThat,
    acceptance,
    priority,
  }
}

function sourcesFromResearch(research: KnowledgeResearch, summary: CadenceSummary): GithubRef[] {
  const sources = research.evidence.slice(0, 10).map(item => ({
    repo: item.source,
    path: item.title,
    kind: item.kind === 'github' ? ('git' as const) : item.kind === 'database' ? ('sql' as const) : ('workspace' as const),
  }))
  if (sources.length === 0 && summary.available) {
    sources.push({ repo: 'cadence', path: 'resumo agregado', kind: 'sql' })
  }
  return sources
}

function stripSchemaFromReply(text: string): string {
  return text
    .replace(/```(?:sql)?[\s\S]*?```/gi, '')
    .replace(/^\s*(fonte|sql|query|endpoint|boardid|tabela)\s*:\s*.+$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
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
  const prompt = systemPrompt(clientId, clientName, clientSector, thread.channel)

  const firstTurn = !thread.messages.some(item => item.role === 'assistant')
  if (isOrientationAsk(message)) {
    return {
      reply: firstTurnWelcome(clientId, clientName),
      diagram: welcomeDiagram(clientName),
      flowNotes: [],
      followUps: welcomeFollowUps(clientId),
      sources: [],
      researchEvidence: [],
      sourceStatuses: [],
    }
  }

  const resolvedIntent = isKnowledgePipelineEnabled(clientId)
    ? resolveQuestionIntent({
        clientId,
        question: message,
        pendingClarification: pendingClarification(thread.messages),
      })
    : {
        intent: null,
        researchQuestion: message,
        clarification: null,
      }
  if (resolvedIntent.clarification) {
    return {
      reply: resolvedIntent.clarification.question,
      diagram: clarificationDiagram(clientName, resolvedIntent.clarification),
      flowNotes: lastFlowNotes(thread.messages),
      followUps: resolvedIntent.clarification.options,
      sources: [],
      researchEvidence: [],
      sourceStatuses: [],
      clarification: resolvedIntent.clarification,
    }
  }

  const effectiveQuestion = resolvedIntent.researchQuestion
  const queryParts = [effectiveQuestion, card?.title ?? '', thread.title].filter(Boolean)
  const askForStory = wantsStoryNow(message)
  const previousNotes = lastFlowNotes(thread.messages)
  const be180Whatsapp = clientId === 'be180-ooh' && (thread.channel === 'whatsapp' || thread.boardId === 'cadence')
  const [research, snapshot] = await Promise.all([
    gatherKnowledgeResearch({
      clientId,
      boardId: thread.boardId,
      question: queryParts.join(' '),
      recentContext: `${previousNotes.join('; ')}\n${historyBrief(thread.messages)}`,
    }),
    getBacklogSnapshot(clientId),
    seedCadenceClient(clientId),
  ])
  const summary = await getCadenceSummary(clientId)
  const firstDatabase = research.databases[0]
  const sqlEvidence: CopilotSqlEvidence | null = firstDatabase
    ? {
        question: firstDatabase.question,
        sql: firstDatabase.sql,
        explanation: firstDatabase.explanation,
        columns: firstDatabase.columns,
        rows: firstDatabase.rows,
        sourceName: firstDatabase.sourceName,
        criticNotes: firstDatabase.critic
          ? formatCritiqueForPrompt(firstDatabase.critic)
          : undefined,
      }
    : null

  const productLine = be180Whatsapp
    ? 'Cadence · WhatsApp (Colmeia, Banco de Ativos e Teste de Visibilidade)'
    : boardLabel(clientId, thread.boardId)
  const user = [
    `Cliente: ${clientName} (${clientSector})`,
    `Board / produto: ${productLine}`,
    be180Whatsapp
      ? 'Se escrever storyDraft, use boardId "colmeia", "banco-ativos" ou "visibilidade" conforme o produto da pergunta.'
      : '',
    `Modo deste turno: ${askForStory ? 'O PM pediu a user story agora. Devolva storyDraft completo, ancorado no fluxo aprendido.' : 'Enriquecer e aprender o fluxo da empresa. storyDraft só se o fluxo já estiver claro.'}`,
    `Card vinculado:\n${cardBrief(card)}`,
    `Memória do board (como a empresa já descreve o trabalho):\n${boardMemoryBrief(snapshot.cards, thread.boardId, clientId, thread.channel)}`,
    `Histórico recente:\n${historyBrief(thread.messages)}`,
    `O que já aprendemos do fluxo da empresa:\n${previousNotes.length ? previousNotes.map(n => `- ${n}`).join('\n') : 'Ainda nada acumulado. Comece a registrar fatos.'}`,
    `Rascunho atual (refine só se for escrever storyDraft):\n${lastStoryDraftBrief(thread.messages)}`,
    `Modelagem do workspace Cadence (não é produção):\n${CADENCE_SCHEMA}`,
    formatCadenceSummaryForPrompt(summary),
    `Pesquisa unificada (GitHub, bancos, reuniões e documentos):\n${formatKnowledgeResearchForPrompt(research)}`,
    `Status das fontes:\n${research.statuses.map(status => `- ${status.label}: ${status.state}${status.detail ? ` — ${status.detail}` : ''}`).join('\n')}`,
    `Mensagem atual do PM:\n${message}`,
    `Pergunta interpretada para pesquisa:\n${effectiveQuestion}`,
  ]
    .filter(Boolean)
    .join('\n\n')

  let parsed = (await callOpenAiJson(prompt, user, {
    temperature: 0.3,
    maxTokens: 2600,
  })) as Record<string, unknown>

  let reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : ''
  let diagram = asDiagram(parsed.diagram)
  let storyDraft = asStoryDraft(parsed.storyDraft, thread.boardId, clientId)

  if (!reply || !diagram || (askForStory && !storyDraft)) {
    parsed = (await callOpenAiJson(
      prompt,
      `${user}\n\nA resposta anterior veio incompleta. Devolva o JSON completo, com "reply" preenchido, "diagram" com no mínimo 3 nós e arestas ligando ids existentes, e "flowNotes" atualizados.${askForStory ? ' O PM pediu a user story: "storyDraft" é obrigatório neste turno.' : ' Se o fluxo ainda não estiver claro, storyDraft deve ser null.'}`,
      { temperature: 0.2, maxTokens: 2600 }
    )) as Record<string, unknown>
    reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : reply
    diagram = asDiagram(parsed.diagram) ?? diagram
    storyDraft = asStoryDraft(parsed.storyDraft, thread.boardId, clientId) ?? storyDraft
  }

  if (!reply) {
    throw new Error('A IA não conseguiu responder. Tente reformular a pergunta.')
  }

  const previousDraft = [...thread.messages].reverse().find(m => m.storyDraft)?.storyDraft
  if (askForStory && !storyDraft && previousDraft) {
    storyDraft = { ...previousDraft, boardId: thread.boardId }
  }

  const spoken = stripSchemaFromReply(reply)

  return {
    reply: firstTurn ? `${spoken}\n\n${firstTurnFooter(clientId)}` : spoken,
    diagram: diagram ?? fallbackDiagram(clientId, thread.boardId, message),
    storyDraft,
    flowNotes: mergeFlowNotes(previousNotes, asStringArray(parsed.flowNotes)),
    followUps: firstTurn
      ? welcomeFollowUps(clientId)
      : withFlowFollowUps(asStringArray(parsed.followUps)),
    sources: sourcesFromResearch(research, summary),
    sqlEvidence: sqlEvidence ?? undefined,
    researchEvidence: research.evidence,
    sourceStatuses: research.statuses,
  }
}
