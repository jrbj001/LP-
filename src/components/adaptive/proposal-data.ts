// Proposta de trabalho — Grupo Orfeu
// Esforço, squad e investimento derivados do plano de trabalho (executive-review-data.ts)
// e das faixas públicas do Guia de Valores 2026 (valor-hora-data.ts).

import {
  OTD_FUTURE_OPTIONS,
  OTD_MILESTONES,
  OTD_MILESTONE_SUMMARY,
  type OtdMilestone,
} from '@/lib/adaptive/b2b-process/milestones'

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export const PROPOSAL_META = {
  password: 'orfeu2026',
  title: 'Proposta de Trabalho',
  client: 'Grupo Orfeu',
  date: '06/08/2026',
  validity: 'Válida por 30 dias · valores indicativos até o aceite do escopo',
  guideHref: '/guides/valor-hora',
}

// ─── Referência de preço (Guia de Valores 2026) ────────────────────────────────

export const RATE_BASIS = {
  blended: { min: 260, max: 285 },
  note: 'Blended efetivo do squad (R$ 260–285/h), dentro da faixa de referência do Guia de Valores PixelPulseLab 2026 (R$ 250–300/h). É a média ponderada dos perfis alocados — usada para dimensionar a mensalidade, não como unidade de cobrança linha a linha.',
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
    hoursMonth: 60,
    rate: 'R$ 300–450/h',
    focus: 'Desenho do Adaptive Layer™, decisões sobre Protheus (400+ regras) e padrões de integração.',
  },
  {
    role: 'Dev sênior back-end / integrações',
    dedication: 'Dedicado (full-time)',
    hoursMonth: 168,
    rate: 'R$ 220–380/h',
    focus: 'Conectores Portal/WMS/EDI/JV · faturamento B2B · order-to-delivery.',
  },
  {
    role: 'Dev pleno full-stack',
    dedication: 'Dedicado',
    hoursMonth: 132,
    rate: 'R$ 150–240/h',
    focus: 'Quick wins OTD de interface, proposta/pricing no fluxo, tracking e recompra.',
  },
  {
    role: 'Especialista IA / agentes',
    dedication: 'Parcial',
    hoursMonth: 50,
    rate: 'R$ 350–600/h',
    focus: 'LLM sobre OTD limpo: status, risco de cliente e NLP no Protheus.',
  },
  {
    role: 'QA / automação de testes',
    dedication: 'Parcial',
    hoursMonth: 50,
    rate: 'R$ 160–300/h',
    focus: 'Validação de integrações críticas (fiscal/faturamento), regressão e critérios de aceite.',
  },
]

export const SQUAD_SUMMARY = {
  totalHoursMonth: 460,
  monthlyInvestment: { min: 120000, max: 130000 },
  guidePackage: 'Compatível com o formato "Squad dedicado multi-perfil" do Guia de Valores 2026, dimensionado pelo blended efetivo (R$ 260–285/h)',
  management: 'Gestão, discovery contínuo, reuniões e governança conduzidos por José Roberto (partner) — inclusos no engagement, não cobrados à parte.',
  capacityLabel: 'Capacidade planejada',
}

// ─── Milestones contratados ────────────────────────────────────────────────────

export interface CommercialMilestone extends OtdMilestone {
  capacityHours: number
  capacityShare: number
  investment: { min: number; max: number }
  squadRoles: string[]
}

const MILESTONE_COMMERCIALS: Record<
  string,
  Pick<CommercialMilestone, 'capacityHours' | 'capacityShare' | 'investment' | 'squadRoles'>
