'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Cloud,
  ExternalLink,
  Flag,
  HeartPulse,
  Layers3,
  Milestone,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import {
  AI_LOOP,
  APPLICATION_NARRATIVE,
  CURRENT_STATE,
  EVIDENCE_LEVELS,
  GAMA_INTRO,
  GAMA_META,
  GOOGLE_ARCHITECTURE,
  IMMEDIATE_DECISIONS,
  METRICS,
  PIVOT,
  PROGRAM,
  RISKS,
  ROADMAP,
} from './likeme-gama-fund-data'

const EVIDENCE_STYLES = {
  confirmed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  documented: 'border-amber-200 bg-amber-50 text-amber-800',
  proposed: 'border-violet-200 bg-violet-50 text-violet-800',
} as const

const FIT_STYLES = {
  aligned: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  validate: 'border-amber-200 bg-amber-50 text-amber-800',
  gap: 'border-rose-200 bg-rose-50 text-rose-800',
} as const

type Evidence = keyof typeof EVIDENCE_STYLES

export function LikeMeGamaFundView({
  locale,
  clientSlug,
  accent,
}: {
  locale: string
  clientSlug: string
  accent: string
}) {
  const base = `/${locale}/client/${clientSlug}`

  return (
    <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10 2xl:px-14">
      <WorkspacePageHeader
        eyebrow={`${GAMA_META.client} · Estratégia de produto`}
        title={GAMA_META.title}
        description={`Como evoluir o produto para uma tese AI-native aderente ao programa. Atualizado em ${GAMA_META.date}.`}
        backHref={`${base}/documentos`}
      />

      <section className="mb-12 overflow-hidden rounded-2xl border border-rose-900/10 bg-rose-50/40">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0" style={{ color: accent }} strokeWidth={1.75} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-800/70">
                {GAMA_INTRO.eyebrow}
              </p>
              <div className="mt-2">
                <EvidenceBadge evidence="proposed" label="Direção proposta" />
              </div>
              <h2 className="mt-1 max-w-4xl text-[21px] font-semibold leading-snug text-neutral-950 sm:text-[24px]">
                {GAMA_INTRO.title}
              </h2>
            </div>
          </div>
          <p className="mt-5 max-w-4xl text-[14px] leading-relaxed text-neutral-700">{GAMA_INTRO.lead}</p>

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-rose-900/10 bg-white/80 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-800/70">
                Recomendação
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-700">{GAMA_INTRO.recommendation}</p>
            </div>
            <div className="rounded-xl border border-rose-900/10 bg-white/80 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-800/70">
                Limite clínico
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-700">{GAMA_INTRO.boundary}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-rose-900/10 bg-white/50 px-6 py-4 sm:px-8">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {EVIDENCE_LEVELS.map(level => (
              <div key={level.id} className="flex items-center gap-2">
                <EvidenceBadge evidence={level.id} label={level.label} />
                <span className="text-[10px] text-neutral-400">{level.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section
        title={PROGRAM.title}
        subtitle={PROGRAM.subtitle}
        icon={Target}
        action={
          <a
            href={GAMA_META.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-900"
          >
            Fonte oficial
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        }
      >
        <div className="mb-5 rounded-xl border border-amber-200/70 bg-amber-50 px-4 py-3 text-[12px] font-medium text-amber-900">
          {PROGRAM.deadline}
        </div>
        <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
          {PROGRAM.criteria.map(item => (
            <div key={item.title} className="grid gap-3 py-4 sm:grid-cols-[180px_1fr_auto] sm:items-center">
              <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
              <p className="text-[12px] leading-relaxed text-neutral-500">{item.detail}</p>
              <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                <EvidenceBadge evidence={item.evidence as Evidence} />
                <span
                  className={`w-fit rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                    FIT_STYLES[item.fit as keyof typeof FIT_STYLES]
                  }`}
                >
                  {item.fitLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            O que o programa oferece
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {PROGRAM.benefits.map(benefit => (
              <div key={benefit} className="flex gap-2 rounded-xl bg-[#f7f7f5] px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={1.75} />
                <p className="text-[12px] leading-relaxed text-neutral-600">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title={CURRENT_STATE.title} subtitle={CURRENT_STATE.subtitle} icon={Layers3}>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Ativos para preservar
            </p>
            <div className="space-y-2">
              {CURRENT_STATE.assets.map(asset => (
                <article key={asset.title} className="rounded-xl border border-black/[0.07] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-neutral-900">{asset.title}</p>
                    <EvidenceBadge evidence={asset.evidence as Evidence} />
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">{asset.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5">
            <p className="text-[12px] font-semibold text-amber-950">Gaps para fechar antes da candidatura</p>
            <BulletList items={CURRENT_STATE.gaps} tone="warning" />
          </div>
        </div>
      </Section>

      <Section title={PIVOT.title} subtitle="O pivot preserva os ativos existentes e muda o centro de valor" icon={Route}>
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
          <PivotCard {...PIVOT.from} />
          <div className="flex items-center justify-center px-2 py-1">
            <ArrowRight className="hidden h-5 w-5 text-neutral-300 md:block" />
            <ArrowDown className="h-5 w-5 text-neutral-300 md:hidden" />
          </div>
          <PivotCard {...PIVOT.to} featured />
        </div>
        <p className="mb-3 mt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Por que GLP-1 como primeiro recorte
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {PIVOT.whyGlp1.map((reason, index) => (
            <div key={reason} className="border-t border-black/[0.08] pt-3">
              <span className="font-mono text-[10px] text-neutral-300">0{index + 1}</span>
              <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">{reason}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={AI_LOOP.title}
        subtitle={AI_LOOP.subtitle}
        icon={BrainCircuit}
        action={<EvidenceBadge evidence="proposed" />}
      >
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
          {AI_LOOP.steps.map((step, index) => (
            <div key={step.n} className="relative rounded-xl border border-black/[0.07] bg-[#fafaf8] p-4">
              <span className="font-mono text-[10px] text-neutral-300">{step.n}</span>
              <p className="mt-2 text-[13px] font-semibold text-neutral-900">{step.title}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">{step.detail}</p>
              {index < AI_LOOP.steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-neutral-300 xl:block" />
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={GOOGLE_ARCHITECTURE.title}
        subtitle={GOOGLE_ARCHITECTURE.subtitle}
        icon={Cloud}
        action={<EvidenceBadge evidence="proposed" />}
      >
        <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5">
            {GOOGLE_ARCHITECTURE.layers.map((layer, index) => (
              <div key={layer.id}>
                <div
                  className={`rounded-xl border p-4 ${
                    layer.id === 'intelligence'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : layer.id === 'context'
                        ? 'border-rose-200 bg-rose-50 text-rose-950'
                        : 'border-black/[0.07] bg-white text-neutral-900'
                  }`}
                >
                  <p className="text-[13px] font-semibold">{layer.title}</p>
                  <p
                    className={`mt-1 text-[11px] leading-relaxed ${
                      layer.id === 'intelligence' ? 'text-white/55' : 'opacity-60'
                    }`}
                  >
                    {layer.detail}
                  </p>
                </div>
                {index < GOOGLE_ARCHITECTURE.layers.length - 1 && (
                  <div className="flex h-7 items-center justify-center">
                    <ArrowDown className="h-4 w-4 text-neutral-300" strokeWidth={1.75} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Princípios de engenharia
            </p>
            <BulletList items={GOOGLE_ARCHITECTURE.principles} />
          </div>
        </div>
      </Section>

      <Section title="Plano de 90 dias" subtitle="Três fases com critério de saída verificável" icon={Milestone}>
        <div className="grid gap-4 xl:grid-cols-3">
          {ROADMAP.map((phase, index) => (
            <article key={phase.phase} className="flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] text-rose-700">{phase.phase}</p>
                  <h3 className="mt-1 text-[15px] font-semibold text-neutral-900">{phase.title}</h3>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>
              <p className="mt-3 text-[12px] font-medium leading-relaxed text-neutral-700">{phase.objective}</p>
              <BulletList items={phase.items} compact />
              <div className="mt-auto border-t border-black/[0.06] pt-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Critério de saída
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">{phase.exit}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title={METRICS.title} subtitle="Evidência de produto, IA, negócio e segurança" icon={Target}>
        <div className="rounded-2xl bg-neutral-950 p-5 text-white sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-rose-300">North star</p>
          <p className="mt-2 max-w-3xl text-[17px] font-medium leading-relaxed">{METRICS.northStar}</p>
        </div>
        <div className="mt-4 rounded-xl border border-rose-200/70 bg-rose-50/50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-800/70">
            Pacote mínimo para a candidatura
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.applicationMinimum.map(item => (
              <p key={item} className="flex gap-2 text-[11px] leading-relaxed text-neutral-600">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-700" strokeWidth={1.75} />
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.groups.map(group => (
            <div key={group.title} className="border-t border-black/[0.08] pt-4">
              <p className="text-[12px] font-semibold text-neutral-900">{group.title}</p>
              <ul className="mt-2 space-y-1.5">
                {group.items.map(item => (
                  <li key={item} className="flex gap-2 text-[11px] text-neutral-500">
                    <CircleDot className="mt-0.5 h-3 w-3 shrink-0 text-neutral-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Riscos que entram no desenho" subtitle="Saúde exige controle antes de escala" icon={ShieldCheck}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RISKS.map(risk => (
            <article key={risk.title} className="rounded-xl border border-black/[0.07] bg-white p-4">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.75} />
                <div>
                  <p className="text-[12px] font-semibold text-neutral-900">{risk.title}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">{risk.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title={APPLICATION_NARRATIVE.title} subtitle="Texto-base para deck e formulário" icon={Flag}>
        <blockquote className="border-l-2 border-rose-700 pl-5 text-[14px] leading-7 text-neutral-700 sm:pl-7">
          {APPLICATION_NARRATIVE.body}
        </blockquote>
        <div className="mt-7 rounded-2xl border border-violet-200/70 bg-violet-50/50 p-5">
          <p className="text-[11px] font-semibold text-violet-950">Evidências que precisam acompanhar essa narrativa</p>
          <BulletList items={APPLICATION_NARRATIVE.proofNeeded} />
        </div>
      </Section>

      <Section title="Decisões imediatas" subtitle="O que precisa ter dono agora" icon={HeartPulse}>
        <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
          {IMMEDIATE_DECISIONS.map((decision, index) => (
            <div key={decision.title} className="grid gap-2 py-4 sm:grid-cols-[40px_180px_1fr] sm:items-center">
              <span className="font-mono text-[10px] text-neutral-300">0{index + 1}</span>
              <p className="text-[12px] font-semibold text-neutral-900">{decision.title}</p>
              <p className="text-[12px] leading-relaxed text-neutral-500">{decision.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-neutral-950 px-5 py-5 text-white">
          <div>
            <p className="text-[13px] font-semibold">Próximo passo recomendado</p>
            <p className="mt-1 text-[11px] text-white/50">
              Workshop de decisão: ICP, design partner, baseline e owner técnico.
            </p>
          </div>
          <Link
            href={`${base}/documentos`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-neutral-900"
          >
            Voltar aos documentos
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Section>

      <footer className="mt-12 border-t border-black/[0.06] pt-5">
        <p className="text-[10px] leading-relaxed text-neutral-400">
          Fontes: {GAMA_META.sources.join(' · ')}. Este documento é uma recomendação estratégica e não confirma
          seleção, investimento ou elegibilidade pelo programa.
        </p>
      </footer>
    </div>
  )
}

function EvidenceBadge({ evidence, label }: { evidence: Evidence; label?: string }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider ${EVIDENCE_STYLES[evidence]}`}
    >
      {label ?? EVIDENCE_LEVELS.find(level => level.id === evidence)?.label}
    </span>
  )
}

function PivotCard({
  label,
  title,
  detail,
  featured = false,
}: {
  label: string
  title: string
  detail: string
  featured?: boolean
}) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        featured ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-black/[0.07] bg-[#fafaf8] text-neutral-900'
      }`}
    >
      <p className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${featured ? 'text-rose-300' : 'text-neutral-400'}`}>
        {label}
      </p>
      <h3 className="mt-2 text-[16px] font-semibold">{title}</h3>
      <p className={`mt-2 text-[12px] leading-relaxed ${featured ? 'text-white/55' : 'text-neutral-500'}`}>{detail}</p>
    </article>
  )
}

function BulletList({
  items,
  tone = 'neutral',
  compact = false,
}: {
  items: string[]
  tone?: 'neutral' | 'warning'
  compact?: boolean
}) {
  return (
    <ul className={compact ? 'my-4 space-y-2' : 'mt-3 space-y-2.5'}>
      {items.map(item => (
        <li key={item} className="flex gap-2.5 text-[11px] leading-relaxed text-neutral-600">
          {tone === 'warning' ? (
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" strokeWidth={1.75} />
          ) : (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={1.75} />
          )}
          {item}
        </li>
      ))}
    </ul>
  )
}

function Section({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
}: {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="mb-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-black/[0.06] pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-neutral-950">{title}</h2>
            <p className="mt-0.5 text-[11px] text-neutral-400">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
