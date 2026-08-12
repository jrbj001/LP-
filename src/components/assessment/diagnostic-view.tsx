'use client'

import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import type {
  AssessmentDiagnostic, DiagnosticSection, DiagnosticStat, Benchmark, MaturityLevel,
} from '@/lib/assessment/types'
import { CheckCircle2, XCircle, TrendingUp } from 'lucide-react'

const STAT_TONE = {
  neutral: 'text-neutral-900',
  leaf: 'text-emerald-600',
  alert: 'text-rose-600',
} as const

const MATURITY_META: Record<MaturityLevel, { label: string; tone: 'green' | 'amber' | 'muted' }> = {
  madura: { label: 'Madura', tone: 'green' },
  inicial: { label: 'Inicial', tone: 'amber' },
  verde: { label: 'Verde', tone: 'muted' },
}

function StatCard({ stat }: { stat: DiagnosticStat }) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-5">
      <p className={`text-[28px] font-semibold tracking-tight leading-none ${STAT_TONE[stat.tone ?? 'neutral']}`}>
        {stat.value}
      </p>
      <p className="text-[12px] text-neutral-500 mt-3 leading-snug">{stat.label}</p>
      {stat.source && <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-300 mt-2">{stat.source}</p>}
    </div>
  )
}

function SectionBlock({ section }: { section: DiagnosticSection }) {
  return (
    <Reveal>
      <section className="mb-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/70 mb-2">{section.eyebrow}</p>
        <h2 className="text-[22px] lg:text-[26px] font-semibold tracking-[-0.02em] text-neutral-900 max-w-2xl">{section.title}</h2>
        {section.lead && <p className="mt-4 text-[15px] text-neutral-600 leading-relaxed max-w-3xl">{section.lead}</p>}

        {section.stats && section.stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {section.stats.map(s => <StatCard key={s.label} stat={s} />)}
          </div>
        )}

        {section.paragraphs?.map(p => (
          <p key={p.slice(0, 32)} className="mt-4 text-[14px] text-neutral-600 leading-relaxed max-w-3xl">{p}</p>
        ))}

        {section.bullets && section.bullets.length > 0 && (
          <ul className="mt-5 space-y-2.5 max-w-3xl">
            {section.bullets.map(b => (
              <li key={b} className="flex items-start gap-2.5 text-[13px] text-neutral-600 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        )}
      </section>
    </Reveal>
  )
}

function BenchmarkCard({ benchmark }: { benchmark: Benchmark }) {
  return (
    <Reveal>
      <article className="rounded-2xl border border-black/[0.06] bg-white p-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
          <h3 className="text-[16px] font-semibold text-neutral-900">{benchmark.name}</h3>
        </div>
        <p className="text-[14px] text-neutral-600 mb-5">{benchmark.headline}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {benchmark.stats.map(s => <StatCard key={s.label} stat={s} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#fafaf8] border border-black/[0.05] p-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1.5">O que fizeram</p>
            <p className="text-[12px] text-neutral-600 leading-relaxed">{benchmark.whatTheyDid}</p>
          </div>
          <div className="rounded-xl bg-emerald-50/60 border border-emerald-900/10 p-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-700/70 mb-1.5">Lição para a Banana Brasil</p>
            <p className="text-[12px] text-neutral-700 leading-relaxed">{benchmark.lesson}</p>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

export function DiagnosticView({ diagnostic }: { diagnostic: AssessmentDiagnostic }) {
  return (
    <PageShell>
      <div className="mb-4"><Badge tone="green">Diagnóstico Digital</Badge></div>
      <PageHeader
        eyebrow={diagnostic.summary.eyebrow}
        title={diagnostic.summary.title}
        subtitle={diagnostic.summary.lead}
      />

      {diagnostic.summary.paragraphs && (
        <Reveal>
          <div className="space-y-4 mb-14 max-w-3xl">
            {diagnostic.summary.paragraphs.map(p => (
              <p key={p.slice(0, 32)} className="text-[15px] text-neutral-600 leading-relaxed">{p}</p>
            ))}
          </div>
        </Reveal>
      )}

      {diagnostic.sections.map(s => <SectionBlock key={s.id} section={s} />)}

      {/* Benchmarks */}
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/70 mb-2">05 — Benchmarks</p>
        <h2 className="text-[22px] lg:text-[26px] font-semibold tracking-[-0.02em] text-neutral-900 mb-6">Quem já provou o modelo.</h2>
      </Reveal>
      {diagnostic.benchmarks.map(b => <BenchmarkCard key={b.id} benchmark={b} />)}

      {/* Ativos x Lacunas */}
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/70 mb-2 mt-12">06 — Diagnóstico</p>
        <h2 className="text-[22px] lg:text-[26px] font-semibold tracking-[-0.02em] text-neutral-900 mb-6">Ativos maduros, motor verde.</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
              <p className="text-[13px] font-semibold text-neutral-900">Ativos já maduros</p>
            </div>
            <ul className="space-y-3">
              {diagnostic.matureAssets.map(a => (
                <li key={a.title}>
                  <p className="text-[13px] font-medium text-neutral-900">{a.title}</p>
                  <p className="text-[12px] text-neutral-600 leading-snug">{a.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-900/10 bg-rose-50/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-4 h-4 text-rose-600" strokeWidth={1.75} />
              <p className="text-[13px] font-semibold text-neutral-900">Lacunas que travam o próximo salto</p>
            </div>
            <ul className="space-y-3">
              {diagnostic.gaps.map(g => (
                <li key={g.title}>
                  <p className="text-[13px] font-medium text-neutral-900">{g.title}</p>
                  <p className="text-[12px] text-neutral-600 leading-snug">{g.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* Maturidade */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden mb-14">
          <div className="px-5 py-3 border-b border-black/[0.05] bg-[#fafaf8]">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400">Maturidade por dimensão</p>
          </div>
          <div className="divide-y divide-black/[0.05]">
            {diagnostic.maturity.map(m => {
              const meta = MATURITY_META[m.level]
              return (
                <div key={m.dimension} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <p className="text-[14px] font-medium text-neutral-900 w-44 flex-shrink-0">{m.dimension}</p>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  <p className="text-[12px] text-neutral-500 flex-1 min-w-[200px]">{m.comment}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>

      {/* Recomendações */}
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/70 mb-2">07 — Recomendações</p>
        <h2 className="text-[22px] lg:text-[26px] font-semibold tracking-[-0.02em] text-neutral-900 mb-6">Em ordem de prioridade.</h2>
        <div className="space-y-3">
          {diagnostic.recommendations.map(r => (
            <div key={r.rank} className="flex gap-4 rounded-2xl border border-black/[0.06] bg-white p-5">
              <span className="w-7 h-7 rounded-full bg-neutral-900 text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0">
                {r.rank}
              </span>
              <div>
                <p className="text-[14px] font-semibold text-neutral-900">{r.title}</p>
                <p className="text-[13px] text-neutral-600 mt-1 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Fontes */}
      {diagnostic.sources && diagnostic.sources.length > 0 && (
        <Reveal>
          <div className="mt-12 pt-6 border-t border-dashed border-black/[0.1]">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-3">Fontes consultadas</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {diagnostic.sources.map(s => (
                <li key={s} className="text-[12px] text-neutral-500 leading-relaxed">{s}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </PageShell>
  )
}