> = {
  'ms-0': {
    capacityHours: 221,
    capacityShare: 6,
    investment: { min: 57600, max: 62400 },
    squadRoles: ['Tech Lead', 'Dev back-end', 'Gestão'],
  },
  'ms-1': {
    capacityHours: 552,
    capacityShare: 15,
    investment: { min: 144000, max: 156000 },
    squadRoles: ['Tech Lead', 'Dev back-end', 'Dev full-stack', 'QA'],
  },
  'ms-2': {
    capacityHours: 736,
    capacityShare: 20,
    investment: { min: 192000, max: 208000 },
    squadRoles: ['Tech Lead', 'Dev back-end', 'QA'],
  },
  'ms-3': {
    capacityHours: 920,
    capacityShare: 25,
    investment: { min: 240000, max: 260000 },
    squadRoles: ['Tech Lead', 'Dev back-end', 'Dev full-stack', 'QA'],
  },
  'ms-4': {
    capacityHours: 736,
    capacityShare: 20,
    investment: { min: 192000, max: 208000 },
    squadRoles: ['Tech Lead', 'Dev back-end', 'Dev full-stack', 'QA'],
  },
  'ms-5': {
    capacityHours: 515,
    capacityShare: 14,
    investment: { min: 134400, max: 145600 },
    squadRoles: ['Especialista IA', 'Tech Lead', 'Dev back-end', 'QA'],
  },
}

export const COMMERCIAL_MILESTONES: CommercialMilestone[] = OTD_MILESTONES.map(
  milestone => ({
    ...milestone,
    ...MILESTONE_COMMERCIALS[milestone.id],
  }),
)

/** Alias mantido para consumidores existentes da proposta. */
export const PROPOSAL_PHASES = COMMERCIAL_MILESTONES

const months = 8
const contractedHours = SQUAD_SUMMARY.totalHoursMonth * months

export const PROPOSAL_TOTALS = {
  hours: { min: contractedHours, max: contractedHours },
  investment: {
    min: SQUAD_SUMMARY.monthlyInvestment.min * months,
    max: SQUAD_SUMMARY.monthlyInvestment.max * months,
  },
  horizon: `${months} meses`,
  note:
    'Engagement mensal do squad orientado aos resultados dos milestones. A capacidade planejada e o blended servem de base de dimensionamento e transparência — a distribuição por milestone apenas mostra onde a capacidade é aplicada, não é cobrança adicional.',
}

export const PROPOSAL_OUTCOME = OTD_MILESTONE_SUMMARY

// ─── Decisão comercial (introdução + porquê) ─────────────────────────────────────

export const COMMERCIAL_DECISION = {
  eyebrow: 'Como estruturamos o investimento',
  title: 'Um engagement mensal orientado a resultado — não venda de horas',
  narrative:
    'Adotamos um único modelo comercial: um squad dedicado com mensalidade fixa, comprometido com o resultado de cada milestone. A Orfeu contrata capacidade + entrega nos gates — não pacotes de horas. Reuniões, discovery, planejamento e engenharia estão todos dentro da mensalidade. A capacidade planejada e o blended aparecem apenas como base de dimensionamento e transparência para o comitê.',
  why: [
    {
      title: 'Previsibilidade',
      detail: 'O comitê aprova um número mensal e um horizonte claro — não um relógio de horas lançadas.',
    },
    {
      title: 'Foco no resultado',
      detail: 'O que vale é o aceite das entregas nos gates M0–M5, não a contagem de horas.',
    },
    {
      title: 'Flexibilidade protegida',
      detail: 'Repriorização dentro do milestone sem renegociar preço; prazo/custo só mudam via change request.',
    },
    {
      title: 'Transparência',
      detail: 'A base de preço (capacidade planejada × blended efetivo) e as evidências ficam visíveis no portal.',
    },
  ],
}

// ─── Modelo comercial (único) ────────────────────────────────────────────────────

export interface CommercialModel {
  id: 'A' | 'B'
  title: string
  badge: string
  recommended?: boolean
  headline: string
  summary: string
  points: string[]
  monthly: string
  total: string
  footing: string
}

