export type EnrichmentLevel = 'raw' | 'story' | 'spec'

export type BacklogColumnId = 'requirement' | 'story' | 'ready' | 'dev' | 'done'

export type BacklogBoardId =
  | 'colmeia'
  | 'banco-ativos'
  | 'agentes'
  | 'visibilidade'
  | 'likeme-landing'
  | 'likeme-app'
  | 'likeme-backend'

export interface GithubRef {
  repo: string
  path?: string
  pr?: number
}

export interface BacklogDiagramNode {
  id: string
  label: string
  detail?: string
  kind?: 'actor' | 'input' | 'process' | 'system' | 'output'
}

export interface BacklogDiagramEdge {
  from: string
  to: string
  label?: string
}

export interface BacklogDiagram {
  title: string
  nodes: BacklogDiagramNode[]
  edges: BacklogDiagramEdge[]
}

export interface BacklogCardSource {
  kind: 'user-story' | 'gap' | 'milestone' | 'manual' | 'meeting'
  ref?: string
}

export interface BacklogCard {
  id: string
  boardId: BacklogBoardId
  column: BacklogColumnId
  title: string
  level: EnrichmentLevel
  persona?: string
  want?: string
  soThat?: string
  acceptance?: string[]
  context?: string
  implementationNotes?: string
  filesLikely?: string[]
  testPlan?: string[]
  risks?: string[]
  githubRefs?: GithubRef[]
  diagram?: BacklogDiagram
  phase?: string
  priority?: 'Alta' | 'Média' | 'Baixa'
  source: BacklogCardSource
  updatedAt: string
  createdAt: string
}

export interface BacklogBoard {
  id: BacklogBoardId
  title: string
  description: string
  productLabel: string
}

export interface StoryDraft {
  boardId: BacklogBoardId
  title: string
  persona: string
  want: string
  soThat: string
  acceptance: string[]
  priority?: 'Alta' | 'Média' | 'Baixa'
  diagram?: BacklogDiagram
}

export interface CopilotMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  diagram?: BacklogDiagram
  storyDraft?: StoryDraft
  sources?: GithubRef[]
  followUps?: string[]
  /** Card criado/atualizado quando o PM aplica o rascunho. */
  appliedCardId?: string
  createdAt: string
}

export interface CopilotThread {
  id: string
  title: string
  boardId: BacklogBoardId
  cardId?: string
  messages: CopilotMessage[]
  createdAt: string
  updatedAt: string
}

export interface CopilotThreadSummary {
  id: string
  title: string
  boardId: BacklogBoardId
  cardId?: string
  messageCount: number
  updatedAt: string
}

export interface BacklogStorePayload {
  version: number
  clientId: string
  updatedAt: string
  /** Overrides e cards manuais/enriched — keyed by card id. */
  cards: Record<string, BacklogCard>
  /** Cards removidos do seed (ids). */
  removedIds: string[]
  /** Conversas do copiloto — keyed by thread id. */
  threads?: Record<string, CopilotThread>
}

export interface BacklogSnapshot {
  boards: BacklogBoard[]
  columns: { id: BacklogColumnId; label: string }[]
  cards: BacklogCard[]
  updatedAt: string
}

export const BACKLOG_STORE_VERSION = 1

export const BACKLOG_COLUMNS: { id: BacklogColumnId; label: string }[] = [
  { id: 'requirement', label: 'Requisito' },
  { id: 'story', label: 'User Story' },
  { id: 'ready', label: 'Pronta p/ agent' },
  { id: 'dev', label: 'Em desenvolvimento' },
  { id: 'done', label: 'Done' },
]

export type CardPatch = Partial<
  Pick<
    BacklogCard,
    | 'boardId'
    | 'column'
    | 'title'
    | 'level'
    | 'persona'
    | 'want'
    | 'soThat'
    | 'acceptance'
    | 'context'
    | 'implementationNotes'
    | 'filesLikely'
    | 'testPlan'
    | 'risks'
    | 'githubRefs'
    | 'diagram'
    | 'phase'
    | 'priority'
  >
>
