'use client'

import { useState } from 'react'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import { CLIENT } from '@/components/adaptive/data'
import {
  REVIEW_META,
  ASSESSMENT_GAPS,
  PILLAR_SCORES,
  ADAPTIVE_INDEX,
  RECOMMENDATIONS,
  QUICK_WINS,
  ROADMAP,
  PORTFOLIO_GROUPS,
  CROSS_THEMES,
  AI_OPPORTUNITIES,
  DELIVERY_MODEL,
  NEXT_STEPS,
  formatReviewDate,
  scoreTone,
  SCORE_BAR,
} from '@/components/adaptive/executive-review-data'
import type { ProgressRow } from '@/lib/adaptive/types'
import {
  Radar, ListChecks, Zap, Sparkles, ChevronDown, Calendar,
  AlertCircle, Target, ArrowRight, CheckCircle2,
} from 'lucide-react'

const PORTFOLIO_TONE: Record<string, string> = {
  green: 'border-emerald-100 bg-emerald-50/50',
  amber: 'border-amber-100 bg-amber-50/50',
  sky: 'border-sky-100 bg-sky-50/50',
}

const PORTFOLIO_DOT: Record<string, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  sky: 'bg-sky-500',
}

export function ExecutiveReviewView({
  progressRows,
  assessmentCount,
}: {
  progressRows?: ProgressRow[]
  assessmentCount?: number
}) {
  const [openPhase, setOpenPhase] = useState<string>('phase-1')
  const received = assessmentCount ?? REVIEW_META.assessmentsReceived
  const pct = Math.round((received / REVIEW_META.assessmentsExpected) * 100)

  const submittedNames = progressRows
    ? progressRows
        .filter(r => ['Assessment done', 'Session booked', 'Done'].includes(r.status))
        .map(r => r.stakeholder)
    : []

  return (
    <PageShell>
      <PageHeader
        eyebrow="Executive Technology Review™"
        title="Executive Review"
        subtitle={`Prévia consolidada do assessment do ${CLIENT.name} — reuniões transcritas, onboarding respondido e portfólio do Comitê de TI.`}
      />

      {/* Status banner */}
      <Reveal>
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-6 mb-8">
          <div className="flex flex-wrap items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-700" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-[15px] font-semibold text-neutral-900">Prévia — assessment parcial</p>
                <Badge tone="amber">{pct}% coletado</Badge>
              </div>
              <p className="text-[13px] text-neutral-600 leading-relaxed">
                {received} de {REVIEW_META.assessmentsExpected} stakeholders responderam o onboarding ·{' '}
                {REVIEW_META.meetingsCompleted} reuniões discovery · {REVIEW_META.projectsMapped} projetos mapeados.
                Scores e priorização serão recalibrados após completar Cristiane, Lucas e Rafaela.
              </p>
              {submittedNames.length > 0 && (
                <p className="text-[12px] text-neutral-500 mt-2">
                  Respondidos: {submittedNames.join(', ')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-neutral-600 bg-white/80 border border-amber-100 rounded-xl px-4 py-2.5">
              <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" strokeWidth={1.75} />
              <span>
                Review: {formatReviewDate(REVIEW_META.reviewDate)}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Adaptive Index hero */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 mb-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40 mb-3">
                Adaptive Index™
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-[56px] font-semibold leading-none tracking-tight">{ADAPTIVE_INDEX}</span>
                <span className="text-[18px] text-white/40">/100</span>
              </div>
              <p className="text-[13px] text-white/50 mt-3 max-w-md leading-relaxed">
                Maturidade organizacional alta; execução tecnológica abaixo do potencial.
                Estimativa preliminar com {received}/{REVIEW_META.assessmentsExpected} vozes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Radar className="w-5 h-5 text-white/30" strokeWidth={1.75} />
              <span className="text-[12px] text-white/40">Gerado em {REVIEW_META.generatedAt}</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Pillar scores */}
      <Reveal>
        <Section title="Radar de Maturidade" subtitle="Cinco pilares do Adaptive Framework™">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-7">
            <div className="flex flex-col gap-5">
              {PILLAR_SCORES.map(p => {
                const tone = scoreTone(p.score)
                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-[13px] font-medium text-neutral-800">{p.name}</span>
                      <span className="text-[14px] font-semibold font-mono text-neutral-900">{p.score}</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/[0.04] overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all ${SCORE_BAR[tone]}`}
                        style={{ width: `${p.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">{p.evidence}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </Section>
      </Reveal>

      {/* Cross themes */}
      <Reveal>
        <Section title="Temas transversais" subtitle="Convergência entre reuniões e onboarding">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CROSS_THEMES.map(t => (
              <div key={t.theme} className="rounded-xl border border-black/[0.06] bg-white p-5">
                <p className="text-[13px] font-medium text-neutral-900 leading-snug">{t.theme}</p>
                <p className="text-[11px] text-neutral-400 mt-2">{t.sources.join(' · ')}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Recommendations */}
      <Reveal>
        <Section
          title="Recomendações executivas"
          subtitle="Top 5 prioridades para o comitê de TI"
          icon={ListChecks}
        >
          <div className="flex flex-col gap-3">
            {RECOMMENDATIONS.map(r => (
              <div key={r.rank} className="rounded-xl border border-black/[0.06] bg-white p-5 flex gap-4">
                <span className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-[13px] font-semibold flex-shrink-0">
                  {r.rank}
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-neutral-900">{r.title}</p>
                  <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Quick Wins */}
      <Reveal>
        <Section title="Quick Wins" subtitle="Alto impacto · baixo esforço · Fase 1" icon={Zap}>
          <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-black/[0.05] text-[11px] uppercase tracking-wider text-neutral-400">
                    <th className="px-5 py-3 font-medium">ID</th>
                    <th className="px-5 py-3 font-medium">Iniciativa</th>
                    <th className="px-5 py-3 font-medium">Origem</th>
                    <th className="px-5 py-3 font-medium">Esforço</th>
                    <th className="px-5 py-3 font-medium">Impacto</th>
                  </tr>
                </thead>
                <tbody>
                  {QUICK_WINS.map(qw => (
                    <tr key={qw.id} className="border-b border-black/[0.04] last:border-0">
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] font-mono text-neutral-500">{qw.id}</span>
                        {qw.pilot && (
                          <span className="ml-2 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            piloto
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] font-medium text-neutral-900">{qw.title}</td>
                      <td className="px-5 py-3.5 text-[12px] text-neutral-500">{qw.source}</td>
                      <td className="px-5 py-3.5 text-[12px] text-neutral-600">{qw.effort}</td>
                      <td className="px-5 py-3.5">
                        <Badge tone={qw.impact === 'Alto' ? 'green' : 'muted'}>{qw.impact}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[12px] text-neutral-400 mt-3">
            Piloto recomendado: QW-01 + QW-04 ou QW-02 — escolha conjunta com André e Ricardo.
          </p>
        </Section>
      </Reveal>

      {/* AI Opportunities */}
      <Reveal>
        <Section title="AI Opportunity Map™" subtitle="Onde IA gera maior valor" icon={Sparkles}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AI_OPPORTUNITIES.map(a => (
              <div key={a.area} className="rounded-xl border border-black/[0.06] bg-white p-5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1">{a.area}</p>
                <p className="text-[13px] font-medium text-neutral-900 leading-snug">{a.opportunity}</p>
                <p className="text-[11px] text-neutral-400 mt-2">{a.stakeholder}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Roadmap phases */}
      <Reveal>
        <Section title="Adaptive Roadmap™" subtitle="Plano faseado por impacto, risco e esforço" icon={Target}>
          <div className="flex flex-col gap-2">
            {ROADMAP.map(phase => {
              const open = openPhase === phase.id
              return (
                <div key={phase.id} className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenPhase(open ? '' : phase.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-black/[0.01] transition-colors"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-900">{phase.title}</p>
                      <p className="text-[12px] text-neutral-500 mt-0.5">
                        {phase.window} · {phase.items.length} iniciativa{phase.items.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                      strokeWidth={1.75}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-black/[0.05] px-5 py-4 bg-[#fafaf8]">
                      <p className="text-[12px] text-neutral-500 mb-4">{phase.objective}</p>
                      <ul className="space-y-3">
                        {phase.items.map(item => (
                          <li key={item.id} className="flex gap-3">
                            <ArrowRight className="w-3.5 h-3.5 text-neutral-300 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <div>
                              <p className="text-[13px] font-medium text-neutral-800">{item.title}</p>
                              {(item.projects || item.notes) && (
                                <p className="text-[11px] text-neutral-400 mt-0.5">
                                  {[item.projects, item.notes].filter(Boolean).join(' · ')}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Section>
      </Reveal>

      {/* Portfolio reprioritization */}
      <Reveal>
        <Section title="Repriorização do portfólio" subtitle="Consolidando onboarding + reuniões + Comitê de TI">
          <div className="grid grid-cols-1 gap-4">
            {PORTFOLIO_GROUPS.map(g => (
              <div key={g.label} className={`rounded-xl border p-5 ${PORTFOLIO_TONE[g.tone]}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${PORTFOLIO_DOT[g.tone]}`} />
                  <p className="text-[13px] font-semibold text-neutral-900">{g.label}</p>
                </div>
                <ul className="space-y-1.5">
                  {g.items.map(item => (
                    <li key={item} className="text-[13px] text-neutral-600 flex gap-2">
                      <span className="text-neutral-300">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Delivery model */}
      <Reveal>
        <Section title="Modelo de entrega" subtitle="Proposta para o Review de 31/07">
          <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.04]">
            {DELIVERY_MODEL.map(row => (
              <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
                <span className="text-[12px] font-medium text-neutral-500">{row.label}</span>
                <span className="text-[13px] text-neutral-900 text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Gaps */}
      <Reveal>
        <Section title="Lacunas do assessment" subtitle="Ações antes do Review final">
          <div className="rounded-xl border border-black/[0.06] bg-white p-5">
            <ul className="space-y-2">
              {ASSESSMENT_GAPS.map(gap => (
                <li key={gap} className="flex gap-2 text-[13px] text-neutral-600">
                  <span className="text-amber-400">○</span>
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </Reveal>

      {/* Next steps */}
      <Reveal>
        <Section title="Próximos passos" subtitle="Até 31/07">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <ul className="space-y-3">
              {NEXT_STEPS.map(step => (
                <li key={step.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                  <div>
                    <p className="text-[13px] font-medium text-neutral-900">{step.title}</p>
                    {(step.owner || step.due) && (
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {[step.owner, step.due].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </Reveal>
    </PageShell>
  )
}

function Section({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />}
        <div>
          <h2 className="text-[18px] font-semibold text-neutral-900">{title}</h2>
          {subtitle && <p className="text-[13px] text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
