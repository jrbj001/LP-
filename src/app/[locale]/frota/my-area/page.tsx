'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/adaptive/ui'
import { STAKEHOLDERS, AREA_ORDER, AREA_META, projectsByArea } from '@/components/frota/data'

export default function FrotaMyAreaPage() {
  const locale = useLocale()
  const [selected, setSelected] = useState<string | null>(null)

  const person = STAKEHOLDERS.find(s => s.name === selected)
  const base = `/${locale}/frota`

  return (
    <div className="max-w-[920px] mx-auto px-6 lg:px-12 py-14 lg:py-20">

      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">Workspace</p>
        <h1 className="text-[28px] lg:text-[34px] font-semibold tracking-[-0.02em] text-neutral-900 mb-2">Minha Área</h1>
        <p className="text-[14px] text-neutral-500 mb-10">
          Selecione seu perfil para ver os módulos e camadas relevantes.
        </p>
      </Reveal>

      {/* Stakeholder selector */}
      <Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
          {STAKEHOLDERS.map((s) => (
            <button
              key={s.name}
              onClick={() => setSelected(s.name)}
              className={`rounded-xl border p-5 text-left transition-all ${
                selected === s.name
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-black/[0.06] bg-white hover:border-black/[0.12]'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold mb-3 ${
                selected === s.name ? 'bg-white/10 text-white' : 'bg-black/[0.06] text-neutral-600'
              }`}>
                {s.initials}
              </div>
              <p className={`text-[14px] font-semibold ${selected === s.name ? 'text-white' : 'text-neutral-900'}`}>
                {s.name}
              </p>
              <p className={`text-[12px] mt-0.5 ${selected === s.name ? 'text-white/60' : 'text-neutral-400'}`}>
                {s.role}
              </p>
              {s.sponsor && (
                <span className={`mt-2 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  selected === s.name ? 'bg-white/10 text-white/70' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  Sponsor
                </span>
              )}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Área da pessoa selecionada */}
      {person && (
        <Reveal key={person.name}>
          <div className="mb-8">
            <h2 className="text-[18px] font-semibold text-neutral-900 mb-1">
              {person.role}
            </h2>
          </div>

          {person.sponsor ? (
            /* Sponsor vê tudo */
            <div className="flex flex-col gap-6">
              {AREA_ORDER.map(area => {
                const meta = AREA_META[area]
                const Icon = meta.icon
                const projects = projectsByArea(area)
                return (
                  <div key={area} className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.04]">
                      <div className="w-7 h-7 rounded-full bg-black/[0.06] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-neutral-900">{area}</p>
                        <p className="text-[11px] text-neutral-400">{meta.owner} · {meta.phase}</p>
                      </div>
                      <span className="ml-auto text-[11px] text-neutral-400">{projects.length} módulos</span>
                    </div>
                    <div className="divide-y divide-black/[0.03]">
                      {projects.map(p => (
                        <div key={p.name} className="px-5 py-3 flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            p.priority === 'high' ? 'bg-rose-400' :
                            p.priority === 'medium' ? 'bg-amber-400' : 'bg-neutral-300'
                          }`} />
                          <p className="text-[13px] text-neutral-700 flex-1">{p.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Membro da equipe vê suas camadas */
            <div className="flex flex-col gap-6">
              {AREA_ORDER
                .filter(area => person.areas.includes(area) || person.areas.includes('Todas'))
                .map(area => {
                  const meta = AREA_META[area]
                  const Icon = meta.icon
                  const projects = projectsByArea(area)
                  return (
                    <div key={area} className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.04]">
                        <div className="w-7 h-7 rounded-full bg-black/[0.06] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-neutral-900">{area}</p>
                          <p className="text-[11px] text-neutral-400">{meta.phase}</p>
                        </div>
                        <span className="ml-auto text-[11px] text-neutral-400">{projects.length} módulos</span>
                      </div>
                      <div className="divide-y divide-black/[0.03]">
                        {projects.map(p => (
                          <div key={p.name} className="px-5 py-3 flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              p.priority === 'high' ? 'bg-rose-400' :
                              p.priority === 'medium' ? 'bg-amber-400' : 'bg-neutral-300'
                            }`} />
                            <p className="text-[13px] text-neutral-700 flex-1">{p.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}

              <a
                href={`${base}/projects`}
                className="group mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 transition-all w-fit"
              >
                Ver todos os módulos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
              </a>
            </div>
          )}
        </Reveal>
      )}

    </div>
  )
}
