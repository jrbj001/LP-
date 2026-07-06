'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import { ProjectCard } from '@/components/adaptive/project-card'
import {
  STAKEHOLDERS, findStakeholder, projectsByRequester, CLIENT,
} from '@/components/adaptive/data'
import { ArrowRight, ChevronDown, Star } from 'lucide-react'

const STORAGE_KEY = 'adaptive.orfeu.stakeholder'

export default function MyAreaPage() {
  const locale = useLocale()
  const base = `/${locale}/adaptive`
  const [selected, setSelected] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (saved && findStakeholder(saved)) setSelected(saved)
    setReady(true)
  }, [])

  function choose(name: string) {
    setSelected(name)
    localStorage.setItem(STORAGE_KEY, name)
  }
  function reset() {
    setSelected(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  if (!ready) return <PageShell><div className="h-[40vh]" /></PageShell>

  // ── Selection screen ──
  if (!selected) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Minha Área"
          title="Quem é você?"
          subtitle={`Selecione seu nome para ver os projetos da sua área no assessment do ${CLIENT.name}.`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STAKEHOLDERS.map((s, i) => {
            const count = projectsByRequester(s.name).length
            return (
              <Reveal key={s.name} delay={i * 0.03}>
                <button
                  onClick={() => choose(s.name)}
                  className="group w-full text-left rounded-xl border border-black/[0.06] bg-white p-5 hover:border-black/[0.14] hover:shadow-[0_2px_18px_rgba(0,0,0,0.05)] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[13px] font-semibold flex-shrink-0">
                      {s.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[14px] font-semibold text-neutral-900 truncate">{s.name}</p>
                        {s.facilitator && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" strokeWidth={0} />}
                      </div>
                      <p className="text-[12px] text-neutral-400 truncate">{s.areas.join(' · ')}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" strokeWidth={2} />
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-between">
                    <span className="text-[12px] text-neutral-500">
                      {count} {count === 1 ? 'projeto' : 'projetos'}
                    </span>
                    {s.facilitator && <Badge tone="amber">Facilitador</Badge>}
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </PageShell>
    )
  }

  // ── Selected stakeholder view ──
  const person = findStakeholder(selected)!
  const projects = projectsByRequester(selected)

  return (
    <PageShell>
      <div className="mb-6">
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors">
          <ChevronDown className="w-3.5 h-3.5 rotate-90" strokeWidth={2} />
          Trocar de usuário
        </button>
      </div>

      <PageHeader
        eyebrow="Minha Área"
        title={person.name}
        subtitle={`Projetos sob sua responsabilidade no assessment do ${CLIENT.name}.`}
      />

      {/* Profile + status card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-black/[0.06] bg-white p-6 flex flex-col sm:flex-row sm:items-center gap-5 mb-10"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[14px] font-semibold">
            {person.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-neutral-900">{person.name}</p>
              {person.facilitator && <Badge tone="amber">Facilitador</Badge>}
            </div>
            <p className="text-[12px] text-neutral-400">{person.areas.join(' · ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[11px] text-neutral-400">Discovery</p>
            <div className="mt-1"><Badge tone="amber">Pending</Badge></div>
          </div>
          <a
            href={`${base}/discovery/session`}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 transition-all"
          >
            Start Discovery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </a>
        </div>
      </motion.div>

      {/* Facilitator note */}
      {person.facilitator && (
        <div className="mb-8 rounded-xl border border-amber-100 bg-amber-50/60 px-5 py-3.5 flex items-center gap-3">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" strokeWidth={0} />
          <p className="text-[13px] text-amber-800">
            Como facilitador, você acompanha todas as áreas em{' '}
            <a href={`${base}/projects`} className="font-semibold underline underline-offset-2">Projetos</a> e{' '}
            <a href={`${base}/dashboard`} className="font-semibold underline underline-offset-2">Dashboard</a>.
          </p>
        </div>
      )}

      {/* Projects */}
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-neutral-900">Seus projetos</h2>
        <span className="text-[12px] text-neutral-400">{projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.05}>
            <ProjectCard project={p} showArea={person.areas.length > 1} />
          </Reveal>
        ))}
      </div>
    </PageShell>
  )
}
