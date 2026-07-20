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

/**
 * Esforço sem commits visíveis no histórico de produto
 * (ex.: migração de backend, infra, estabilização de ambiente).
 */
export interface ManualEffortItem {
  label: string
  hours: number
  description?: string
  /** Datas ISO (YYYY-MM-DD) — o item entra no período se houver interseção. */
  from?: string
  to?: string
}

export interface PrRow {
  number: number
  repo: string
  branch: string
  title: string
  type: DeliveryType
  product: string
  mergedAt: string
  additions: number
  deletions: number
  changedFiles: number
  commitCount: number
  /** Horas estimadas desta PR (parcela do gitHours pelo peso de linhas). */
  estimatedHours: number
}

export interface ModuleGroup {
  key: string
  name: string
  type: DeliveryType | 'infra'
  product: string
  commitCount: number
  prNumbers: number[]
  description: string
  /** Presente apenas em módulos de esforço manual. */
  manualHours?: number
  estimatedHours: number
  linesAdded: number
  linesDeleted: number
  firstMergedAt?: string
  lastMergedAt?: string
}

export interface PeriodStats {
  commits: number
  pullRequests: number
  featureCommits: number
  fixCommits: number
  filesChanged: number
  linesAdded: number
  linesDeleted: number
}

export interface EffortEstimate {
  gitHours: number
  manualHours: number
  totalHours: number
  /** Faixa de variação (±variancePct). */
  totalHoursMin: number
  totalHoursMax: number
  weeks: number
  hoursPerWeek: number
  personMonths: number
  /** Percentuais da distribuição feat/fix sobre commits classificados. */
  featPct: number
  fixPct: number
}

/** KPIs de negócio derivados do período. */
export interface DeliveryKpis {
  /** PRs mescladas por semana. */
  velocityPrPerWeek: number
  /** % do esforço/commits em features vs correções. */
  featureRatioPct: number
  /** Correções / features — saúde do produto (menor = melhor). */
  fixToFeatureRatio: number
  /** Média de linhas por PR. */
  avgLinesPerPr: number
  /** Média de arquivos por PR. */
  avgFilesPerPr: number
  /** Horas médias por PR (estimadas). */
  avgHoursPerPr: number
  /** Share do produto com mais entrega (nome + %). */
  topProduct: { name: string; pct: number } | null
  /** Net code: adds - dels. */
  netLines: number
}

export interface WeeklyBucket {
  weekStart: string
  label: string
  prs: number
  features: number
  fixes: number
  linesAdded: number
  hours: number
}

export interface RoadmapMilestone {
  id: string
  date: string
  title: string
  type: DeliveryType | 'infra'
  product: string
  hours: number
  prNumbers: number[]
  status: 'done'
}

export interface RepoStatus {
  repo: string
  ok: boolean
  /** 'token' | 'rate' | mensagem. */
  error?: string
}

export interface ProductBreakdown {
  product: string
  prs: number
  hours: number
  linesAdded: number
}

export interface DeliveryReport {
  periodStart: string
  periodEnd: string
  periodDays: number
  stats: PeriodStats
  estimate: EffortEstimate
  kpis: DeliveryKpis
  weekly: WeeklyBucket[]
  roadmap: RoadmapMilestone[]
  byProduct: ProductBreakdown[]
  modules: ModuleGroup[]
  prs: PrRow[]
  repos: RepoStatus[]
  generatedAt: string
}
