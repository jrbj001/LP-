'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import { ArchitectureDiagram, AgentsDiagram } from '@/components/adaptive/review-diagrams'
import {
  LAYER_DOC_META,
  LAYER_INTRO,
  LEGACY_SYSTEMS,
  LAYER_DETAILS,
  OTD_AGENTS,
  OTD_AI_OPPORTUNITIES,
  AGENT_LOOP,
  AGENT_WALKTHROUGH,
} from '@/components/adaptive/adaptive-layer-doc-data'
import { stageLabel } from '@/lib/adaptive/b2b-process/agents'
import {
  Lock, Unlock, Layers, Server, Bot, Sparkles, ArrowRight,
  CheckCircle2, Cable, Braces, Workflow, ShieldCheck, Info,
} from 'lucide-react'

const STORAGE_KEY = 'orfeu-adaptive-layer-unlocked'

const CAPABILITY_ICONS = {
  integration: Cable,
  data: Braces,
  apis: Workflow,
  security: ShieldCheck,
} as const

export function AdaptiveLayerDocView() {
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(STORAGE_KEY) === '1')
    setReady(true)
  }, [])

  if (!ready) return null

  if (!unlocked) {
    return (
      <PasswordGate
        onUnlock={() => {
          sessionStorage.setItem(STORAGE_KEY, '1')
          setUnlocked(true)
        }}
      />
    )
  }

  return <LayerDocContent />
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim().toLowerCase() === LAYER_DOC_META.password) {
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <PageShell>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Reveal className="w-full max-w-sm">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight">
              {LAYER_DOC_META.title}
            </h1>
            <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">
              Documento exclusivo do {LAYER_DOC_META.client}. Digite a senha compartilhada
              pela PixelPulseLab.
            </p>
            <form onSubmit={submit} className="mt-6">
              <input
                type="password"
                value={value}
                onChange={e => {
                  setValue(e.target.value)
                  setError(false)
                }}
                placeholder="Senha de acesso"
                autoFocus
                className={`w-full rounded-xl border px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors ${
                  error
                    ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400'
                    : 'border-black/[0.08] bg-[#fafaf8] focus:border-neutral-900/30'
                }`}
              />
              {error && (
                <p className="text-[12px] text-rose-600 mt-2">Senha incorreta. Tente novamente.</p>
              )}
              <button
                type="submit"
                className="w-full mt-3 rounded-xl bg-neutral-900 text-white text-[14px] font-medium py-3 hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" strokeWidth={1.75} />
                Acessar documento
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </PageShell>
  )
}

