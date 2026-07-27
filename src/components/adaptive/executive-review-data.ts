// ─── Assessment status ────────────────────────────────────────────────────────

export const REVIEW_META = {
  reviewDate: '2026-07-31T14:00:00-03:00',
  generatedAt: '2026-07-27',
  status: 'preview' as const,
  assessmentsReceived: 9,
  assessmentsExpected: 16,
  meetingsCompleted: 4,
  projectsMapped: 31,
  areasMapped: 10,
}

export const ASSESSMENT_GAPS = [
  'Cristiane (Comercial — crítica para HORECA)',
  'Lucas (Fazenda)',
  'Rafaela (Financeiro / Gestão)',
  'Augusto Kraft (Diretor Comercial — incluir)',
  'Priscila (Supermercados — incluir)',
  'Silvia, Alene, Amanda Raquel, Jéssica Viana, Diego (identificados, assessment pendente)',
]

// ─── Adaptive Index™ ────────────────────────────────────────────────────────────

export interface PillarScore {
  id: string
  name: string
  score: number
  evidence: string
}

export const PILLAR_SCORES: PillarScore[] = [
  {
    id: 'business',
    name: 'Business Alignment™',
    score: 72,
    evidence: 'CEO alinhado; objetivos claros por área; lacunas comercial (Cris / Priscila).',
  },
  {
    id: 'portfolio',
    name: 'Portfolio Health™',
    score: 45,
    evidence: '31 projetos, repriorização constante, equipe TI sobrecarregada.',
  },
  {
    id: 'operational',
    name: 'Operational Excellence™',
    score: 50,
    evidence: 'B2C automatizado; B2B manual; sistemas fragmentados.',
  },
  {
    id: 'technology',
    name: 'Technology Readiness™',
    score: 55,
    evidence: 'Protheus robusto mas engessado; WMS parcial; BIs descentralizados.',
  },
  {
    id: 'ai',
    name: 'AI Readiness™',
    score: 38,
    evidence: 'Alto apetite (CEO, Gustavo, André); dados não integrados; contratos não digitalizados.',
  },
]

export const ADAPTIVE_INDEX = 52

// ─── Recommendations ──────────────────────────────────────────────────────────

export interface Recommendation {
  rank: number
  title: string
  detail: string
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    rank: 1,
    title: 'Capacidade externa embarcada',
    detail:
      'Contratar Pixel como braço de execução — não consultoria rotativa. Continuidade de regras de negócio é crítica (400+ customizações Protheus).',
  },
  {
    rank: 2,
    title: 'Piloto Quick Wins + Faturamento B2B',
    detail:
      'Validar modelo de entrega em 6–8 semanas antes de escalar. Candidatos: conciliação PagBrasil, integração e-mail Suri, resumo IA checklists.',
  },
  {
    rank: 3,
    title: 'Camada de integração de dados',
    detail:
      'Construir infraestrutura antes de novos BIs/dashboards — evita multiplicar silos (visão Gustavo + André).',
  },
  {
    rank: 4,
    title: 'Digitalizar contratos comerciais',
    detail:
      'Desbloqueia IA sobre Protheus e automação de pricing. Hoje contratos em PDF impedem consultas em linguagem natural.',
  },
  {
    rank: 5,
    title: 'Segurança da informação transversal',
    detail:
      'Auditoria + LGPD + monitoramento contínuo. Único tema levantado espontaneamente pelo CEO no assessment.',
  },
]

// ─── Quick Wins ─────────────────────────────────────────────────────────────────

export interface QuickWin {
  id: string
  title: string
  source: string
  effort: 'Baixo' | 'Baixo-Médio' | 'Médio'
  impact: 'Médio' | 'Alto'
  pilot?: boolean
}