export const COMMERCIAL_MODELS: CommercialModel[] = [
  {
    id: 'A',
    title: 'Engagement por outcome',
    badge: 'Recomendado',
    recommended: true,
    headline: 'Squad dedicado + gates de aceite',
    summary:
      'A Orfeu contrata um engagement mensal: capacidade dedicada, rituais e resultados nos milestones. Reuniões, planejamento, discovery e engenharia estão dentro do engagement — não são “horas à parte”.',
    points: [
      'Produto vendido: capacidade + resultado nos gates M0–M5',
      'Mensalidade fixa na faixa do squad; fatura liberada no aceite do ciclo',
      'Inclui governança, alinhamentos e execução técnica',
      'Esforço em horas fica no planejamento interno e no portal',
    ],
    monthly: `${formatBRL(SQUAD_SUMMARY.monthlyInvestment.min)}–${formatBRL(SQUAD_SUMMARY.monthlyInvestment.max)}/mês`,
    total: `${formatBRL(SQUAD_SUMMARY.monthlyInvestment.min * months)}–${formatBRL(SQUAD_SUMMARY.monthlyInvestment.max * months)} · ${months} meses`,
    footing: `Base de dimensionamento: ~${SQUAD_SUMMARY.totalHoursMonth}h/mês × blended efetivo R$ ${RATE_BASIS.blended.min}–${RATE_BASIS.blended.max}/h (${contractedHours.toLocaleString('pt-BR')}h planejadas no horizonte) — detalhado a seguir para transparência do comitê.`,
  },
]

// ─── Modelo comercial ───────────────────────────────────────────────────────────

export const COMMERCIAL_TERMS = [
  {
    label: 'Contrato',
    value: 'Engagement mensal do squad, orientado a resultado (outcome-first) — capacidade e blended entram apenas como base de transparência',
  },
  {
    label: 'Produto',
    value: 'Squad mensal dedicado orientado a 6 milestones e gates de aceite — não venda de horas isoladas',
  },
  {
    label: 'Faturamento',
    value: 'Fatura mensal liberada após aceite das entregas previstas no ciclo',
  },
  {
    label: 'Cadência',
    value: 'Planejamento quinzenal · demos semanais · comitê executivo quinzenal · gate mensal',
  },
  {
    label: 'Aceite',
    value: 'Até 5 dias úteis para validar evidências; pendência recebe plano corretivo e nova data acordada',
  },
  {
    label: 'Transparência',
    value: 'Capacidade planejada, entregas, critérios, riscos e evidências visíveis no portal',
  },
  {
    label: 'Propriedade',
    value: 'Código, dados e infraestrutura em contas do Grupo Orfeu desde o dia 1',
  },
  {
    label: 'Mudança de escopo',
    value: 'Repriorização dentro do milestone sem alterar o gate; mudança de prazo/custo exige change request',
  },
]

export const OPERATING_MODEL = [
  {
    cadence: 'Semanal',
    ritual: 'Demo + revisão operacional',
    output: 'Incremento demonstrável, impedimentos e evidências atualizadas',
  },
  {
    cadence: 'Quinzenal',
    ritual: 'Planejamento + comitê executivo',
    output: 'Prioridades do ciclo, riscos, decisões e dependências com owner',
  },
  {
    cadence: 'Mensal',
    ritual: 'Gate de aceite',
    output: 'Checklist do milestone/ciclo, ata de aceite e liberação da fatura',
  },
  {
    cadence: 'Por release',
    ritual: 'Go-live + estabilização',
    output: 'Plano de rollback, runbook, métricas e transferência de conhecimento',
  },
]

export const SCOPE = {
  included: [
    'Mobilização, baseline e ramp das regras Protheus ligadas ao OTD',
    'Os 10 quick wins OTD e integrações necessárias ao fluxo contratado',
    'Adaptive Layer™ para Protheus, WMS, Portal, EDI e Jornada do Vendedor',
    'OTD em produção, observabilidade, documentação e estabilização',
    'LLM, Command Center e 6 agentes OTD com guardrails e avaliação',
  ],
  excluded: [
    'Licenças, cloud, consumo de APIs/LLMs e serviços de terceiros',
    'Substituição integral do Protheus, WMS, Portal, EDI ou Jornada do Vendedor',
    'Conciliação PagBrasil — executada por outro fornecedor; apenas ponto futuro de integração',
    'Operação 24×7 e sustentação após a janela de estabilização',
  ],
  future: OTD_FUTURE_OPTIONS,
}

