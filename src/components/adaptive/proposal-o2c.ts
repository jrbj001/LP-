// Recorte Order-to-Cash da proposta Orfeu.
// Seleciona, a partir do escopo OTD compartilhado, apenas o eixo financeiro
// (pedido → crédito → faturamento → contas a receber → caixa). O conteúdo OTD
// completo permanece intacto no Executive Review e no Processo B2B.

import {
  OTD_KPIS,
  OTD_QUICK_WINS,
  OTD_ROI_MODEL,
  quickWinById,
  type OtdKpi,
  type OtdQuickWin,
} from '@/lib/adaptive/b2b-process/quick-wins'
import { OTD_AGENTS, type OtdAgent } from '@/lib/adaptive/b2b-process/agents'

// ─── Seleção de escopo ──────────────────────────────────────────────────────

/** Quick wins do ciclo financeiro que compõem o MVP Order-to-Cash. */
export const O2C_MVP_QUICK_WIN_IDS = [
  'QW-OTD-02', // proposta e pricing no fluxo (margem)
  'QW-OTD-03', // cadastro + análise de crédito
  'QW-OTD-05', // input de pedido com ruptura visível (receita)
  'QW-OTD-06', // liberação de crédito pré-faturamento
  'QW-OTD-07', // faturamento B2B automático (NF-e + boletos)
] as const

/** Quick wins de logística/pós-venda que ficam para a Fase 2. */
export const O2C_PHASE2_QUICK_WIN_IDS = [
  'QW-OTD-01', // lead na Jornada do Vendedor
  'QW-OTD-04', // contrato digital
  'QW-OTD-08', // separação/WMS
  'QW-OTD-09', // expedição e EDI/tracking
  'QW-OTD-10', // alerta de recompra
] as const

export const O2C_MVP_QUICK_WINS: OtdQuickWin[] = O2C_MVP_QUICK_WIN_IDS.map(
  id => quickWinById(id),
).filter((q): q is OtdQuickWin => Boolean(q))

export const O2C_PHASE2_QUICK_WINS: OtdQuickWin[] = O2C_PHASE2_QUICK_WIN_IDS.map(
  id => quickWinById(id),
).filter((q): q is OtdQuickWin => Boolean(q))

/** Agentes core do ciclo financeiro (logística e recompra ficam na Fase 2). */
export const O2C_MVP_AGENT_IDS = ['orchestrator', 'commercial', 'order', 'finance'] as const

export const O2C_MVP_AGENTS: OtdAgent[] = OTD_AGENTS.filter(agent =>
  (O2C_MVP_AGENT_IDS as readonly string[]).includes(agent.id),
)

export const O2C_PHASE2_AGENTS: OtdAgent[] = OTD_AGENTS.filter(
  agent => !(O2C_MVP_AGENT_IDS as readonly string[]).includes(agent.id),
)

// ─── KPIs de negócio ──────────────────────────────────────────────────────────

const O2C_OPERATIONAL_KPI_IDS = [
  'straight-through',
  'cost-to-serve',
  'exception-resolution',
  'manual-touch-rate',
]

export const O2C_OPERATIONAL_KPIS: OtdKpi[] = O2C_OPERATIONAL_KPI_IDS
  .map(id => OTD_KPIS.find(kpi => kpi.id === id))
  .filter((kpi): kpi is OtdKpi => Boolean(kpi))

export interface O2cCommercialKpi {
  id: string
  label: string
  purpose: string
  target: string
  linkedToRisk: boolean
}

/** KPIs comerciais que ancoram a parcela em risco e o bônus de sucesso. */
export const O2C_COMMERCIAL_KPIS: O2cCommercialKpi[] = [
  {
    id: 'incremental-revenue',
    label: 'Receita incremental atribuível',
    purpose:
      'Ganho de conversão e margem protegida no ciclo (proposta mais rápida, menos bloqueio, ruptura recuperada).',
    target: '~R$ 1,5 mi/ano de run-rate ao estabilizar (meta validada no baseline M0)',
    linkedToRisk: true,
  },
  {
    id: 'qlp-savings',
    label: 'Economia com QLPs redundantes',
    purpose:
      'Horas manuais eliminadas no ciclo financeiro que liberam ~5 funções redundantes (QLPs) mapeadas.',
    target: '~5 QLPs remanejados, com horas economizadas medidas por gate',
    linkedToRisk: true,
  },
]

