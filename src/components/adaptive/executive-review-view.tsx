'use client'

import { useEffect, useState } from 'react'
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
  SEED_TO_CUP,
  SEED_TO_CUP_INTRO,
  CRITICAL_ALIGNMENT,
  ADAPTIVE_LAYER,
  WORK_PLAN,
  formatReviewDate,
  scoreTone,
  SCORE_BAR,
} from '@/components/adaptive/executive-review-data'
import { ArchitectureDiagram, AgentsDiagram, ProductDiagram } from '@/components/adaptive/review-diagrams'
import type { ProgressRow } from '@/lib/adaptive/types'
import {
  Radar, ListChecks, Zap, Sparkles, ChevronDown, Calendar,
  AlertCircle, Target, ArrowRight, ArrowDown, CheckCircle2, Coffee, Layers, Quote,
  Handshake, Bot, Network,
} from 'lucide-react'

/* ─── Capítulos ──────────────────────────────────────────────────────────── */

interface Chapter {
  id: string
  num: string
  label: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const CHAPTERS: Chapter[] = [
  {
    id: 'semente-a-xicara',
    num: '01',
    label: 'A jornada',
    title: 'Da semente à xícara',
    description: 'A história que ouvimos em todas as conversas — e onde a tecnologia entra nela.',
    icon: Coffee,
  },
  {
    id: 'ponto-critico',
    num: '02',
    label: 'O ponto crítico',
    title: 'O ponto crítico em comum',
    description: 'O que todas as áreas repetiram, e o alinhamento com a visão do Ricardo.',
    icon: AlertCircle,
  },
  {
    id: 'diagnostico',
    num: '03',
    label: 'Diagnóstico',
    title: 'Diagnóstico',
    description: 'Adaptive Index™, radar de maturidade e os temas que atravessam as áreas.',
    icon: Radar,
  },
  {
    id: 'oportunidades',
    num: '04',
    label: 'Oportunidades',
    title: 'Oportunidades',
    description: 'Recomendações executivas, quick wins e o squad de agentes de IA.',
    icon: Sparkles,
  },
  {
    id: 'plano-de-trabalho',
    num: '05',
    label: 'Plano de trabalho',
    title: 'Plano de trabalho',
    description: 'A entrega-mãe (Adaptive Layer™), a arquitetura e o roadmap faseado.',
    icon: Layers,
  },
  {
    id: 'modelo-de-entrega',
    num: '06',
    label: 'Como trabalhamos',
    title: 'Como vamos trabalhar',
    description: 'O portal em tempo real, o modelo de entrega e os próximos passos.',
    icon: Handshake,
  },
]

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-25% 0px -65% 0px' },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])
  return active
}

