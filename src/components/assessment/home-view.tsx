'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { PageShell, Reveal, Badge } from '@/components/adaptive/ui'
import type { AssessmentWorkspace } from '@/lib/assessment/types'
import { ArrowRight, BookOpen, Server, Bot, Zap, Gauge } from 'lucide-react'

const JOURNEY_DOT = {
  done: 'bg-emerald-500',
  active: 'bg-neutral-900',
  upcoming: 'bg-neutral-200',
} as const

export function HomeView({ workspace }: { workspace: AssessmentWorkspace }) {
  const locale = useLocale()
  const base = `/${locale}/adaptive/${workspace.client.slug}`
  const { client, home } = workspace

  const STAT_ICONS = [Server, Bot, Zap, Gauge]

  return (
    <PageShell>
      {/* Identidade */}
      <Reveal>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] text-[12px] font-medium text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: client.accent ?? '#10b981' }} />
            {client.name}
          </span>
          <span className="text-[12px] text-neutral-400">{client.sector}</span>
        </div>
      </Reveal>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-14"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-5">
          Assessment · Adaptive Enterprise™
        </p>
        <h1 className="text-[32px] lg:text-[46px] font-semibold tracking-[-0.03em] leading-[1.05] text-neutral-900 max-w-3xl">
          {home.problem}
        </h1>
        <div className="mt-7 space-y-4 max-w-2xl">
          {home.narrative.map(p => (
            <p key={p.slice(0, 32)} className="text-[15px] leading-relaxed text-neutral-500">{p}</p>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          {workspace.features.includes('lgpdNda') && (
            <Link
              href={`${base}/lgpd-nda`}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 transition-all"
            >
              NDA & LGPD · dar ok
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </Link>
          )}
          <Link
            href={`${base}/diagnostico`}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium transition-all ${
              workspace.features.includes('lgpdNda')
                ? 'border border-black/[0.1] text-neutral-700 hover:bg-black/[0.02]'
                : 'group bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            Ver o diagnóstico
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </Link>
          <Link
            href={`${base}/como-funciona`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/[0.1] text-neutral-700 text-[14px] font-medium hover:bg-black/[0.02] transition-all"
          >
            <BookOpen className="w-4 h-4" strokeWidth={1.75} />
            Como funciona a Layer
          </Link>
        </div>
      </motion.section>

      {/* Stats */}
      <Reveal className="mb-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {home.stats.map((stat, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length]
            return (
              <div key={stat.label} className="rounded-xl border border-black/[0.06] bg-white p-5">
                <Icon className="w-[18px] h-[18px] text-neutral-300 mb-4" strokeWidth={1.75} />
                <p className="text-[26px] font-semibold tracking-tight text-neutral-900 leading-none">{stat.value}</p>
                <p className="text-[12px] font-medium text-neutral-700 mt-2">{stat.label}</p>
                {stat.hint && <p className="text-[11px] text-neutral-400 mt-0.5">{stat.hint}</p>}
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* Jornada */}
      <Reveal className="mb-14">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-[15px] font-semibold text-neutral-900">Jornada do Assessment</h2>
            <span className="text-[12px] text-neutral-400">{home.journey.length} etapas</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {home.journey.map((step, i) => (
              <div key={step.id} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${JOURNEY_DOT[step.status]}`} />
                  <span className="text-[11px] font-mono text-neutral-300">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="text-[14px] font-semibold text-neutral-900">{step.title}</p>
                <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Deliverables */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 lg:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40 mb-3">
            O que você recebe ao final
          </p>
          <h2 className="text-[24px] lg:text-[28px] font-semibold tracking-[-0.02em] max-w-lg">
            Resultados concretos, não um relatório de consultoria.
          </h2>
          <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {home.deliverables.map(d => (
              <div key={d.metric} className="border-t border-white/10 pt-5">
                <p className="text-[15px] font-semibold text-white">{d.metric}</p>
                <p className="text-[12px] text-white/40 mt-0.5">{d.label}</p>
                <p className="text-[13px] text-white/60 mt-3 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </PageShell>
  )
}
