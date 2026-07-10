'use client'

import { Reveal } from '@/components/adaptive/ui'
import { PROJECTS, AREA_ORDER, AREA_META, PROJECT_STATUS_META, PRIORITY_META, projectsByArea } from '@/components/frota/data'

export default function FrotaProjectsPage() {
  return (
    <div className="max-w-[920px] mx-auto px-6 lg:px-12 py-14 lg:py-20">

      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">Workspace</p>
        <h1 className="text-[28px] lg:text-[34px] font-semibold tracking-[-0.02em] text-neutral-900 mb-2">Módulos</h1>
        <p className="text-[14px] text-neutral-500 mb-12">
          {PROJECTS.length} entregáveis distribuídos em {AREA_ORDER.length} camadas de arquitetura.
        </p>
      </Reveal>

      <div className="flex flex-col gap-10">
        {AREA_ORDER.map((area) => {
          const meta = AREA_META[area]
          const Icon = meta.icon
          const projects = projectsByArea(area)

          return (
            <Reveal key={area}>
              {/* Area header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-black/[0.06] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-neutral-500" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-neutral-900">{area}</h2>
                  <p className="text-[11px] text-neutral-400">{meta.owner} · {meta.phase} · {projects.length} módulos</p>
                </div>
              </div>

              {/* Project rows */}
              <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.04] overflow-hidden">
                {projects.map((p) => {
                  const statusMeta  = PROJECT_STATUS_META[p.status]
                  const priorityMeta = PRIORITY_META[p.priority]
                  return (
                    <div key={p.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-black/[0.015] transition-colors">
                      {/* Priority dot */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityMeta.dot}`} />

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-neutral-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{p.owner}</p>
                      </div>

                      {/* Status badge */}
                      <span className={`flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-md border ${
                        statusMeta.tone === 'green'   ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                        statusMeta.tone === 'amber'   ? 'border-amber-200 bg-amber-50 text-amber-700' :
                        statusMeta.tone === 'neutral' ? 'border-neutral-200 bg-neutral-50 text-neutral-500' :
                        'border-black/[0.08] bg-black/[0.02] text-neutral-400'
                      }`}>
                        {statusMeta.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
