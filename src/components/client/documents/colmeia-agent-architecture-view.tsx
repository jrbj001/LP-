'use client'

import Link from 'next/link'
import {
  COLMEIA_AGENT_ARCHITECTURE_META,
  COLMEIA_INTRO,
  COLMEIA_PRODUCT,
  COLMEIA_ADAPTIVE_LAYER,
  AGENT_ARCHITECTURE,
  JOURNEY_BOARD,
  JOURNEY_STAGES,
  COLMEIA_AGENTS,
  AGENT_LOOP_COLMEIA,
  AGENT_SCREENS,
  AGENT_ADMIN_SCREEN,
  AGENT_DASHBOARD_SCREEN,
  AS_IS,
  WORK_PLAN,
  USER_STORIES,
  WORKING_GROUPS,
} from '@/components/client/documents/colmeia-agent-architecture-data'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import {
  Layers, Target, Bot, Milestone, ListChecks, Users,
  CheckCircle2, Cable, Braces, Workflow, ShieldCheck, ArrowRight, GitBranch, Database,
  MonitorPlay, AlertTriangle, Clock, Search, SlidersHorizontal,
} from 'lucide-react'

const CAP_ICONS = {
  integration: Cable,
  data: Braces,
  apis: Workflow,
  security: ShieldCheck,
} as const

const ARCH_ICONS = {
  agents: Bot,
  layer: Layers,
  infra: ShieldCheck,
  systems: Database,
} as const

