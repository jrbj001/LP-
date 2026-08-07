import { PROJECTS, STAKEHOLDERS } from '@/components/adaptive/data'
import {
  OTD_QUICK_WINS,
  SATELLITE_WINS,
  OTD_PLAN_SUMMARY,
  OTD_AI_PLAN_INTRO,
  OTD_KPIS,
  OTD_ROI_MODEL,
} from '@/lib/adaptive/b2b-process/quick-wins'
import { OTD_AI_OPPORTUNITIES } from '@/lib/adaptive/b2b-process/agents'
import { OTD_MILESTONES } from '@/lib/adaptive/b2b-process/milestones'

// ─── Assessment status ────────────────────────────────────────────────────────

export const REVIEW_META = {
  reviewDate: '2026-07-31T14:00:00-03:00',
  generatedAt: '2026-07-31',
  status: 'preview' as const,
  assessmentsReceived: 8,
  assessmentsExpected: STAKEHOLDERS.length,
  meetingsCompleted: 6,
  projectsMapped: 31,
  areasMapped: 10,
}

export const ASSESSMENT_GAPS = [
  'Cristiane (Comercial — crítica para HORECA)',
  'Lucas (Fazenda)',
  'Rafaela (Financeiro / Gestão)',
  'Augusto Kraft Baum (Diretor Comercial — assessment pendente)',
  'Priscila Calvelhe (Gerente do Varejo — assessment pendente)',
  'Silvia, Alene, Amanda Raquel, Jéssica Viana (identificadas, assessment pendente)',
]

// ─── Da semente à xícara — storytelling ─────────────────────────────────────────

export const SEED_TO_CUP_INTRO = {
  eyebrow: 'Da semente à xícara',
  title: 'O café da Orfeu já percorre essa jornada com excelência. Os dados ainda não.',
  narrative:
    'Cada lote da Orfeu nasce na fazenda, passa pelo beneficiamento, pela torra, pela prova dos degustadores, atravessa a logística e chega à xícara do cliente com padrão premium. A informação que acompanha esse café faz o mesmo caminho — só que em papel, planilha, e-mail e sistemas que não conversam. Em cada estação, alguém redigita, reconcilia e corre atrás do dado. O Adaptive Layer™ faz o dado percorrer a mesma jornada do grão: capturado uma vez na origem, fluindo íntegro até a xícara — e voltando como inteligência para cada decisão.',
  anchors: [
    {
      quote:
        'A excelência operacional só é alcançada quando entendemos toda a jornada do produto, desde a origem da matéria-prima até a experiência do cliente final.',
      author: 'Gustavo · Diretor de Operações',
    },
    {
      quote: 'Cuidar da qualidade do café na xícara.',
      author: 'Joyce · Baristas, sobre o objetivo da área',
    },
  ],
}

export interface SeedToCupStage {
  id: string
  stage: string
  owners: string
  pain: string
  future: string
}

export const SEED_TO_CUP: SeedToCupStage[] = [
  {
    id: 'fazenda',
    stage: 'Fazenda · Semente',
    owners: 'Lucas',
    pain: 'Custos indiretos apurados à mão; manejo, qualidade e produtividade sem correlação em dados.',
    future: 'Dados de manejo capturados na origem alimentam BI de correlação e custo por talhão em tempo real.',
  },
  {
    id: 'industria',
    stage: 'Beneficiamento · Indústria',
    owners: 'Gustavo',
    pain: 'TOTVS, Traction, MES e WMS não integrados; BIs por área; beneficiamento em transição 1.0 → 2.0.',
    future: 'Arquitetura de dados única conecta pessoas, máquinas e processos — decisão operacional em tempo real.',
  },
  {
    id: 'qualidade',
    stage: 'Qualidade · Sensorial',
    owners: 'Milena',
    pain: 'Cupping mensal em papel + Excel; rastreabilidade do café cru e do selo consumindo tempo do time.',
    future: 'Plataforma única de degustação e rastreabilidade: nota lançada uma vez, ranking, laudo e selo automáticos.',
  },
  {
    id: 'logistica',
    stage: 'Logística',
    owners: 'Ricardo Silva',
    pain: 'Sem visibilidade em tempo real; WMS parcial; EDI ainda sem API; transporte sem previsibilidade.',
    future: 'WMS em todas as plantas + tracking preditivo — o lote é visível da fazenda ao ponto de venda.',
  },
  {
    id: 'comercial',
    stage: 'Comercial · Cliente',
    owners: 'Cristiane · Selton · Cibele · Ricardo CEO',
    pain: 'Order-to-delivery manual, faturamento B2B redigitado, sem CRM unificado, e-mail fora da Suri.',
    future: 'Jornada digital B2B ponta a ponta: pedido, faturamento, entrega e pós-venda numa visão 360º do cliente.',
  },
  {
    id: 'xicara',
    stage: 'Xícara · Experiência',
    owners: 'Joyce',
    pain: '45+ checklists de baristas por dia analisados um a um; N2 e treinamentos sem registro estruturado.',
    future: 'IA resume os checklists do dia e aponta os desvios — o time cuida da xícara, não do relatório.',
  },
]

