'use client'

import { useMemo, useState } from 'react'
import { TrendingUp, Clock, Wallet, Info, LineChart, ChevronDown, BookOpen, CheckCircle2 } from 'lucide-react'
import {
  computeRoi,
  projectGains,
  O2C_PROJECTION,
  O2C_ROI_DEFAULTS,
  O2C_ROI_GUIDE,
  O2C_ROI_MODEL,
  O2C_ROI_RANGES,
  type ProjectionYear,
  type RoiInputs,
} from './proposal-o2c'
import { formatBRL } from './proposal-data'

function formatCompactBRL(value: number) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '−' : ''
  if (abs >= 1_000_000) {
    return `${sign}R$ ${(abs / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} mi`
  }
  if (abs >= 1_000) {
    return `${sign}R$ ${(abs / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`
  }
  return `${sign}${formatBRL(abs)}`
}

type SliderKey = keyof Omit<RoiInputs, 'investment'>

interface FieldConfig {
  key: SliderKey
  label: string
  hint: string
  kind: 'currency' | 'percent' | 'count' | 'days'
}

interface FieldGroup {
  title: string
  fields: FieldConfig[]
}

const GROUPS: FieldGroup[] = [
  {
    title: 'Receita e margem',
    fields: [
      { key: 'annualRevenue', label: 'Faturamento anual', hint: 'Premissa do Grupo — simula até R$ 500 mi', kind: 'currency' },
      { key: 'salesUpliftPct', label: 'Aumento de vendas atribuível', hint: 'Proposta mais rápida e menos bloqueio', kind: 'percent' },
      { key: 'contributionMargin', label: 'Margem de contribuição', hint: 'Margem média sobre a receita incremental', kind: 'percent' },
      { key: 'marginLeakageRecoveredPct', label: 'Margem recuperada no pricing', hint: 'Desconto indevido e erro de preço evitados', kind: 'percent' },
    ],
  },
  {
    title: 'Produtividade e falhas',
    fields: [
      { key: 'qlpCount', label: 'QLPs eliminados', hint: 'Funções redundantes remanejadas', kind: 'count' },
      { key: 'qlpMonthlyLoadedCost', label: 'Custo mensal por QLP', hint: 'Custo carregado (salário + encargos)', kind: 'currency' },
      { key: 'failureCostAvoidedAnnual', label: 'Custos de falha evitados/ano', hint: 'NF-e/boleto, retrabalho, reentrega', kind: 'currency' },
    ],
  },
  {
    title: 'Capital de giro e crédito',
    fields: [
      { key: 'dsoDaysReduced', label: 'Dias a menos para receber', hint: 'Faturamento automático e crédito sem fila', kind: 'days' },
      { key: 'costOfCapital', label: 'Custo de capital', hint: 'Precifica o caixa antecipado', kind: 'percent' },
      { key: 'badDebtBaselineRate', label: 'Inadimplência atual', hint: 'Perda de crédito sobre o faturamento', kind: 'percent' },
      { key: 'badDebtReductionPct', label: 'Inadimplência evitada', hint: 'Ganho com crédito analisado no fluxo', kind: 'percent' },
    ],
  },
]

function formatValue(kind: FieldConfig['kind'], value: number) {
  if (kind === 'percent') {
    const decimals = value < 0.01 ? 2 : 1
    return `${(value * 100).toLocaleString('pt-BR', { maximumFractionDigits: decimals })}%`
  }
  if (kind === 'count') return `${value}`
  if (kind === 'days') return `${value} dias`
  return formatCompactBRL(value)
}