// ─── ROI preditivo ────────────────────────────────────────────────────────────

export interface RoiInputs {
  /** Faturamento anual do Grupo (premissa base). */
  annualRevenue: number
  /** Margem de contribuição média. */
  contributionMargin: number
  /** Aumento de vendas atribuível ao ciclo O2C (fração). */
  salesUpliftPct: number
  /** Nº de funções redundantes (QLPs) eliminadas. */
  qlpCount: number
  /** Custo mensal carregado por QLP. */
  qlpMonthlyLoadedCost: number
  /** Custos de falha evitados por ano (NF-e/boleto/retrabalho). */
  failureCostAvoidedAnnual: number
  /** Dias de redução no ciclo de faturamento/recebimento (DSO). */
  dsoDaysReduced: number
  /** Custo de capital anual usado para precificar o caixa liberado. */
  costOfCapital: number
  /** Inadimplência atual como fração do faturamento. */
  badDebtBaselineRate: number
  /** Fração da inadimplência evitada com crédito no fluxo. */
  badDebtReductionPct: number
  /** Margem recuperada com pricing disciplinado, como fração do faturamento. */
  marginLeakageRecoveredPct: number
  /** Investimento total líquido do projeto, após desconto comercial. */
  investment: number
}

/**
 * Cenário-base preditivo — números editáveis, confirmados com dados reais no M0.
 * ~500 colaboradores, faturamento na casa de R$ 100 mi/ano.
 */
export const O2C_ROI_DEFAULTS: RoiInputs = {
  annualRevenue: 100_000_000,
  contributionMargin: 0.3,
  salesUpliftPct: 0.01,
  qlpCount: 5,
  qlpMonthlyLoadedCost: 11_000,
  failureCostAvoidedAnnual: 150_000,
  dsoDaysReduced: 5,
  costOfCapital: 0.13,
  badDebtBaselineRate: 0.008,
  badDebtReductionPct: 0.2,
  marginLeakageRecoveredPct: 0.0015,
  investment: 912_000,
}

export const O2C_ROI_RANGES = {
  annualRevenue: { min: 40_000_000, max: 500_000_000, step: 5_000_000 },
  contributionMargin: { min: 0.15, max: 0.5, step: 0.01 },
  salesUpliftPct: { min: 0.002, max: 0.03, step: 0.001 },
  qlpCount: { min: 0, max: 15, step: 1 },
  qlpMonthlyLoadedCost: { min: 6_000, max: 20_000, step: 500 },
  failureCostAvoidedAnnual: { min: 0, max: 1_200_000, step: 25_000 },
  dsoDaysReduced: { min: 0, max: 20, step: 1 },
  costOfCapital: { min: 0.05, max: 0.2, step: 0.005 },
  badDebtBaselineRate: { min: 0, max: 0.03, step: 0.001 },
  badDebtReductionPct: { min: 0, max: 0.6, step: 0.05 },
  marginLeakageRecoveredPct: { min: 0, max: 0.01, step: 0.0005 },
} as const

export interface RoiResult {
  incrementalRevenue: number
  marginBenefit: number
  qlpSavings: number
  failureAvoided: number
  /** Caixa liberado pela antecipação do recebimento (estoque de capital). */
  workingCapitalReleased: number
  /** Economia anual de custo de capital sobre o caixa liberado. */
  workingCapitalGain: number
  badDebtAvoided: number
  marginProtected: number
  annualBenefit: number
  monthlyBenefit: number
  roiPct: number
  paybackMonths: number
  projectCoveragePct: number
}

/** Multiplicador simplificado para anualizar o custo carregado (13º + encargos). */
const QLP_ANNUAL_FACTOR = 13

