import { PROJECTS } from '@/components/adaptive/data'

// ─── Assessment status ────────────────────────────────────────────────────────

export const REVIEW_META = {
  reviewDate: '2026-07-31T14:00:00-03:00',
  generatedAt: '2026-07-31',
  status: 'preview' as const,
  assessmentsReceived: 8,
  assessmentsExpected: 15,
  meetingsCompleted: 5,
  projectsMapped: 31,
  areasMapped: 10,
}

export const ASSESSMENT_GAPS = [
  'Cristiane (Comercial — crítica para HORECA)',
  'Lucas (Fazenda)',
  'Rafaela (Financeiro / Gestão)',
  'Augusto Kraft (Diretor Comercial — incluir)',
  'Priscila (Supermercados — incluir)',
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
    'As 8 vozes do assessment e as 5 reuniões discovery convergem para a mesma dor: sistemas que não conversam obrigam pessoas a serem a integração — redigitando, conciliando e correndo atrás do dado. O sintoma mais caro está na jornada comercial (order-to-delivery e faturamento B2B manuais, sem CRM), mas a causa é estrutural e atravessa todas as áreas. Por isso a entrega-mãe deste plano é o Adaptive Layer™: a camada que integra os sistemas existentes e devolve às pessoas o tempo que hoje se perde entre eles.',
  ceo: {
    name: 'Ricardo Madureira · CEO',
    alignment: [
      'Escalar nacionalmente mantendo posicionamento premium — receita orçada superando margem de contribuição.',
      '"Se fosse CIO por um dia: automatizar todos os processos manuais." Maior desafio declarado: operações manuais e retrabalho.',
      'Tecnologia atrapalha "quando não é integrada dentro do processo e exige interação humana entre as etapas — gerando erros e retrabalho".',
      'Segurança de dados e integridade dos bancos como pilar transversal — único tema levantado espontaneamente.',
    ],
  },
  voices: [
    { name: 'André · TI', quote: 'Faturamento automático B2B e Varejo é o processo nº 1 a automatizar; equipe enxuta para 31 projetos.' },
    { name: 'Gustavo · Operações', quote: 'CIO por um dia: arquitetura de dados integrada — um único ecossistema digital.' },
    { name: 'Selton · Consultor Comercial', quote: 'Order-to-delivery multicanais e CRM/jornada do vendedor e do cliente.' },
    { name: 'Cibele · CX', quote: 'Sistemas não integrados exigem consultas em várias plataformas — retrabalho e jornada quebrada.' },
    { name: 'Milena · Qualidade', quote: 'Plataforma única e integrada, eliminando controles paralelos e lançamentos manuais.' },
    { name: 'Ricardo Silva · Logística', quote: 'O maior desafio é visibilidade em tempo real.' },
  ],
}

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
      'Validar modelo de entrega em 6–8 semanas antes de escalar. Candidatos: resumo IA checklists, integração e-mail Suri, automação Cropster.',
  },
  {
    rank: 3,
    title: 'Adaptive Layer™ — a entrega-mãe',
    detail:
      'Camada de integração de dados antes de novos BIs/dashboards — evita multiplicar silos e destrava order-to-delivery, visão 360º e IA (visão Gustavo + André + Selton).',
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

// ─── Plano de trabalho — entrega-mãe + quick wins ───────────────────────────────

export const ADAPTIVE_LAYER = {
  title: 'Adaptive Layer™',
  tagline: 'A entrega-mãe do plano de trabalho',
  description:
    'Camada de integração de dados que conecta os sistemas que a Orfeu já tem — sem substituí-los. É construída em paralelo aos quick wins: cada quick win entregue já nasce plugado na camada, e cada integração nova amplia o que a próxima entrega consegue fazer. Ao final, o dado percorre a jornada da semente à xícara sem redigitação.',
  connects: ['Protheus (400+ regras)', 'WMS', 'Shopify', 'Suri', 'Cropster', 'OpsFactor / sensores', 'Mercado Livre'],
  unlocks: [
    'Faturamento automático B2B + Varejo',
    'Order-to-delivery digital multicanais',
    'Visão 360º do cliente + VoC',
    'IA/NLP sobre Protheus (consultas em linguagem natural)',
    'Rastreabilidade da semente à xícara',
    'Segurança e integridade de dados por desenho',
  ],
}

export interface WorkPlanStep {
  id: string
  window: string
  title: string
  type: 'quick-win' | 'layer' | 'delivery'
  detail: string
}

export const WORK_PLAN: WorkPlanStep[] = [
  {
    id: 'wp-1',
    window: 'Semanas 1–4',
    title: 'Piloto Quick Wins',
    type: 'quick-win',
    detail: 'QW-02 Resumo IA checklists baristas + QW-04 integração e-mail → Suri — valor visível em semanas, validando o modelo Pixel.',
  },
  {
    id: 'wp-2',
    window: 'Semanas 3–8',
    title: 'Fundação do Adaptive Layer™',
    type: 'layer',
    detail: 'Ramp Protheus (regras customizadas), primeiras integrações WMS + Shopify + Suri. Cada quick win entregue já pluga na camada.',
  },
  {
    id: 'wp-3',
    window: 'Semanas 6–10',
    title: 'Quick wins de integração',
    type: 'quick-win',
    detail: 'QW-03 relatórios Cropster · QW-05 portal de entregas · QW-06 chamados TI com SLA.',
  },
  {
    id: 'wp-4',
    window: 'Meses 3–5',
    title: 'Adaptive Layer™ — faturamento e order-to-delivery',
    type: 'layer',
    detail: 'Faturamento automático B2B + Varejo (prioridade nº 1 do comitê e do CEO) e jornada digital de pedidos sobre a camada.',
  },
  {
    id: 'wp-5',
    window: 'Meses 4–8',
    title: 'Entrega-mãe em produção',
    type: 'delivery',
    detail: 'Camada operante ponta a ponta: CRM/jornada do vendedor, visão 360º do cliente, IA/NLP sobre Protheus e rastreabilidade semente → xícara.',
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
      { id: '0-1', title: 'Assessments + sessões: Cristiane, Lucas, Rafaela', notes: 'crítico — Comercial, Fazenda e Financeiro' },
      { id: '0-2', title: 'Incluir Augusto Kraft e Priscila no processo', notes: 'Diego' },
      { id: '0-3', title: 'Completar assessments: Silvia, Alene, Amanda, Jéssica' },
      { id: '0-4', title: 'Agendar sessões presenciais 30 min restantes' },
    ],
  },
  {
    id: 'phase-1',
    title: 'Fase 1 — Quick Wins',
    window: 'Semanas 3–8',
    objective: 'Ganhos rápidos de baixo risco — validar modelo Pixel antes de escalar. Cada entrega já nasce plugada no Adaptive Layer™.',
    items: QUICK_WINS.map(qw => ({
      id: qw.id,
      title: qw.title,
      notes: `${qw.effort} esforço · ${qw.impact} impacto`,
    })),
  },
  {
    id: 'phase-2',
    title: 'Fase 2 — Adaptive Layer™ (entrega-mãe)',
    window: 'Meses 2–5',
    objective: 'A camada de integração que resolve a causa comum: dados fluindo entre os sistemas existentes, sem redigitação.',
    items: [
      { id: 'F-01', title: 'Camada de integração de dados (Protheus ↔ WMS ↔ Shopify ↔ Suri ↔ Cropster)', notes: 'Pré-requisito para IA e visão 360º' },
      { id: 'F-02', title: 'Faturamento automático B2B + Varejo', projects: 'Cristiane, André, Cibele, Ricardo Madureira', notes: 'Prioridade #1 comitê + CEO' },
      { id: 'F-03', title: 'Order-to-delivery digital multicanais', projects: 'Selton, Cristiane', notes: 'Processo #1 do consultor comercial' },
      { id: 'F-04', title: 'Site Compra B2B + Página Office', projects: 'Cristiane', notes: 'Shopify pausado aguardando Pixel' },
      { id: 'F-05', title: 'Conciliação Mercado Livre', projects: 'Rafaela' },
      { id: 'F-06', title: 'WMS Botelhos + expansão fábrica', projects: 'Ricardo Silva, Gustavo' },
      { id: 'F-07', title: 'Segurança da informação / LGPD', projects: 'Diego', notes: 'Pilar transversal — pedido espontâneo do CEO' },
    ],
  },
  {
    id: 'phase-3',
    title: 'Fase 3 — Transformação Comercial & IA',
    window: 'Meses 4–8',
    objective: 'Sobre a camada pronta: resolver as dores estruturais de crescimento nacional.',
    items: [
      { id: 'T-01', title: 'CRM / Jornada do Vendedor e do Cliente (API Protheus)', projects: 'Cristiane, Selton, Amanda, Ricardo CEO' },
      { id: 'T-02', title: 'Camada IA/NLP sobre Protheus', projects: 'André', notes: 'Consultas em linguagem natural' },
      { id: 'T-03', title: 'Visão 360º do cliente + VoC', notes: 'Cibele — fora do portfólio hoje' },
      { id: 'T-04', title: 'GTM regiões + clusterização B2B · gaps Varejo × Nielsen', projects: 'Selton', notes: 'Fora do portfólio hoje' },
      { id: 'T-05', title: 'Dashboard forecast × realizado', projects: 'Amanda Raquel' },
      { id: 'T-06', title: 'Calculadora elasticidade de preço', projects: 'Silvia + Ricardo CEO' },
      { id: 'T-07', title: 'App Baristas Orfeu', projects: 'Joyce' },
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
  { title: 'Review com Ricardo Madureira', owner: 'José Roberto + Ricardo', due: 'hoje · 31/07 · 14h' },
  { title: 'Completar assessments: Cristiane, Lucas, Rafaela', owner: 'José Roberto' },
  { title: 'Incluir Augusto Kraft e Priscila no processo', owner: 'Diego', due: 'imediato' },
  { title: 'Consolidar scores finais do Adaptive Index™', owner: 'PixelPulseLab' },
  { title: 'Proposta comercial: piloto Quick Wins + Adaptive Layer™', owner: 'PixelPulseLab', due: 'pós-review' },
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