export const QUICK_WINS: QuickWin[] = [
  {
    id: 'QW-01',
    title: 'Conciliação PagBrasil (retomar — ~70% pronto)',
    source: 'Discovery André · projeto Rafaela',
    effort: 'Médio',
    impact: 'Alto',
    pilot: true,
  },
  {
    id: 'QW-02',
    title: 'Resumo IA de checklists baristas (45+ relatórios/dia → digest)',
    source: 'Joyce · onboarding Q8/Q9',
    effort: 'Baixo',
    impact: 'Médio',
    pilot: true,
  },
  {
    id: 'QW-03',
    title: 'Automação relatórios Cropster (degustações sensoriais)',
    source: 'Milena · onboarding Q8/Q9',
    effort: 'Baixo-Médio',
    impact: 'Médio',
  },
  {
    id: 'QW-04',
    title: 'Integração e-mail → Suri (CX 360º parcial)',
    source: 'Cibele · onboarding Q8',
    effort: 'Médio',
    impact: 'Alto',
    pilot: true,
  },
  {
    id: 'QW-05',
    title: 'Portal de entregas Pixel para André + comitê TI',
    source: 'Discovery André + Ricardo CEO',
    effort: 'Baixo',
    impact: 'Alto',
  },
  {
    id: 'QW-06',
    title: 'Sistema de chamados TI com SLA visível',
    source: 'Ricardo Silva · onboarding Q11',
    effort: 'Baixo-Médio',
    impact: 'Médio',
  },
]

// ─── Roadmap phases ─────────────────────────────────────────────────────────────

export interface RoadmapItem {
  id: string
  title: string
  projects?: string
  notes?: string
}

export interface RoadmapPhase {
  id: string
  title: string
  window: string
  objective: string
  items: RoadmapItem[]
}

export const ROADMAP: RoadmapPhase[] = [
  {
    id: 'phase-0',
    title: 'Fase 0 — Completar Assessment',
    window: 'Semanas 1–2',
    objective: 'Fechar lacunas antes do Executive Review final.',
    items: [
      { id: '0-1', title: 'Assessments + sessões: Cristiane, Lucas, Rafaela', notes: 'até 30/07' },
      { id: '0-2', title: 'Incluir Augusto Kraft e Priscila no processo', notes: 'Diego' },
      { id: '0-3', title: 'Completar assessments: Silvia, Alene, Amanda, Jéssica, Diego' },
      { id: '0-4', title: 'Agendar sessões presenciais 30 min restantes' },
    ],
  },
  {
    id: 'phase-1',
    title: 'Fase 1 — Quick Wins',
    window: 'Semanas 3–8',
    objective: 'Ganhos rápidos de baixo risco — validar modelo Pixel antes de escalar.',
    items: QUICK_WINS.map(qw => ({
      id: qw.id,
      title: qw.title,
      notes: `${qw.effort} esforço · ${qw.impact} impacto`,
    })),
  },
  {
    id: 'phase-2',
    title: 'Fase 2 — Fundação Digital',
    window: 'Meses 2–4',
    objective: 'Camada de infraestrutura de dados antes de projetos isolados.',
    items: [
      { id: 'F-01', title: 'Camada de integração de dados (Protheus ↔ WMS ↔ Shopify ↔ Suri)', notes: 'Pré-requisito para IA' },
      { id: 'F-02', title: 'Faturamento automático B2B + Varejo', projects: 'Cristiane, André, Cibele, RM', notes: 'Prioridade #1 comitê + CEO' },
      { id: 'F-03', title: 'Site Compra B2B + Página Office', projects: 'Cristiane', notes: 'Shopify pausado aguardando Pixel' },
      { id: 'F-04', title: 'Conciliação Mercado Livre', projects: 'Rafaela' },
      { id: 'F-05', title: 'WMS Botelhos + expansão fábrica', projects: 'Ricardo Silva, Gustavo' },
      { id: 'F-06', title: 'Segurança da informação / LGPD', projects: 'Diego', notes: 'Pilar transversal — CEO' },
    ],
  },
  {
    id: 'phase-3',
    title: 'Fase 3 — Transformação Comercial & IA',
    window: 'Meses 4–8',
    objective: 'Resolver dores estruturais de crescimento nacional.',
    items: [
      { id: 'T-01', title: 'CRM / Jornada do Vendedor (API Protheus)', projects: 'Cristiane, Amanda, Ricardo CEO' },
      { id: 'T-02', title: 'Camada IA/NLP sobre Protheus', projects: 'André', notes: 'Consultas em linguagem natural' },
      { id: 'T-03', title: 'Visão 360º do cliente + VoC', notes: 'Cibele — fora do portfólio hoje' },
      { id: 'T-04', title: 'Dashboard forecast × realizado', projects: 'Amanda Raquel' },
      { id: 'T-05', title: 'Calculadora elasticidade de preço', projects: 'Silvia + Ricardo CEO' },
      { id: 'T-06', title: 'App Baristas Orfeu', projects: 'Joyce' },
    ],
  },
  {
    id: 'phase-4',
    title: 'Fase 4 — Indústria 4.0 & Agro',
    window: 'Meses 6–12',
    objective: 'Referência operacional — visão Gustavo e Milena.',
    items: [
      { id: 'I-01', title: 'Integração OpsFactor × Protheus', projects: 'Gustavo' },
      { id: 'I-02', title: 'App análise sensorial Cropster (plataforma única)', projects: 'Milena' },
      { id: 'I-03', title: 'BI correlação manejo × qualidade × produtividade', projects: 'Lucas' },
      { id: 'I-04', title: 'Gerente Agrícola — automação custos indiretos', projects: 'Lucas' },
      { id: 'I-05', title: 'Módulos CQ + Manutenção de Ativos', projects: 'Gustavo' },
      { id: 'I-06', title: 'Migração versão Protheus', projects: 'André Martins', notes: 'Alto risco — planejar' },
    ],
  },
]

