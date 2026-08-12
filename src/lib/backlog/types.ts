export type EnrichmentLevel = 'raw' | 'story' | 'spec'

export type BacklogColumnId = 'requirement' | 'story' | 'ready' | 'dev' | 'done'

export type BacklogBoardId =
  | 'colmeia'
  | 'banco-ativos'
  | 'agentes'
  | 'visibilidade'

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
  kind: 'user-story' | 'gap' | 'milestone' | 'manual'
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

export interface BacklogStorePayload {
  version: number
  clientId: string
  updatedAt: string
  /** Overrides e cards manuais/enriched — keyed by card id. */
  cards: Record<string, BacklogCard>
  /** Cards removidos do seed (ids). */
  removedIds: string[]
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

export const BACKLOG_BOARDS: BacklogBoard[] = [
  {
    id: 'colmeia',
    title: 'Colmeia · Meus Roteiros',
    description: 'Planner, metodologia, resultados e jornada do roteiro OOH.',
    productLabel: 'Colmeia · Meus Roteiros',
  },
  {
    id: 'banco-ativos',
    title: 'Banco de Ativos',
    description: 'Inventário, exibidores, media kit, cadastros e funil de aprovação.',
    productLabel: 'Banco de Ativos',
  },
  {
    id: 'agentes',
    title: 'Agentes / Adaptive Layer™',
    description: 'Copiloto, agentes da jornada e contratos da Adaptive Layer™.',
    productLabel: 'Agentes · Adaptive Layer™',
  },
  {
    id: 'visibilidade',
    title: 'Teste de Visibilidade',
    description: 'Frontend e backend do teste de visibilidade / image brand processing.',
    productLabel: 'Teste de Visibilidade',
  },
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