export function computeRoi(inputs: RoiInputs): RoiResult {
  const incrementalRevenue = inputs.annualRevenue * inputs.salesUpliftPct
  const marginBenefit = incrementalRevenue * inputs.contributionMargin
  const qlpSavings = inputs.qlpCount * inputs.qlpMonthlyLoadedCost * QLP_ANNUAL_FACTOR
  const failureAvoided = inputs.failureCostAvoidedAnnual

  // Faturar mais rápido e sem bloqueio antecipa o recebimento: o caixa liberado
  // é um estoque; o ganho recorrente é o custo de capital que ele deixa de consumir.
  const workingCapitalReleased = (inputs.annualRevenue / 365) * inputs.dsoDaysReduced
  const workingCapitalGain = workingCapitalReleased * inputs.costOfCapital

  const badDebtAvoided =
    inputs.annualRevenue * inputs.badDebtBaselineRate * inputs.badDebtReductionPct
  const marginProtected = inputs.annualRevenue * inputs.marginLeakageRecoveredPct

  const annualBenefit =
    marginBenefit +
    qlpSavings +
    failureAvoided +
    workingCapitalGain +
    badDebtAvoided +
    marginProtected
  const monthlyBenefit = annualBenefit / 12
  const roiPct =
    inputs.investment > 0
      ? ((annualBenefit - inputs.investment) / inputs.investment) * 100
      : 0
  const paybackMonths = monthlyBenefit > 0 ? inputs.investment / monthlyBenefit : 0
  const projectCoveragePct =
    inputs.investment > 0 ? (annualBenefit / inputs.investment) * 100 : 0

  return {
    incrementalRevenue,
    marginBenefit,
    qlpSavings,
    failureAvoided,
    workingCapitalReleased,
    workingCapitalGain,
    badDebtAvoided,
    marginProtected,
    annualBenefit,
    monthlyBenefit,
    roiPct,
    paybackMonths,
    projectCoveragePct,
  }
}

// ─── Projeção acumulada (5 anos) ──────────────────────────────────────────────

export const O2C_PROJECTION = {
  years: 5,
  /** No ano 1 a entrega ocupa 10 meses: o benefício se materializa em rampa. */
  rampYear1: 0.5,
  /** Sustentação e evolução a partir do ano 2, como fração do investimento. */
  sustainRateOfInvestment: 0.12,
  note:
    'Ano 1 considera rampa de 50% do benefício (a entrega ocupa 10 meses) e o investimento integral. A partir do ano 2, benefício cheio e um custo de sustentação/evolução de 12% do investimento. Sem crescimento especulativo de receita.',
}

export interface ProjectionYear {
  year: number
  benefit: number
  cost: number
  net: number
  cumulative: number
}

export function projectGains(inputs: RoiInputs, years = O2C_PROJECTION.years): ProjectionYear[] {
  const { annualBenefit } = computeRoi(inputs)
  const sustainCost = inputs.investment * O2C_PROJECTION.sustainRateOfInvestment

  let cumulative = 0
  return Array.from({ length: years }, (_, index) => {
    const year = index + 1
    const benefit = year === 1 ? annualBenefit * O2C_PROJECTION.rampYear1 : annualBenefit
    const cost = year === 1 ? inputs.investment : sustainCost
    const net = benefit - cost
    cumulative += net
    return { year, benefit, cost, net, cumulative }
  })
}

export const O2C_ROI_MODEL = {
  title: 'ROI preditivo — do baseline ao benefício anual',
  disclaimer:
    'Estimativa preditiva, não uma garantia de resultado. As premissas (faturamento, margem, uplift e QLPs) são ilustrativas e serão substituídas por dados reais da Orfeu no baseline M0.',
  principle: OTD_ROI_MODEL.principle,
  valueLevers: OTD_ROI_MODEL.valueLevers,
  formulas: OTD_ROI_MODEL.formulas,
  baselineInputs: OTD_ROI_MODEL.baselineInputs,
}

// ─── Guia do simulador (racional + fatibilidade) ──────────────────────────────