// ─── Portfolio reprioritization ───────────────────────────────────────────────

export interface PortfolioGroup {
  label: string
  tone: 'green' | 'amber' | 'sky'
  items: string[]
}

export const PORTFOLIO_GROUPS: PortfolioGroup[] = [
  {
    label: 'Manter / acelerar (consenso)',
    tone: 'green',
    items: [
      'Faturamento automático B2B e Varejo',
      'Site Compra B2B + Página Office',
      'CRM Jornada do Vendedor',
      'Conciliação Mercado Livre + PagBrasil',
      'WMS Botelhos',
      'Segurança da informação / LGPD',
      'Integração OpsFactor × Protheus',
    ],
  },
  {
    label: 'Repriorizar para Fase 3+',
    tone: 'amber',
    items: [
      'Custos indiretos Gerente Agrícola (André Q3)',
      'App análise sensorial Cropster (André Q3 — Milena ainda prioriza)',
      'Módulo Controle da Qualidade',
      'CRM Dashboard API Protheus (depende de integração)',
    ],
  },
  {
    label: 'Incluir no portfólio (fora do Comitê)',
    tone: 'sky',
    items: [
      'Visão 360º do cliente + VoC (Cibele)',
      'Camada IA/NLP sobre Protheus (André + Ricardo CEO)',
      'Arquitetura de dados integrada Indústria 4.0 (Gustavo)',
      'Evolução chatbot — retomar (Cibele Q3)',
    ],
  },
]

// ─── Cross-cutting themes (onboarding + meetings) ───────────────────────────────

export interface CrossTheme {
  theme: string
  sources: string[]
}

export const CROSS_THEMES: CrossTheme[] = [
  { theme: 'Automação de processos manuais / faturamento B2B', sources: ['Ricardo CEO', 'André', 'Cibele'] },
  { theme: 'Integração de sistemas / visão 360º do cliente', sources: ['Cibele', 'Ricardo CEO', 'Gustavo'] },
  { theme: 'Velocidade de execução de projetos', sources: ['Gustavo', 'André', 'Ricardo Silva'] },
  { theme: 'IA para decisão operacional e relatórios', sources: ['Gustavo', 'Milena', 'Joyce', 'Ricardo CEO'] },
  { theme: 'Arquitetura de dados integrada (Indústria 4.0)', sources: ['Gustavo'] },
  { theme: 'Segurança de dados', sources: ['Ricardo CEO', 'Diego'] },
]

// ─── AI opportunities ───────────────────────────────────────────────────────────

export interface AiOpportunity {
  area: string
  opportunity: string
  stakeholder: string
}

export const AI_OPPORTUNITIES: AiOpportunity[] = [
  { area: 'Comercial', opportunity: 'Elasticidade de preço · jornada de vendas automatizada', stakeholder: 'Ricardo CEO / Silvia' },
  { area: 'TI / ERP', opportunity: 'Camada NLP sobre Protheus — consultas em linguagem natural', stakeholder: 'André' },
  { area: 'CX / CS', opportunity: 'Classificação de solicitações · análise de sentimento · sugestão de respostas', stakeholder: 'Cibele' },
  { area: 'Operações', opportunity: 'Tomada de decisão e planejamento operacional em tempo real', stakeholder: 'Gustavo' },
  { area: 'Qualidade sensorial', opportunity: 'Automação de relatórios e consolidação Cropster', stakeholder: 'Milena' },
  { area: 'Baristas', opportunity: 'Resumo diário de 45+ checklists · relatório N2', stakeholder: 'Joyce' },
  { area: 'Logística', opportunity: 'Previsibilidade de transporte e tracking', stakeholder: 'Ricardo Silva' },
]