const WORK_PLAN_STYLE: Record<string, { dot: string; badge: string; label: string }> = {
  'quick-win': { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', label: 'Quick win' },
  layer: { dot: 'bg-neutral-900', badge: 'bg-neutral-100 text-neutral-700', label: 'Adaptive Layer™' },
  delivery: { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700', label: 'Entrega-mãe' },
}

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
  const activeChapter = useScrollSpy(CHAPTERS.map(c => c.id))
  const received = assessmentCount ?? REVIEW_META.assessmentsReceived
  const pct = Math.round((received / REVIEW_META.assessmentsExpected) * 100)

  const submittedNames = progressRows
    ? progressRows
        .filter(r => ['Assessment done', 'Session booked', 'Done'].includes(r.status))
        .map(r => r.stakeholder)
    : []

  return (
    <>
      {/* Navegação de capítulos — sticky */}
      <nav className="sticky top-14 lg:top-0 z-30 bg-[#fbfbfa]/90 backdrop-blur-xl border-b border-black/[0.05]">
        <div className="max-w-[880px] mx-auto px-6 lg:px-12">
          <div className="flex gap-1 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CHAPTERS.map(c => {
              const active = activeChapter === c.id
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    active
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.04]'
                  }`}
                >
                  <span className={`font-mono text-[10px] ${active ? 'text-white/50' : 'text-neutral-300'}`}>
                    {c.num}
                  </span>
                  {c.label}
                </a>
              )
            })}
          </div>
        </div>
      </nav>

      <PageShell>
        <PageHeader
          eyebrow="Executive Technology Review™"
          title="Executive Review"
          subtitle={`Prévia consolidada do assessment do ${CLIENT.name} — reuniões transcritas, onboarding respondido e portfólio do Comitê de TI.`}
        />

        {/* Status banner */}
        <Reveal>
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-6 mb-10">
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

        {/* Roteiro — o que vem pela frente */}
        <Reveal>
          <div className="mb-16">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
              O roteiro desta leitura · 6 capítulos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CHAPTERS.map(c => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="group rounded-xl border border-black/[0.06] bg-white p-4 hover:border-neutral-900/20 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] transition-all"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-neutral-300">{c.num}</span>
                      <c.icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" strokeWidth={1.75} />
                    </div>
                    <ArrowDown className="w-3.5 h-3.5 text-neutral-200 group-hover:text-neutral-500 transition-colors" strokeWidth={2} />
                  </div>
                  <p className="text-[13px] font-semibold text-neutral-900 leading-snug">{c.title}</p>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{c.description}</p>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Capítulo 01 · Da semente à xícara ─────────────────────────── */}
        <ChapterSection chapter={CHAPTERS[0]} next={CHAPTERS[1]}>
          <Reveal>
            <div className="rounded-2xl border border-black/[0.06] bg-[#f7f4ef] p-8 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Coffee className="w-4 h-4 text-amber-800/60" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-900/50">
                  {SEED_TO_CUP_INTRO.eyebrow}
                </p>
              </div>
              <h3 className="text-[22px] sm:text-[26px] font-semibold text-neutral-900 leading-tight max-w-2xl mb-4">
                {SEED_TO_CUP_INTRO.title}
              </h3>
              <p className="text-[14px] text-neutral-600 leading-relaxed max-w-3xl mb-8">
                {SEED_TO_CUP_INTRO.narrative}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {SEED_TO_CUP_INTRO.anchors.map(a => (
                  <div key={a.author} className="rounded-xl border border-amber-900/10 bg-white/70 p-5">
                    <Quote className="w-3.5 h-3.5 text-amber-800/40 mb-2" strokeWidth={1.75} />
                    <p className="text-[13px] text-neutral-800 leading-relaxed italic">“{a.quote}”</p>
                    <p className="text-[11px] text-neutral-400 mt-2">{a.author}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SEED_TO_CUP.map((s, i) => (
                  <div key={s.id} className="rounded-xl border border-black/[0.05] bg-white p-5 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-[13px] font-semibold text-neutral-900">{s.stage}</p>
                    </div>
                    <p className="text-[12px] text-neutral-500 leading-relaxed">
                      <span className="font-medium text-rose-600/80">Hoje:</span> {s.pain}
                    </p>
                    <p className="text-[12px] text-neutral-600 leading-relaxed mt-2">
                      <span className="font-medium text-emerald-700">Com o Adaptive Layer™:</span> {s.future}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-auto pt-3">{s.owners}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </ChapterSection>

        {/* ── Capítulo 02 · O ponto crítico em comum ────────────────────── */}
        <ChapterSection chapter={CHAPTERS[1]} next={CHAPTERS[2]}>
          <Reveal>
            <div className="rounded-2xl border border-black/[0.06] bg-white p-8">
              <p className="text-[15px] text-neutral-700 leading-relaxed max-w-3xl mb-7">
                {CRITICAL_ALIGNMENT.statement}
              </p>

              <div className="rounded-xl border border-neutral-900/10 bg-neutral-900 text-white p-6 mb-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40 mb-3">
                  Alinhamento com {CRITICAL_ALIGNMENT.ceo.name}
                </p>
                <ul className="space-y-2.5">
                  {CRITICAL_ALIGNMENT.ceo.alignment.map(item => (
                    <li key={item} className="flex gap-2.5 text-[13px] text-white/80 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400/80 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CRITICAL_ALIGNMENT.voices.map(v => (
                  <div key={v.name} className="rounded-xl border border-black/[0.05] bg-[#fafaf8] p-4">
                    <p className="text-[12px] text-neutral-600 leading-relaxed">“{v.quote}”</p>
                    <p className="text-[11px] font-medium text-neutral-400 mt-2">{v.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </ChapterSection>

        {/* ── Capítulo 03 · Diagnóstico ─────────────────────────────────── */}
        <ChapterSection chapter={CHAPTERS[2]} next={CHAPTERS[3]}>
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

          <Reveal>
            <SubSection title="Radar de Maturidade" subtitle="Cinco pilares do Adaptive Framework™">
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
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection title="Temas transversais" subtitle="Convergência entre reuniões e onboarding">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CROSS_THEMES.map(t => (
                  <div key={t.theme} className="rounded-xl border border-black/[0.06] bg-white p-5">
                    <p className="text-[13px] font-medium text-neutral-900 leading-snug">{t.theme}</p>
                    <p className="text-[11px] text-neutral-400 mt-2">{t.sources.join(' · ')}</p>
                  </div>
                ))}
              </div>
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection title="Lacunas do assessment" subtitle="Ações antes do Review final">
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
            </SubSection>
          </Reveal>
        </ChapterSection>

        {/* ── Capítulo 04 · Oportunidades ───────────────────────────────── */}
        <ChapterSection chapter={CHAPTERS[3]} next={CHAPTERS[4]}>
          <Reveal>
            <SubSection title="Recomendações executivas" subtitle="Top 5 prioridades para o comitê de TI" icon={ListChecks}>
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
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection title="Quick Wins" subtitle="Alto impacto · baixo esforço · Fase 1" icon={Zap}>
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
                Piloto recomendado: QW-02 + QW-04 — escolha conjunta com André e Ricardo.
              </p>
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection title="AI Opportunity Map™" subtitle="Onde IA gera maior valor" icon={Sparkles}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AI_OPPORTUNITIES.map(a => (
                  <div key={a.area} className="rounded-xl border border-black/[0.06] bg-white p-5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1">{a.area}</p>
                    <p className="text-[13px] font-medium text-neutral-900 leading-snug">{a.opportunity}</p>
                    <p className="text-[11px] text-neutral-400 mt-2">{a.stakeholder}</p>
                  </div>
                ))}
              </div>
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection
              title="O squad de agentes"
              subtitle="Um agente de IA por área — todos sobre a mesma camada de dados"
              icon={Bot}
            >
              <AgentsDiagram />
            </SubSection>
          </Reveal>
        </ChapterSection>

        {/* ── Capítulo 05 · Plano de trabalho ───────────────────────────── */}
        <ChapterSection chapter={CHAPTERS[4]} next={CHAPTERS[5]}>
          <Reveal>
            <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-7 mb-8">
              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <h3 className="text-[18px] font-semibold">{ADAPTIVE_LAYER.title}</h3>
                <span className="text-[12px] text-white/50">{ADAPTIVE_LAYER.tagline}</span>
              </div>
              <p className="text-[13px] text-white/60 leading-relaxed max-w-3xl">
                {ADAPTIVE_LAYER.description}
              </p>
            </div>
          </Reveal>

          <Reveal>
            <SubSection
              title="A arquitetura"
              subtitle="Como a camada se encaixa no que já existe"
              icon={Network}
            >
              <ArchitectureDiagram />
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection title="A linha do tempo" subtitle="Uma entrega-mãe com quick wins no caminho" icon={Layers}>
              <div className="rounded-2xl border border-black/[0.06] bg-white p-7">
                <div className="relative flex flex-col gap-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-black/[0.08]">
                  {WORK_PLAN.map(step => {
                    const style = WORK_PLAN_STYLE[step.type]
                    return (
                      <div key={step.id} className="relative pl-8">
                        <span className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-white ${style.dot}`} />
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-[14px] font-semibold text-neutral-900">{step.title}</p>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                            {style.label}
                          </span>
                          <span className="text-[11px] text-neutral-400">{step.window}</span>
                        </div>
                        <p className="text-[13px] text-neutral-500 leading-relaxed max-w-2xl">{step.detail}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection title="Adaptive Roadmap™" subtitle="Detalhamento faseado por impacto, risco e esforço" icon={Target}>
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
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection title="Repriorização do portfólio" subtitle="Consolidando onboarding + reuniões + Comitê de TI">
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
            </SubSection>
          </Reveal>
        </ChapterSection>

        {/* ── Capítulo 06 · Como vamos trabalhar ────────────────────────── */}
        <ChapterSection chapter={CHAPTERS[5]}>
          <Reveal>
            <SubSection
              title="O produto do dia a dia"
              subtitle="Portal em tempo real — cada entrega visível quando entra em produção"
            >
              <ProductDiagram />
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection title="Modelo de entrega" subtitle="Proposta para o Review de 31/07">
              <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.04]">
                {DELIVERY_MODEL.map(row => (
                  <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
                    <span className="text-[12px] font-medium text-neutral-500">{row.label}</span>
                    <span className="text-[13px] text-neutral-900 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </SubSection>
          </Reveal>

          <Reveal>
            <SubSection title="Próximos passos" subtitle="Até 31/07">
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
            </SubSection>
          </Reveal>
        </ChapterSection>
      </PageShell>
    </>
  )
}

/* ─── Building blocks ────────────────────────────────────────────────────── */

function ChapterSection({
  chapter,
  next,
  children,
}: {
  chapter: Chapter
  next?: Chapter
  children: React.ReactNode
}) {
  return (
    <section id={chapter.id} className="scroll-mt-32 lg:scroll-mt-20 mb-6">
      <Reveal>
        <div className="flex items-start gap-4 mb-8 pt-6 border-t border-black/[0.06]">
          <span className="text-[40px] font-semibold leading-none tracking-tight text-neutral-200 font-mono flex-shrink-0">
            {chapter.num}
          </span>
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <chapter.icon className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />
              <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900">{chapter.title}</h2>
            </div>
            <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed max-w-xl">{chapter.description}</p>
          </div>
        </div>
      </Reveal>

      {children}

      {next && (
        <a
          href={`#${next.id}`}
          className="group flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-white px-5 py-4 mt-8 mb-14 hover:border-neutral-900/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-neutral-300">{next.num}</span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">A seguir</p>
              <p className="text-[13px] font-semibold text-neutral-900">{next.title}</p>
            </div>
          </div>
          <ArrowDown className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-y-0.5 transition-all" strokeWidth={2} />
        </a>
      )}
    </section>
  )
}

function SubSection({
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
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />}
        <div>
          <h3 className="text-[16px] font-semibold text-neutral-900">{title}</h3>
          {subtitle && <p className="text-[12px] text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
