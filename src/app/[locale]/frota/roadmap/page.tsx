'use client'

import { Reveal } from '@/components/adaptive/ui'
import { MILESTONES, TEAM, PROJECTS } from '@/components/frota/data'

const PHASE_COLORS: Record<string, string> = {
  'Fase 1': 'border-neutral-900 bg-neutral-900',
  'Fase 2': 'border-neutral-300 bg-neutral-400',
}

const PHASE_TEXT: Record<string, string> = {
  'Fase 1': 'text-white',
  'Fase 2': 'text-white',
}

const OWNER_COLOR: Record<string, string> = {
  Backend:  'bg-neutral-900',
  IA:       'bg-neutral-700',
  Frontend: 'bg-neutral-500',
  Mobile:   'bg-neutral-400',
  Cliente:  'bg-emerald-500',
}

export default function FrotaRoadmapPage() {
  const fase1Total = MILESTONES.filter(m => m.phase === 'Fase 1').reduce((s, m) => s + m.hours, 0)
  const fase2Total = MILESTONES.filter(m => m.phase === 'Fase 2').reduce((s, m) => s + m.hours, 0)
  const totalWeeks = Math.max(...MILESTONES.map(m => m.week)) + 1

  return (
    <div className="max-w-[920px] mx-auto px-6 lg:px-12 py-14 lg:py-20">

      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">Projeto</p>
        <h1 className="text-[28px] lg:text-[34px] font-semibold tracking-[-0.02em] text-neutral-900 mb-2">Roadmap</h1>
        <p className="text-[14px] text-neutral-500 mb-3">
          {MILESTONES.length} milestones · {totalWeeks} semanas · 3 devs alocados
        </p>
        <div className="flex gap-5 text-[13px] mb-12">
          <span className="text-neutral-500">Fase 1 <strong className="text-neutral-900">{fase1Total}h</strong></span>
          <span className="text-neutral-300">·</span>
          <span className="text-neutral-500">Fase 2 <strong className="text-neutral-900">{fase2Total}h</strong></span>
          <span className="text-neutral-300">·</span>
          <span className="text-neutral-500">Total <strong className="text-neutral-900">{fase1Total + fase2Total}h</strong></span>
        </div>
      </Reveal>

      {/* Linha do tempo */}
      <Reveal className="mb-16">
        <div className="flex flex-col gap-0">
          {MILESTONES.map((m, i) => {
            const isLast = i === MILESTONES.length - 1
            const isPhaseChange = i > 0 && MILESTONES[i - 1].phase !== m.phase

            return (
              <div key={m.id}>
                {/* Phase divider */}
                {isPhaseChange && (
                  <div className="flex items-center gap-3 my-4 ml-5">
                    <div className="flex-1 h-px bg-neutral-100" />
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest px-3">
                      {m.phase}
                    </span>
                    <div className="flex-1 h-px bg-neutral-100" />
                  </div>
                )}

                <div className="flex gap-5">
                  {/* Timeline spine */}
                  <div className="flex flex-col items-center w-10 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 border-2 ${
                      m.id === 'kickoff'
                        ? 'border-emerald-500 bg-emerald-500 text-white ring-4 ring-emerald-100'
                        : `${PHASE_COLORS[m.phase]} ${PHASE_TEXT[m.phase]}`
                    }`}>
                      {m.id === 'kickoff' ? '★' : `M${i}`}
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-neutral-100 mt-1" />}
                  </div>

                  {/* Content */}
                  <div className="pb-10 flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] text-neutral-400 font-mono">
                            Sem {m.week === 0 ? '0 · Kickoff' : m.week}
                          </span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            m.phase === 'Fase 1'
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            {m.phase}
                          </span>
                        </div>
                        <h3 className="text-[16px] font-semibold text-neutral-900">{m.title}</h3>
                      </div>
                      <span className="text-[14px] font-semibold text-neutral-900 flex-shrink-0 font-mono">
                        {m.hours}h
                      </span>
                    </div>

                    <p className="text-[13px] text-neutral-500 mb-4">{m.description}</p>

                    {/* Roles/owners — sem nomes */}
                    <div className="flex items-center gap-2 mb-4">
                      {m.owners.map(owner => (
                        <div
                          key={owner}
                          className={`w-6 h-6 rounded-full ${OWNER_COLOR[owner] ?? 'bg-neutral-200'} text-white flex items-center justify-center text-[9px] font-semibold`}
                          title={owner}
                        >
                          {owner.slice(0, 2).toUpperCase()}
                        </div>
                      ))}
                      <span className="text-[11px] text-neutral-400 ml-1">
                        {m.owners.filter(o => o !== 'Cliente').join(' · ')}
                      </span>
                    </div>

                    {/* Deliverables */}
                    <div className="rounded-xl border border-black/[0.06] bg-white p-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-3">
                        Entregáveis
                      </p>
                      <div className="flex flex-col gap-2">
                        {m.deliverables.map(d => (
                          <div key={d} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                            <p className="text-[12px] text-neutral-600">{d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* Resumo por papel */}
      <Reveal>
        <h2 className="text-[15px] font-semibold text-neutral-900 mb-5">Alocação por papel</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEAM.map(member => {
            const memberProjects = PROJECTS.filter(p =>
              member.focus.some(f => p.area === f)
            )
            const memberHours = memberProjects.reduce((s, p) => s + p.hours, 0)
            const weeksNeeded = Math.ceil(memberHours / member.hoursPerWeek)

            return (
              <div key={member.role} className="rounded-xl border border-black/[0.06] bg-white p-5">
                <div className={`w-9 h-9 rounded-full ${member.color} text-white flex items-center justify-center text-[12px] font-semibold mb-4`}>
                  {member.initials}
                </div>
                <p className="text-[14px] font-semibold text-neutral-900">{member.role}</p>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Horas estimadas</span>
                    <span className="font-semibold text-neutral-900">{memberHours}h</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Dedicação/sem</span>
                    <span className="font-semibold text-neutral-900">{member.hoursPerWeek}h</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Semanas</span>
                    <span className="font-semibold text-neutral-900">~{weeksNeeded} sem</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Módulos</span>
                    <span className="font-semibold text-neutral-900">{memberProjects.length}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Reveal>

    </div>
  )
}
