'use client'

import { Reveal } from '@/components/adaptive/ui'
import { DASHBOARD_METRICS, AREA_ORDER, AREA_META, projectsByArea, PROJECTS } from '@/components/frota/data'

const LAYER_COLORS = [
  'bg-neutral-900',
  'bg-neutral-700',
  'bg-neutral-500',
  'bg-neutral-300',
  'bg-neutral-200',
]

export default function FrotaDashboardPage() {
  const totalHigh   = PROJECTS.filter(p => p.priority === 'high').length
  const totalMedium = PROJECTS.filter(p => p.priority === 'medium').length
  const totalLow    = PROJECTS.filter(p => p.priority === 'low').length

  return (
    <div className="max-w-[920px] mx-auto px-6 lg:px-12 py-14 lg:py-20">

      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">Workspace</p>
        <h1 className="text-[28px] lg:text-[34px] font-semibold tracking-[-0.02em] text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-[14px] text-neutral-500 mb-12">
          Acompanhe o andamento do build em tempo real. Os números são atualizados a cada sprint.
        </p>
      </Reveal>

      {/* Metric cards */}
      <Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          {DASHBOARD_METRICS.map((m, i) => (
            <div key={m.label} className="rounded-xl border border-black/[0.06] bg-white p-5 h-full">
              <div className="flex items-baseline gap-2">
                <p className="text-[28px] font-semibold tracking-tight text-neutral-900 leading-none">{m.value}</p>
                {m.delta && <span className="text-[11px] text-neutral-400">{m.delta}</span>}
              </div>
              <p className="text-[12px] font-medium text-neutral-700 mt-2.5">{m.label}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{m.hint}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Portfolio por camada */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 mb-8">
          <div className="flex items-baseline justify-between mb-7">
            <h2 className="text-[15px] font-semibold text-neutral-900">Módulos por camada</h2>
            <span className="text-[12px] text-neutral-400">{PROJECTS.length} total</span>
          </div>

          <div className="flex flex-col gap-5">
            {AREA_ORDER.map((area, i) => {
              const count = projectsByArea(area).length
              const pct = Math.round((count / PROJECTS.length) * 100)
              const Icon = AREA_META[area].icon
              return (
                <div key={area}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.75} />
                      <span className="text-[13px] font-medium text-neutral-700">{area}</span>
                    </div>
                    <span className="text-[13px] font-mono text-neutral-400">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/[0.05] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${LAYER_COLORS[i]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>

      {/* Distribuição de prioridade */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8">
          <div className="flex items-baseline justify-between mb-7">
            <h2 className="text-[15px] font-semibold text-neutral-900">Distribuição de prioridade</h2>
            <span className="text-[12px] text-neutral-400">inicial · a revisar após kickoff</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Alta', value: totalHigh,   color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-100' },
              { label: 'Média',value: totalMedium, color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
              { label: 'Baixa',value: totalLow,    color: 'text-neutral-500',bg: 'bg-neutral-50',border: 'border-neutral-100' },
            ].map(({ label, value, color, bg, border }) => (
              <div key={label} className={`rounded-xl border ${border} ${bg} p-5 text-center`}>
                <p className={`text-[32px] font-semibold ${color}`}>{value}</p>
                <p className="text-[12px] text-neutral-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[12px] text-neutral-400 leading-relaxed">
            * Prioridades iniciais baseadas na proposta técnica. Revisão obrigatória no kickoff com o cliente.
          </p>
        </div>
      </Reveal>

    </div>
  )
}