// ─── O ponto crítico em comum ───────────────────────────────────────────────────

export const CRITICAL_ALIGNMENT = {
  headline: 'O ponto crítico em comum',
  statement:
    'Palavra-chave: Order-to-delivery. As 6 discoveries convergem para a mesma dor estrutural — sistemas que não conversam — e o sintoma mais caro está na jornada B2B: intervenções manuais em cada etapa do pedido (financeiro + logística), com back-office dedicado só a isso. Cristiane e Selton mapearam a jornada; André confirma faturamento B2B como nº 1; o CEO pede portal B2B e integrações Protheus. Por isso os quick wins deste plano são a resolução de TODAS essas intervenções. Juntos, eles constroem o Adaptive Layer™; o LLM opera sobre o fluxo já limpo.',
  ceo: {
    name: 'Ricardo Madureira · CEO',
    alignment: [
      'Escalar nacionalmente mantendo posicionamento premium — receita orçada superando margem de contribuição.',
      '"Se fosse CIO por um dia: automatizar todos os processos manuais." Maior desafio declarado: operações manuais e retrabalho.',
      'Tecnologia atrapalha "quando não é integrada dentro do processo e exige interação humana entre as etapas — gerando erros e retrabalho".',
      'Quick wins citados: portal B2B e integrações Protheus; PagBrasil segue com fornecedor atual e entra apenas como ponto futuro de integração · segurança como pilar transversal.',
    ],
  },
  voices: [
    { name: 'Cristiane · B2B HORECA', quote: 'Canal +55% 2024→2025; order-to-delivery ainda cheio de intervenções manuais em cada etapa.' },
    { name: 'Selton · Consultor Comercial', quote: 'Jornada mapeada no Miro há 4 anos — prioridade: digitalizar order-to-delivery multicanais.' },
    { name: 'André · TI', quote: 'Faturamento automático B2B e Varejo é o processo nº 1 a automatizar; equipe enxuta para 31 projetos.' },
    { name: 'Gustavo · Operações', quote: 'CIO por um dia: arquitetura de dados integrada — um único ecossistema digital.' },
    { name: 'Milena · Qualidade', quote: 'Plataforma única e integrada, eliminando controles paralelos e lançamentos manuais.' },
    { name: 'Cibele · CX', quote: 'Sistemas não integrados exigem consultas em várias plataformas — retrabalho e jornada quebrada.' },
  ],
}

export { OTD_PLAN_SUMMARY, OTD_AI_PLAN_INTRO, OTD_KPIS, OTD_ROI_MODEL }

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
    title: 'Order-to-delivery — eliminar intervenções manuais',
    detail:
      'Palavra-chave do plano. Cada intervenção manual no caminho do pedido (financeiro + logística) vira um quick win. Ver jornada completa em /adaptive/processo-b2b.',
  },
  {
    rank: 2,
    title: 'Piloto Quick Wins OTD',
    detail:
      'Começar pelos QWs de maior atrito: proposta/pricing no fluxo, input com ruptura visível e faturamento B2B automático (André #1 + CEO).',
  },
  {
    rank: 3,
    title: 'Adaptive Layer™ — a entrega-mãe',
    detail:
      'Os QWs OTD nascem plugados na camada (Protheus, WMS, portal, EDI, JV). Sem Layer, cada automação vira silo novo.',
  },
  {
    rank: 4,
    title: 'LLM sobre o fluxo limpo',
    detail:
      'Consultas NL, status de pedido e risco de cliente — só depois que as intervenções manuais do OTD caíram.',
  },
  {
    rank: 5,
    title: 'Segurança da informação transversal',
    detail:
      'Auditoria + LGPD + monitoramento contínuo. Único tema levantado espontaneamente pelo CEO no assessment.',
  },
]

