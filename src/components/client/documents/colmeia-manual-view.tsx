import {
  MANUAL_META,
  MANUAL_NAV,
  MANUAL_HIGHLIGHTS,
  STACK_LAYERS,
  PERSONAS,
  AUTH_STEPS,
  MANUAL_FLOWS,
  ROTEIRO_PIPELINE,
  DATABRICKS_STEPS,
  BANCO_ATIVOS,
  MANUAL_MODULES,
  OOH_METRICS,
  ROUTE_REFERENCE,
  type Persona,
} from '@/components/client/documents/colmeia-manual-data'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import {
  BookOpen, Layers, Users, Workflow, Cpu, Database, Grid3x3, Gauge, Route,
  ExternalLink, ArrowRight, ArrowDown, CheckCircle2, ShieldCheck, Upload,
  MapPin, FileBarChart, Building2, UserCog, Store,
} from 'lucide-react'

const PERSONA_TONE: Record<Persona['tone'], { dot: string; chip: string; icon: typeof Users }> = {
  be: { dot: 'bg-teal-500', chip: 'border-teal-200 bg-teal-50 text-teal-800', icon: Building2 },
  agencia: { dot: 'bg-violet-500', chip: 'border-violet-200 bg-violet-50 text-violet-800', icon: Users },
  exibidor: { dot: 'bg-amber-500', chip: 'border-amber-200 bg-amber-50 text-amber-800', icon: Store },
  admin: { dot: 'bg-neutral-800', chip: 'border-black/[0.1] bg-neutral-100 text-neutral-700', icon: UserCog },
}

const PIPELINE_TONE: Record<string, string> = {
  input: 'border-teal-200 bg-teal-50 text-teal-900',
  process: 'border-black/[0.08] bg-white text-neutral-800',
  compute: 'border-violet-200 bg-violet-50 text-violet-900',
  output: 'border-neutral-900 bg-neutral-900 text-white',
}

const MODULE_ICONS: Record<string, typeof MapPin> = {
  'meus-roteiros': FileBarChart,
  'criar-roteiro': Workflow,
  mapa: MapPin,
  resultados: Gauge,
  p1a: FileBarChart,
  banco: Database,
  exibidor: Store,
  endereco: MapPin,
  admin: UserCog,
}

