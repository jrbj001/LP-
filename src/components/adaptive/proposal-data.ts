// Proposta de trabalho — Grupo Orfeu
// Esforço, squad e investimento derivados do plano de trabalho (executive-review-data.ts)
// e das faixas públicas do Guia de Valores 2026 (valor-hora-data.ts).

export const PROPOSAL_META = {
  password: 'orfeu2026',
  title: 'Proposta de Trabalho',
  client: 'Grupo Orfeu',
  date: '31/07/2026',
  validity: 'Válida por 30 dias · valores indicativos até o aceite do escopo',
  guideHref: '/guides/valor-hora',
}

// ─── Referência de preço (Guia de Valores 2026) ────────────────────────────────

export const RATE_BASIS = {
  blended: { min: 250, max: 300 },
  note: 'Blended rate recomendado no Guia de Valores PixelPulseLab 2026 para projetos multidisciplinares. Cada perfil do squad tem faixa própria; o blended é a média ponderada usada nas estimativas.',
  references: [
    { category: 'Desenvolvimento convencional', range: 'R$ 220–280/h' },
    { category: 'Engenharia sênior e arquitetura', range: 'R$ 300–450/h' },
    { category: 'IA, agentes e visão computacional', range: 'R$ 350–600/h' },
    { category: 'Sustentação com volume contratado', range: 'R$ 180–240/h' },
  ],
}

// ─── Squad sugerido ─────────────────────────────────────────────────────────────

export interface SquadRole {
  role: string
  dedication: string
  hoursMonth: number
  rate: string
  focus: string
}

export const SQUAD: SquadRole[] = [
  {
    role: 'Tech Lead / Arquiteto de integrações',
    dedication: 'Parcial',
    hoursMonth: 30,
    rate: 'R$ 300–450/h',
    focus: 'Desenho do Adaptive Layer™, decisões sobre Protheus (400+ regras) e padrões de integração.',
  },
  {
    role: 'Dev sênior back-end / integrações',
    dedication: 'Dedicado',
    hoursMonth: 100,
    rate: 'R$ 220–380/h',
    focus: 'Conectores WMS, Shopify e Suri · faturamento automático B2B · order-to-delivery.',
  },
  {
    role: 'Dev pleno full-stack',
    dedication: 'Dedicado parcial',
    hoursMonth: 80,
    rate: 'R$ 150–240/h',
    focus: 'Portal de entregas, quick wins de interface, chamados TI e automações Cropster.',
  },
  {
    role: 'Especialista IA / agentes',
    dedication: 'Sob demanda',
    hoursMonth: 30,
    rate: 'R$ 350–600/h',
    focus: 'Resumo IA dos checklists, NLP sobre Protheus e squad de agentes por área.',
  },
  {
    role: 'QA / automação de testes',
    dedication: 'Parcial',
    hoursMonth: 20,
    rate: 'R$ 160–300/h',
    focus: 'Validação de integrações críticas (fiscal/faturamento), regressão e critérios de aceite.',
  },
]

export const SQUAD_SUMMARY = {
  totalHoursMonth: 260,
  monthlyInvestment: { min: 62000, max: 78000 },
  guidePackage: 'Compatível com o formato "Squad enxuto" do Guia de Valores (R$ 55.000–80.000/mês)',
  management: 'Gestão, discovery contínuo e governança conduzidos por José Roberto (partner) — já incluídos no blended.',
}

// ─── Demandas por fase (espelha o WORK_PLAN do Executive Review) ───────────────

export interface ProposalPhase {
  id: string
  window: string
  title: string
  type: 'quick-win' | 'layer' | 'delivery'
  demands: string[]
  hours: { min: number; max: number }
  investment: { min: number; max: number }
}