export function ColmeiaAgentArchitectureView({
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
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${COLMEIA_AGENT_ARCHITECTURE_META.client} · Arquitetura de agentes`}
        title={COLMEIA_AGENT_ARCHITECTURE_META.title}
        description={`${COLMEIA_INTRO.lead} Atualizado em ${COLMEIA_AGENT_ARCHITECTURE_META.date}.`}
        backHref={base}
      />

      {/* Intro */}
      <section className="rounded-2xl border border-teal-900/10 bg-teal-50/40 p-6 mb-10">
        <div className="flex items-start gap-3 mb-4">
          <Layers className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: accent }} strokeWidth={1.75} />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-teal-800/70">
              {COLMEIA_INTRO.eyebrow}
            </p>
            <h2 className="text-[18px] font-semibold text-neutral-900 mt-1">{COLMEIA_INTRO.title}</h2>
          </div>
        </div>
        <div className="space-y-3 max-w-3xl">
          {COLMEIA_INTRO.narrative.map(p => (
            <p key={p.slice(0, 48)} className="text-[13px] text-neutral-600 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {COLMEIA_INTRO.principles.map(item => (
            <div key={item.title} className="rounded-xl border border-teal-900/10 bg-white/80 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" strokeWidth={1.75} />
                <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
              </div>
              <p className="text-[12px] text-neutral-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-teal-900/10">
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Fontes: {COLMEIA_AGENT_ARCHITECTURE_META.sources.join(' · ')}
          </p>
        </div>
      </section>

      {/* Produto */}
      <Section title={COLMEIA_PRODUCT.title} subtitle={COLMEIA_PRODUCT.subtitle} icon={Target}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
          {COLMEIA_PRODUCT.pillars.map(pillar => (
            <article key={pillar.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <p className="text-[14px] font-semibold text-neutral-900">{pillar.name}</p>
              <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">{pillar.role}</p>
              <div className="mt-4 space-y-2">
                <Detail label="Agora" text={pillar.now} />
                <Detail label="Futuro" text={pillar.future} tone="teal" />
              </div>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {COLMEIA_PRODUCT.personas.map(p => (
            <div key={p.id} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
              <p className="text-[13px] font-semibold text-neutral-900">{p.name}</p>
              <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">{p.need}</p>
            </div>
          ))}
        </div>
        <ul className="space-y-2">
          {COLMEIA_PRODUCT.outcomes.map(o => (
            <li key={o} className="flex gap-2 text-[12px] text-neutral-700 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
              {o}
            </li>
          ))}
        </ul>
      </Section>

      {/* Adaptive Layer */}
      <Section
        title={COLMEIA_ADAPTIVE_LAYER.title}
        subtitle={COLMEIA_ADAPTIVE_LAYER.tagline}
        icon={Layers}
      >
        <p className="text-[13px] text-neutral-600 leading-relaxed max-w-3xl mb-2">
          {COLMEIA_ADAPTIVE_LAYER.description}
        </p>
        <p className="text-[12px] font-mono text-teal-800 mb-5">{COLMEIA_ADAPTIVE_LAYER.formula}</p>

        <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5 sm:p-6 mb-5">
          <div className="max-w-2xl mx-auto text-center mb-6">
            <p className="text-[15px] font-semibold text-neutral-900">{AGENT_ARCHITECTURE.title}</p>
            <p className="text-[12px] text-neutral-500 leading-relaxed mt-1.5">
              {AGENT_ARCHITECTURE.subtitle}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {AGENT_ARCHITECTURE.layers.map((layer, index) => {
              const Icon = ARCH_ICONS[layer.id as keyof typeof ARCH_ICONS] ?? Layers
              const tone =
                layer.id === 'agents'
                  ? 'border-violet-200 bg-violet-50 text-violet-950'
                  : layer.id === 'layer'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : layer.id === 'infra'
                      ? 'border-teal-200 bg-teal-50 text-teal-950'
                      : 'border-black/[0.08] bg-white text-neutral-900'
              return (
                <div key={layer.id}>
                  <div className={`rounded-2xl border p-4 ${tone}`}>
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-70" strokeWidth={1.75} />
                      <div>
                        <p className="text-[13px] font-semibold">{layer.label}</p>
                        <p className={`text-[11px] leading-relaxed mt-1 ${
                          layer.id === 'layer' ? 'text-white/60' : 'opacity-60'
                        }`}>
                          {layer.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < AGENT_ARCHITECTURE.layers.length - 1 && (
                    <div className="h-8 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 rotate-90 text-neutral-300" strokeWidth={1.75} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {AGENT_ARCHITECTURE.reasons.map(reason => (
              <div key={reason.title} className="rounded-xl border border-black/[0.06] bg-white p-4">
                <p className="text-[12px] font-semibold text-neutral-900">{reason.title}</p>
                <p className="text-[11px] text-neutral-500 leading-relaxed mt-1.5">{reason.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 px-4 py-3 mt-3">
            <p className="text-[11px] text-amber-950/70 leading-relaxed">
              <span className="font-semibold text-amber-950">Sem a base:</span>{' '}
              {AGENT_ARCHITECTURE.warning}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-5 mb-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 text-center mb-3">
            O que a Layer conecta
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {COLMEIA_ADAPTIVE_LAYER.connects.map(item => (
              <span
                key={item}
                className="rounded-xl border border-black/[0.07] bg-[#fafaf8] px-3.5 py-2 text-[12px] font-medium text-neutral-700"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="rounded-2xl bg-neutral-900 text-white p-5">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-teal-300" strokeWidth={1.75} />
              <p className="text-[15px] font-semibold">Adaptive Layer™</p>
              <span className="text-[11px] text-white/40">vertical Colmeia</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COLMEIA_ADAPTIVE_LAYER.capabilities.map(cap => {
                const Icon = CAP_ICONS[cap.id as keyof typeof CAP_ICONS] ?? Cable
                return (
                  <div
                    key={cap.id}
                    className="rounded-xl bg-white/[0.07] border border-white/[0.08] px-3 py-3 text-center"
                  >
                    <Icon className="w-4 h-4 text-white/60 mx-auto mb-1.5" strokeWidth={1.75} />
                    <p className="text-[11px] text-white/85 leading-tight">{cap.title}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {COLMEIA_ADAPTIVE_LAYER.capabilities.map(cap => (
            <div key={cap.id} className="rounded-xl border border-black/[0.06] bg-white p-4">
              <p className="text-[13px] font-semibold text-neutral-900">{cap.title}</p>
              <p className="text-[12px] text-neutral-500 mt-1.5 leading-relaxed">{cap.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-teal-900/10 bg-teal-50/40 p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal-800/70 mb-3">
            O que a camada destrava
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COLMEIA_ADAPTIVE_LAYER.unlocks.map(item => (
              <li key={item} className="flex gap-2 text-[12px] text-neutral-700 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Jornada Miro */}
      <Section
        title="Arquitetura da jornada OOH"
        subtitle="Board do Miro redesenhado sobre a nova arquitetura — jornada, agentes, Layer e dados"
        icon={Workflow}
      >
        <JourneyBoard accent={accent} />
        <div className="space-y-3">
          {JOURNEY_STAGES.map(stage => (
            <article key={stage.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-mono font-semibold text-neutral-400">{stage.number}</span>
                <h3 className="text-[15px] font-semibold text-neutral-900">{stage.title}</h3>
              </div>
              <p className="text-[12px] text-neutral-600 leading-relaxed">{stage.goal}</p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1.5">
                    Atividades
                  </p>
                  <ul className="space-y-1">
                    {stage.activities.map(a => (
                      <li key={a} className="text-[11px] text-neutral-600 leading-relaxed">
                        · {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1.5">
                    Outputs
                  </p>
                  <ul className="space-y-1">
                    {stage.outputs.map(o => (
                      <li key={o} className="text-[11px] text-neutral-600 leading-relaxed">
                        · {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1.5">
                    Dados · Agentes
                  </p>
                  <p className="text-[11px] text-neutral-600 leading-relaxed mb-2">
                    {stage.dataSources.join(' · ')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.agentIds.map(id => {
                      const agent = COLMEIA_AGENTS.find(a => a.id === id)
                      return (
                        <span
                          key={id}
                          className="text-[10px] rounded-full border border-black/[0.06] bg-[#fafaf8] px-2 py-0.5 text-neutral-600"
                        >
                          {agent?.name.split('·')[0].trim() ?? id}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* As-is */}
      <Section title={AS_IS.title} subtitle={AS_IS.subtitle} icon={GitBranch}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {AS_IS.repos.map(repo => (
            <div key={repo.name} className="rounded-xl border border-black/[0.06] bg-white p-4">
              <p className="text-[13px] font-semibold text-neutral-900">{repo.label}</p>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">{repo.name}</p>
              <p className="text-[12px] text-neutral-500 mt-2 leading-relaxed">{repo.note}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-amber-900/10 bg-amber-50/50 p-5 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-amber-800/70 mb-3">
            Gaps (04/08 + fundação)
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AS_IS.gaps.map(g => (
              <li key={g} className="text-[12px] text-neutral-700 leading-relaxed">
                · {g}
              </li>
            ))}
          </ul>
        </div>
        <ul className="space-y-1.5">
          {AS_IS.evidence.map(e => (
            <li key={e} className="text-[12px] text-neutral-500 leading-relaxed">
              · {e}
            </li>
          ))}
        </ul>
      </Section>

      {/* Agentes */}
      <Section
        title="Squad de agentes no roadmap"
        subtitle="Seis agentes do Miro, especificados no M0 e entregues progressivamente do M1 ao M4"
        icon={Bot}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {COLMEIA_AGENTS.map(agent => (
            <div key={agent.id} className="rounded-xl border border-black/[0.06] bg-white p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" strokeWidth={1.75} />
                </div>
                <p className="text-[13px] font-semibold text-neutral-900 leading-tight">{agent.name}</p>
              </div>
              <p className="text-[12px] text-neutral-500 leading-relaxed">{agent.role}</p>
              <p className="text-[11px] text-neutral-600 italic mt-2 leading-snug">{agent.example}</p>
              <span className="mt-auto pt-3 text-[10px] uppercase tracking-wider text-neutral-400">
                Entrada no roadmap · {agent.phase}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {AGENT_LOOP_COLMEIA.map((step, index) => (
            <div key={step.id} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-3">
              <p className="text-[10px] font-mono text-neutral-400 mb-1">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="text-[12px] font-semibold text-neutral-900">{step.title}</p>
              <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">{step.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Telas dos agentes */}
      <Section title={AGENT_SCREENS.title} subtitle={AGENT_SCREENS.subtitle} icon={MonitorPlay}>
        <p className="text-[13px] text-neutral-600 leading-relaxed max-w-3xl mb-6">
          {AGENT_SCREENS.intro}
        </p>

        <div className="mb-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
            <p className="text-[13px] font-semibold text-neutral-900">{AGENT_ADMIN_SCREEN.label}</p>
            <p className="text-[11px] text-neutral-400">Configuração e governança</p>
          </div>
          <WireframeFrame path={AGENT_ADMIN_SCREEN.path}>
            <AdminMockup accent={accent} />
          </WireframeFrame>
          <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed max-w-3xl">
            {AGENT_ADMIN_SCREEN.caption}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
            <p className="text-[13px] font-semibold text-neutral-900">{AGENT_DASHBOARD_SCREEN.label}</p>
            <p className="text-[11px] text-neutral-400">Operação e auditoria</p>
          </div>
          <WireframeFrame path={AGENT_DASHBOARD_SCREEN.path}>
            <DashboardMockup accent={accent} />
          </WireframeFrame>
          <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed max-w-3xl">
            {AGENT_DASHBOARD_SCREEN.caption}
          </p>
        </div>
      </Section>

      {/* Plano */}
      <Section
        title="Plano de trabalho"
        subtitle="Um roadmap integrado: produto, infraestrutura, Layer e agentes avançam juntos por dependência"
        icon={Milestone}
      >
        <div className="relative">
          <div className="absolute left-[15px] top-5 bottom-5 w-px bg-black/[0.08]" />
          <div className="space-y-3">
            {WORK_PLAN.map(ms => (
              <div key={ms.id} className="relative pl-11">
                <div
                  className={`absolute left-2 top-5 w-4 h-4 rounded-full border-[3px] border-white ${
                    ms.includesAgents ? 'bg-violet-500' : 'bg-teal-600'
                  }`}
                />
                <div className="rounded-xl border border-black/[0.06] bg-white px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold text-neutral-400">{ms.number}</span>
                    <span className="text-[14px] font-semibold text-neutral-900">{ms.title}</span>
                    <span className="text-[11px] text-neutral-400 ml-auto">{ms.window}</span>
                  </div>
                  <p className="text-[12px] text-neutral-500 leading-relaxed mt-2">{ms.focus}</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1.5">
                        Entregáveis
                      </p>
                      <ul className="space-y-1">
                        {ms.deliverables.map(d => (
                          <li key={d} className="text-[11px] text-neutral-600 leading-relaxed">
                            · {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1.5">
                        Aceite
                      </p>
                      <ul className="space-y-1">
                        {ms.acceptance.map(a => (
                          <li key={a} className="text-[11px] text-neutral-600 leading-relaxed">
                            · {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-3">Owners: {ms.owners.join(' · ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* User stories */}
      <Section
        title="User stories"
        subtitle="Por fundação, Layer e etapas da jornada — com a fase do roadmap"
        icon={ListChecks}
      >
        <div className="space-y-2.5">
          {USER_STORIES.map(story => (
            <div key={story.id} className="rounded-xl border border-black/[0.06] bg-white p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-mono text-neutral-400">{story.id}</span>
                <span className="text-[10px] rounded-full bg-neutral-100 text-neutral-600 px-2 py-0.5">
                  {story.phase}
                </span>
                <span className="text-[10px] rounded-full border border-black/[0.06] px-2 py-0.5 text-neutral-500">
                  {story.stageId}
                </span>
              </div>
              <p className="text-[13px] text-neutral-900 leading-relaxed">
                Como <span className="font-semibold">{story.persona}</span>, quero {story.want} para{' '}
                {story.soThat}.
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {story.acceptance.map(a => (
                  <li
                    key={a}
                    className="text-[10px] rounded-full border border-black/[0.06] bg-[#fafaf8] px-2 py-0.5 text-neutral-600"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Working groups */}
      <Section title="Grupos de trabalho" subtitle="Owners alinhados à sessão 04/08 e ao Miro" icon={Users}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WORKING_GROUPS.map(g => (
            <div key={g.id} className="rounded-xl border border-black/[0.06] bg-white p-4">
              <p className="text-[13px] font-semibold text-neutral-900">{g.title}</p>
              <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{g.focus}</p>
              <p className="text-[11px] text-neutral-400 mt-3">{g.members.join(' · ')}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer links */}
      <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <p className="text-[14px] font-semibold">Continuar no workspace Be180</p>
          <p className="text-[12px] text-white/50 mt-1">Projetos, entregas GitHub e documentos do engajamento.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`${base}/projetos`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-neutral-900 text-[12px] font-medium px-4 py-2 hover:bg-white/90"
          >
            Projetos
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
          <Link
            href={`${base}/entregas`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 text-white text-[12px] font-medium px-4 py-2 hover:bg-white/10"
          >
            Entregas
          </Link>
          <Link
            href={`${base}/documentos`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 text-white text-[12px] font-medium px-4 py-2 hover:bg-white/10"
          >
            Documentos
          </Link>
        </div>
      </div>
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  Ativo: 'border-teal-200 bg-teal-50 text-teal-800',
  Piloto: 'border-violet-200 bg-violet-50 text-violet-800',
  Sandbox: 'border-amber-200 bg-amber-50 text-amber-800',
  Rascunho: 'border-black/[0.08] bg-[#f3f3f0] text-neutral-500',
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${
        STATUS_STYLES[status] ?? STATUS_STYLES.Rascunho
      }`}
    >
      {status}
    </span>
  )
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`w-7 h-4 rounded-full flex items-center px-0.5 flex-shrink-0 ${
        on ? 'bg-teal-600 justify-end' : 'bg-neutral-200 justify-start'
      }`}
    >
      <span className="w-3 h-3 rounded-full bg-white" />
    </span>
  )
}