// ─── Delivery model ─────────────────────────────────────────────────────────────

export interface DeliveryRow {
  label: string
  value: string
}

export const DELIVERY_MODEL: DeliveryRow[] = [
  { label: 'Início', value: '1–2 projetos piloto (Quick Wins)' },
  { label: 'Ramp Protheus', value: '2–3 semanas para regras customizadas' },
  { label: 'Cadência', value: 'Entregas semanais · portal em tempo real' },
  { label: 'Billing', value: 'Por entrega em produção (código commitado)' },
  { label: 'Parceiros', value: 'José Roberto (engenharia) + Marco Lúcio (comercial)' },
  { label: 'Governança', value: 'André observador no portal · comitê quinzenal' },
]

// ─── Next steps ─────────────────────────────────────────────────────────────────

export interface NextStep {
  title: string
  owner?: string
  due?: string
}

export const NEXT_STEPS: NextStep[] = [
  { title: 'Completar assessments: Cristiane, Lucas, Rafaela', owner: 'José Roberto', due: 'até 30/07' },
  { title: 'Incluir Augusto Kraft e Priscila no processo', owner: 'Diego', due: 'imediato' },
  { title: 'Consolidar scores finais do Adaptive Index™', owner: 'PixelPulseLab' },
  { title: 'Preparar proposta comercial Fase 0 + Fase 1', owner: 'PixelPulseLab', due: 'até 30/07' },
  { title: 'Review com Ricardo Madureira', owner: 'José Roberto + Ricardo', due: '31/07 · 14h' },
  { title: 'Compartilhar mapa de oportunidades com André antes da apresentação', owner: 'José Roberto' },
]

export const CRITICAL_RISKS = [
  'Equipe TI enxuta — Alex afastado até ~dez/2026',
  'Faturamento B2B ainda manual (B2C já automatizado)',
  'Sem CRM unificado — jornada comercial quebrada',
  'Vulnerabilidade em segurança da informação (CEO)',
  'Sistemas fragmentados — BIs descentralizados',
  'Repriorização constante — 31 projetos, pouca capacidade',
]

// ─── Dashboard metrics (dynamic) ──────────────────────────────────────────────

export interface DashboardMetric {
  label: string
  value: string
  delta?: string
  hint: string
}

export interface DashboardCounts {
  assessmentDone: number
  sessionBooked: number
}

export function buildDashboardMetrics(counts?: Partial<DashboardCounts>): DashboardMetric[] {
  const expected = REVIEW_META.assessmentsExpected
  const done = counts?.assessmentDone ?? REVIEW_META.assessmentsReceived
  const sessions = counts?.sessionBooked ?? 1
  const pct = Math.round((done / expected) * 100)

  return [
    { label: 'Assessment Progress', value: `${pct}%`, hint: `${done}/${expected} respondidos` },
    { label: 'Projects Mapped', value: String(REVIEW_META.projectsMapped), hint: 'no Comitê de TI' },
    { label: 'Áreas', value: String(REVIEW_META.areasMapped), hint: 'em avaliação' },
    { label: 'Stakeholders', value: '15', hint: 'solicitantes mapeados' },
    {
      label: 'Discovery Sessions',
      value: `${REVIEW_META.meetingsCompleted}/${REVIEW_META.areasMapped}`,
      hint: `${sessions} sessão presencial agendada`,
    },
    { label: 'Quick Wins', value: String(QUICK_WINS.length), hint: 'Fase 1 mapeados' },
    { label: 'Critical Risks', value: String(CRITICAL_RISKS.length), hint: 'identificados na prévia' },
    { label: 'AI Opportunities', value: String(AI_OPPORTUNITIES.length), hint: 'mapeadas' },
  ]
}

export function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function scoreTone(score: number): 'high' | 'mid' | 'low' {
  if (score >= 65) return 'high'
  if (score >= 45) return 'mid'
  return 'low'
}

export const SCORE_BAR: Record<'high' | 'mid' | 'low', string> = {
  high: 'bg-emerald-500',
  mid: 'bg-amber-500',
  low: 'bg-rose-500',
}
