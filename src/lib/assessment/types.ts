// Assessment platform — multi-client types.
//
// Cada cliente novo é um "pack de dados" (src/components/assessment/tenants/<slug>)
// que preenche este shape. As páginas e diagramas são genéricos e data-driven,
// então adicionar um cliente NÃO exige novas rotas nem novos componentes.

import type { LucideIcon } from 'lucide-react'

/** Features que um tenant pode expor. A navegação é derivada das ativas. */
export type AssessmentFeature =
  | 'home'
  | 'framework'
  | 'diagnostico'
  | 'adaptiveLayer'
  | 'documentos'
  // Futuras (Orfeu-like), ainda não implementadas na plataforma nova:
  | 'onboard'
  | 'projects'
  | 'meetings'
  | 'executiveReview'
  | 'proposta'

export interface AssessmentContact {
  name: string
  role: string
  initials: string
  email?: string
}

export interface AssessmentClient {
  id: string
  slug: string
  name: string
  sector: string
  /** Tom de acento opcional (badges, destaques). Default: neutro PixelPulseLab. */
  accent?: string
  /** Frase curta que resume a lacuna/oportunidade central do cliente. */
  tagline: string
  facilitator?: AssessmentContact
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export interface AssessmentStat {
  value: string
  label: string
  hint?: string
}

export interface AssessmentJourneyStep {
  id: string
  title: string
  description: string
  status: 'done' | 'active' | 'upcoming'
}

export interface AssessmentHome {
  /** O problema em uma frase (hero). */
  problem: string
  /** Parágrafos de abertura re-elaborados. */
  narrative: string[]
  stats: AssessmentStat[]
  journey: AssessmentJourneyStep[]
  /** O que o cliente recebe ao final do assessment. */
  deliverables: { metric: string; label: string; description: string }[]
}

// ─── Diagnóstico ────────────────────────────────────────────────────────────
export type MaturityLevel = 'madura' | 'inicial' | 'verde'

export interface MaturityDimension {
  dimension: string
  level: MaturityLevel
  comment: string
}

export interface DiagnosticStat {
  value: string
  label: string
  source?: string
  tone?: 'neutral' | 'leaf' | 'alert'
}

export interface DiagnosticSection {
  id: string
  eyebrow: string
  title: string
  lead?: string
  paragraphs?: string[]
  stats?: DiagnosticStat[]
  bullets?: string[]
}

export interface Benchmark {
  id: string
  name: string
  headline: string
  stats: DiagnosticStat[]
  whatTheyDid: string
  lesson: string
}

export interface DiagnosticFinding {
  title: string
  detail: string
}

export interface Recommendation {
  rank: number
  title: string
  detail: string
}

export interface AssessmentDiagnostic {
  summary: DiagnosticSection
  sections: DiagnosticSection[]
  benchmarks: Benchmark[]
  matureAssets: DiagnosticFinding[]
  gaps: DiagnosticFinding[]
  maturity: MaturityDimension[]
  recommendations: Recommendation[]
  sources?: string[]
}

// ─── Aplicação da Adaptive Layer no cliente ──────────────────────────────────
export interface LayerSystem {
  id: string
  name: string
  owner: string
  role: string
  today: string
  pain: string
  layerRole: string
}

export interface LayerCapability {
  id: 'integration' | 'data' | 'apis' | 'security'
  title: string
  detail: string
}

export type AgentIconKey =
  | 'orchestrator'
  | 'commercial'
  | 'channel'
  | 'inventory'
  | 'price'
  | 'marketing'
  | 'repurchase'
  | 'logistics'
  | 'finance'

export interface LayerAgent {
  id: string
  name: string
  icon: AgentIconKey
  role: string
  example: string
  owner: string
}

export interface AlertGroup {
  id: string
  label: string
  tone: 'comercial' | 'operacional' | 'marketing'
  items: string[]
}

export interface QuickWin {
  id: string
  stage: string
  opportunity: string
  enabledBy: string
  owner: string
  /** true no item final (Command Center / LLM sobre a camada). */
  llm?: boolean
}

export interface AssessmentLayerApplication {
  eyebrow: string
  title: string
  lead: string
  /** Sistemas do cliente que a Layer conecta (para o diagrama de arquitetura). */
  connects: string[]
  /** O que a camada destrava para este cliente. */
  unlocks: string[]
  systems: LayerSystem[]
  capabilities: LayerCapability[]
  agents: LayerAgent[]
  alerts: AlertGroup[]
  quickWins: QuickWin[]
  /** Canal de saída dos alertas (ex.: "WhatsApp Business + e-mail"). */
  alertChannel: string
}

// ─── Documentos ───────────────────────────────────────────────────────────────
export interface AssessmentDocument {
  name: string
  type: string
  size: string
  status: 'available' | 'locked'
  href?: string
  external?: string
  highlight?: boolean
}

// ─── Workspace ──────────────────────────────────────────────────────────────
export interface AssessmentWorkspace {
  client: AssessmentClient
  features: AssessmentFeature[]
  /**
   * Senha de acesso à área. Gate client-side (mesmo padrão da proposta do
   * Orfeu): protege de acesso casual ao link, não é controle de acesso real.
   */
  password?: string
  home: AssessmentHome
  diagnostic?: AssessmentDiagnostic
  layer?: AssessmentLayerApplication
  documents?: AssessmentDocument[]
}

// ─── Navegação derivada ─────────────────────────────────────────────────────
export interface AssessmentNavItem {
  label: string
  /** Caminho relativo à base do tenant (ex.: '/diagnostico'); '' = home. */
  href: string
  icon: LucideIcon
}