export const PROPOSAL_PHASES: ProposalPhase[] = [
  {
    id: 'pf-1',
    window: 'Semanas 1–4',
    title: 'Piloto Quick Wins',
    type: 'quick-win',
    demands: [
      'QW-02 · Resumo IA dos checklists baristas (45+/dia → digest)',
      'QW-04 · Integração e-mail → Suri (visão 360º parcial do cliente)',
      'Setup do portal de entregas para André + comitê',
    ],
    hours: { min: 120, max: 160 },
    investment: { min: 30000, max: 48000 },
  },
  {
    id: 'pf-2',
    window: 'Semanas 3–8',
    title: 'Fundação do Adaptive Layer™',
    type: 'layer',
    demands: [
      'Ramp Protheus: mapeamento das regras customizadas',
      'Primeiras integrações: WMS + Shopify + Suri',
      'Modelo de dados unificado e trilha de segurança/LGPD',
    ],
    hours: { min: 280, max: 360 },
    investment: { min: 70000, max: 108000 },
  },
  {
    id: 'pf-3',
    window: 'Semanas 6–10',
    title: 'Quick wins de integração',
    type: 'quick-win',
    demands: [
      'QW-03 · Automação de relatórios Cropster',
      'QW-05 · Portal de entregas consolidado para o comitê',
      'QW-06 · Chamados TI com SLA visível',
    ],
    hours: { min: 120, max: 160 },
    investment: { min: 30000, max: 48000 },
  },
  {
    id: 'pf-4',
    window: 'Meses 3–5',
    title: 'Faturamento automático + order-to-delivery',
    type: 'layer',
    demands: [
      'Faturamento automático B2B + Varejo (prioridade nº 1 do comitê e do CEO)',
      'Jornada digital de pedidos multicanais sobre a camada',
      'Conciliação e integridade fiscal por desenho',
    ],
    hours: { min: 420, max: 540 },
    investment: { min: 105000, max: 162000 },
  },
  {
    id: 'pf-5',
    window: 'Meses 4–8',
    title: 'Entrega-mãe em produção',
    type: 'delivery',
    demands: [
      'CRM / jornada do vendedor integrada',
      'Visão 360º do cliente + VoC',
      'IA/NLP sobre Protheus (consultas em linguagem natural)',
      'Rastreabilidade semente → xícara',
    ],
    hours: { min: 460, max: 620 },
    investment: { min: 115000, max: 186000 },
  },
]

export const PROPOSAL_TOTALS = {
  hours: { min: 1400, max: 1840 },
  investment: { min: 350000, max: 552000 },
  horizon: '6–8 meses',
  note: 'Total estimado ao blended de R$ 250–300/h. As fases se sobrepõem: o squad trabalha em capacidade mensal contínua, não em fases sequenciais isoladas.',
}

// ─── Modelo comercial ───────────────────────────────────────────────────────────

export const COMMERCIAL_TERMS = [
  {
    label: 'Modelo',
    value: 'Squad mensal (capacidade contratada) com billing por entrega em produção',
  },
  {
    label: 'Início',
    value: 'Piloto Quick Wins (semanas 1–4) antes de compromisso de longo prazo',
  },
  {
    label: 'Cadência',
    value: 'Entregas semanais · portal em tempo real · comitê quinzenal',
  },
  {
    label: 'Transparência',
    value: 'Horas consumidas, riscos e progresso visíveis no portal · André como observador',
  },
  {
    label: 'Propriedade',
    value: 'Código, dados e infraestrutura em contas do Grupo Orfeu desde o dia 1',
  },
  {
    label: 'Flexibilidade',
    value: 'Repriorização a cada ciclo · redução ou ampliação do squad com 30 dias de aviso',
  },
]

export const ASSUMPTIONS = [
  'Estimativas baseadas no assessment parcial (8/15 stakeholders + 5 discoveries); refinadas após o review final.',
  'Ramp de 2–3 semanas para as regras customizadas do Protheus, conforme discovery com André.',
  'Custos de cloud, licenças e APIs de terceiros (ex.: LLM) não inclusos.',
  'Conciliação PagBrasil está fora do escopo — em desenvolvimento com outro fornecedor. O Adaptive Layer™ prevê ponto de integração com essa entrega quando concluída.',
  'Valores dentro das faixas públicas do Guia de Valores PixelPulseLab 2026.',
  'Piloto Quick Wins pode ser contratado isoladamente como pacote de validação.',
]

// ─── Helpers ────────────────────────────────────────────────────────────────────

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
