export type DeliveryType = 'feature' | 'fix' | 'improvement' | 'maintenance'

/** Regra de produto dentro de um repo (ex.: Banco de Ativos dentro do Colmeia). */
export interface ProductRule {
  label: string
  /** Regex (case-insensitive) testada contra "branch título" da PR. */
  pattern: string
}

export interface RepoConfig {
  owner: string
  repo: string
  /** Produto padrão do repo (quando nenhuma regra casa). */
  label: string
  products?: ProductRule[]
}

export interface EffortBreakdown {
  /** Horas estimadas pelo sinal de sessões de trabalho (git-hours). */
  sessionHours: number
  /** Horas estimadas pelo sinal de complexidade da entrega. */
  complexityHours: number
  baseHours: number
  sizeFactor: number
  reviewRounds: number
  commitCount: number
  /** Resultado final: blend arredondado. */
  billableHours: number
}

export interface DeliveryItem {
  id: string
  repo: string
  prNumber: number
  product: string
  title: string
  type: DeliveryType
  mergedAt: string
  authorInitials: string
  filesChanged: number
  additions: number
  deletions: number
  reviewApproved: boolean
  deployedToProduction: boolean
  effort: EffortBreakdown
}

export interface DeliverySummary {
  periodDays: number
  totalDeliveries: number
  features: number
  fixes: number
  improvements: number
  maintenance: number
  productionDeploys: number
  totalHours: number
  byProduct: { product: string; deliveries: number; hours: number }[]
}

export interface RepoStatus {
  repo: string
  ok: boolean
  /** 'token' = repo privado sem GITHUB_TOKEN; senão mensagem curta. */
  error?: string
}

export interface DeliveryWeek {
  weekStart: string
  items: DeliveryItem[]
}

export interface DeliveriesData {
  summary: DeliverySummary
  weeks: DeliveryWeek[]
  repos: RepoStatus[]
  generatedAt: string
}