export const DELIVERY_RISKS = [
  {
    risk: 'Acesso tardio ou documentação incompleta dos sistemas',
    mitigation: 'Checklist no M0, owner por sistema e escalonamento no comitê em até 48h',
    owner: 'André Martins',
  },
  {
    risk: 'Regras Protheus e fiscais descobertas durante a implementação',
    mitigation: 'Ramp antecipado, homologação com massa realista e decisões versionadas',
    owner: 'Orfeu + Tech Lead',
  },
  {
    risk: 'Baixa disponibilidade dos owners para homologação',
    mitigation: 'Agenda fixa semanal, delegados nomeados e prazo de aceite de 5 dias úteis',
    owner: 'Cristiane · Selton · André',
  },
  {
    risk: 'Mudanças de prioridade competirem com os 10 QWs',
    mitigation: 'Backlog OTD protegido; satélites entram somente via change request',
    owner: 'Comitê executivo',
  },
  {
    risk: 'Dados insuficientes para LLM e agentes',
    mitigation: 'Gate M4 condiciona IA à qualidade, cobertura e rastreabilidade mínimas',
    owner: 'TI + Especialista IA',
  },
]

export const ASSUMPTIONS = [
  'Escopo-base: OTD completo → Adaptive Layer™ → LLM e agentes; satélites e Indústria 4.0 são opções futuras.',
  'O produto comercial é o engagement do squad + outcomes nos gates; horas/blended são apenas base de planejamento e transparência.',
  'As janelas pressupõem início conjunto do M0 e disponibilidade dos owners definidos em cada gate.',
  'A Orfeu disponibiliza acessos, ambientes, massas de teste e decisões de negócio nos prazos do ciclo.',
  'Custos de cloud, licenças e APIs de terceiros, incluindo consumo de LLM, não estão inclusos.',
  'Conciliação PagBrasil permanece fora do escopo; a Layer preserva um ponto futuro de integração.',
  'Valores alinhados às faixas públicas do Guia de Valores PixelPulseLab 2026 (blended efetivo R$ 260–285/h dentro da faixa R$ 250–300/h).',
  'Capacidade planejada de ~460h/mês por 8 meses; mudanças materiais usam change request aprovado.',
]

export function validateProposalData() {
  const milestoneIds = COMMERCIAL_MILESTONES.map(milestone => milestone.id)
  const uniqueMilestones = new Set(milestoneIds).size === milestoneIds.length
  const allocatedHours = COMMERCIAL_MILESTONES.reduce(
    (total, milestone) => total + milestone.capacityHours,
    0,
  )
  const allocatedShare = COMMERCIAL_MILESTONES.reduce(
    (total, milestone) => total + milestone.capacityShare,
    0,
  )
  const allocatedInvestment = COMMERCIAL_MILESTONES.reduce(
    (total, milestone) => ({
      min: total.min + milestone.investment.min,
      max: total.max + milestone.investment.max,
    }),
    { min: 0, max: 0 },
  )

  return {
    valid:
      uniqueMilestones &&
      allocatedHours === PROPOSAL_TOTALS.hours.max &&
      allocatedShare === 100 &&
      allocatedInvestment.min === PROPOSAL_TOTALS.investment.min &&
      allocatedInvestment.max === PROPOSAL_TOTALS.investment.max,
    milestoneCount: milestoneIds.length,
    allocatedHours,
    allocatedShare,
    allocatedInvestment,
  }
}

export const PROPOSAL_VALIDATION = validateProposalData()

if (!PROPOSAL_VALIDATION.valid) {
  throw new Error(
    `Proposta inconsistente: ${JSON.stringify(PROPOSAL_VALIDATION)}`,
  )
}
