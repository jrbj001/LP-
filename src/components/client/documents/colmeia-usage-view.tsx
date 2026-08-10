import Link from 'next/link'
import {
  USAGE_META,
  USAGE_KPIS,
  ACTIVATION_FUNNEL,
  ENGAGEMENT_BANDS,
  PROFILE_BREAKDOWN,
  MONTHLY_ROTEIROS,
  ADOPTION_SERIES,
  ROTEIRO_TYPES,
  ROTEIRO_STATUS,
  INVENTORY_BATCHES,
  TOP_CREATORS,
  AI_SUMMARY,
  AI_INSIGHTS,
  COPILOT_QUESTIONS,
  type UsageInsight,
} from '@/components/client/documents/colmeia-usage-data'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import {
  Sparkles, TrendingUp, Users, Filter, ListChecks, Layers, Database,
  AlertTriangle, CheckCircle2, ArrowRight, ExternalLink, MessageSquare, Clock,
} from 'lucide-react'

const TONE_BAR: Record<string, string> = {
  good: 'bg-teal-500',
  warn: 'bg-amber-400',
  bad: 'bg-red-400',
  neutral: 'bg-neutral-300',
}

const LEVEL_STYLES: Record<UsageInsight['level'], { badge: string; card: string; icon: string }> = {
  'crítico': {
    badge: 'border-red-200 bg-red-50 text-red-700',
    card: 'border-red-200/70',
    icon: 'text-red-500',
  },
  'atenção': {
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    card: 'border-amber-200/70',
    icon: 'text-amber-500',
  },
  'positivo': {
    badge: 'border-teal-200 bg-teal-50 text-teal-700',
    card: 'border-teal-200/70',
    icon: 'text-teal-600',
  },
}