export function RoiSimulator() {
  const [inputs, setInputs] = useState<RoiInputs>({ ...O2C_ROI_DEFAULTS })

  const result = useMemo(() => computeRoi(inputs), [inputs])
  const projection = useMemo(() => projectGains(inputs), [inputs])
  const fiveYearTotal = projection[projection.length - 1]?.cumulative ?? 0

  function update(key: keyof RoiInputs, value: number) {
    setInputs(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Controles */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-black/[0.06]">
          <div className="flex items-center justify-between gap-3 mb-5">
            <p className="text-[13px] font-semibold text-neutral-900">Premissas (edite os valores)</p>
            <button
              type="button"
              onClick={() => setInputs({ ...O2C_ROI_DEFAULTS })}
              className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              Restaurar cenário-base
            </button>
          </div>

          <div className="space-y-6">
            {GROUPS.map(group => (
              <div key={group.title}>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400 mb-3">
                  {group.title}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                  {group.fields.map(field => {
                    const range = O2C_ROI_RANGES[field.key]
                    const value = inputs[field.key]
                    return (
                      <div key={field.key}>
                        <div className="flex items-baseline justify-between gap-2 mb-1.5">
                          <label className="text-[12px] font-medium text-neutral-700">{field.label}</label>
                          <span className="text-[12px] font-mono font-semibold text-neutral-900 whitespace-nowrap">
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
                        <p className="text-[10px] text-neutral-400 mt-1 leading-snug">{field.hint}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
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
            <ResultRow icon={Wallet} label="Investimento líquido (5% off)" value={formatCompactBRL(inputs.investment)} />
            <ResultRow
              icon={TrendingUp}
              label="ROI no 1º ano cheio"
              value={`${result.roiPct.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%`}
              highlight
            />
            <ResultRow
              icon={Clock}
              label="Payback"
              value={`${result.paybackMonths.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} meses`}
            />
          </div>

          <div className="rounded-xl bg-white/[0.06] p-4 space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
              Composição do benefício
            </p>
            <Breakdown label="Margem incremental" value={formatCompactBRL(result.marginBenefit)} />
            <Breakdown label="Margem recuperada no pricing" value={formatCompactBRL(result.marginProtected)} />
            <Breakdown label="Economia com QLPs" value={formatCompactBRL(result.qlpSavings)} />
            <Breakdown label="Custos de falha evitados" value={formatCompactBRL(result.failureAvoided)} />
            <Breakdown label="Capital de giro liberado" value={formatCompactBRL(result.workingCapitalGain)} />
            <Breakdown label="Inadimplência evitada" value={formatCompactBRL(result.badDebtAvoided)} />
            <div className="pt-2 mt-1 border-t border-white/[0.08] space-y-2">
              <Breakdown
                label="Caixa antecipado (estoque)"
                value={formatCompactBRL(result.workingCapitalReleased)}
                muted
              />
              <Breakdown
                label="Cobertura do projeto"
                value={`${result.projectCoveragePct.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%`}
              />
            </div>
          </div>

          <p className="flex items-start gap-1.5 text-[11px] text-white/40 leading-relaxed mt-4">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            {O2C_ROI_MODEL.disclaimer}
          </p>
        </div>
      </div>

      {/* Projeção acumulada */}
      <div className="border-t border-black/[0.06] p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div className="flex items-start gap-2">
            <LineChart className="w-4 h-4 text-neutral-400 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-[13px] font-semibold text-neutral-900">
                Ganho acumulado projetado · {O2C_PROJECTION.years} anos
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Benefício líquido de investimento e sustentação, ano a ano
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              Acumulado em {O2C_PROJECTION.years} anos
            </p>
            <p className="text-[24px] font-semibold tracking-tight text-emerald-600 leading-tight">
              {formatCompactBRL(fiveYearTotal)}
            </p>
          </div>
        </div>

        <ProjectionChart rows={projection} />

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
          <LegendItem className="bg-emerald-500" label="Ganho líquido no ano" />
          <LegendItem className="bg-amber-400" label="Ano com investimento" />
          <LegendItem className="bg-neutral-900" label="Acumulado" line />
        </div>

        <p className="text-[11px] text-neutral-400 leading-relaxed mt-3">{O2C_PROJECTION.note}</p>
      </div>

      {/* Guia / racional */}
      <RoiGuide />
    </div>
  )
}

function RoiGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-black/[0.06] bg-[#fafaf8]">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center gap-2.5 px-6 py-4 text-left"
        aria-expanded={open}
      >
        <BookOpen className="w-4 h-4 text-neutral-500 flex-shrink-0" strokeWidth={1.75} />
        <span className="text-[13px] font-semibold text-neutral-900">
          Como ler o simulador — e por que os números são factíveis
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 ml-auto flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="px-6 pb-6">
          <p className="text-[12px] text-neutral-600 leading-relaxed max-w-3xl mb-5">
            {O2C_ROI_GUIDE.intro}
          </p>

          <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[720px]">
                <thead>
                  <tr className="border-b border-black/[0.05] text-[10px] uppercase tracking-wider text-neutral-400">
                    <th className="px-5 py-3 font-medium">Alavanca</th>
                    <th className="px-5 py-3 font-medium">Como calcula</th>
                    <th className="px-5 py-3 font-medium">Por que é factível</th>
                    <th className="px-5 py-3 font-medium">Habilitada por</th>
                  </tr>
                </thead>
                <tbody>
                  {O2C_ROI_GUIDE.levers.map(lever => (
                    <tr key={lever.lever} className="border-b border-black/[0.04] last:border-0 align-top">
                      <td className="px-5 py-3.5 text-[12px] font-semibold text-neutral-900 min-w-[160px]">
                        {lever.lever}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-neutral-600 leading-relaxed min-w-[200px]">
                        {lever.how}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-neutral-500 leading-relaxed min-w-[260px]">
                        {lever.feasibility}
                      </td>
                      <td className="px-5 py-3.5 text-[11px] font-mono text-neutral-400 leading-relaxed min-w-[180px]">
                        {lever.enabledBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400 mb-2">
            Método e garantias
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {O2C_ROI_GUIDE.method.map(item => (
              <li
                key={item}
                className="flex gap-2 text-[12px] text-neutral-600 leading-relaxed rounded-xl border border-black/[0.05] bg-white px-4 py-3"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-500" strokeWidth={1.75} />
                {item}
              </li>
            ))}
          </ul>

          <p className="flex items-start gap-1.5 text-[11px] text-neutral-400 leading-relaxed mt-4">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            {O2C_ROI_MODEL.disclaimer}
          </p>
        </div>
      )}
    </div>
  )
}

const CHART = {
  width: 760,
  height: 260,
  padTop: 28,
  padBottom: 40,
  padLeft: 72,
  padRight: 20,
  barWidth: 44,
}

function ProjectionChart({ rows }: { rows: ProjectionYear[] }) {
  const plotWidth = CHART.width - CHART.padLeft - CHART.padRight
  const plotHeight = CHART.height - CHART.padTop - CHART.padBottom
  const band = plotWidth / rows.length

  const values = [0, ...rows.flatMap(row => [row.net, row.cumulative])]
  const rawMax = Math.max(...values)
  const rawMin = Math.min(...values)
  const span = rawMax - rawMin || 1
  const max = rawMax + span * 0.12
  const min = rawMin - span * 0.08

  const y = (value: number) => CHART.padTop + ((max - value) / (max - min)) * plotHeight
  const bandCenter = (index: number) => CHART.padLeft + band * index + band / 2

  const zeroY = y(0)
  const points = rows.map((row, index) => `${bandCenter(index)},${y(row.cumulative)}`).join(' ')

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        className="w-full min-w-[560px]"
        style={{ height: CHART.height }}
        role="img"
        aria-label="Gráfico de ganho líquido anual e acumulado em 5 anos"
      >
        {/* Eixo Y */}
        {[max, (max + min) / 2, min].map(tick => (
          <g key={tick}>
            <line
              x1={CHART.padLeft}
              x2={CHART.width - CHART.padRight}
              y1={y(tick)}
              y2={y(tick)}
              stroke="rgba(0,0,0,0.05)"
              strokeWidth={1}
            />
            <text
              x={CHART.padLeft - 10}
              y={y(tick) + 4}
              textAnchor="end"
              className="fill-neutral-400"
              style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace' }}
            >
              {formatCompactBRL(tick)}
            </text>
          </g>
        ))}

        {/* Linha do zero */}
        <line
          x1={CHART.padLeft}
          x2={CHART.width - CHART.padRight}
          y1={zeroY}
          y2={zeroY}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={1}
        />

        {/* Barras: ganho líquido do ano */}
        {rows.map((row, index) => {
          const barY = row.net >= 0 ? y(row.net) : zeroY
          const barHeight = Math.abs(y(row.net) - zeroY)
          return (
            <g key={row.year}>
              <rect
                x={bandCenter(index) - CHART.barWidth / 2}
                y={barY}
                width={CHART.barWidth}
                height={Math.max(barHeight, 1)}
                rx={3}
                className={row.net >= 0 ? 'fill-emerald-500/85' : 'fill-amber-400/90'}
              />
              <text
                x={bandCenter(index)}
                y={CHART.height - CHART.padBottom + 18}
                textAnchor="middle"
                className="fill-neutral-500"
                style={{ fontSize: 11 }}
              >
                Ano {row.year}
              </text>
              <text
                x={bandCenter(index)}
                y={CHART.height - CHART.padBottom + 32}
                textAnchor="middle"
                className="fill-neutral-400"
                style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace' }}
              >
                {formatCompactBRL(row.net)}
              </text>
            </g>
          )
        })}

        {/* Linha do acumulado */}
        <polyline points={points} fill="none" stroke="#171717" strokeWidth={2} strokeLinejoin="round" />
        {rows.map((row, index) => (
          <g key={`cum-${row.year}`}>
            <circle cx={bandCenter(index)} cy={y(row.cumulative)} r={4} fill="#171717" />
            <text
              x={bandCenter(index)}
              y={y(row.cumulative) - 11}
              textAnchor="middle"
              className="fill-neutral-900"
              style={{ fontSize: 10, fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}
            >
              {formatCompactBRL(row.cumulative)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function LegendItem({ className, label, line }: { className: string; label: string; line?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`${className} ${line ? 'w-4 h-0.5' : 'w-2.5 h-2.5 rounded-sm'}`} />
      <span className="text-[11px] text-neutral-500">{label}</span>
    </span>
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

function Breakdown({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`text-[12px] ${muted ? 'text-white/35' : 'text-white/55'}`}>{label}</span>
      <span className={`text-[12px] font-mono ${muted ? 'text-white/50' : 'text-white/85'}`}>{value}</span>
    </div>
  )
}