function WireframeFrame({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/[0.1] bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/[0.06] bg-[#f6f6f4]">
        <span className="flex gap-1.5 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-black/[0.12]" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/[0.12]" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/[0.12]" />
        </span>
        <span className="ml-1 flex-1 min-w-0 rounded-md border border-black/[0.06] bg-white px-2 py-1 text-[10px] font-mono text-neutral-400 truncate">
          {path}
        </span>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

function WireLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-2">{children}</p>
  )
}

function AdminMockup({ accent }: { accent: string }) {
  const { nav, agents, detail } = AGENT_ADMIN_SCREEN
  return (
    <div className="min-w-[860px] flex">
      {/* Sidebar */}
      <aside className="w-[150px] flex-shrink-0 border-r border-black/[0.06] bg-[#fafaf8] p-3">
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-4 h-4 rounded" style={{ backgroundColor: accent }} />
          <span className="text-[10px] font-semibold text-neutral-700">Colmeia Admin</span>
        </div>
        <div className="space-y-1">
          {nav.map((item, i) => (
            <div
              key={item}
              className={`rounded-md px-2 py-1.5 text-[10px] ${
                i === 0 ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-500'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </aside>

      {/* Lista de agentes */}
      <div className="w-[210px] flex-shrink-0 border-r border-black/[0.06] p-3">
        <div className="flex items-center gap-1.5 rounded-md border border-black/[0.08] px-2 py-1.5 mb-3">
          <Search className="w-3 h-3 text-neutral-300" strokeWidth={2} />
          <span className="text-[10px] text-neutral-300">Buscar agente</span>
        </div>
        <div className="space-y-1.5">
          {agents.map(agent => (
            <div
              key={agent.id}
              className={`rounded-lg border px-2.5 py-2 ${
                agent.selected ? 'border-neutral-900 bg-[#fafaf8]' : 'border-black/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-medium text-neutral-800 truncate">{agent.name}</span>
                <StatusPill status={agent.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalhe / configuração */}
      <div className="flex-1 min-w-[440px] p-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[12px] font-semibold text-neutral-900">{detail.title}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{detail.subtitle}</p>
          </div>
          <span className="text-[9px] font-mono text-neutral-400 whitespace-nowrap">{detail.version}</span>
        </div>

        <div className="mb-4">
          <WireLabel>Nível de autonomia</WireLabel>
          <div className="grid grid-cols-3 gap-2">
            {detail.autonomy.map(option => (
              <div
                key={option.label}
                className={`rounded-lg border px-2.5 py-2 ${
                  option.active ? 'border-teal-500 bg-teal-50' : 'border-black/[0.08] bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full border-[3px] flex-shrink-0 ${
                      option.active ? 'border-teal-600 bg-white' : 'border-neutral-200 bg-white'
                    }`}
                  />
                  <span className="text-[10px] font-medium text-neutral-800">{option.label}</span>
                </div>
                <p className="text-[9px] text-neutral-400 mt-1 leading-snug">{option.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <WireLabel>Ferramentas liberadas</WireLabel>
            <div className="space-y-1.5">
              {detail.tools.map(tool => (
                <div
                  key={tool.name}
                  className="flex items-center justify-between gap-2 rounded-md border border-black/[0.06] px-2 py-1.5"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-neutral-700 truncate">{tool.name}</p>
                    <p className="text-[9px] text-neutral-400 truncate">{tool.scope}</p>
                  </div>
                  <Toggle on={tool.on} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <WireLabel>Contexto autorizado</WireLabel>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {detail.context.map(item => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-md border border-black/[0.08] bg-[#fafaf8] px-2 py-1 text-[9px] text-neutral-600"
                >
                  <Database className="w-2.5 h-2.5 opacity-50" strokeWidth={2} />
                  {item}
                </span>
              ))}
            </div>
            <WireLabel>Guardrails</WireLabel>
            <div className="space-y-1">
              {detail.guardrails.map(rule => (
                <div key={rule} className="flex items-start gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-teal-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span className="text-[9px] text-neutral-600 leading-snug">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 mb-4">
          <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-violet-800/70">
            {detail.evaluation.label}
          </p>
          <p className="text-[11px] font-semibold text-violet-950 mt-0.5">{detail.evaluation.value}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {detail.actions.map((action, i) => (
            <span
              key={action}
              className={`rounded-md px-3 py-1.5 text-[10px] font-medium ${
                i === detail.actions.length - 1
                  ? 'bg-neutral-900 text-white'
                  : 'border border-black/[0.1] text-neutral-600'
              }`}
            >
              {action}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function DashboardMockup({ accent }: { accent: string }) {
  const { kpis, columns, rows, approvals, audit, alerts } = AGENT_DASHBOARD_SCREEN
  return (
    <div className="min-w-[860px] p-4">
      {/* Topbar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded" style={{ backgroundColor: accent }} />
          <span className="text-[11px] font-semibold text-neutral-800">Controle de Agentes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md border border-black/[0.08] px-2 py-1 text-[9px] text-neutral-500">
            <Clock className="w-2.5 h-2.5" strokeWidth={2} />
            Últimas 24h
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-black/[0.08] px-2 py-1 text-[9px] text-neutral-500">
            <SlidersHorizontal className="w-2.5 h-2.5" strokeWidth={2} />
            Todos os agentes
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="rounded-lg border border-black/[0.06] bg-[#fafaf8] px-3 py-2.5">
            <p className="text-[9px] uppercase tracking-[0.1em] text-neutral-400">{kpi.label}</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <p className="text-[15px] font-semibold text-neutral-900 leading-none">{kpi.value}</p>
              <span className="text-[9px] text-teal-700">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1.5fr_1fr] gap-4">
        {/* Tabela por agente */}
        <div>
          <WireLabel>Desempenho por agente</WireLabel>
          <div className="rounded-lg border border-black/[0.06] overflow-hidden">
            <div className="grid grid-cols-[1.4fr_0.9fr_0.6fr_0.6fr_0.7fr_0.6fr] gap-2 bg-[#fafaf8] px-3 py-2 border-b border-black/[0.06]">
              {columns.map(col => (
                <span key={col} className="text-[9px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                  {col}
                </span>
              ))}
            </div>
            {rows.map(row => (
              <div
                key={row.agent}
                className="grid grid-cols-[1.4fr_0.9fr_0.6fr_0.6fr_0.7fr_0.6fr] gap-2 px-3 py-2 border-b border-black/[0.04] last:border-b-0 items-center"
              >
                <span className="text-[10px] font-medium text-neutral-800 truncate">{row.agent}</span>
                <span className="text-[10px] text-neutral-500 truncate">{row.stage}</span>
                <span className="text-[10px] text-neutral-600">{row.runs}</span>
                <span className="text-[10px] text-teal-700 font-medium">{row.success}</span>
                <span className="text-[10px] text-neutral-500">{row.human}</span>
                <StatusPill status={row.status} />
              </div>
            ))}
          </div>

          {/* Auditoria */}
          <div className="mt-4">
            <WireLabel>Trilha de auditoria</WireLabel>
            <div className="rounded-lg border border-black/[0.06] divide-y divide-black/[0.04]">
              {audit.map(entry => (
                <div key={entry.time} className="flex gap-2 px-3 py-2">
                  <span className="text-[9px] font-mono text-neutral-400 flex-shrink-0 mt-0.5">{entry.time}</span>
                  <span className="text-[10px] text-neutral-600 leading-snug">{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita */}
        <div>
          <WireLabel>Aprovações pendentes</WireLabel>
          <div className="space-y-1.5 mb-4">
            {approvals.map(item => (
              <div key={item.action} className="rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-amber-950">{item.agent}</span>
                  <span className="text-[9px] text-amber-900/60">{item.wait}</span>
                </div>
                <p className="text-[9px] text-amber-900/80 mt-1 leading-snug">{item.action}</p>
                <div className="flex gap-1.5 mt-2">
                  <span className="rounded bg-neutral-900 text-white px-2 py-0.5 text-[9px] font-medium">
                    Aprovar
                  </span>
                  <span className="rounded border border-black/[0.12] px-2 py-0.5 text-[9px] text-neutral-600">
                    Ajustar
                  </span>
                  <span className="rounded border border-black/[0.12] px-2 py-0.5 text-[9px] text-neutral-600">
                    Recusar
                  </span>
                </div>
              </div>
            ))}
          </div>

          <WireLabel>Alertas</WireLabel>
          <div className="space-y-1.5">
            {alerts.map(alert => (
              <div
                key={alert.text}
                className={`rounded-lg border px-2.5 py-2 flex gap-1.5 ${
                  alert.level === 'alto'
                    ? 'border-red-200 bg-red-50/70'
                    : 'border-black/[0.08] bg-[#fafaf8]'
                }`}
              >
                <AlertTriangle
                  className={`w-3 h-3 mt-0.5 flex-shrink-0 ${
                    alert.level === 'alto' ? 'text-red-500' : 'text-neutral-400'
                  }`}
                  strokeWidth={2}
                />
                <span className="text-[9px] text-neutral-700 leading-snug">{alert.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function JourneyBoard({ accent }: { accent: string }) {
  return (
    <div className="mb-6">
      <div className="overflow-x-auto pb-3">
        <div className="min-w-[900px] rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5">
          {/* Jornada — cabeçalho das etapas */}
          <div className="relative mb-3">
            <div className="absolute left-4 right-4 top-4 h-px bg-black/[0.1]" />
            <div className="grid grid-cols-5 gap-3">
              {JOURNEY_STAGES.map(stage => (
                <div key={stage.id} className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="relative z-10 w-8 h-8 rounded-full text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: accent }}
                    >
                      {stage.number.replace(/^0/, '')}
                    </span>
                    <p className="text-[12px] font-semibold text-neutral-900 leading-tight">{stage.title}</p>
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-snug">{stage.goal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agentes por etapa */}
          <div className="grid grid-cols-5 gap-3 mb-3">
            {JOURNEY_STAGES.map(stage => (
              <div key={stage.id} className="space-y-1.5">
                {stage.agentIds.map(id => {
                  const agent = COLMEIA_AGENTS.find(a => a.id === id)
                  const [head, tail] = agent?.name.split('·').map(s => s.trim()) ?? [id]
                  return (
                    <div key={id} className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-2">
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-violet-700 flex-shrink-0" strokeWidth={1.75} />
                        <p className="text-[11px] font-semibold text-violet-950 leading-tight">{head}</p>
                      </div>
                      {tail && <p className="text-[10px] text-violet-900/70 leading-snug mt-1">{tail}</p>}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-2">
            <ArrowRight className="w-4 h-4 rotate-90 text-neutral-300" strokeWidth={1.75} />
          </div>

          {/* Adaptive Layer */}
          <div className="rounded-xl bg-neutral-900 text-white px-4 py-3 mb-2">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
              <span className="inline-flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-300" strokeWidth={1.75} />
                <span className="text-[13px] font-semibold">{JOURNEY_BOARD.layerLabel}</span>
              </span>
              <span className="text-[10px] text-white/50">{JOURNEY_BOARD.layerDetail}</span>
            </div>
          </div>

          {/* Infraestrutura */}
          <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 mb-3 text-center">
            <span className="text-[12px] font-semibold text-teal-950">{JOURNEY_BOARD.infraLabel}</span>
            <span className="text-[10px] text-teal-900/60 ml-2">{JOURNEY_BOARD.infraDetail}</span>
          </div>

          {/* Sistemas e dados */}
          <div className="flex flex-wrap justify-center gap-2">
            {JOURNEY_BOARD.systems.map(sys => (
              <span
                key={sys.id}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium ${
                  sys.kind === 'product'
                    ? 'border-black/[0.1] bg-white text-neutral-800'
                    : 'border-black/[0.06] bg-[#f3f3f0] text-neutral-500'
                }`}
              >
                <Database className="w-3.5 h-3.5 opacity-60 flex-shrink-0" strokeWidth={1.75} />
                {sys.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-neutral-400 mt-1.5 px-1 leading-relaxed">{JOURNEY_BOARD.caption}</p>
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
  icon: typeof Layers
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-black/[0.04] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-neutral-700" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">{title}</h2>
          <p className="text-[13px] text-neutral-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Detail({
  label,
  text,
  tone = 'neutral',
}: {
  label: string
  text: string
  tone?: 'neutral' | 'teal'
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        tone === 'teal' ? 'bg-teal-50/70 border-teal-900/10' : 'bg-[#fafaf8] border-black/[0.05]'
      }`}
    >
      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1">{label}</p>
      <p className="text-[11px] text-neutral-700 leading-relaxed">{text}</p>
    </div>
  )
}