export function ColmeiaManualView({
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
        eyebrow={`${MANUAL_META.client} · Documentação de produto`}
        title={MANUAL_META.title}
        description={`${MANUAL_META.lead} Atualizado em ${MANUAL_META.updatedAt}.`}
        backHref={base}
      />

      {/* Nav âncora + highlights */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {MANUAL_NAV.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
          >
            {item.label}
          </a>
        ))}
        <a
          href={MANUAL_META.notionHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/[0.08] bg-[#fafaf8] px-3 py-1.5 text-[11px] font-medium text-neutral-400 hover:text-neutral-800 inline-flex items-center gap-1.5"
        >
          Fonte no Notion
          <ExternalLink className="w-3 h-3" strokeWidth={2} />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        {MANUAL_HIGHLIGHTS.map(item => (
          <div key={item.label} className="rounded-2xl border border-black/[0.06] bg-white p-4">
            <p className="text-[22px] font-semibold tracking-[-0.03em] text-neutral-900 leading-none">
              {item.value}
            </p>
            <p className="text-[11px] text-neutral-500 mt-2 leading-snug">{item.label}</p>
          </div>
        ))}
      </div>

      {/* O que é */}
      <Section id="visao" title="O que é o Colmeia" subtitle="Planejamento OOH ponta a ponta, em modelo SaaS multi-tenant" icon={BookOpen}>
        <div className="rounded-2xl border border-teal-900/10 bg-teal-50/40 p-6">
          <p className="text-[14px] text-neutral-700 leading-relaxed max-w-3xl">
            <span className="font-semibold text-neutral-900">Colmeia · Meus Roteiros</span> permite simular e comparar
            planos de mídia com base em localização, período, tipo de mídia e alvo demográfico — gerando cobertura,
            frequência, impactos, TRP e CPM. A Be180 opera internamente, agências acessam roteiros liberados e
            exibidores mantêm o inventário pelo portal próprio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            {[
              { t: 'Be180', d: 'Planeja, simula e opera campanhas internamente.' },
              { t: 'Agências', d: 'Consultam e comparam roteiros liberados.' },
              { t: 'Exibidores', d: 'Atualizam inventário OOH pelo portal.' },
            ].map(item => (
              <div key={item.t} className="rounded-xl border border-teal-900/10 bg-white/80 p-4">
                <p className="text-[13px] font-semibold text-neutral-900">{item.t}</p>
                <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Arquitetura / stack */}
      <Section id="stack" title="Arquitetura em camadas" subtitle="Do usuário ao dado — o que sustenta cada tela" icon={Layers}>
        <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5 sm:p-6">
          <div className="max-w-2xl mx-auto space-y-0">
            {STACK_LAYERS.map((layer, index) => {
              const tone =
                layer.tone === 'accent'
                  ? 'border-transparent text-white'
                  : layer.tone === 'dark'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : layer.tone === 'teal'
                      ? 'border-teal-200 bg-teal-50 text-teal-950'
                      : 'border-black/[0.08] bg-white text-neutral-900'
              return (
                <div key={layer.id}>
                  <div
                    className={`rounded-2xl border p-4 ${tone}`}
                    style={layer.tone === 'accent' ? { backgroundColor: accent } : undefined}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="text-[13px] font-semibold">{layer.label}</p>
                      <p className={`text-[11px] font-mono ${
                        layer.tone === 'accent' || layer.tone === 'dark' ? 'text-white/70' : 'text-neutral-500'
                      }`}>
                        {layer.tech}
                      </p>
                    </div>
                    <p className={`text-[11px] leading-relaxed mt-1 ${
                      layer.tone === 'accent' || layer.tone === 'dark' ? 'text-white/60' : 'opacity-60'
                    }`}>
                      {layer.detail}
                    </p>
                  </div>
                  {index < STACK_LAYERS.length - 1 && (
                    <div className="h-6 flex items-center justify-center">
                      <ArrowDown className="w-4 h-4 text-neutral-300" strokeWidth={1.75} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Personas & acesso */}
      <Section id="personas" title="Personas & controle de acesso" subtitle="Quem entra, o que vê e o modelo multi-tenant" icon={Users}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {PERSONAS.map(persona => {
            const tone = PERSONA_TONE[persona.tone]
            const Icon = tone.icon
            return (
              <article key={persona.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#fafaf8] border border-black/[0.05] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-neutral-700" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-neutral-900 leading-tight">{persona.name}</p>
                    <p className="text-[10px] font-mono text-neutral-400">{persona.identity}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {persona.screens.map(screen => (
                    <span key={screen} className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${tone.chip}`}>
                      {screen}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed flex items-start gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${tone.dot}`} />
                  {persona.restriction}
                </p>
              </article>
            )
          })}
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-4">
            Autenticação — do login ao contexto de acesso
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {AUTH_STEPS.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-3 h-full">
                  <span
                    className="inline-flex w-6 h-6 rounded-full text-white text-[11px] font-semibold items-center justify-center mb-2"
                    style={{ backgroundColor: accent }}
                  >
                    {step.step}
                  </span>
                  <p className="text-[12px] font-semibold text-neutral-900">{step.title}</p>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{step.detail}</p>
                </div>
                {index < AUTH_STEPS.length - 1 && (
                  <ArrowRight className="hidden sm:block absolute -right-[9px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300 z-10" strokeWidth={2} />
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Fluxos */}
      <Section id="fluxos" title="Fluxos ponta a ponta" subtitle="Os três caminhos principais, do ponto de vista de cada persona" icon={Workflow}>
        <div className="space-y-3">
          {MANUAL_FLOWS.map(flow => (
            <article key={flow.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="rounded-md bg-neutral-900 text-white px-2 py-0.5 text-[10px] font-mono font-semibold">
                  {flow.code}
                </span>
                <h3 className="text-[14px] font-semibold text-neutral-900">{flow.title}</h3>
                <span className="text-[11px] text-neutral-400 ml-auto">{flow.persona}</span>
              </div>
              <div className="flex flex-wrap items-stretch gap-2">
                {flow.steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="rounded-lg border border-black/[0.07] bg-[#fafaf8] px-3 py-2 max-w-[220px]">
                      <span className="text-[9px] font-mono text-neutral-400">{String(index + 1).padStart(2, '0')}</span>
                      <p className="text-[11px] text-neutral-700 leading-snug">{step}</p>
                    </div>
                    {index < flow.steps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0" strokeWidth={2} />
                    )}
                  </div>
                ))}
              </div>
              {flow.note && (
                <p className="text-[11px] text-neutral-400 mt-3 leading-relaxed border-t border-black/[0.05] pt-3">
                  {flow.note}
                </p>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* Pipeline */}
      <Section id="pipeline" title="Pipeline do roteiro" subtitle="Do upload aos resultados — com o processamento Databricks no centro" icon={Cpu}>
        <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5 sm:p-6 mb-3">
          <div className="overflow-x-auto">
            <div className="flex items-stretch gap-2 min-w-[720px]">
              {ROTEIRO_PIPELINE.map((node, index) => (
                <div key={node.id} className="flex items-center gap-2 flex-1">
                  <div className={`rounded-xl border p-4 flex-1 ${PIPELINE_TONE[node.kind]}`}>
                    <p className="text-[12px] font-semibold leading-tight">{node.label}</p>
                    <p className={`text-[10px] leading-snug mt-1.5 ${node.kind === 'output' ? 'text-white/60' : 'opacity-60'}`}>
                      {node.detail}
                    </p>
                  </div>
                  {index < ROTEIRO_PIPELINE.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-neutral-300 flex-shrink-0" strokeWidth={2} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-200/70 bg-violet-50/40 p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-violet-800/70 mb-3">
            Dentro do Databricks
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DATABRICKS_STEPS.map((step, index) => (
              <div key={step.id} className="relative rounded-xl border border-violet-200/70 bg-white p-3">
                <p className="text-[12px] font-mono font-semibold text-violet-900">{step.label}</p>
                <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{step.detail}</p>
                {index < DATABRICKS_STEPS.length - 1 && (
                  <ArrowRight className="hidden sm:block absolute -right-[9px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-violet-300 z-10" strokeWidth={2} />
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Banco de Ativos */}
      <Section id="banco" title="Banco de Ativos" subtitle="O inventário OOH sobre duas camadas de dados" icon={Database}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {BANCO_ATIVOS.roles.map(role => (
            <div key={role.id} className="rounded-xl border border-black/[0.06] bg-white p-4">
              <p className="text-[12px] font-semibold text-neutral-900">{role.label}</p>
              <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{role.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf8] p-5 sm:p-6 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 text-center mb-4">
            UI Banco de Ativos consome duas camadas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BANCO_ATIVOS.layers.map(layer => (
              <div key={layer.id} className="rounded-2xl border border-black/[0.08] bg-white p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 flex-shrink-0" style={{ color: accent }} strokeWidth={1.75} />
                  <p className="text-[13px] font-semibold text-neutral-900">{layer.label}</p>
                </div>
                <span className="inline-block rounded-full border border-black/[0.08] bg-[#fafaf8] px-2 py-0.5 text-[10px] font-medium text-neutral-500 mb-2">
                  {layer.use}
                </span>
                <p className="text-[12px] text-neutral-500 leading-relaxed mb-3">{layer.detail}</p>
                <div className="flex flex-wrap gap-1.5">
                  {layer.handlers.map(h => (
                    <span key={h} className="rounded-md bg-[#f3f3f0] px-2 py-0.5 text-[10px] font-mono text-neutral-500">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-3">
              Filtros de busca
            </p>
            <div className="flex flex-wrap gap-1.5">
              {BANCO_ATIVOS.filters.map(f => (
                <span key={f} className="rounded-md border border-black/[0.07] bg-[#fafaf8] px-2 py-1 text-[11px] text-neutral-600">
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-3">
              KPIs do dashboard
            </p>
            <ul className="space-y-1.5">
              {BANCO_ATIVOS.kpis.map(k => (
                <li key={k} className="flex items-start gap-2 text-[12px] text-neutral-600 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Módulos */}
      <Section id="modulos" title="Módulos do produto" subtitle="Nove áreas em operação e suas rotas" icon={Grid3x3}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MANUAL_MODULES.map(module => {
            const Icon = MODULE_ICONS[module.id] ?? Grid3x3
            return (
              <div key={module.id} className="rounded-2xl border border-black/[0.06] bg-white p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accent}12`, color: accent }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <p className="text-[13px] font-semibold text-neutral-900 leading-tight">{module.name}</p>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">{module.desc}</p>
                <div className="flex items-center justify-between gap-2 mt-auto pt-3">
                  <span className="text-[10px] font-mono text-neutral-400">{module.route}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${
                      module.status === 'Produção'
                        ? 'border-teal-200 bg-teal-50 text-teal-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {module.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Métricas OOH */}
      <Section id="metricas" title="Métricas OOH" subtitle="O glossário que sustenta os resultados do planejamento" icon={Gauge}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OOH_METRICS.map(metric => (
            <div key={metric.id} className="rounded-2xl border border-black/[0.06] bg-white p-4">
              <p className="text-[14px] font-semibold text-neutral-900">{metric.term}</p>
              <p className="text-[12px] text-neutral-500 mt-1.5 leading-relaxed">{metric.definition}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Rotas & APIs */}
      <Section id="rotas" title="Rotas & APIs" subtitle="Referência rápida de onde cada fluxo acontece" icon={Route}>
        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
          <div className="grid grid-cols-[0.8fr_1.1fr_1.4fr] gap-3 bg-[#fafaf8] px-5 py-2.5 border-b border-black/[0.06]">
            {['Área', 'Rota', 'API / procedure'].map(col => (
              <span key={col} className="text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400">
                {col}
              </span>
            ))}
          </div>
          {ROUTE_REFERENCE.map(row => (
            <div
              key={row.area}
              className="grid grid-cols-[0.8fr_1.1fr_1.4fr] gap-3 px-5 py-3 border-b border-black/[0.04] last:border-b-0 items-center"
            >
              <span className="text-[12px] font-medium text-neutral-800">{row.area}</span>
              <span className="text-[11px] font-mono text-neutral-500">{row.route}</span>
              <span className="text-[11px] font-mono text-neutral-400">{row.api}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Rodapé */}
      <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-300 flex-shrink-0" strokeWidth={1.75} />
          <div>
            <p className="text-[14px] font-semibold">Manual vivo do Colmeia</p>
            <p className="text-[12px] text-white/50 mt-0.5">Evolui junto com o produto — sincronizado com o Banco de Ativos e a Adaptive Layer™.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={MANUAL_META.notionHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 text-white text-[12px] font-medium px-4 py-2 hover:bg-white/10"
          >
            <Upload className="w-3.5 h-3.5" strokeWidth={2} />
            Fonte no Notion
          </a>
        </div>
      </div>
    </div>
  )
}

function Section({
  id,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  id: string
  title: string
  subtitle: string
  icon: typeof Layers
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-20">
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