export function ColmeiaUsageView({
  locale,
  clientSlug,
  accent,
}: {
  locale: string
  clientSlug: string
  accent: string
}) {
  const base = `/${locale}/client/${clientSlug}`
  const maxMonthly = Math.max(...MONTHLY_ROTEIROS.map(m => m.value))
  const maxAdoption = Math.max(...ADOPTION_SERIES.map(m => m.value))
  const funnelMax = ACTIVATION_FUNNEL[0].value
  const totalBatches = INVENTORY_BATCHES.reduce((sum, b) => sum + b.value, 0)
  const totalTypes = ROTEIRO_TYPES.reduce((sum, t) => sum + t.value, 0)
  const totalStatus = ROTEIRO_STATUS.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${USAGE_META.client} · Dados de produção`}
        title={USAGE_META.title}
        description={`Adoção, engajamento, roteiros e inventário de exibidores com leitura assistida por IA. Gerado em ${USAGE_META.generatedAt}.`}
        backHref={base}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
          <Database className="w-3.5 h-3.5" strokeWidth={1.75} />
          {USAGE_META.source}
        </span>
        <a
          href={USAGE_META.notionHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-900"
        >
          Ver base detalhada por usuário
          <ExternalLink className="w-3 h-3" strokeWidth={2} />
        </a>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
        {USAGE_KPIS.map(kpi => (
          <div key={kpi.id} className="rounded-2xl border border-black/[0.06] bg-white p-4">
            <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">{kpi.label}</p>
            <p className="text-[24px] font-semibold tracking-[-0.03em] text-neutral-900 mt-1.5 leading-none">
              {kpi.value}
            </p>
            <p className="text-[11px] text-neutral-400 mt-2 leading-snug">{kpi.hint}</p>
          </div>
        ))}
      </div>

      {/* AI Summary */}
      <section className="rounded-2xl border border-violet-200/70 bg-gradient-to-br from-violet-50/80 to-white p-6 mb-10">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-violet-300" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-violet-800/70">
              {AI_SUMMARY.eyebrow}
            </p>
            <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight mt-1 max-w-3xl leading-snug">
              {AI_SUMMARY.headline}
            </h2>
          </div>
        </div>
        <p className="text-[13px] text-neutral-600 leading-relaxed max-w-3xl">{AI_SUMMARY.narrative}</p>
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-violet-900/10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[10px] font-medium text-violet-800">
            <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
            Confiança: {AI_SUMMARY.confidence}
          </span>
          <span className="text-[10px] text-neutral-400">
            {AI_INSIGHTS.filter(i => i.level === 'crítico').length} insights críticos ·{' '}
            {AI_INSIGHTS.filter(i => i.level === 'atenção').length} em atenção ·{' '}
            {AI_INSIGHTS.filter(i => i.level === 'positivo').length} resolvido
          </span>
        </div>
      </section>

      {/* AI Insights */}
      <Section
        title="Insights e ações recomendadas"
        subtitle="Cada leitura vem com evidência nos dados, ação sugerida e onde ela entra no roadmap"
        icon={Sparkles}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {AI_INSIGHTS.map(insight => {
            const style = LEVEL_STYLES[insight.level]
            const Icon = insight.level === 'positivo' ? CheckCircle2 : AlertTriangle
            return (
              <article
                key={insight.id}
                className={`rounded-2xl border bg-white p-5 flex flex-col ${style.card}`}
              >
                <div className="flex items-start gap-2.5 mb-3">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${style.icon}`} strokeWidth={1.9} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider ${style.badge}`}
                      >
                        {insight.level}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">{insight.phase}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug">
                      {insight.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5 text-[12px] leading-relaxed">
                  <p className="text-neutral-700">
                    <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 block mb-0.5">
                      Evidência
                    </span>
                    {insight.evidence}
                  </p>
                  <p className="text-neutral-600">
                    <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 block mb-0.5">
                      Leitura
                    </span>
                    {insight.reading}
                  </p>
                  <div className="rounded-xl bg-[#fafaf8] border border-black/[0.05] p-3">
                    <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400 block mb-1">
                      Ação recomendada
                    </span>
                    <p className="text-neutral-800">{insight.action}</p>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-400 mt-auto pt-3">Owner: {insight.owner}</p>
              </article>
            )
          })}
        </div>
      </Section>

      {/* Funil de ativação */}
      <Section
        title="Funil de ativação"
        subtitle="Do cadastro ao uso recorrente — onde a base se perde"
        icon={Filter}
      >
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <div className="space-y-2.5">
            {ACTIVATION_FUNNEL.map((step, index) => {
              const pct = Math.round((step.value / funnelMax) * 100)
              const prev = index > 0 ? ACTIVATION_FUNNEL[index - 1].value : null
              const drop = prev ? Math.round(((prev - step.value) / prev) * 100) : 0
              return (
                <div key={step.id}>
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <span className="text-[12px] text-neutral-700">{step.label}</span>
                    <span className="flex items-baseline gap-2">
                      <span className="text-[13px] font-semibold text-neutral-900">{step.value}</span>
                      <span className="text-[10px] text-neutral-400 w-9 text-right">{pct}%</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-black/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: accent, opacity: 1 - index * 0.12 }}
                    />
                  </div>
                  {drop > 0 && (
                    <p className="text-[10px] text-red-500/80 mt-1">−{drop}% em relação à etapa anterior</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Série mensal */}
      <Section
        title="Roteiros por mês"
        subtitle="Últimos 12 meses — pico, vale e retomada"
        icon={TrendingUp}
      >
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <div className="flex items-end justify-between gap-1.5 h-40 mb-2">
            {MONTHLY_ROTEIROS.map(item => (
              <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                <span className="text-[10px] font-medium text-neutral-500">{item.value}</span>
                <div
                  className={`w-full rounded-t-md ${item.partial ? 'opacity-40' : ''}`}
                  style={{
                    height: `${Math.max((item.value / maxMonthly) * 100, 3)}%`,
                    backgroundColor: accent,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-1.5 pt-2 border-t border-black/[0.05]">
            {MONTHLY_ROTEIROS.map(item => (
              <span
                key={item.month}
                className="flex-1 text-center text-[9px] text-neutral-400 whitespace-nowrap"
              >
                {item.month}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-neutral-400 mt-3">
            ago/26 é parcial (relatório gerado em {USAGE_META.generatedAt}).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-4">
              Primeiros acessos por mês
            </p>
            <div className="space-y-2.5">
              {ADOPTION_SERIES.map(item => (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-500 w-14 flex-shrink-0">{item.month}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-black/[0.04] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.partial ? 'opacity-40' : ''}`}
                      style={{ width: `${(item.value / maxAdoption) * 100}%`, backgroundColor: accent }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-800 w-6 text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-neutral-400 mt-3 leading-relaxed">
              O ciclo de junho (53 novos acessos) antecede a retomada de volume em maio–julho.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-4">
              Engajamento da base
            </p>
            <div className="space-y-2.5">
              {ENGAGEMENT_BANDS.map(band => (
                <div key={band.id}>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-[12px] text-neutral-700">{band.label}</span>
                    <span className="text-[11px] text-neutral-400">
                      <span className="font-semibold text-neutral-800">{band.count}</span> · {band.pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-black/[0.04] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${TONE_BAR[band.tone]}`}
                      style={{ width: `${band.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Perfis */}
      <Section
        title="Adoção por perfil"
        subtitle="Exibidores concentram a base — e o gargalo de ativação"
        icon={Users}
      >
        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
          <div className="grid grid-cols-[1.2fr_0.8fr_1fr_1fr] gap-3 bg-[#fafaf8] px-5 py-2.5 border-b border-black/[0.06]">
            {['Perfil', 'Total', 'Já acessaram', 'Ativos 30d'].map(col => (
              <span key={col} className="text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400">
                {col}
              </span>
            ))}
          </div>
          {PROFILE_BREAKDOWN.map(row => {
            const accessPct = row.total ? Math.round((row.accessed / row.total) * 100) : 0
            return (
              <div
                key={row.profile}
                className="grid grid-cols-[1.2fr_0.8fr_1fr_1fr] gap-3 px-5 py-3 border-b border-black/[0.04] last:border-b-0 items-center"
              >
                <span className="text-[12px] font-medium text-neutral-800">{row.profile}</span>
                <span className="text-[12px] text-neutral-600">{row.total}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-black/[0.05] overflow-hidden max-w-[70px]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${accessPct}%`, backgroundColor: accent }}
                    />
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    {row.accessed} · {accessPct}%
                  </span>
                </div>
                <span className="text-[12px] text-neutral-600">{row.active30}</span>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Roteiros e inventário */}
      <Section
        title="Roteiros e inventário"
        subtitle="Composição por tipo, status e situação dos lotes enviados"
        icon={ListChecks}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <DistributionCard
            title="Roteiros por tipo"
            total={totalTypes}
            items={ROTEIRO_TYPES.map(t => ({ ...t, tone: 'neutral' as const }))}
            accent={accent}
          />
          <DistributionCard
            title="Roteiros por status"
            total={totalStatus}
            items={ROTEIRO_STATUS}
            note="99,6% em “Teste” — sem taxonomia confiável não há funil de conversão."
          />
          <DistributionCard
            title="Lotes de inventário"
            total={totalBatches}
            items={INVENTORY_BATCHES}
            note="82% dos lotes não chegam à aprovação — maior atrito da fundação."
          />
        </div>
      </Section>

      {/* Top criadores */}
      <Section
        title="Principais criadores de roteiros"
        subtitle="Volume acumulado versus atividade nos últimos 30 dias"
        icon={Layers}
      >
        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
          {TOP_CREATORS.map(creator => (
            <div
              key={creator.name}
              className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-black/[0.04] last:border-b-0"
            >
              <span className="text-[12px] font-medium text-neutral-800 flex-1 min-w-[180px] truncate">
                {creator.name}
              </span>
              <span className="text-[12px] text-neutral-600 w-16">{creator.total}</span>
              <span
                className={`text-[12px] w-16 ${
                  creator.last30 > 0 ? 'text-teal-700 font-medium' : 'text-neutral-300'
                }`}
              >
                {creator.last30} · 30d
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 w-28">
                <Clock className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
                {creator.lastAt}
              </span>
              {creator.stale && (
                <span className="rounded-full border border-black/[0.08] bg-[#f3f3f0] px-2 py-0.5 text-[9px] uppercase tracking-wider text-neutral-500">
                  Inativo
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
          O volume histórico se concentra em usuários sem atividade recente — os indicadores de operação
          corrente devem olhar para ativos em 30 dias.
        </p>
      </Section>

      {/* Copiloto */}
      <Section
        title={COPILOT_QUESTIONS.label}
        subtitle="O que a operação vai poder perguntar direto sobre esta base"
        icon={MessageSquare}
      >
        <div className="rounded-2xl bg-neutral-900 text-white p-6">
          <div className="space-y-2.5 mb-5">
            {COPILOT_QUESTIONS.questions.map(question => (
              <div
                key={question}
                className="flex items-start gap-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-3"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-300 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <span className="text-[12px] text-white/80 leading-relaxed">{question}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between pt-4 border-t border-white/[0.08]">
            <p className="text-[11px] text-white/40 leading-relaxed max-w-md">{COPILOT_QUESTIONS.note}</p>
            <Link
              href={`${base}/arquitetura-de-agentes`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-neutral-900 text-[12px] font-medium px-4 py-2 hover:bg-white/90 self-start"
            >
              Ver arquitetura de agentes
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  )
}

function DistributionCard({
  title,
  total,
  items,
  note,
  accent,
}: {
  title: string
  total: number
  items: { label: string; value: number; tone: 'good' | 'warn' | 'bad' | 'neutral' }[]
  note?: string
  accent?: string
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 flex flex-col">
      <div className="flex items-baseline justify-between gap-2 mb-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">{title}</p>
        <span className="text-[11px] text-neutral-400">{total.toLocaleString('pt-BR')}</span>
      </div>
      <div className="space-y-2.5 flex-1">
        {items.map(item => {
          const pct = total ? Math.round((item.value / total) * 100) : 0
          return (
            <div key={item.label}>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-[12px] text-neutral-700">{item.label}</span>
                <span className="text-[11px] text-neutral-400">
                  <span className="font-semibold text-neutral-800">
                    {item.value.toLocaleString('pt-BR')}
                  </span>{' '}
                  · {pct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-black/[0.04] overflow-hidden">
                <div
                  className={`h-full rounded-full ${accent ? '' : TONE_BAR[item.tone]}`}
                  style={{ width: `${Math.max(pct, 1)}%`, backgroundColor: accent }}
                />
              </div>
            </div>
          )
        })}
      </div>
      {note && (
        <p className="text-[10px] text-neutral-400 mt-4 pt-3 border-t border-black/[0.05] leading-relaxed">
          {note}
        </p>
      )}
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
