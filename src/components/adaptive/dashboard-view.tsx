'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import {
  PROJECTS, AREA_ORDER, projectsByArea, PRIORITY_META, CLIENT,
} from '@/components/adaptive/data'
import {
  buildDashboardMetrics,
  PILLAR_SCORES,
  ADAPTIVE_INDEX,
  REVIEW_META,
  CRITICAL_RISKS,
  scoreTone,
  SCORE_BAR,
  type DashboardCounts,
} from '@/components/adaptive/executive-review-data'
import { ArrowRight, Radar } from 'lucide-react'

const PRIORITIES = ['high', 'medium', 'low'] as const

export function DashboardView({ counts }: { counts?: DashboardCounts }) {
  const locale = useLocale()
  const metrics = buildDashboardMetrics(counts)
  const reviewHref = `/${locale}/adaptive/executive-review`

  const maxArea = Math.max(...AREA_ORDER.map(a => projectsByArea(a).length))
  const priorityCounts = PRIORITIES.map(p => ({
    key: p,
    label: PRIORITY_META[p].label,
    dot: PRIORITY_META[p].dot,
    count: PROJECTS.filter(x => x.priority === p).length,
  }))

  const assessmentPct = counts
    ? Math.round((counts.assessmentDone / REVIEW_META.assessmentsExpected) * 100)
    : Math.round((REVIEW_META.assessmentsReceived / REVIEW_META.assessmentsExpected) * 100)

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Dashboard"
        subtitle={`Visão consolidada do portfólio do ${CLIENT.name}. Scores preliminares com base em ${counts?.assessmentDone ?? REVIEW_META.assessmentsReceived} assessments e ${REVIEW_META.meetingsCompleted} reuniões discovery.`}
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        {metrics.map((m, i) => (
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
              Priorização preliminar — validada parcialmente via onboarding e reuniões.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Adaptive Index — preliminary */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 mb-4">
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Radar className="w-4 h-4 text-white/40" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Adaptive Index™
                </p>
                <Badge tone="amber">Prévia · {assessmentPct}% coletado</Badge>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[48px] font-semibold leading-none tracking-tight">{ADAPTIVE_INDEX}</span>
                <span className="text-[16px] text-white/40">/100</span>
              </div>
              <p className="text-[13px] text-white/50 mt-3 max-w-lg leading-relaxed">
                Estimativa preliminar — será recalibrada após Cristiane, Lucas e Rafaela completarem o assessment.
              </p>
            </div>
            <Link
              href={reviewHref}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-neutral-900 text-[13px] font-medium hover:bg-white/90 transition-colors"
            >
              Ver Executive Review
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLAR_SCORES.map(p => {
              const tone = scoreTone(p.score)
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[12px] text-white/70">{p.name.replace('™', '')}</span>
                    <span className="text-[13px] font-semibold font-mono">{p.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${SCORE_BAR[tone]}`}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>

      {/* Critical risks preview */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-7">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-4">Riscos críticos identificados</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CRITICAL_RISKS.map(risk => (
              <li key={risk} className="flex gap-2 text-[13px] text-neutral-600">
                <span className="text-rose-400 flex-shrink-0">·</span>
                {risk}
              </li>
            ))}
          </ul>
          <Link
            href={reviewHref}
            className="inline-flex items-center gap-1.5 mt-5 text-[12px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Recomendações e roadmap completo
            <ArrowRight className="w-3 h-3" strokeWidth={2} />
          </Link>
        </div>
      </Reveal>
    </PageShell>
  )
}
