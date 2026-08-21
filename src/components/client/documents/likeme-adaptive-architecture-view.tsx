'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleHelp,
  Database,
  GitBranch,
  Layers,
  LockKeyhole,
  Milestone,
  Network,
  Radar,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import {
  AGENT_LOOP,
  AGENT_MAP,
  CURRENT_ARCHITECTURE,
  EVIDENCE_LEVELS,
  GUARDRAILS,
  LIKEME_AGENTS,
  LIKEME_ARCHITECTURE_META,
  LIKEME_INTRO,
  ROADMAP,
  TARGET_ARCHITECTURE,
  VALIDATION_QUESTIONS,
} from './likeme-adaptive-architecture-data'

const EVIDENCE_STYLES = {
  confirmed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  documented: 'border-amber-200 bg-amber-50 text-amber-800',
  proposed: 'border-violet-200 bg-violet-50 text-violet-800',
} as const

export function LikeMeAdaptiveArchitectureView({
  locale,
  clientSlug,
  accent,
}: {
  locale: string
  clientSlug: string
  accent: string
}) {
  const base = `/${locale}/client/${clientSlug}`
  const orchestrator = LIKEME_AGENTS.find(agent => agent.id === 'orchestrator')
  const specialists = LIKEME_AGENTS.filter(agent => agent.id !== 'orchestrator')

  return (
    <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10 2xl:px-14">
      <WorkspacePageHeader
        eyebrow={`${LIKEME_ARCHITECTURE_META.client} · Estudo de arquitetura`}
        title={LIKEME_ARCHITECTURE_META.title}
        description={`${LIKEME_INTRO.lead} Atualizado em ${LIKEME_ARCHITECTURE_META.date}.`}
        backHref={`${base}/documentos`}
      />

      <section className="mb-10 rounded-2xl border border-rose-900/10 bg-rose-50/40 p-6">
        <div className="flex items-start gap-3">
          <Layers className="mt-0.5 h-5 w-5 shrink-0" style={{ color: accent }} strokeWidth={1.75} />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-rose-800/70">
              {LIKEME_INTRO.eyebrow}
            </p>
            <h2 className="mt-1 max-w-3xl text-[19px] font-semibold leading-snug text-neutral-900">
              {LIKEME_INTRO.title}
            </h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {LIKEME_INTRO.notes.map(note => (
            <p
              key={note}
              className="rounded-xl border border-rose-900/10 bg-white/80 p-4 text-[12px] leading-relaxed text-neutral-600"
            >
              {note}
            </p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {EVIDENCE_LEVELS.map(level => (
            <div key={level.id} className="group relative">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${EVIDENCE_STYLES[level.id]}`}
              >
                {level.label}
              </span>
              <span className="ml-2 text-[11px] text-neutral-400">{level.detail}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 border-t border-rose-900/10 pt-4 text-[10px] leading-relaxed text-neutral-400">
          Fontes: {LIKEME_ARCHITECTURE_META.sources.join(' · ')}
        </p>
      </section>

      <Section title={CURRENT_ARCHITECTURE.title} subtitle={CURRENT_ARCHITECTURE.subtitle} icon={Radar}>
        <ArchitectureStack
          layers={CURRENT_ARCHITECTURE.layers.map(layer => ({
            id: layer.id,
            label: layer.label,
            detail: layer.items.join(' · '),
            status: layer.status,
          }))}
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-5">
            <p className="text-[12px] font-semibold text-emerald-950">Forças da base atual</p>
            <BulletList items={CURRENT_ARCHITECTURE.strengths} tone="positive" />
          </div>
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5">
            <p className="text-[12px] font-semibold text-amber-950">Tensões que a Layer precisa resolver</p>
            <BulletList items={CURRENT_ARCHITECTURE.gaps} tone="warning" />
          </div>
        </div>
      </Section>

      <Section title={TARGET_ARCHITECTURE.title} subtitle={TARGET_ARCHITECTURE.subtitle} icon={Network}>
        <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5 sm:p-7">
          <div className="mx-auto max-w-3xl">
            {TARGET_ARCHITECTURE.layers.map((layer, index) => {
              const isAdaptive = layer.id === 'adaptive'
              const isAgents = layer.id === 'agents'
              return (
                <div key={layer.id}>
                  <div
                    className={`rounded-2xl border p-4 ${
                      isAdaptive
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : isAgents
                          ? 'border-violet-200 bg-violet-50 text-violet-950'
                          : 'border-black/[0.08] bg-white text-neutral-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isAdaptive ? (
                        <Layers className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
                      ) : isAgents ? (
                        <Bot className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                      ) : layer.id === 'foundation' ? (
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
                      ) : (
                        <Database className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
                      )}
                      <div>
                        <p className="text-[13px] font-semibold">{layer.label}</p>
                        <p className={`mt-1 text-[11px] leading-relaxed ${isAdaptive ? 'text-white/60' : 'opacity-60'}`}>
                          {layer.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < TARGET_ARCHITECTURE.layers.length - 1 && (
                    <div className="flex h-8 items-center justify-center">
                      <ArrowDown className="h-4 w-4 text-neutral-300" strokeWidth={1.75} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TARGET_ARCHITECTURE.capabilities.map(capability => (
            <article key={capability.title} className="rounded-xl border border-black/[0.07] bg-white p-4">
              <p className="text-[12px] font-semibold text-neutral-900">{capability.title}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">{capability.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Squad de agentes proposto"
        subtitle="Especialização por domínio, coordenação pela mesma Adaptive Layer™"
        icon={Bot}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {LIKEME_AGENTS.map(agent => (
            <article key={agent.id} className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Bot className="h-4.5 w-4.5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-neutral-900">{agent.name}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">{agent.role}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <CompactList label="Disparos" items={agent.triggers} />
                <CompactList label="Ações" items={agent.actions} />
              </div>
              <div className="mt-4 rounded-xl border border-amber-200/70 bg-amber-50/60 px-3.5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">Guardrail principal</p>
                <p className="mt-1 text-[11px] leading-relaxed text-amber-950/70">{agent.guardrail}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-black/[0.07] bg-neutral-950 p-5 text-white sm:p-6">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            Loop operacional de todos os agentes
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-5">
            {AGENT_LOOP.map((step, index) => (
              <div key={step.title} className="relative rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <p className="text-[11px] font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-white/50">{step.detail}</p>
                {index < AGENT_LOOP.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-white/30 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title={AGENT_MAP.title} subtitle={AGENT_MAP.subtitle} icon={Workflow}>
        <div className="overflow-x-auto rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5 sm:p-6">
          <div className="min-w-[820px]">
            <div className="grid grid-cols-6 gap-2">
              {AGENT_MAP.stages.map(stage => (
                <div key={stage.id} className="rounded-xl border border-black/[0.08] bg-white px-3 py-3">
                  <span className="font-mono text-[10px] font-semibold text-rose-700">{stage.number}</span>
                  <p className="mt-1 text-[12px] font-semibold leading-tight text-neutral-900">{stage.title}</p>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-neutral-400">{stage.goal}</p>
                </div>
              ))}
            </div>

            <div className="mt-2 rounded-xl border border-violet-300 bg-violet-100/70 px-4 py-2.5">
              <div className="flex items-center justify-center gap-2">
                <Bot className="h-3.5 w-3.5 text-violet-700" strokeWidth={1.75} />
                <p className="text-[11px] font-semibold text-violet-950">
                  {orchestrator ? `${orchestrator.code} · ${orchestrator.name}` : 'Orquestrador'}
                </p>
                <span className="text-[10px] text-violet-900/60">cobre todas as etapas</span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-6 gap-2">
              {AGENT_MAP.stages.map(stage => {
                const primary = specialists.filter(agent => agent.primaryStages.includes(stage.id))
                const support = specialists.filter(agent => agent.supportStages?.includes(stage.id))
                return (
                  <div key={stage.id} className="space-y-1.5">
                    {primary.map(agent => (
                      <div
                        key={agent.id}
                        className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-2"
                        title={agent.role}
                      >
                        <p className="font-mono text-[9px] font-semibold text-violet-700">{agent.code}</p>
                        <p className="text-[10px] font-semibold leading-tight text-violet-950">{agent.short}</p>
                      </div>
                    ))}
                    {support.map(agent => (
                      <div
                        key={agent.id}
                        className="flex items-baseline gap-1.5 rounded-lg border border-dashed border-neutral-300 bg-white px-2.5 py-1.5"
                        title={agent.role}
                      >
                        <span className="font-mono text-[9px] font-semibold text-neutral-400">{agent.code}</span>
                        <span className="truncate text-[10px] leading-tight text-neutral-500">{agent.short}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            <div className="flex h-7 items-center justify-center">
              <ArrowDown className="h-4 w-4 text-neutral-300" strokeWidth={1.75} />
            </div>

            <div className="rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-3.5">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Layers className="h-4 w-4 text-rose-300" strokeWidth={1.75} />
                <p className="text-[12px] font-semibold text-white">{AGENT_MAP.layerLabel}</p>
                <span className="text-[10px] text-white/50">{AGENT_MAP.layerDetail}</span>
              </div>
            </div>

            <div className="flex h-7 items-center justify-center">
              <ArrowDown className="h-4 w-4 text-neutral-300" strokeWidth={1.75} />
            </div>

            <div className="flex flex-wrap justify-center gap-1.5">
              {AGENT_MAP.systems.map(system => (
                <span
                  key={system.id}
                  className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-medium ${
                    system.kind === 'product'
                      ? 'border-black/[0.1] bg-white text-neutral-800'
                      : system.kind === 'partner'
                        ? 'border-black/[0.06] bg-neutral-100 text-neutral-600'
                        : 'border-teal-200 bg-teal-50 text-teal-800'
                  }`}
                >
                  {system.label}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-black/[0.06] bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <LegendItem className="border-violet-200 bg-violet-50" label="Agente dono da etapa" />
                <LegendItem className="border-dashed border-neutral-300 bg-white" label="Agente de apoio" />
                <LegendItem className="border-neutral-900 bg-neutral-900" label="Adaptive Layer™" />
                <LegendItem className="border-teal-200 bg-teal-50" label="Canais de comunicação" />
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">{AGENT_MAP.caption}</p>
      </Section>

      <Section
        title="Guardrails antes de autonomia"
        subtitle="Saúde, pagamento e dados pessoais exigem arquitetura de controle — não só bons prompts"
        icon={LockKeyhole}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GUARDRAILS.map(group => (
            <article key={group.title} className="rounded-2xl border border-black/[0.07] bg-white p-4">
              <p className="text-[12px] font-semibold text-neutral-900">{group.title}</p>
              <BulletList items={group.items} tone="neutral" compact />
            </article>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" />
          <p className="text-[11px] leading-relaxed text-rose-950/70">
            A Layer não deve replicar dados clínicos, financeiros ou de identidade sem necessidade. Ela referencia as
            fontes oficiais, monta contexto mínimo por tarefa e registra por que cada dado foi usado.
          </p>
        </div>
      </Section>

      <Section title="Roadmap de adoção" subtitle="Autonomia cresce depois de contratos, observabilidade e avaliação" icon={Milestone}>
        <div className="space-y-4">
          {ROADMAP.map((phase, index) => (
            <article key={phase.id} className="grid gap-4 rounded-2xl border border-black/[0.07] bg-white p-5 lg:grid-cols-[160px_1fr]">
              <div>
                <span className="text-[11px] font-mono font-semibold text-rose-700">{phase.label}</span>
                <h3 className="mt-1 text-[15px] font-semibold text-neutral-900">{phase.title}</h3>
                <p className="mt-1 text-[11px] text-neutral-400">{phase.window}</p>
                {index < ROADMAP.length - 1 && <GitBranch className="mt-4 h-4 w-4 text-neutral-300" />}
              </div>
              <div>
                <BulletList items={phase.deliverables} tone="neutral" compact />
                <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-[11px] leading-relaxed text-neutral-600">
                  <span className="font-semibold text-neutral-900">Critério de saída:</span> {phase.exit}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Decisões em aberto"
        subtitle="Perguntas que precisam ser fechadas com produto, engenharia, dados e parceiros"
        icon={CircleHelp}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {VALIDATION_QUESTIONS.map((question, index) => (
            <div key={question} className="flex gap-3 rounded-xl border border-black/[0.07] bg-white p-4">
              <span className="font-mono text-[10px] font-semibold text-rose-700">{String(index + 1).padStart(2, '0')}</span>
              <p className="text-[12px] leading-relaxed text-neutral-700">{question}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5">
        <div>
          <p className="text-[13px] font-semibold text-neutral-900">Próximo passo recomendado</p>
          <p className="mt-1 text-[11px] text-neutral-500">
            Workshop M0 para validar o as-is nos três repositórios e escolher o primeiro piloto.
          </p>
        </div>
        <Link
          href={`${base}/backlog`}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold text-white"
          style={{ backgroundColor: accent }}
        >
          Abrir backlog
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

function Section({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold tracking-[-0.015em] text-neutral-900">{title}</h2>
          <p className="mt-0.5 text-[12px] text-neutral-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function ArchitectureStack({
  layers,
}: {
  layers: { id: string; label: string; detail: string; status: 'confirmed' | 'documented' }[]
}) {
  return (
    <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-3">
        {layers.map(layer => (
          <div key={layer.id} className="rounded-xl border border-black/[0.07] bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[13px] font-semibold text-neutral-900">{layer.label}</p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${EVIDENCE_STYLES[layer.status]}`}
              >
                {layer.status === 'confirmed' ? 'Confirmado' : 'Documentado'}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">{layer.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function BulletList({
  items,
  tone,
  compact = false,
}: {
  items: string[]
  tone: 'positive' | 'warning' | 'neutral'
  compact?: boolean
}) {
  const iconClass =
    tone === 'positive' ? 'text-emerald-600' : tone === 'warning' ? 'text-amber-600' : 'text-neutral-400'
  return (
    <ul className={`${compact ? 'mt-3 space-y-1.5' : 'mt-4 space-y-2'}`}>
      {items.map(item => (
        <li key={item} className="flex gap-2 text-[11px] leading-relaxed text-neutral-600">
          <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${iconClass}`} strokeWidth={1.75} />
          {item}
        </li>
      ))}
    </ul>
  )
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-500">
      <span className={`h-3 w-3 rounded border ${className}`} />
      {label}
    </span>
  )
}

function CompactList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
      <ul className="mt-2 space-y-1">
        {items.map(item => (
          <li key={item} className="text-[10px] leading-relaxed text-neutral-600">
            · {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