// ─── Quick Wins = resolução das intervenções OTD ───────────────────────────────

export interface QuickWin {
  id: string
  title: string
  source: string
  effort: 'Baixo' | 'Baixo-Médio' | 'Médio'
  impact: 'Médio' | 'Alto'
  pilot?: boolean
  intervention?: string
  interventionDetail?: string
  businessRisk?: string
  expectedGain?: string
  kpis?: string[]
  stageLabel?: string
  area?: string
}

/** Drive: cada QW elimina uma intervenção manual do order-to-delivery. */
export const QUICK_WINS: QuickWin[] = OTD_QUICK_WINS.map(q => ({
  id: q.id,
  title: q.title,
  source: q.source,
  effort: q.effort,
  impact: q.impact,
  pilot: q.pilot,
  intervention: q.intervention,
  interventionDetail: q.interventionDetail,
  businessRisk: q.businessRisk,
  expectedGain: q.expectedGain,
  kpis: q.kpis,
  stageLabel: q.stageLabel,
  area: q.area,
}))

/** Trilhas paralelas — permanecem no roadmap; não competem com QWs OTD. */
export const SATELLITE_QUICK_WINS = SATELLITE_WINS

// ─── Plano de trabalho — entrega-mãe + quick wins ───────────────────────────────

export const ADAPTIVE_LAYER = {
  title: 'Adaptive Layer™',
  tagline: 'A entrega-mãe: Order-to-delivery sem intervenções manuais',
  description:
    'Camada de integração que conecta os sistemas que a Orfeu já tem — Protheus, WMS, portal, EDI, Jornada do Vendedor — sem substituí-los. Cada quick win do order-to-delivery nasce plugado na camada: juntos eliminam as intervenções manuais (financeiro + logística) no caminho do pedido. No topo, o LLM consulta status, risco e dados comerciais sobre o fluxo já limpo. Trilhas paralelas (qualidade, CX, Indústria 4.0, segurança) também plugam na mesma Layer.',
  connects: ['Protheus (400+ regras)', 'WMS', 'Portal de Vendas', 'EDI', 'Jornada do Vendedor', 'Shopify', 'Suri', 'Cropster', 'OpsFactor / sensores'],
  unlocks: [
    'Order-to-delivery digital ponta a ponta (Cris + Selton)',
    'Faturamento automático B2B + Varejo (André #1)',
    'Ruptura e crédito visíveis no fluxo',
    'Tracking e recompra sem planilha/telefone',
    'IA/LLM sobre Protheus e status de pedido',
    'Segurança e integridade de dados por desenho',
  ],
}

export interface WorkPlanStep {
  id: string
  window: string
  title: string
  type: 'mobilization' | 'quick-win' | 'layer' | 'delivery'
  detail: string
}

