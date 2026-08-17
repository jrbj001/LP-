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
  /** Investimento total do projeto (fee cheio no horizonte). */
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
  investment: 960_000,
}

export const O2C_ROI_RANGES = {
  annualRevenue: { min: 40_000_000, max: 200_000_000, step: 5_000_000 },
  contributionMargin: { min: 0.15, max: 0.5, step: 0.01 },
  salesUpliftPct: { min: 0.002, max: 0.03, step: 0.001 },
  qlpCount: { min: 0, max: 10, step: 1 },
  qlpMonthlyLoadedCost: { min: 6_000, max: 20_000, step: 500 },
  failureCostAvoidedAnnual: { min: 0, max: 600_000, step: 25_000 },
} as const

export interface RoiResult {
  incrementalRevenue: number
  marginBenefit: number
  qlpSavings: number
  failureAvoided: number
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
  const annualBenefit = marginBenefit + qlpSavings + failureAvoided
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
    annualBenefit,
    monthlyBenefit,
    roiPct,
    paybackMonths,
    projectCoveragePct,
  }
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
