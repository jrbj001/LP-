'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  FlaskConical,
  Megaphone,
  Milestone,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import { LikeMeAnimatedAvatar } from './likeme-avatar-animado'
import { LikeMeAvatarShareCard } from './likeme-avatar-share-card'
import {
  AVATAR_META,
  DATA_INVENTORY,
  DATA_STATUS,
  GAPS,
  MARKERS,
  PERSONAS,
  PHASES,
  PRIVACY,
  ROADMAP,
  RULES,
  VIRAL,
  deriveAvatarState,
  type AvatarInput,
  type AvatarPhase,
  type DataStatus,
  type MarkerId,
} from './likeme-avatar-animado-data'

const STATUS_STYLES: Record<DataStatus, string> = {
  hoje: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  derivavel: 'border-amber-200 bg-amber-50 text-amber-800',
  futuro: 'border-violet-200 bg-violet-50 text-violet-800',
}

const DEFAULT_PERSONA = PERSONAS.find(p => p.id === 'glp1') ?? PERSONAS[0]

export function LikeMeAvatarAnimadoView({
  locale,
  clientSlug,
  accent,
}: {
  locale: string
  clientSlug: string
  accent: string
}) {
  const base = `/${locale}/client/${clientSlug}`
  const [personaId, setPersonaId] = useState<string | null>(DEFAULT_PERSONA.id)
  const [input, setInput] = useState<AvatarInput>(DEFAULT_PERSONA.input)
  const state = useMemo(() => deriveAvatarState(input), [input])

  const update = (patch: Partial<AvatarInput>) => {
    setPersonaId(null)
    setInput(current => ({ ...current, ...patch }))
  }
  const updateMarker = (id: MarkerId, value: number) => {
    setPersonaId(null)
    setInput(current => ({ ...current, markers: { ...current.markers, [id]: value } }))
  }

  return (
    <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10 2xl:px-14">
      <WorkspacePageHeader
        eyebrow={`${AVATAR_META.client} · Estudo de produto`}
        title={AVATAR_META.title}
        description={`Como transformar tudo o que sabemos do usuário em um avatar vivo e compartilhável. Atualizado em ${AVATAR_META.date}.`}
        backHref={`${base}/documentos`}
      />

      <section className="mb-12 overflow-hidden rounded-2xl border border-rose-900/10 bg-rose-50/40 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0" style={{ color: accent }} strokeWidth={1.75} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-800/70">Tese viral</p>
            <h2 className="mt-1 max-w-4xl text-[21px] font-semibold leading-snug text-neutral-950 sm:text-[24px]">
              Dados íntimos de saúde viram uma forma bonita que evolui, e uma forma bonita se compartilha.
            </h2>
          </div>
        </div>
        <p className="mt-5 max-w-4xl text-[14px] leading-relaxed text-neutral-700">{VIRAL.thesis}</p>
      </section>

      <Section
        title="Laboratório do avatar"
        subtitle="Escolha uma persona ou mexa nos dados. O avatar e o card reagem em tempo real."
        icon={FlaskConical}
      >
        <div className="mb-5 flex flex-wrap gap-2">
          {PERSONAS.map(persona => (
            <button
              key={persona.id}
              type="button"
              onClick={() => {
                setPersonaId(persona.id)
                setInput(persona.input)
              }}
              className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                personaId === persona.id
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-black/[0.08] bg-white text-neutral-600 hover:border-black/20'
              }`}
              title={persona.description}
            >
              {persona.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_auto_auto]">
          <div className="space-y-5 rounded-2xl border border-black/[0.07] bg-white p-5">
            <label className="flex items-center gap-2 text-[12px] font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={input.anamnesisCompleted}
                onChange={event => update({ anamnesisCompleted: event.target.checked })}
                className="h-3.5 w-3.5 accent-neutral-900"
              />
              Anamnese completa
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Slider label="MENTE (mentalPercentage)" value={input.mind} onChange={mind => update({ mind })} />
              <Slider label="CORPO (physicalPercentage)" value={input.body} onChange={body => update({ body })} />
              <Slider
                label="Delta da mente no mês"
                value={input.mindDelta}
                min={-30}
                max={30}
                suffix=" p.p."
                onChange={mindDelta => update({ mindDelta })}
              />
              <Slider
                label="Delta do corpo no mês"
                value={input.bodyDelta}
                min={-30}
                max={30}
                suffix=" p.p."
                onChange={bodyDelta => update({ bodyDelta })}
              />
              <Slider
                label="Streak de hábitos"
                value={input.streakDays}
                max={90}
                suffix=" dias"
                onChange={streakDays => update({ streakDays })}
              />
            </div>
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Marcadores (GET /api/anamnesis/markers)
              </p>
              <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                {MARKERS.map(marker => (
                  <Slider
                    key={marker.id}
                    label={`${marker.label} · ${marker.dimension === 'mind' ? 'mente' : marker.dimension === 'body' ? 'corpo' : 'elo'}`}
                    value={input.markers[marker.id]}
                    onChange={value => updateMarker(marker.id, value)}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-w-[260px] flex-col items-center justify-center rounded-2xl bg-[#F4F3EC] px-6 py-8">
            <p className="mb-4 self-start text-[18px] font-medium text-[#001137] font-[family-name:var(--font-cadence-body)]">
              Seu Avatar
            </p>
            <LikeMeAnimatedAvatar state={state} className="w-[220px]" labelClassName="text-[#001137]/50" />
            <div className="mt-5 w-full space-y-1 text-[10px] text-neutral-500">
              <StateRow label="Fase" value={PHASES[state.phase].label} />
              <StateRow label="Escala mente / corpo" value={`${state.mind.scale}× / ${state.body.scale}×`} />
              <StateRow label="Ondulação mente / corpo" value={`${state.mind.wobble} / ${state.body.wobble}`} />
              <StateRow label="Respiração" value={`${state.mind.breathSeconds}s / ${state.body.breathSeconds}s`} />
              <StateRow label="Pulso" value={`${state.mind.pulse} / ${state.body.pulse}`} />
              <StateRow label="Elo de conexão" value={String(state.link)} />
            </div>
          </div>

          <div className="flex justify-center">
            <LikeMeAvatarShareCard state={state} fileName={personaId ?? 'personalizado'} />
          </div>
        </div>
      </Section>

      <Section title="Do dado ao movimento" subtitle="Regras de deriveAvatarState, função pura e testada" icon={Wand2}>
        <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
          {RULES.map(rule => (
            <div key={rule.input} className="grid gap-2 py-3.5 sm:grid-cols-[280px_1fr]">
              <p className="font-mono text-[11px] text-neutral-800">{rule.input}</p>
              <p className="text-[12px] leading-relaxed text-neutral-500">{rule.output}</p>
            </div>
          ))}
        </div>
        <p className="mb-3 mt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Fases do avatar
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PHASES) as AvatarPhase[]).map(phase => (
            <article
              key={phase}
              className={`rounded-xl border p-4 ${
                state.phase === phase ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-black/[0.07] bg-[#fafaf8]'
              }`}
            >
              <p className="text-[13px] font-semibold">{PHASES[phase].label}</p>
              <p className={`mt-1.5 text-[11px] leading-relaxed ${state.phase === phase ? 'text-white/60' : 'text-neutral-500'}`}>
                {PHASES[phase].detail}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Mecânica viral · Like:Me Wrapped" subtitle="Card 9:16 mensal como motor de aquisição" icon={Megaphone}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VIRAL.loop.map((step, index) => (
            <div key={step.title} className="border-t border-black/[0.08] pt-3">
              <p className="text-[10px] font-semibold text-neutral-400">0{index + 1}</p>
              <p className="mt-1 text-[13px] font-semibold text-neutral-900">{step.title}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">{step.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5">
          <p className="text-[12px] font-semibold text-neutral-900">Como medir</p>
          <BulletList items={VIRAL.metrics} />
        </div>
      </Section>

      <Section
        title="Mapa de dados do usuário"
        subtitle="Tudo que os 3 repositórios Like:Me sabem ou poderão saber"
        icon={Database}
      >
        <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
          {(Object.keys(DATA_STATUS) as DataStatus[]).map(status => (
            <div key={status} className="flex items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-[10px] text-neutral-400">{DATA_STATUS[status].detail}</span>
            </div>
          ))}
        </div>
        <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
          {DATA_INVENTORY.map(item => (
            <div key={item.group} className="grid gap-2 py-4 lg:grid-cols-[180px_1fr_1fr_auto] lg:items-start">
              <div>
                <p className="text-[13px] font-semibold text-neutral-900">{item.group}</p>
                <p className="mt-0.5 text-[10px] text-neutral-400">{item.source}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-neutral-500">{item.path}</p>
                <p className="mt-1 text-[11px] text-neutral-700">{item.fields}</p>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-500">{item.drives}</p>
              <div className="flex flex-wrap gap-1.5 lg:justify-end">
                <StatusBadge status={item.status} />
                {item.sensitive && (
                  <span className="inline-flex w-fit rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-rose-800">
                    Sensível
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Privacidade e LGPD" subtitle="O card compartilha forma, nunca o dado" icon={ShieldCheck}>
        <BulletList items={PRIVACY} />
      </Section>

      <Section title="Gaps técnicos" subtitle="O que precisa mudar nos repositórios para o avatar ir ao app" icon={AlertTriangle}>
        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5">
          <BulletList items={GAPS} tone="warning" />
        </div>
      </Section>

      <Section title="Roadmap" subtitle="Do estudo ao avatar vivo no app" icon={Milestone}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {ROADMAP.map(step => (
            <article key={step.phase} className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{step.window}</p>
              <h3 className="mt-1.5 text-[15px] font-semibold text-neutral-900">{step.phase}</h3>
              <BulletList items={step.items} compact />
            </article>
          ))}
        </div>
      </Section>

      <footer className="border-t border-black/[0.06] pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Fontes</p>
        <ul className="mt-2 space-y-1">
          {AVATAR_META.sources.map(source => (
            <li key={source} className="text-[11px] text-neutral-500">
              {source}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  )
}

function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  suffix = '%',
  compact = false,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  suffix?: string
  compact?: boolean
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[11px] text-neutral-600">
        <span className={compact ? 'text-[10px]' : ''}>{label}</span>
        <span className="font-mono text-[10px] text-neutral-400">
          {value > 0 && min < 0 ? '+' : ''}
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={event => onChange(Number(event.target.value))}
        className="mt-1.5 w-full accent-neutral-900"
      />
    </label>
  )
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <span className="font-mono text-neutral-700">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: DataStatus }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {DATA_STATUS[status].label}
    </span>
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
    <ul className={compact ? 'mt-3 space-y-2' : 'mt-3 space-y-2.5'}>
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
  children,
}: {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
}) {
  return (
    <section className="mb-14">
      <div className="mb-6 flex items-start gap-3 border-b border-black/[0.06] pb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-neutral-950">{title}</h2>
          <p className="mt-0.5 text-[11px] text-neutral-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}