export const WORK_PLAN: WorkPlanStep[] = OTD_MILESTONES.map(milestone => ({
  id: milestone.id,
  window: milestone.window,
  title: milestone.title,
  type: milestone.type,
  detail: `${milestone.objective} ${milestone.gate}`,
}))

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
      { id: '0-1', title: 'Assessments + sessões: Cristiane, Lucas, Rafaela', notes: 'crítico — Comercial, Fazenda e Financeiro' },
      { id: '0-2', title: 'Completar assessments: Augusto Kraft Baum e Priscila Calvelhe', notes: 'Comercial e Varejo' },
      { id: '0-3', title: 'Completar assessments: Silvia, Alene, Amanda, Jéssica' },
      { id: '0-4', title: 'Agendar sessões presenciais 30 min restantes' },
    ],
  },
  {
    id: 'phase-1',
    title: 'Fase 1 — Quick Wins OTD',
    window: 'Semanas 2–14',
    objective:
      'Resolver TODAS as intervenções manuais do order-to-delivery (financeiro + logística). Cada QW nasce plugado no Adaptive Layer™.',
    items: QUICK_WINS.map(qw => ({
      id: qw.id,
      title: qw.title,
      notes: qw.intervention
        ? `Manual: ${qw.intervention}`
        : `${qw.effort} esforço · ${qw.impact} impacto`,
    })),
  },
  {
    id: 'phase-2',
    title: 'Fase 2 — Adaptive Layer™ (entrega-mãe)',
    window: 'Semanas 3–Mês 5',
    objective:
      'A camada que mantém o OTD limpo: dados fluindo entre Protheus, WMS, portal, EDI e JV — sem redigitação.',
    items: [
      { id: 'F-01', title: 'Camada de integração (Protheus ↔ WMS ↔ Portal ↔ EDI ↔ JV)', notes: 'Pré-requisito para LLM e visão 360º' },
      { id: 'F-02', title: 'Faturamento automático B2B + Varejo', projects: 'Cristiane, André, Cibele, Ricardo Madureira', notes: 'Prioridade #1 comitê + CEO · QW-OTD-07' },
      { id: 'F-03', title: 'Order-to-delivery digital multicanais', projects: 'Selton, Cristiane', notes: 'Mapa completo em /processo-b2b' },
      { id: 'F-04', title: 'Site Compra B2B + Página Office', projects: 'Cristiane', notes: 'Shopify pausado aguardando Pixel' },
      { id: 'F-05', title: 'Conciliação Mercado Livre', projects: 'Rafaela', notes: 'PagBrasil com outro fornecedor; Layer preserva ponto futuro de integração' },
      { id: 'F-06', title: 'WMS Botelhos + expansão fábrica', projects: 'Ricardo Silva, Gustavo' },
      { id: 'F-07', title: 'Segurança da informação / LGPD', projects: 'Diego', notes: 'Pilar transversal — pedido espontâneo do CEO' },
    ],
  },
  {
    id: 'phase-3',
    title: 'Fase 3 — LLM + agentes OTD',
    window: 'Meses 5–8',
    objective: 'Escopo comercial: Command Center, LLM e agentes operando sobre o OTD estabilizado.',
    items: [
      { id: 'T-01', title: 'CRM / Jornada do Vendedor e do Cliente (API Protheus)', projects: 'Cristiane, Selton, Amanda, Ricardo CEO' },
      { id: 'T-02', title: 'Camada IA/LLM sobre Protheus + status pedido', projects: 'André', notes: 'Consultas em linguagem natural' },
      { id: 'T-AGENTS', title: 'Squad de 6 agentes OTD', projects: 'Cristiane, Selton, André, Operações', notes: 'Guardrails, aprovação humana e auditoria' },
    ],
  },
  {
    id: 'phase-options',
    title: 'Opções futuras — Comercial + satélites',
    window: 'Após M5 · contratação separada',
    objective: 'Evoluções que podem usar a mesma Layer, mas não integram o preço-base da proposta OTD.',
    items: [
      { id: 'T-03', title: 'Visão 360º do cliente + VoC', notes: 'Cibele — fora do portfólio hoje' },
      { id: 'T-04', title: 'GTM regiões + clusterização B2B · gaps Varejo × Nielsen', projects: 'Selton', notes: 'Fora do portfólio hoje' },
      { id: 'T-05', title: 'Dashboard forecast × realizado', projects: 'Amanda Raquel' },
      { id: 'T-06', title: 'Calculadora elasticidade de preço', projects: 'Silvia + Ricardo CEO' },
      { id: 'T-07', title: 'Satélites: Cropster, Suri, App Baristas, portal Pixel', notes: 'Trilhas paralelas na Layer' },
    ],
  },
  {
    id: 'phase-4',
    title: 'Opção futura — Indústria 4.0 & Agro',
    window: 'Contratação separada',
    objective: 'Fora do preço-base OTD — referência operacional para uma próxima onda.',
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
      'Conciliação Mercado Livre (PagBrasil segue com fornecedor atual)',
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
      'Order-to-delivery digital multicanais (Selton)',
      'GTM regiões + clusterização B2B · gaps Varejo × Nielsen (Selton)',
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
  { theme: 'Automação de processos manuais / faturamento B2B', sources: ['Ricardo CEO', 'André', 'Cibele', 'Selton'] },
  { theme: 'Order-to-delivery e jornada digital B2B', sources: ['Selton', 'Ricardo CEO', 'Cristiane (comitê)'] },
  { theme: 'Integração de sistemas / visão 360º do cliente', sources: ['Cibele', 'Ricardo CEO', 'Gustavo', 'Milena'] },
  { theme: 'Velocidade de execução de projetos', sources: ['Gustavo', 'André', 'Ricardo Silva'] },
  { theme: 'IA para decisão operacional e relatórios', sources: ['Gustavo', 'Milena', 'Joyce', 'Ricardo CEO'] },
  { theme: 'Arquitetura de dados integrada (Indústria 4.0)', sources: ['Gustavo', 'Milena'] },
  { theme: 'Rastreabilidade da semente à xícara', sources: ['Milena', 'Ricardo Silva', 'Gustavo'] },
  { theme: 'Segurança de dados', sources: ['Ricardo CEO', 'Diego'] },
]

