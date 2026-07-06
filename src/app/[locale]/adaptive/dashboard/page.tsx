'use client'

import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { DASHBOARD_METRICS, PILLARS } from '@/components/adaptive/data'

// Sample pillar scores (0–100) shown as horizontal bars.
const PILLAR_SCORES = [72, 64, 58, 61, 43]

export default function DashboardPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Dashboard"
        subtitle="Acompanhe o andamento do assessment em tempo real. Os números são atualizados à medida que as Discovery Sessions são concluídas."
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

      {/* Pillar scores */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8">
          <div className="flex items-baseline justify-between mb-7">
            <h2 className="text-[15px] font-semibold text-neutral-900">Adaptive Index™ — parcial</h2>
            <span className="text-[12px] text-neutral-400">baseado em 25% dos dados</span>
          </div>

          <div className="flex flex-col gap-5">
            {PILLARS.map((pillar, i) => {
              const score = PILLAR_SCORES[i]
              return (
                <div key={pillar.index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium text-neutral-700">{pillar.name}</span>
                    <span className="text-[13px] font-mono text-neutral-400">{score}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-neutral-900"
                      style={{ width: `${score}%`, animation: `adaptive-fade-up 0.6s ease-out` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-7 text-[12px] text-neutral-400 leading-relaxed">
            * Índice preliminar. O score final é consolidado após todas as Discovery Sessions e a análise técnica.
          </p>
        </div>
      </Reveal>
    </PageShell>
  )
}