export interface RoiGuideLever {
  lever: string
  /** Como o número é calculado, em linguagem simples. */
  how: string
  /** Por que a premissa é conservadora/factível e de onde vêm os dados. */
  feasibility: string
  /** Quick win / gate que habilita a alavanca. */
  enabledBy: string
}

export const O2C_ROI_GUIDE = {
  intro:
    'O simulador não inventa economia: ele parte do baseline real da Orfeu (medido no M0) e projeta apenas o que a operação limpa passa a capturar. Cada alavanca abaixo tem uma conta simples, uma premissa conservadora e um quick win que a habilita. Ajuste os controles para ver o intervalo — a proposta é assinada sobre o cenário validado, não sobre o otimista.',
  levers: [
    {
      lever: 'Margem incremental (vendas)',
      how: 'Faturamento × % de vendas atribuível × margem de contribuição.',
      feasibility:
        'Usamos 1% do faturamento como uplift — abaixo do que proposta mais rápida e menos bloqueio costumam destravar. A margem é a própria margem da Orfeu, não uma estimada.',
      enabledBy: 'QW-OTD-02 (proposta/pricing) e QW-OTD-05 (ruptura)',
    },
    {
      lever: 'Margem recuperada no pricing',
      how: 'Faturamento × % de vazamento de margem recuperado.',
      feasibility:
        'Apenas 0,15% do faturamento: desconto fora de alçada e erro de tabela que somem quando o preço é calculado no fluxo. É a menor das alavancas justamente por ser a mais sensível.',
      enabledBy: 'QW-OTD-02 (pricing e margem no fluxo)',
    },
    {
      lever: 'Economia com QLPs',
      how: 'Nº de funções redundantes × custo mensal carregado × 13 (encargos/13º).',
      feasibility:
        'Parte das ~5 QLPs já mapeadas na operação. Medimos horas manuais eliminadas gate a gate; a função não precisa ser demitida — pode ser remanejada para trabalho de maior valor.',
      enabledBy: 'QW-OTD-03/06/07 (cadastro, crédito e faturamento sem redigitação)',
    },
    {
      lever: 'Custos de falha evitados',
      how: 'Soma dos erros evitados × custo médio por ocorrência.',
      feasibility:
        'NF-e/boleto refeitos, retrabalho e reentrega têm custo conhecido. Entramos com um valor anual único e conservador, refinado com o histórico real no M0.',
      enabledBy: 'QW-OTD-07 (faturamento B2B homologado)',
    },
    {
      lever: 'Capital de giro liberado',
      how: '(Faturamento ÷ 365 × dias a menos para receber) × custo de capital.',
      feasibility:
        'Faturar no mesmo dia e liberar crédito sem fila reduz o DSO. Contabilizamos só o custo de capital do caixa antecipado — não o caixa inteiro — para não inflar o ganho.',
      enabledBy: 'QW-OTD-06/07 (liberação de crédito e faturamento)',
    },
    {
      lever: 'Inadimplência evitada',
      how: 'Faturamento × inadimplência atual × % evitado com crédito no fluxo.',
      feasibility:
        'Análise de crédito antes de faturar reduz perda. Assumimos evitar 1/5 da inadimplência atual — o baseline real da Orfeu ajusta a conta para cima ou para baixo.',
      enabledBy: 'QW-OTD-03/06 (cadastro + análise de crédito)',
    },
  ] satisfies RoiGuideLever[],
  method: [
    'Alavancas independentes: não há dupla contagem — margem de vendas, produtividade, falhas, capital e crédito medem coisas diferentes.',
    'Ano 1 em rampa: a entrega ocupa 10 meses, então projetamos 50% do benefício no primeiro ano e o investimento integral.',
    'A partir do ano 2: benefício cheio menos 12% do investimento em sustentação e evolução, sem crescimento especulativo de receita.',
    'Tudo se reconcilia no M0: baseline medido, metas assinadas e a parcela em risco atrelada exatamente a esses KPIs.',
  ],
}