// ─── AI opportunities ───────────────────────────────────────────────────────────

export interface AiOpportunity {
  id?: string
  area: string
  opportunity: string
  stakeholder: string
  enabledBy?: string[]
}

export const AI_OPPORTUNITIES: AiOpportunity[] = OTD_AI_OPPORTUNITIES.map(o => ({
  id: o.id,
  area: o.area,
  opportunity: o.opportunity,
  stakeholder: o.stakeholder,
  enabledBy: o.enabledBy,
}))

// ─── Delivery model ─────────────────────────────────────────────────────────────

export interface DeliveryRow {
  label: string
  value: string
}

export const DELIVERY_MODEL: DeliveryRow[] = [
  { label: 'Modelo', value: 'Engagement mensal do squad · outcomes nos gates (A) + capacidade/blended como transparência (B)' },
  { label: 'Início', value: 'M0 baseline + ramp Protheus; piloto começa na semana 2' },
  { label: 'Cadência', value: 'Demos semanais · planejamento e comitê quinzenais · gate mensal' },
  { label: 'Billing', value: 'Fatura mensal liberada após aceite do ciclo — não cobrança hora a hora' },
  { label: 'Parceiros', value: 'José Roberto (engenharia) + Marco Lúcio (comercial)' },
  { label: 'Governança', value: 'Owners Orfeu validam evidências em até 5 dias úteis; pendência recebe plano corretivo' },
]

// ─── Next steps ─────────────────────────────────────────────────────────────────

export interface NextStep {
  title: string
  owner?: string
  due?: string
}

export const NEXT_STEPS: NextStep[] = [
  { title: 'Capturar baseline OTD no M0 (KPIs, volume, margem e toques manuais)', owner: 'Pixel + Orfeu', due: 'kick-off' },
  { title: 'Completar assessment Cristiane (crítica HORECA / OTD)', owner: 'José Roberto' },
  { title: 'Completar assessments: Lucas, Rafaela, Augusto, Priscila', owner: 'José Roberto' },
  { title: 'Piloto QWs OTD: proposta/pricing + ruptura + faturamento B2B', owner: 'Pixel + André + Cris' },
  { title: 'Validar ROI com dados reais após estabilização do OTD (M4)', owner: 'Financeiro + Pixel' },
  { title: 'Consolidar scores finais do Adaptive Index™', owner: 'PixelPulseLab' },
  { title: 'Proposta comercial: engagement por outcome + capacidade/blended', owner: 'PixelPulseLab', due: 'pós-review' },
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
  const pct = Math.round((done / expected) * 100)
  const requesters = new Set(PROJECTS.map(p => p.requester)).size

  return [
    { label: 'Assessment Progress', value: `${pct}%`, hint: `${done}/${expected} respondidos` },
    { label: 'Projects Mapped', value: String(REVIEW_META.projectsMapped), hint: 'no Comitê de TI' },
    { label: 'Áreas', value: String(REVIEW_META.areasMapped), hint: 'em avaliação' },
    { label: 'Stakeholders', value: String(requesters), hint: 'solicitantes mapeados' },
    {
      label: 'Discovery Sessions',
      value: String(REVIEW_META.meetingsCompleted),
      hint: 'reuniões transcritas e analisadas',
    },
    { label: 'Quick Wins', value: String(QUICK_WINS.length), hint: 'OTD · intervenções → QWs' },
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
