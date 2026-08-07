export type ProcessArea =
  | 'Comercial'
  | 'Jurídico'
  | 'Financeiro'
  | 'Backoffice'
  | 'Logística'
  | 'Pós-venda'

export type NodeKind =
  | 'root'
  | 'stage'
  | 'process'
  | 'decision'
  | 'positive'
  | 'negative'
  | 'system'
  | 'alert'
  | 'group'

export type PlanBadge = 'intervention' | 'quick-win' | 'layer' | 'llm'

export interface NodeDetails {
  description?: string
  owner?: string
  system?: string
  input?: string
  output?: string
  risks?: string[]
  automation?: string
  intervention?: string
  quickWinId?: string
  planPhase?: string
}

export interface ProcessNodeData extends Record<string, unknown> {
  label: string
  kind: NodeKind
  area?: ProcessArea
  stageId?: string
  details?: NodeDetails
  badges?: PlanBadge[]
  width?: number
}

export interface StageMeta {
  id: string
  number: number
  title: string
  area: ProcessArea
}

export const STAGES: StageMeta[] = [
  { id: 's1', number: 1, title: 'Encontrar o Lead', area: 'Comercial' },
  { id: 's2', number: 2, title: 'Negociação / Prova + visita', area: 'Comercial' },
  { id: 's3', number: 3, title: 'Cadastro do Cliente', area: 'Comercial' },
  { id: 's4', number: 4, title: 'Contrato de fornecimento', area: 'Jurídico' },
  { id: 's5', number: 5, title: 'Input Pedido', area: 'Comercial' },
  { id: 's6', number: 6, title: 'Processamento Pedido', area: 'Logística' },
  { id: 's7', number: 7, title: 'Contas a Receber', area: 'Financeiro' },
  { id: 's8', number: 8, title: 'Tracking Pedidos', area: 'Logística' },
  { id: 's9', number: 9, title: 'Recompra / Pós-Venda', area: 'Pós-venda' },
]

export const AREA_FILTERS: ProcessArea[] = [
  'Comercial',
  'Jurídico',
  'Financeiro',
  'Backoffice',
  'Logística',
  'Pós-venda',
]

/** Cores da legenda do processo B2B */
export const KIND_STYLES: Record<
  Exclude<NodeKind, 'group'>,
  { bg: string; text: string; border: string }
> = {
  root: { bg: '#424BB5', text: '#ffffff', border: '#323B9D' },
  stage: { bg: '#2399E5', text: '#ffffff', border: '#1684C8' },
  process: { bg: '#B9DDF5', text: '#18384D', border: '#8CC5EA' },
  decision: { bg: '#9BD850', text: '#173B12', border: '#7DBA36' },
  positive: { bg: '#9BD850', text: '#173B12', border: '#7DBA36' },
  negative: { bg: '#F04A24', text: '#ffffff', border: '#D83917' },
  system: { bg: '#FFD86B', text: '#473A00', border: '#E5BC46' },
  alert: { bg: '#FFAAA4', text: '#5C1E1A', border: '#EE8D86' },
}
