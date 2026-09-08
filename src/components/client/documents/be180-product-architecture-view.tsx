'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  CircleDot,
  Database,
  FileCheck2,
  GitBranch,
  Layers3,
  Map,
  Milestone,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import {
  AS_IS_ARCHITECTURE,
  AGENT_OPERATING_MODEL,
  BE180_PRODUCT_ARCHITECTURE_META,
  DOCUMENT_NAV,
  EVIDENCE_LEGEND,
  EXECUTIVE_SUMMARY,
  FEATURE_MAP,
  PORTFOLIO,
  PRODUCT_JOURNEYS,
  REPOSITORY_MAP,
  RISKS_AND_DECISIONS,
  ROADMAP,
  SUCCESS_METRICS,
  TARGET_ARCHITECTURE,
  TARGET_FLOWS,
  UNIFIED_ARCHITECTURE_BLUEPRINT,
  type EvidenceLevel,
  type FeatureStatus,
} from './be180-product-architecture-data'

const EVIDENCE_STYLES: Record<EvidenceLevel, string> = {
  confirmado: 'border-teal-200 bg-teal-50 text-teal-800',
  observado: 'border-amber-200 bg-amber-50 text-amber-800',
  proposto: 'border-violet-200 bg-violet-50 text-violet-800',
}

const STATUS_STYLES: Record<FeatureStatus, string> = {
  'Em produção': 'border-teal-200 bg-teal-50 text-teal-800',
  'Em evolução': 'border-blue-200 bg-blue-50 text-blue-800',
  Gap: 'border-amber-200 bg-amber-50 text-amber-800',
  Proposta: 'border-violet-200 bg-violet-50 text-violet-800',
}

const PRODUCT_STYLES: Record<string, string> = {
  Colmeia: 'border-sky-200 bg-sky-50 text-sky-800',
  'Banco de Ativos': 'border-teal-200 bg-teal-50 text-teal-800',
  Visibilidade: 'border-violet-200 bg-violet-50 text-violet-800',
  Plataforma: 'border-neutral-300 bg-neutral-100 text-neutral-700',
}

