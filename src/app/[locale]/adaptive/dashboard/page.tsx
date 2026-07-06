'use client'

import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import {
  DASHBOARD_METRICS, PROJECTS, AREA_ORDER, projectsByArea, PRIORITY_META, CLIENT,
} from '@/components/adaptive/data'
import { Lock } from 'lucide-react'

const PRIORITIES = ['high', 'medium', 'low'] as const

export default function DashboardPage() {
  const maxArea = Math.max(...AREA_ORDER.map(a => projectsByArea(a).length))
  const priorityCounts = PRIORITIES.map(p => ({
    key: p,
    label: PRIORITY_META[p].label,
    dot: PRIORITY_META[p].dot,
    count: PROJECTS.filter(x => x.priority === p).length,
  }))

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Dashboard"
        subtitle={`Visão consolidada do portfólio do ${CLIENT.name}. Os indicadores de maturidade são gerados à medida que as Discovery Sessions são concluídas.`}
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        {DASHBOARD_METRICS.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.04}>
            <div className="rounded-xl border border-black/[0.06] bg-white p-5 h-full">
              <div className="flex items-baseline gap-2">
                <p className="text-[28px] font-semibold tracking-tight text-neutral-900 leading-none">{m.value}</p>
                {m.delta && <span className="text-[11px] text-neutral-400">{m.delta}</span>}
              </div>
              <p className="text-[12px] font-medium text-neutral-700 mt-2.5">{m.label}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{m.hint}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mb-12">
        {/* Projects by area */}
        <Reveal>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-7 h-full">
            <h2 className="text-[15px] font-semibold text-neutral-900 mb-6">Projetos por área</h2>
            <div className="flex flex-col gap-3.5">
              {AREA_ORDER.map(area => {
                const count = projectsByArea(area).length
                return (
                  <div key={area} className="flex items-center gap-3">
                    <span className="w-24 text-[12px] text-neutral-500 flex-shrink-0">{area}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-black/[0.04] overflow-hidden">
                      <div className="h-full rounded-full bg-neutral-900" style={{ width: `${(count / maxArea) * 100}%` }} />
                    </div>
                    <span className="w-5 text-right text-[12px] font-mono text-neutral-400">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Priority distribution */}
        <Reveal delay={0.06}>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-7 h-full">
            <h2 className="text-[15px] font-semibold text-neutral-900 mb-6">Prioridade inicial</h2>
            <div className="flex flex-col gap-5">
              {priorityCounts.map(p => (
                <div key={p.key} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[13px] text-neutral-600">
                    <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                    {p.label}
                  </span>
                  <span className="text-[18px] font-semibold text-neutral-900">{p.count}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] text-neutral-400 leading-relaxed">
              Priorização preliminar — será validada com cada líder durante a Discovery.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Adaptive Index — awaiting */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[15px] font-semibold">Adaptive Index™ — aguardando assessment</p>
            <p className="text-[13px] text-white/50 mt-1">
              O índice de maturidade dos 5 pilares é liberado após as Discovery Sessions.
            </p>
          </div>
        </div>
      </Reveal>
    </PageShell>
  )
}
