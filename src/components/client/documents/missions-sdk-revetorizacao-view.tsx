'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  GitBranch,
  ListChecks,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import {
  ALTERNATIVE_SPLIT,
  FRENTES_TABLE,
  MISSIONS_SDK_REVETORIZACAO_META,
  OBSERVATIONS,
  RAG_SEQUENCE_FLOW,
  ROADMAP_OWNERS,
  SDK_SEQUENCE_FLOW,
  SYNC_POINTS,
  type RoadmapOwner,
  type RoadmapTask,
} from './missions-sdk-revetorizacao-data'

export function MissionsSdkRevetorizacaoView({
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
        title={MISSIONS_SDK_REVETORIZACAO_META.title}
        description="Três frentes: duas cuidam do SDK de Missions (tipos, cliente, pacote instalável, teste e guia) e a terceira cuida de embeddings, RAG e revetorização da Colmeia e do Banco de Ativos."
        backHref={`${base}/documentos`}
      />

      <div className="mb-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetaCard label="Status" value={MISSIONS_SDK_REVETORIZACAO_META.status} />
        <MetaCard label="Escopo" value={MISSIONS_SDK_REVETORIZACAO_META.scope} />
        <MetaCard label="Alvo" value={MISSIONS_SDK_REVETORIZACAO_META.target} />
        <MetaCard label="Time" value={MISSIONS_SDK_REVETORIZACAO_META.team.join(' · ')} />
      </div>

      <Section number="01" title="Divisão do trabalho" subtitle="Três frentes, três devs" icon={Users}>
        <div className="overflow-x-auto rounded-2xl border border-black/[0.07] bg-white">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-black/[0.06] text-[10px] uppercase tracking-wider text-neutral-400">
                <th className="px-4 py-3 font-semibold">Frente</th>
                <th className="px-4 py-3 font-semibold">Dev</th>
                <th className="px-4 py-3 font-semibold">Entrega</th>
                <th className="px-4 py-3 font-semibold">Onde mexe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {FRENTES_TABLE.map(row => (
                <tr key={row.frente}>
                  <td className="px-4 py-3 font-mono text-[11px] font-semibold text-indigo-700">{row.frente}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-900">{row.dev}</td>
                  <td className="px-4 py-3 text-neutral-600">{row.entrega}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-neutral-400">{row.ondeMexe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">{ALTERNATIVE_SPLIT}</p>
      </Section>

      <Section
        number="02–04"
        title="Backlog por frente"
        subtitle="Cada dev tem ownership completo da sua frente, com Definition of Done própria"
        icon={ListChecks}
      >
        <div className="space-y-10">
          {ROADMAP_OWNERS.map(owner => (
            <OwnerBacklog key={owner.id} owner={owner} accent={accent} />
          ))}
        </div>
      </Section>

      <Section
        number="05"
        title="Sequência e pontos de sincronização"
        subtitle="O SDK e a revetorização andam em paralelo, sem se bloquear"
        icon={GitBranch}
      >
        <div className="grid gap-5 xl:grid-cols-2">
          <FlowPanel title="Sequência SDK (Frentes A → B)" items={SDK_SEQUENCE_FLOW} />
          <FlowPanel title="Sequência RAG (Frente C)" items={RAG_SEQUENCE_FLOW} muted />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {SYNC_POINTS.map(point => (
            <div key={point.title} className="rounded-xl border border-black/[0.07] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700">{point.title}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">{point.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        number="06"
        title="Isolamento e observações"
        subtitle="A Frente C não conflita com o SDK; o escopo do LP- e do apps/cadence fica intocado"
        icon={ShieldAlert}
      >
        <div className="space-y-2">
          {OBSERVATIONS.map(item => (
            <div key={item} className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
              <p className="text-[11px] leading-relaxed text-amber-950/80">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5">
        <div>
          <p className="text-[13px] font-semibold text-neutral-900">Board: Adaptive Layer™</p>
          <p className="mt-1 text-[11px] text-neutral-500">
            Os 13 cards das três frentes já estão no board — João, Pedro e Henrique podem mover cada um.
          </p>
        </div>
        <Link
          href={`${base}/backlog?board=adaptive-layer`}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold text-white"
          style={{ backgroundColor: accent }}
        >
          Abrir board
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

function OwnerBacklog({ owner, accent }: { owner: RoadmapOwner; accent: string }) {
  return (
    <div>
      <div className="mb-5 rounded-2xl border border-black/[0.07] bg-neutral-950 p-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/40">
              {owner.frente} · Ownership
            </p>
            <h3 className="mt-1 text-[18px] font-semibold">{owner.dev}</h3>
            <p className="mt-1 text-[11px] font-medium" style={{ color: accent }}>
              {owner.ownership}
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] text-white/60">
            {owner.tasks.length} tasks
          </span>
        </div>
        <p className="mt-4 max-w-4xl text-[12px] leading-relaxed text-white/60">{owner.objective}</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {owner.tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <div className="mt-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
            Pronto quando · {owner.dev}
          </p>
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
        <span className="rounded-md bg-indigo-50 px-2 py-1 font-mono text-[10px] font-semibold text-indigo-700">
          {task.id}
        </span>
        <h4 className="pt-0.5 text-[13px] font-semibold text-neutral-900">{task.title}</h4>
      </div>
      <div className="mt-4">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">Implementar</p>
        <BulletList items={task.implementation} />
      </div>
      {task.acceptance && (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-700">Pronto quando</p>
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
