'use client'

import Link from 'next/link'
import {
  ArrowDown,
  ArrowRight,
  Boxes,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Code2,
  GitPullRequest,
  Layers3,
  Milestone,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  XCircle,
} from 'lucide-react'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import {
  ALTERNATE_STATES,
  CLOSING_STATEMENTS,
  CORE_CONTRACTS,
  FIRST_MISSION,
  MISSION_FLOW,
  MISSION_LIFECYCLE,
  MISSIONS_ROADMAP_META,
  NEXT_PHASES,
  NORTH_STAR_FLOW,
  OUT_OF_SCOPE,
  PLATFORM_LAYERS,
  PRESENCE_FLOW,
  PRODUCT_SHIFT,
  QUESTION_FLOW,
  ROADMAP_OWNERS,
  RUNTIME_CAPABILITIES,
  RUNTIME_TREE,
  SHARED_VERTICAL,
  SPRINT_DEFINITION_OF_DONE,
  SPRINT_PLAN,
  type RoadmapOwner,
  type RoadmapTask,
} from './pixel-missions-roadmap-data'

export function PixelMissionsRoadmapView({
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
        eyebrow="Adaptive Layer™ · Product / Engineering Roadmap"
        title={MISSIONS_ROADMAP_META.title}
        description="Plano de execução do Mission Runtime — uma vertical integrada entre Cadence, Context Engine e Agents para concluir a primeira Mission de ponta a ponta."
        backHref={`${base}/documentos`}
      />

      <div className="mb-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetaCard label="Status" value={MISSIONS_ROADMAP_META.status} />
        <MetaCard label="Phase" value={MISSIONS_ROADMAP_META.phase} />
        <MetaCard label="Target" value={MISSIONS_ROADMAP_META.target} />
        <MetaCard label="Sprint" value={MISSIONS_ROADMAP_META.sprint} />
        <MetaCard label="Team" value={MISSIONS_ROADMAP_META.team.join(' · ')} />
      </div>

      <Section
        number="01"
        title="Objetivo"
        subtitle="De infraestrutura de respostas para uma plataforma que conclui Missions"
        icon={Target}
      >
        <div className="grid gap-5 xl:grid-cols-2">
          <FlowPanel title="Infraestrutura preservada" items={QUESTION_FLOW} muted />
          <FlowPanel title="Novo fluxo principal" items={MISSION_FLOW} />
        </div>
        <Callout accent={accent}>
          A unidade fundamental do produto deixa de ser uma resposta da IA e passa a ser uma Mission concluída.
          O endpoint <code>/ask</code> continua existindo como capability disponível para Agents e Missions.
        </Callout>
      </Section>

      <Section number="02" title="De → Para" subtitle="A mudança de unidade de produto e execução" icon={ArrowRight}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_SHIFT.map(([from, to]) => (
            <div key={from} className="flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white p-3.5">
              <span className="flex-1 text-[11px] text-neutral-400">{from}</span>
              <ArrowRight className="h-3.5 w-3.5 text-neutral-300" />
              <span className="flex-1 text-[12px] font-semibold text-neutral-900">{to}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        number="03"
        title="Arquitetura de Produto"
        subtitle="Cadence é o Control Plane; Pixel Runtime concentra inteligência e execução"
        icon={Network}
      >
        <FlowPanel title="Pixel Platform" items={PLATFORM_LAYERS.map(layer => layer.title)} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PLATFORM_LAYERS.map(layer => (
            <article key={layer.title} className="rounded-xl border border-black/[0.07] bg-white p-4">
              <p className="text-[12px] font-semibold text-neutral-900">{layer.title}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">{layer.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        number="04"
        title="Responsabilidade das camadas"
        subtitle="Control Plane, unidade de trabalho e runtime de execução"
        icon={Layers3}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoCard
            title="Cadence"
            badge="Control Plane"
            text="Onde humanos criam e acompanham Missions, visualizam planos, Tasks, Agents, approvals, artifacts, resultados e histórico. A lógica principal de execução não vive aqui."
          />
          <InfoCard
            title="Missions"
            badge="Unidade de trabalho"
            text="Objective + Context + Plan + Tasks + Agents + Humans + Tools + Artifacts + Approvals + Evaluation + Result."
          />
          <InfoCard
            title="Pixel Runtime"
            badge="Execution Plane"
            text="Evolução conceitual do SDK atual. Reutiliza todo o patrimônio existente e o disponibiliza para Missions e Agents, sem reescrever a infraestrutura."
          />
        </div>
      </Section>

      <Section
        number="05"
        title="Pixel Runtime"
        subtitle="A infraestrutura existente vira capability de Missions e Agents"
        icon={Boxes}
      >
        <div className="flex flex-wrap gap-2">
          {RUNTIME_CAPABILITIES.map(item => (
            <span key={item} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-800">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {RUNTIME_TREE.map(group => (
            <article key={group.title} className="rounded-2xl border border-black/[0.07] bg-white p-4">
              <p className="text-[12px] font-semibold text-neutral-900">{group.title}</p>
              <BulletList items={[...group.items]} />
            </article>
          ))}
        </div>
      </Section>

      <Section
        number="06"
        title="Mission Lifecycle"
        subtitle="Toda mudança de estado deve produzir um evento"
        icon={Workflow}
      >
        <FlowPanel title="Lifecycle v1" items={MISSION_LIFECYCLE} />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Estados alternativos</span>
          {ALTERNATE_STATES.map(state => (
            <span key={state} className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[10px] font-semibold text-rose-800">
              {state}
            </span>
          ))}
        </div>
      </Section>

      <Section
        number="07"
        title="Core Domain"
        subtitle="Contratos compartilhados por Cadence, Runtime, Context e Agents"
        icon={Code2}
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {CORE_CONTRACTS.map(contract => (
            <article key={contract.name} className="overflow-hidden rounded-2xl border border-black/[0.08] bg-neutral-950">
              <p className="border-b border-white/10 px-5 py-3 text-[11px] font-semibold text-white/70">{contract.name}</p>
              <pre className="overflow-x-auto p-5 text-[11px] leading-relaxed text-emerald-200">{contract.code}</pre>
            </article>
          ))}
        </div>
      </Section>

      <Section
        number="08"
        title="Milestone 01 · First End-to-End Mission"
        subtitle="O primeiro sprint entrega uma Mission real, não uma plataforma genérica completa"
        icon={Milestone}
      >
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700">Mission #001 · Objective</p>
          <p className="mt-2 text-[16px] font-semibold text-indigo-950">“{FIRST_MISSION.objective}”</p>
        </div>
        <div className="mt-5">
          <FlowPanel title="Fluxo esperado" items={FIRST_MISSION.flow} />
        </div>
      </Section>

      <Section
        number="09–11"
        title="Execution Backlog"
        subtitle="26 itens rastreáveis, com ownership e contratos explícitos"
        icon={Users}
      >
        <div className="space-y-10">
          {ROADMAP_OWNERS.map(owner => (
            <OwnerBacklog key={owner.id} owner={owner} accent={accent} />
          ))}
        </div>
      </Section>

      <Section
        number="12"
        title="Responsabilidade compartilhada"
        subtitle="Os três engenheiros constroem uma única vertical"
        icon={GitPullRequest}
      >
        <FlowPanel title="Vertical integrada" items={SHARED_VERTICAL} />
        <Callout accent={accent}>
          Marga = execução e orquestração. João = inteligência e contexto. Pedro = superfície Cadence e Agents.
          Os três compartilham um único Definition of Done.
        </Callout>
      </Section>

      <Section number="13" title="Sprint Plan" subtitle="Duas semanas; dias 9–10 são apenas integração" icon={CalendarDays}>
        <div className="grid gap-4 xl:grid-cols-2">
          {SPRINT_PLAN.map(period => (
            <article key={period.window} className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <p className="font-mono text-[11px] font-semibold text-indigo-700">{period.window}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {period.people.map(person => (
                  <div key={person.name}>
                    <p className="text-[12px] font-semibold text-neutral-900">{person.name}</p>
                    <BulletList items={person.items} />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        number="14"
        title="Definition of Done — Sprint"
        subtitle="O Sprint termina somente quando esta demonstração ao vivo for possível"
        icon={CheckCircle2}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {SPRINT_DEFINITION_OF_DONE.map((step, index) => (
            <div key={step} className="flex gap-3 rounded-xl border border-black/[0.07] bg-white p-3.5">
              <span className="font-mono text-[10px] font-semibold text-indigo-700">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[11px] leading-relaxed text-neutral-600">{step}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        number="15"
        title="Não fazer neste Sprint"
        subtitle="Se não for necessário para completar Mission #001, não pertence ao Sprint 01"
        icon={XCircle}
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {OUT_OF_SCOPE.map(item => (
            <div key={item} className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-[11px] text-rose-900/70">
              <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section number="16–17" title="Próximas fases & Presence" subtitle="Expandir Agents e domínios depois da Mission #001" icon={Sparkles}>
        <div className="grid gap-4 lg:grid-cols-2">
          {NEXT_PHASES.map(phase => (
            <InfoCard key={phase.title} title={phase.title} badge="Next" text={phase.detail} />
          ))}
        </div>
        <div className="mt-5">
          <FlowPanel title="Presence como client do Pixel Runtime" items={PRESENCE_FLOW} muted />
        </div>
        <Callout accent={accent}>
          Presence não implementa inteligência paralela. Ele consome a mesma infraestrutura de Context, Missions,
          Agents, Tools e Memory e não é prioridade do Sprint 01.
        </Callout>
      </Section>

      <Section number="18–20" title="North Star & Visão" subtitle="A medida de valor passa a ser uma Mission concluída" icon={Target}>
        <FlowPanel title="Can Pixel successfully complete a Mission?" items={NORTH_STAR_FLOW} />
        <div className="mt-5 rounded-2xl border border-black/[0.07] bg-neutral-950 p-6 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">Princípio de arquitetura</p>
          <p className="mt-3 max-w-4xl text-[17px] font-medium leading-relaxed">
            Antes de adicionar uma nova feature, perguntar: esta feature aumenta nossa capacidade de criar, entender,
            planejar, executar, avaliar ou concluir uma Mission?
          </p>
          <p className="mt-3 text-[12px] text-white/50">
            Cadence é onde o trabalho acontece. Missions organizam o trabalho. Agents executam. Pixel Runtime fornece
            contexto, inteligência, ferramentas e execução. Presence conecta essa infraestrutura ao mundo humano.
          </p>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {CLOSING_STATEMENTS.map(([label, statement]) => (
            <article key={label} className="rounded-xl border border-black/[0.07] bg-white p-4">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
              <p className="mt-2 text-[13px] font-semibold leading-relaxed text-neutral-900">{statement}</p>
            </article>
          ))}
        </div>
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5">
        <div>
          <p className="text-[13px] font-semibold text-neutral-900">Unidade de execução: Mission</p>
          <p className="mt-1 text-[11px] text-neutral-500">Unidade de valor: uma Mission concluída.</p>
        </div>
        <Link
          href={`${base}/backlog`}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold text-white"
          style={{ backgroundColor: accent }}
        >
          Abrir boards
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/[0.07] bg-white p-4">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="mt-1.5 text-[12px] font-semibold leading-snug text-neutral-900">{value}</p>
    </div>
  )
}

function Section({
  number,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  number: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
}) {
  return (
    <section className="mb-14 scroll-mt-8">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-indigo-600">{number}</p>
          <h2 className="text-[18px] font-semibold tracking-[-0.015em] text-neutral-900">{title}</h2>
          <p className="mt-0.5 text-[12px] text-neutral-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function FlowPanel({ title, items, muted = false }: { title: string; items: readonly string[]; muted?: boolean }) {
  return (
    <div className={`overflow-x-auto rounded-2xl border p-5 ${muted ? 'border-black/[0.07] bg-[#fafaf8]' : 'border-indigo-200 bg-indigo-50/40'}`}>
      <p className={`mb-4 text-[10px] font-semibold uppercase tracking-wider ${muted ? 'text-neutral-400' : 'text-indigo-700'}`}>{title}</p>
      <div className="flex min-w-max items-center">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center">
            <span className={`rounded-lg border px-3 py-2 text-[10px] font-semibold ${muted ? 'border-black/[0.07] bg-white text-neutral-600' : 'border-indigo-200 bg-white text-indigo-950'}`}>
              {item}
            </span>
            {index < items.length - 1 && <ArrowRight className="mx-2 h-3.5 w-3.5 shrink-0 text-neutral-300" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function InfoCard({ title, badge, text }: { title: string; badge: string; text: string }) {
  return (
    <article className="rounded-2xl border border-black/[0.07] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[14px] font-semibold text-neutral-900">{title}</p>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-indigo-700">{badge}</span>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">{text}</p>
    </article>
  )
}

function OwnerBacklog({ owner, accent }: { owner: RoadmapOwner; accent: string }) {
  return (
    <div>
      <div className="mb-5 rounded-2xl border border-black/[0.07] bg-neutral-950 p-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/40">Ownership</p>
            <h3 className="mt-1 text-[18px] font-semibold">{owner.name}</h3>
            <p className="mt-1 text-[11px] font-medium" style={{ color: accent }}>{owner.ownership}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] text-white/60">
            {owner.tasks.length} tasks
          </span>
        </div>
        <p className="mt-4 max-w-4xl text-[12px] leading-relaxed text-white/60">{owner.objective}</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {owner.tasks.map(task => <TaskCard key={task.id} task={task} />)}
      </div>
      <div className="mt-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">Definition of Done · {owner.name}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-emerald-950/70">{owner.definitionOfDone}</p>
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task }: { task: RoadmapTask }) {
  return (
    <article id={task.id.toLowerCase()} className="rounded-2xl border border-black/[0.07] bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="rounded-md bg-indigo-50 px-2 py-1 font-mono text-[10px] font-semibold text-indigo-700">{task.id}</span>
        <h4 className="pt-0.5 text-[13px] font-semibold text-neutral-900">{task.title}</h4>
      </div>
      <div className="mt-4">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">Implementar</p>
        <BulletList items={task.implementation} />
      </div>
      {task.acceptance && (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-700">Acceptance Criteria</p>
          <BulletList items={task.acceptance} success />
        </div>
      )}
    </article>
  )
}

function BulletList({ items, success = false }: { items: readonly string[]; success?: boolean }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map(item => (
        <li key={item} className="flex gap-2 text-[11px] leading-relaxed text-neutral-600">
          {success ? (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
          ) : (
            <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-300" />
          )}
          {item}
        </li>
      ))}
    </ul>
  )
}

function Callout({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="mt-5 flex gap-3 rounded-xl border border-black/[0.07] bg-white p-4">
      <ArrowDown className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
      <p className="text-[12px] font-medium leading-relaxed text-neutral-700">{children}</p>
    </div>
  )
}
