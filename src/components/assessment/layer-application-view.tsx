'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import {
  ArchitectureFlow, AgentSquadMap, AgentLoop, AlertFlow, QwToLayerToAi,
} from '@/components/assessment/diagrams'
import type { AssessmentLayerApplication } from '@/lib/assessment/types'
import {
  Layers, Server, Bot, Sparkles, AlertTriangle, Cable, Braces, Workflow, ShieldCheck, BookOpen, ArrowRight,
} from 'lucide-react'

const CAPABILITY_ICONS = { integration: Cable, data: Braces, apis: Workflow, security: ShieldCheck } as const

export function LayerApplicationView({
  layer,
  basePath,
}: {
  layer: AssessmentLayerApplication
  basePath: string
}) {
  const locale = useLocale()

  return (
    <PageShell>
      <div className="mb-4"><Badge tone="green">{layer.eyebrow}</Badge></div>
      <PageHeader eyebrow="Adaptive Layer™" title={layer.title} subtitle={layer.lead} />

      {/* Link para metodologia */}
      <Reveal>
        <Link
          href={`/${locale}${basePath}/como-funciona`}
          className="mb-10 inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-[13px] text-neutral-700 hover:bg-black/[0.02] transition-colors"
        >
          <BookOpen className="w-4 h-4 text-neutral-500" strokeWidth={1.75} />
          Nova por aqui? Entenda o método antes da aplicação — <span className="font-medium text-neutral-900">Como funciona a Adaptive Layer™</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
      </Reveal>

      {/* Arquitetura */}
      <Section title="Arquitetura em uma vista" subtitle="Sistemas atuais → Adaptive Layer™ → o que a camada destrava" icon={Layers}>
        <ArchitectureFlow
          connects={layer.connects}
          unlocks={layer.unlocks}
          capabilities={layer.capabilities}
          systemsLabel="O que a Banana Brasil já tem — nada é substituído"
        />
      </Section>

      {/* Capacidades */}
      <Section title="Como a camada funciona entre o legado e a IA" subtitle="Quatro capacidades — o meio-campo entre sistemas e agentes" icon={Cable}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {layer.capabilities.map(cap => {
            const Icon = CAPABILITY_ICONS[cap.id]
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
      </Section>

      {/* Sistemas */}
      <Section title="Sistema atual" subtitle="O que a Banana Brasil já opera — e o papel de cada sistema na camada" icon={Server}>
        <div className="space-y-3">
          {layer.systems.map(system => (
            <article key={system.id} id={system.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <div className="flex flex-wrap items-start gap-2 mb-2">
                <h3 className="text-[15px] font-semibold text-neutral-900">{system.name}</h3>
                <Badge tone="muted">{system.owner}</Badge>
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

      {/* Agentes */}
      <Section title="Squad de agentes sobre a Layer" subtitle="Copilotos especializados — todos sobre a mesma verdade operacional" icon={Bot}>
        <AgentSquadMap agents={layer.agents} />
        <div className="mt-6">
          <p className="text-[12px] font-medium text-neutral-700 mb-3">Como cada agente opera</p>
          <AgentLoop />
        </div>
      </Section>

      {/* Alertas */}
      <Section title="Alertas inteligentes" subtitle="Um desvio, um alerta, um responsável — sem esperar o fechamento" icon={AlertTriangle}>
        <AlertFlow groups={layer.alerts} channel={layer.alertChannel} />
      </Section>

      {/* Quick wins */}
      <Section title="Quick wins na ordem certa" subtitle="Cada quick win limpa a operação e amplia a camada; a IA entra por último" icon={Sparkles}>
        <QwToLayerToAi quickWins={layer.quickWins} />
      </Section>
    </PageShell>
  )
}

function Section({
  title, subtitle, icon: Icon, children,
}: {
  title: string
  subtitle: string
  icon: typeof Layers
  children: React.ReactNode
}) {
  return (
    <Reveal>
      <section className="mb-12">
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
    </Reveal>
  )
}

function DetailBlock({ label, text, tone = 'neutral' }: { label: string; text: string; tone?: 'neutral' | 'amber' | 'emerald' }) {
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