function LayerDocContent() {
  const locale = useLocale()

  return (
    <PageShell>
      <PageHeader
        eyebrow={`Exclusivo · ${LAYER_DOC_META.client}`}
        title={LAYER_DOC_META.title}
        subtitle={`${LAYER_INTRO.lead} ${LAYER_DOC_META.validity}.`}
      />

      {/* Intro */}
      <Reveal>
        <section className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Layers className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/70">
                {LAYER_INTRO.eyebrow}
              </p>
              <h2 className="text-[18px] font-semibold text-neutral-900 mt-1">{LAYER_INTRO.title}</h2>
            </div>
          </div>
          <div className="space-y-3 max-w-3xl">
            {LAYER_INTRO.narrative.map(paragraph => (
              <p key={paragraph.slice(0, 40)} className="text-[13px] text-neutral-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {LAYER_INTRO.principles.map(item => (
              <div key={item.title} className="rounded-xl border border-emerald-900/10 bg-white/70 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={1.75} />
                  <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
                </div>
                <p className="text-[12px] text-neutral-500 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Mapa visual */}
      <Reveal>
        <Section
          title="Arquitetura em uma vista"
          subtitle="Sistemas atuais → Adaptive Layer™ → o que a camada destrava"
          icon={Layers}
        >
          <ArchitectureDiagram />
        </Section>
      </Reveal>

      {/* Legado detalhado */}
      <Reveal>
        <Section
          title="Sistema legado atual"
          subtitle="O que a Orfeu já opera — e o papel de cada sistema na Adaptive Layer™"
          icon={Server}
        >
          <div className="space-y-3">
            {LEGACY_SYSTEMS.map(system => (
              <article
                key={system.id}
                id={system.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-5"
              >
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <h3 className="text-[15px] font-semibold text-neutral-900">{system.name}</h3>
                  <Badge tone="muted">{system.owners}</Badge>
                </div>
                <p className="text-[12px] font-medium text-neutral-700">{system.role}</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
                  <DetailBlock label="Hoje" text={system.today} />
                  <DetailBlock label="Dor" text={system.pain} tone="amber" />
                  <DetailBlock label="Papel na Layer" text={system.layerRole} tone="emerald" />
                </div>
              </article>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Detalhes da Layer */}
      <Reveal>
        <Section
          title={LAYER_DETAILS.title}
          subtitle={LAYER_DETAILS.subtitle}
          icon={Info}
        >
          <p className="text-[13px] text-neutral-600 mb-5 max-w-3xl leading-relaxed">
            {LAYER_DETAILS.formula}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {LAYER_DETAILS.capabilities.map(cap => {
              const Icon = CAPABILITY_ICONS[cap.id as keyof typeof CAPABILITY_ICONS] ?? Cable
              return (
                <div key={cap.id} className="rounded-xl border border-black/[0.06] bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" strokeWidth={1.75} />
                    </div>
                    <p className="text-[14px] font-semibold text-neutral-900">{cap.title}</p>
                  </div>
                  <p className="text-[12px] text-neutral-500 leading-relaxed">{cap.detail}</p>
                </div>
              )
            })}
          </div>
          <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/40 p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700/70 mb-3">
              O que a camada destrava
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LAYER_DETAILS.unlocks.map(item => (
                <li key={item} className="flex gap-2 text-[12px] text-neutral-700 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </Reveal>

      {/* Agentes */}
      <Reveal>
        <Section
          title="Squad de agentes sobre a Layer"
          subtitle="Seis agentes especializados — todos na mesma jornada Order-to-delivery"
          icon={Bot}
        >
          <AgentsDiagram />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6">
            {AGENT_LOOP.map((step, index) => (
              <div key={step.id} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-3">
                <p className="text-[10px] font-mono text-neutral-400 mb-1">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="text-[12px] font-semibold text-neutral-900">{step.title}</p>
                <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">{step.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-5">
            <p className="text-[13px] font-semibold text-neutral-900">{AGENT_WALKTHROUGH.title}</p>
            <p className="text-[12px] text-neutral-500 mt-1 mb-4">{AGENT_WALKTHROUGH.subtitle}</p>
            <ol className="space-y-3">
              {AGENT_WALKTHROUGH.steps.map((step, index) => {
                const agent = OTD_AGENTS.find(a => a.id === step.agentId)
                return (
                  <li key={`${step.stageId}-${step.agentId}`} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[12px] font-medium text-neutral-900">
                        {stageLabel(step.stageId)} · {agent?.name ?? step.agentId}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {step.event} → {step.action}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </Section>
      </Reveal>

      {/* Oportunidades IA */}
      <Reveal>
        <Section
          title="Oportunidades de IA por etapa"
          subtitle="Só depois que o quick win correspondente limpa a intervenção manual"
          icon={Sparkles}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OTD_AI_OPPORTUNITIES.map(item => (
              <div key={item.id} className="rounded-xl border border-black/[0.06] bg-white p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1">
                  {item.area}
                </p>
                <p className="text-[13px] font-medium text-neutral-900 leading-snug">{item.opportunity}</p>
                {item.enabledBy && item.enabledBy.length > 0 && (
                  <p className="text-[10px] text-emerald-700/80 mt-2">
                    habilitado por {item.enabledBy.join(' · ')}
                  </p>
                )}
                <p className="text-[11px] text-neutral-400 mt-2">{item.stakeholder}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Links */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <p className="text-[14px] font-semibold">Continuar na jornada Orfeu</p>
            <p className="text-[12px] text-white/50 mt-1">
              Processo B2B, Executive Review e proposta comercial.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${locale}/adaptive/processo-b2b`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-neutral-900 text-[12px] font-medium px-4 py-2 hover:bg-white/90"
            >
              Processo B2B
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
            <Link
              href={`/${locale}/adaptive/executive-review`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 text-white text-[12px] font-medium px-4 py-2 hover:bg-white/10"
            >
              Executive Review
            </Link>
            <Link
              href={`/${locale}/adaptive/documents`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 text-white text-[12px] font-medium px-4 py-2 hover:bg-white/10"
            >
              Documentos
            </Link>
          </div>
        </div>
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

function DetailBlock({
  label,
  text,
  tone = 'neutral',
}: {
  label: string
  text: string
  tone?: 'neutral' | 'amber' | 'emerald'
}) {
  const styles = {
    neutral: 'bg-[#fafaf8] border-black/[0.05]',
    amber: 'bg-amber-50/70 border-amber-900/10',
    emerald: 'bg-emerald-50/70 border-emerald-900/10',
  }
  return (
    <div className={`rounded-xl border p-3 ${styles[tone]}`}>
      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1">{label}</p>
      <p className="text-[11px] text-neutral-700 leading-relaxed">{text}</p>
    </div>
  )
}