export function Be180ProductArchitectureView({
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
        eyebrow={`${BE180_PRODUCT_ARCHITECTURE_META.client} · Documento técnico-executivo`}
        title={BE180_PRODUCT_ARCHITECTURE_META.title}
        description={`${BE180_PRODUCT_ARCHITECTURE_META.lead} Atualizado em ${BE180_PRODUCT_ARCHITECTURE_META.updatedAt}.`}
        backHref={base}
      />

      <nav
        aria-label="Navegação do documento"
        className="sticky top-16 z-30 -mx-4 mb-10 overflow-x-auto border-y border-black/[0.06] bg-[#fbfbfa]/95 px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        <div className="flex min-w-max gap-1">
          {DOCUMENT_NAV.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={event => {
                event.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                window.history.replaceState(null, '', `#${item.id}`)
              }}
              className="rounded-full px-3 py-1.5 text-[11px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="resumo" className="scroll-mt-32">
        <div className="overflow-hidden rounded-3xl bg-neutral-950 text-white">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.35fr_0.65fr] lg:p-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-teal-300">
                Norte do produto
              </p>
              <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                Três produtos. Uma jornada OOH.
              </h2>
              <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-white/60">
                {EXECUTIVE_SUMMARY.thesis}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
              {EXECUTIVE_SUMMARY.signals.map(signal => (
                <div key={signal.label} className="bg-white/[0.04] p-4">
                  <p className="font-mono text-xl font-semibold text-white">{signal.value}</p>
                  <p className="mt-1 text-[10px] leading-snug text-white/45">{signal.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {EXECUTIVE_SUMMARY.principles.map((item, index) => (
              <div
                key={item.title}
                className="border-b border-white/10 p-5 last:border-b-0 sm:border-r lg:border-b-0"
              >
                <span className="font-mono text-[10px] text-teal-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-[13px] font-semibold">{item.title}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {EVIDENCE_LEGEND.map(item => (
            <div key={item.level} className="rounded-xl border border-black/[0.06] bg-white p-4">
              <EvidenceBadge level={item.level} />
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <DocumentSection
        id="portfolio"
        icon={Boxes}
        title="Mapa do portfólio"
        subtitle="O papel de cada produto e como o valor se completa."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {PORTFOLIO.map((product, index) => (
            <article key={product.id} className="flex flex-col rounded-2xl border border-black/[0.07] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] text-neutral-300">
                    P{String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 text-[16px] font-semibold tracking-tight text-neutral-900">
                    {product.name}
                  </h3>
                </div>
                <EvidenceBadge level={product.evidence} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <SmallPill>{product.role}</SmallPill>
                <SmallPill>{product.state}</SmallPill>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-neutral-600">{product.outcome}</p>
              <ul className="mt-4 space-y-1.5">
                {product.capabilities.map(item => (
                  <li key={item} className="flex gap-2 text-[11px] leading-relaxed text-neutral-500">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-teal-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-black/[0.05] pt-4">
                {product.repositories.map(repo => (
                  <p key={repo} className="truncate font-mono text-[9px] text-neutral-400">
                    {repo}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="flex min-w-[780px] items-center gap-3 rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5">
            <PortfolioNode label="Briefing" detail="demanda" />
            <FlowArrow />
            <PortfolioNode label="Colmeia" detail="planejar" strong />
            <FlowArrow />
            <PortfolioNode label="Banco de Ativos" detail="selecionar" />
            <FlowArrow />
            <PortfolioNode label="Campanha" detail="operar" strong />
            <FlowArrow />
            <PortfolioNode label="Visibilidade" detail="comprovar" />
            <FlowArrow />
            <PortfolioNode label="Aprendizado" detail="enriquecer" />
          </div>
        </div>
      </DocumentSection>

      <DocumentSection
        id="features"
        icon={Map}
        title="Mapa de features"
        subtitle="Capacidades existentes, em evolução e propostas — por domínio e fase."
      >
        <div className="space-y-4">
          {FEATURE_MAP.map(domain => (
            <article key={domain.id} className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
              <div className="flex flex-col gap-3 border-b border-black/[0.06] bg-[#fafaf8] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-neutral-900">{domain.title}</h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${PRODUCT_STYLES[domain.product]}`}
                    >
                      {domain.product}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-500">{domain.goal}</p>
                </div>
                <span className="font-mono text-[10px] text-neutral-300">
                  {domain.features.length} capacidades
                </span>
              </div>
              <div className="divide-y divide-black/[0.05]">
                {domain.features.map(feature => (
                  <div
                    key={feature.name}
                    className="grid gap-2 px-5 py-3.5 sm:grid-cols-[minmax(160px,0.75fr)_minmax(260px,1.5fr)_auto] sm:items-center"
                  >
                    <p className="text-[12px] font-semibold text-neutral-800">{feature.name}</p>
                    <p className="text-[11px] leading-relaxed text-neutral-500">{feature.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${STATUS_STYLES[feature.status]}`}
                      >
                        {feature.status}
                      </span>
                      <span className="rounded-full border border-black/[0.07] px-2 py-0.5 font-mono text-[9px] text-neutral-400">
                        {feature.phase}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </DocumentSection>

      <DocumentSection
        id="jornadas"
        icon={Route}
        title="Jornadas e integrações"
        subtitle="Onde cada produto entra — e qual valor precisa voltar ao fluxo."
      >
        <div className="space-y-4">
          {PRODUCT_JOURNEYS.map(journey => (
            <article key={journey.id} className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[14px] font-semibold text-neutral-900">{journey.title}</h3>
                  <p className="mt-1 text-[11px] text-neutral-500">{journey.persona}</p>
                </div>
                <EvidenceBadge level={journey.evidence} />
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {journey.steps.map((step, index) => (
                  <div key={step.label} className="relative rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
                    <p className="font-mono text-[9px] text-neutral-300">
                      {String(index + 1).padStart(2, '0')} · {step.product}
                    </p>
                    <p className="mt-2 text-[11px] font-medium leading-relaxed text-neutral-700">{step.label}</p>
                    {index < journey.steps.length - 1 && (
                      <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-neutral-300 lg:block" />
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </DocumentSection>

      <DocumentSection
        id="arquitetura"
        icon={Network}
        title={AS_IS_ARCHITECTURE.title}
        subtitle={AS_IS_ARCHITECTURE.subtitle}
      >
        <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-4 sm:p-6">
          <div className="mx-auto max-w-4xl space-y-2">
            {AS_IS_ARCHITECTURE.layers.map((layer, index) => (
              <div key={layer.id}>
                <div className="rounded-xl border border-black/[0.07] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-neutral-900">{layer.label}</p>
                    <EvidenceBadge level={layer.evidence} />
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {layer.components.map(component => (
                      <div
                        key={component}
                        className="rounded-lg border border-black/[0.05] bg-[#fafaf8] px-3 py-2 text-[10px] leading-relaxed text-neutral-600"
                      >
                        {component}
                      </div>
                    ))}
                  </div>
                </div>
                {index < AS_IS_ARCHITECTURE.layers.length - 1 && (
                  <ArrowDown className="mx-auto my-1 h-4 w-4 text-neutral-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {REPOSITORY_MAP.map(repo => (
            <div key={repo.name} className="rounded-xl border border-black/[0.07] bg-white p-4">
              <div className="flex items-start gap-3">
                <GitBranch className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
                <div className="min-w-0">
                  <p className="truncate font-mono text-[10px] font-medium text-neutral-700">{repo.name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-neutral-900">{repo.domain}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-neutral-500">{repo.responsibility}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800/70">
            Restrições do as-is
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {AS_IS_ARCHITECTURE.constraints.map(item => (
              <li key={item} className="flex gap-2 text-[11px] leading-relaxed text-amber-950/70">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </DocumentSection>

      <DocumentSection
        id="blueprint"
        icon={Workflow}
        title={UNIFIED_ARCHITECTURE_BLUEPRINT.title}
        subtitle={UNIFIED_ARCHITECTURE_BLUEPRINT.subtitle}
      >
        <div className="overflow-x-auto rounded-3xl border border-black/[0.08] bg-[#f7f7f4]">
          <div
            className="min-w-[1120px] p-5 sm:p-7"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(23,23,23,0.12) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <div className="mb-5 flex items-center justify-between rounded-xl border border-black/[0.07] bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-teal-400" />
                <span className="ml-2 font-mono text-[9px] text-neutral-400">
                  BE180 · PRODUCT + ENGINEERING BLUEPRINT
                </span>
              </div>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-medium text-violet-700">
                visão alvo · M4
              </span>
            </div>

            <div className="grid grid-cols-[1fr_220px_1.35fr] gap-5">
              <BlueprintZone label={UNIFIED_ARCHITECTURE_BLUEPRINT.current.label} tone="current">
                {UNIFIED_ARCHITECTURE_BLUEPRINT.current.groups.map(group => (
                  <BlueprintGroup key={group.label} label={group.label} items={group.items} />
                ))}
              </BlueprintZone>

              <div className="flex flex-col justify-center">
                <div className="relative rounded-2xl border border-dashed border-amber-400/60 bg-amber-50/90 p-4 shadow-sm">
                  <ArrowRight className="absolute -left-4 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-amber-300 bg-white p-1.5 text-amber-600" />
                  <ArrowRight className="absolute -right-4 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-amber-300 bg-white p-1.5 text-amber-600" />
                  <p className="text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-800">
                    {UNIFIED_ARCHITECTURE_BLUEPRINT.transition.label}
                  </p>
                  <div className="mt-3 space-y-2">
                    {UNIFIED_ARCHITECTURE_BLUEPRINT.transition.items.map((item, index) => (
                      <div key={item} className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-2.5 py-2">
                        <span className="font-mono text-[8px] text-amber-500">{String(index + 1).padStart(2, '0')}</span>
                        <span className="text-[9px] font-medium text-amber-950/75">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <BlueprintZone label={UNIFIED_ARCHITECTURE_BLUEPRINT.future.label} tone="future">
                {UNIFIED_ARCHITECTURE_BLUEPRINT.future.groups.map(group => (
                  <BlueprintGroup
                    key={group.label}
                    label={group.label}
                    items={group.items}
                    highlight={group.label === 'Adaptive Layer™' || group.label === 'Squad de agentes'}
                  />
                ))}
              </BlueprintZone>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              {UNIFIED_ARCHITECTURE_BLUEPRINT.outcomes.map((outcome, index) => (
                <div key={outcome} className="rounded-xl border border-teal-200 bg-teal-50/90 px-3 py-2.5 text-center shadow-sm">
                  <span className="font-mono text-[8px] text-teal-500">O{index + 1}</span>
                  <p className="mt-0.5 text-[9px] font-semibold text-teal-900">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-neutral-400">
          Leia da esquerda para a direita. O futuro preserva os produtos e serviços existentes, mas troca integrações
          implícitas por contratos, contexto compartilhado e execução governada.
        </p>
      </DocumentSection>

      <DocumentSection
        id="alvo"
        icon={Layers3}
        title={TARGET_ARCHITECTURE.title}
        subtitle={TARGET_ARCHITECTURE.subtitle}
      >
        <div className="overflow-hidden rounded-3xl bg-neutral-950 p-4 text-white sm:p-7">
          <div className="mx-auto max-w-4xl space-y-2">
            {TARGET_ARCHITECTURE.layers.map((layer, index) => (
              <div key={layer.id}>
                <div
                  className={`rounded-2xl border p-4 ${
                    layer.id === 'layer'
                      ? 'border-teal-300/40 bg-teal-300 text-neutral-950'
                      : 'border-white/10 bg-white/[0.055]'
                  }`}
                >
                  <div className="grid gap-3 sm:grid-cols-[0.55fr_1.1fr_1.35fr] sm:items-center">
                    <p className="text-[13px] font-semibold">{layer.label}</p>
                    <p className={`text-[11px] ${layer.id === 'layer' ? 'text-neutral-700' : 'text-white/55'}`}>
                      {layer.detail}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {layer.responsibilities.map(item => (
                        <span
                          key={item}
                          className={`rounded-full border px-2 py-0.5 text-[9px] ${
                            layer.id === 'layer'
                              ? 'border-neutral-900/15 bg-white/40 text-neutral-800'
                              : 'border-white/10 bg-white/[0.04] text-white/50'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {index < TARGET_ARCHITECTURE.layers.length - 1 && (
                  <ArrowDown className="mx-auto my-1 h-4 w-4 text-white/25" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {TARGET_FLOWS.map(flow => (
            <article key={flow.id} className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                {flow.trigger}
              </p>
              <div className="mt-4 space-y-2">
                {flow.flow.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 font-mono text-[8px] text-neutral-500">
                      {index + 1}
                    </span>
                    <p className="text-[10px] text-neutral-600">{step}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-black/[0.05] pt-3 text-[11px] font-medium leading-relaxed text-neutral-800">
                {flow.result}
              </p>
            </article>
          ))}
        </div>
      </DocumentSection>

      <DocumentSection
        id="agentes"
        icon={Bot}
        title={AGENT_OPERATING_MODEL.title}
        subtitle={AGENT_OPERATING_MODEL.subtitle}
      >
        <div className="overflow-x-auto rounded-3xl bg-neutral-950 p-4 text-white sm:p-6">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-6 gap-2">
              {AGENT_OPERATING_MODEL.agents.map(agent => (
                <article key={agent.id} className="rounded-xl border border-violet-300/20 bg-violet-400/[0.08] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[8px] text-violet-300">{agent.stage}</span>
                    <span className="rounded-full bg-violet-300/10 px-1.5 py-0.5 font-mono text-[8px] text-violet-200">
                      {agent.phase}
                    </span>
                  </div>
                  <Bot className="mt-3 h-4 w-4 text-violet-300" />
                  <p className="mt-2 text-[11px] font-semibold">{agent.name}</p>
                  <p className="mt-1 text-[9px] leading-relaxed text-white/45">{agent.role}</p>
                </article>
              ))}
            </div>

            <ArrowDown className="mx-auto my-2 h-5 w-5 text-violet-300/50" />
            <div className="rounded-2xl border border-teal-300/30 bg-teal-300 p-4 text-neutral-950">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold">Adaptive Layer™ · runtime dos agentes</p>
                <span className="font-mono text-[8px] text-neutral-600">contexto autorizado · execução rastreável</span>
              </div>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {AGENT_OPERATING_MODEL.layer.map(item => (
                  <div key={item} className="rounded-lg border border-neutral-900/10 bg-white/45 px-2 py-2 text-center text-[9px] font-medium">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <ArrowDown className="mx-auto my-2 h-5 w-5 text-teal-300/50" />
            <div className="grid grid-cols-6 gap-2">
              {AGENT_OPERATING_MODEL.tools.map(item => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-center">
                  <Database className="mx-auto h-3.5 w-3.5 text-white/35" />
                  <p className="mt-1.5 text-[9px] text-white/55">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          <article className="rounded-2xl border border-black/[0.07] bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
              Controle operacional
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {AGENT_OPERATING_MODEL.control.map(item => (
                <div key={item} className="flex gap-2 rounded-lg bg-[#fafaf8] px-3 py-2.5 text-[10px] leading-relaxed text-neutral-600">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-violet-600" />
                  {item}
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
              Loop de cada execução
            </p>
            <div className="mt-4 flex min-w-0 items-center gap-1.5">
              {AGENT_OPERATING_MODEL.loop.map((step, index) => (
                <div key={step} className="contents">
                  <div className="min-w-0 flex-1 rounded-lg border border-black/[0.06] bg-white px-2 py-3 text-center">
                    <span className="font-mono text-[8px] text-violet-500">{String(index + 1).padStart(2, '0')}</span>
                    <p className="mt-1 text-[9px] font-medium leading-tight text-neutral-700">{step}</p>
                  </div>
                  {index < AGENT_OPERATING_MODEL.loop.length - 1 && (
                    <ArrowRight className="h-3 w-3 flex-shrink-0 text-neutral-300" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-neutral-500">
              O handoff humano não é exceção: faz parte do fluxo e diminui somente quando qualidade, custo e risco
              atingem os critérios de saída definidos para cada agente.
            </p>
          </article>
        </div>
      </DocumentSection>

      <DocumentSection
        id="roadmap"
        icon={Milestone}
        title="Roadmap integrado M0–M4"
        subtitle="Fases por dependência, com entregáveis e critérios explícitos de saída."
      >
        <div className="relative">
          <div className="absolute bottom-6 left-[19px] top-6 w-px bg-black/[0.08]" />
          <div className="space-y-4">
            {ROADMAP.map((milestone, index) => (
              <article key={milestone.id} className="relative pl-12">
                <div
                  className="absolute left-0 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#fbfbfa] font-mono text-[10px] font-semibold text-white"
                  style={{ backgroundColor: index === 0 ? '#171717' : accent }}
                >
                  {milestone.id}
                </div>
                <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-[15px] font-semibold text-neutral-900">{milestone.title}</h3>
                      <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-neutral-500">
                        {milestone.outcome}
                      </p>
                    </div>
                    <span className="whitespace-nowrap rounded-full border border-black/[0.07] px-2.5 py-1 font-mono text-[9px] text-neutral-500">
                      {milestone.window}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <RoadmapList title="Dependências" items={milestone.dependencies} />
                    <RoadmapList title="Entregáveis" items={milestone.deliverables} />
                    <RoadmapList title="Critérios de saída" items={milestone.acceptance} />
                  </div>
                  <p className="mt-4 border-t border-black/[0.05] pt-3 text-[9px] text-neutral-400">
                    Owners sugeridos · {milestone.owners.join(' · ')}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </DocumentSection>

      <DocumentSection
        id="riscos"
        icon={ShieldCheck}
        title="Riscos, decisões & métricas"
        subtitle="O que pode comprometer o roadmap e como medir se a arquitetura está entregando valor."
      >
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-3">
            {RISKS_AND_DECISIONS.risks.map(risk => (
              <article key={risk.title} className="rounded-xl border border-black/[0.07] bg-white p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                  <div>
                    <h3 className="text-[12px] font-semibold text-neutral-900">{risk.title}</h3>
                    <p className="mt-1 text-[10px] leading-relaxed text-neutral-500">{risk.evidence}</p>
                    <p className="mt-2 text-[10px] leading-relaxed text-neutral-700">
                      <span className="font-semibold">Mitigação:</span> {risk.mitigation}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="rounded-2xl bg-neutral-950 p-5 text-white">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-teal-300" />
              <h3 className="text-[13px] font-semibold">Decisões de arquitetura</h3>
            </div>
            <ol className="mt-4 space-y-3">
              {RISKS_AND_DECISIONS.decisions.map((decision, index) => (
                <li key={decision} className="flex gap-3 text-[10px] leading-relaxed text-white/60">
                  <span className="font-mono text-teal-300">{String(index + 1).padStart(2, '0')}</span>
                  {decision}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
          <div className="border-b border-black/[0.06] bg-[#fafaf8] px-5 py-4">
            <h3 className="text-[13px] font-semibold text-neutral-900">Scorecard de sucesso</h3>
            <p className="mt-1 text-[10px] text-neutral-500">
              Metas numéricas devem ser pactuadas no M0 após validação do baseline.
            </p>
          </div>
          <div className="divide-y divide-black/[0.05]">
            {SUCCESS_METRICS.map(item => (
              <div
                key={item.metric}
                className="grid gap-2 px-5 py-3.5 sm:grid-cols-[0.55fr_1.4fr_0.8fr_0.8fr] sm:items-center"
              >
                <span className="text-[10px] font-semibold text-teal-700">{item.domain}</span>
                <span className="text-[11px] text-neutral-700">{item.metric}</span>
                <span className="text-[10px] text-neutral-400">{item.baseline}</span>
                <span className="text-[10px] font-medium text-neutral-600">{item.target}</span>
              </div>
            ))}
          </div>
        </div>
      </DocumentSection>

      <section className="rounded-3xl border border-black/[0.06] bg-neutral-950 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-300">
              <Sparkles className="h-4 w-4" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Próximo passo</p>
            </div>
            <h2 className="mt-3 text-[18px] font-semibold">Validar M0 com produto e engenharia.</h2>
            <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-white/50">
              Fechar owners, contratos, baseline e critérios de saída antes de transformar propostas em compromisso.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`${base}/backlog`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-medium text-neutral-900"
            >
              Abrir backlog
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={`${base}/documentos`}
              className="rounded-full border border-white/20 px-4 py-2 text-[11px] font-medium text-white"
            >
              Documentos
            </Link>
          </div>
        </div>
      </section>

      <p className="mt-5 text-[9px] leading-relaxed text-neutral-400">
        Fontes: {BE180_PRODUCT_ARCHITECTURE_META.sources.join(' · ')}
      </p>
    </div>
  )
}

function DocumentSection({
  id,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  id: string
  icon: typeof Target
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-32 py-12 sm:py-14">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-black/[0.04]">
          <Icon className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-[19px] font-semibold tracking-tight text-neutral-900">{title}</h2>
          <p className="mt-0.5 text-[12px] text-neutral-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-medium capitalize ${EVIDENCE_STYLES[level]}`}
    >
      {level}
    </span>
  )
}

function SmallPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-black/[0.07] bg-[#fafaf8] px-2 py-0.5 text-[9px] text-neutral-500">
      {children}
    </span>
  )
}

function PortfolioNode({
  label,
  detail,
  strong = false,
}: {
  label: string
  detail: string
  strong?: boolean
}) {
  return (
    <div
      className={`min-w-[108px] flex-1 rounded-xl border p-3 text-center ${
        strong ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-black/[0.07] bg-white text-neutral-900'
      }`}
    >
      <p className="text-[11px] font-semibold">{label}</p>
      <p className={`mt-1 text-[9px] ${strong ? 'text-white/45' : 'text-neutral-400'}`}>{detail}</p>
    </div>
  )
}

function FlowArrow() {
  return <ArrowRight className="h-4 w-4 flex-shrink-0 text-neutral-300" />
}

function BlueprintZone({
  label,
  tone,
  children,
}: {
  label: string
  tone: 'current' | 'future'
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        tone === 'future' ? 'border-teal-300/70 bg-teal-50/75' : 'border-neutral-300 bg-white/75'
      }`}
    >
      <p className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] ${tone === 'future' ? 'text-teal-800' : 'text-neutral-500'}`}>
        {label}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function BlueprintGroup({
  label,
  items,
  highlight = false,
}: {
  label: string
  items: string[]
  highlight?: boolean
}) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? 'border-violet-300 bg-violet-50' : 'border-black/[0.07] bg-white'}`}>
      <p className={`text-[9px] font-semibold uppercase tracking-[0.1em] ${highlight ? 'text-violet-700' : 'text-neutral-400'}`}>
        {label}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {items.map(item => (
          <div
            key={item}
            className={`rounded-lg border px-2 py-2 text-[9px] font-medium leading-tight ${
              highlight ? 'border-violet-200 bg-white text-violet-950' : 'border-black/[0.05] bg-[#fafaf8] text-neutral-600'
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function RoadmapList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">{title}</p>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item} className="flex gap-2 text-[10px] leading-relaxed text-neutral-600">
            <CircleDot className="mt-0.5 h-3 w-3 flex-shrink-0 text-teal-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
