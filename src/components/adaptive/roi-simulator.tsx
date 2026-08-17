'use client'

import { useMemo, useState } from 'react'
import { TrendingUp, Clock, Wallet, Info } from 'lucide-react'
import {
  computeRoi,
  O2C_ROI_DEFAULTS,
  O2C_ROI_MODEL,
  O2C_ROI_RANGES,
  type RoiInputs,
} from './proposal-o2c'
import { formatBRL } from './proposal-data'

function formatCompactBRL(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} mi`
  }
  if (Math.abs(value) >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`
  }
  return formatBRL(value)
}

interface FieldConfig {
  key: keyof Omit<RoiInputs, 'investment'>
  label: string
  hint: string
  kind: 'currency' | 'percent' | 'count'
}

const FIELDS: FieldConfig[] = [
  { key: 'annualRevenue', label: 'Faturamento anual', hint: 'Premissa do Grupo (~R$ 100 mi)', kind: 'currency' },
  { key: 'salesUpliftPct', label: 'Aumento de vendas atribuível', hint: 'Ganho de conversão/margem no ciclo', kind: 'percent' },
  { key: 'contributionMargin', label: 'Margem de contribuição', hint: 'Margem média sobre a receita incremental', kind: 'percent' },
  { key: 'qlpCount', label: 'QLPs eliminados', hint: 'Funções redundantes remanejadas', kind: 'count' },
  { key: 'qlpMonthlyLoadedCost', label: 'Custo mensal por QLP', hint: 'Custo carregado (salário + encargos)', kind: 'currency' },
  { key: 'failureCostAvoidedAnnual', label: 'Custos de falha evitados/ano', hint: 'NF-e/boleto, retrabalho, reentrega', kind: 'currency' },
]

function formatValue(kind: FieldConfig['kind'], value: number) {
  if (kind === 'percent') return `${(value * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
  if (kind === 'count') return `${value}`
  return formatCompactBRL(value)
}

export function RoiSimulator() {
  const [inputs, setInputs] = useState<RoiInputs>({ ...O2C_ROI_DEFAULTS })

  const result = useMemo(() => computeRoi(inputs), [inputs])

  function update(key: keyof RoiInputs, value: number) {
    setInputs(prev => ({ ...prev, [key]: value }))
  }

  function reset() {
    setInputs({ ...O2C_ROI_DEFAULTS })
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Controles */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-black/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[13px] font-semibold text-neutral-900">Premissas (edite os valores)</p>
            <button
              type="button"
              onClick={reset}
              className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              Restaurar cenário-base
            </button>
          </div>

          <div className="space-y-5">
            {FIELDS.map(field => {
              const range = O2C_ROI_RANGES[field.key]
              const value = inputs[field.key]
              return (
                <div key={field.key}>
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <label className="text-[12px] font-medium text-neutral-700">{field.label}</label>
                    <span className="text-[13px] font-mono font-semibold text-neutral-900">
                      {formatValue(field.kind, value)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={value}
                    onChange={e => update(field.key, Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">{field.hint}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Resultado */}
        <div className="p-6 bg-neutral-900 text-white">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40 mb-4">
            Resultado preditivo
          </p>

          <div className="space-y-3 mb-5">
            <ResultRow
              icon={TrendingUp}
              label="Benefício anual estimado"
              value={formatCompactBRL(result.annualBenefit)}
              highlight
            />
            <ResultRow icon={Wallet} label="Investimento (fee cheio)" value={formatCompactBRL(inputs.investment)} />
            <ResultRow
              icon={TrendingUp}
              label="ROI no 1º ano"
              value={`${result.roiPct.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%`}
              highlight
            />
            <ResultRow
              icon={Clock}
              label="Payback"
              value={`${result.paybackMonths.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} meses`}
            />
          </div>

          <div className="rounded-xl bg-white/[0.06] p-4 space-y-2 mb-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">Composição do benefício</p>
            <Breakdown label="Margem incremental" value={formatCompactBRL(result.marginBenefit)} />
            <Breakdown label="Economia com QLPs" value={formatCompactBRL(result.qlpSavings)} />
            <Breakdown label="Custos de falha evitados" value={formatCompactBRL(result.failureAvoided)} />
            <div className="pt-2 mt-1 border-t border-white/[0.08]">
              <Breakdown
                label="Cobertura do projeto"
                value={`${result.projectCoveragePct.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%`}
              />
            </div>
          </div>

          <p className="flex items-start gap-1.5 text-[11px] text-white/40 leading-relaxed">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            {O2C_ROI_MODEL.disclaimer}
          </p>
        </div>
      </div>
    </div>
  )
}

function ResultRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
        <span className="text-[12px] text-white/60">{label}</span>
      </div>
      <span className={`font-mono font-semibold ${highlight ? 'text-[20px] text-emerald-400' : 'text-[14px] text-white'}`}>
        {value}
      </span>
    </div>
  )
}

function Breakdown({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-white/55">{label}</span>
      <span className="text-[12px] font-mono text-white/85">{value}</span>
    </div>
  )
}
