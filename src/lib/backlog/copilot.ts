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
  type CopilotThread,
  type GithubRef,
  type StoryDraft,
} from './types'
import { getBacklogBoards } from './boards'

export interface CopilotTurn {
  reply: string
  diagram: BacklogDiagram
  storyDraft?: StoryDraft
  followUps: string[]
  sources: GithubRef[]
}

function systemPrompt(clientId: string, clientName: string, sector: string): string {
  const specialization =
    clientId === 'likeme'
      ? 'Especialize-se em saúde, marketplace, comunidade e nas integrações relevantes Tabia, pagamentos e Social Plus. Não presuma detalhes de implementação que não apareçam no contexto fornecido.'
      : 'Especialize-se no domínio de mídia exterior (OOH) e nos produtos Colmeia, Banco de Ativos, agentes e teste de visibilidade.'

  return `Você é o copiloto de produto de ${clientName} (${sector}). ${specialization}

Você conversa com um Product Manager em português do Brasil para construir user stories prontas para desenvolvimento.

Regras:
- Sempre responda em português do Brasil, direto e concreto, sem preâmbulo.
- SEMPRE devolva um "diagram" ilustrando o que você explicou (fluxo, arquitetura ou jornada). O desenho é obrigatório em toda resposta.
- Use o contexto de código do GitHub quando disponível e cite os arquivos que consultou pelo caminho real.
- Só proponha "storyDraft" quando houver informação suficiente para uma story útil (persona, objetivo, valor e critérios de aceite testáveis). Caso falte informação essencial, deixe storyDraft como null e faça perguntas objetivas.
- Critérios de aceite devem ser verificáveis e escritos no formato "Dado/Quando/Então" ou como afirmações checáveis.
- Nunca invente nomes de arquivos ou endpoints que não estejam no contexto; se for hipótese, deixe claro no texto.

Responda SOMENTE com um objeto JSON:
{
  "reply": "resposta em markdown simples (sem títulos H1), 2 a 6 parágrafos curtos ou bullets",
  "diagram": {
    "title": "string",
    "nodes": [{ "id": "n1", "label": "string", "detail": "string opcional", "kind": "actor|input|process|system|output" }],
    "edges": [{ "from": "n1", "to": "n2", "label": "string opcional" }]
  },
  "storyDraft": {
    "title": "string",
    "persona": "string",
    "want": "string",
    "soThat": "string",
    "acceptance": ["string"],
    "priority": "Alta|Média|Baixa"
  } | null,
  "followUps": ["pergunta curta sugerida ao PM"]
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
      return `${who}: ${text}`
    })
    .join('\n')
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

function sourcesFromContext(bundle: GithubContextBundle, reply: string): GithubRef[] {
  const cited = bundle.snippets.filter(s => reply.includes(s.path) || reply.includes(s.path.split('/').pop() ?? ''))
  const chosen = cited.length > 0 ? cited : bundle.snippets.slice(0, 4)
  return chosen.slice(0, 6).map(s => ({ repo: s.repo, path: s.path }))
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
  const bundle = await gatherGithubContextForQuery(
    { clientId, boardId: thread.boardId, query: queryParts.join(' ') },
    repos
  )

  const user = [
    `Cliente: ${clientName} (${clientSector})`,
    `Board / produto: ${boardLabel(clientId, thread.boardId)}`,
    `Card vinculado:\n${cardBrief(card)}`,
    `Histórico recente:\n${historyBrief(thread.messages)}`,
    `Contexto do código (GitHub):\n${formatGithubContextForPrompt(bundle)}`,
    `Pergunta atual do PM:\n${message}`,
  ].join('\n\n')

  let parsed = (await callOpenAiJson(prompt, user, {
    temperature: 0.3,
    maxTokens: 2600,
  })) as Record<string, unknown>

  let reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : ''
  let diagram = asDiagram(parsed.diagram)

  if (!reply || !diagram) {
    // Retentativa estrita: o desenho é obrigatório na UI.
    parsed = (await callOpenAiJson(
      prompt,
      `${user}\n\nA resposta anterior veio incompleta. Devolva o JSON completo, com "reply" preenchido e "diagram" contendo no mínimo 3 nós e as arestas ligando ids existentes.`,
      { temperature: 0.2, maxTokens: 2600 }
    )) as Record<string, unknown>
    reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : reply
    diagram = asDiagram(parsed.diagram) ?? diagram
  }

  if (!reply) {
    throw new Error('A IA não conseguiu responder. Tente reformular a pergunta.')
  }

  return {
    reply,
    diagram: diagram ?? fallbackDiagram(clientId, thread.boardId, message),
    storyDraft: asStoryDraft(parsed.storyDraft, thread.boardId),
    followUps: asStringArray(parsed.followUps).slice(0, 4),
    sources: sourcesFromContext(bundle, reply),
  }
}
