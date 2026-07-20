import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { getDeliveryReport } from '@/lib/delivery/service'
import {
  AiAnalysisPanel,
  EffortSection,
  KpiStrip,
  MixChart,
  ModulesSection,
  ProductChart,
  PrsTable,
  ReportPeriod,
  RoadmapTimeline,
  SummaryStrip,
  WeeklyChart,
} from '@/components/client/delivery-report'
import { CacheRefreshLink, PeriodSwitcher } from '@/components/client/period-switcher'
import type { DeliveryReport } from '@/lib/delivery/types'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
  searchParams: Promise<{ periodo?: string; refresh?: string }>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-400 mb-4 pb-2 border-b border-black/[0.06]">
      {children}
    </div>
  )
}

export default async function EntregasPage({ params, searchParams }: Props) {
  const [{ locale, clientId }, { periodo, refresh }] = await Promise.all([params, searchParams])
  const client = getClient(clientId)
  if (!client) notFound()

  const repos = client.delivery?.repos ?? []
  const days = periodo === '30' ? 30 : periodo === '60' ? 60 : 90
  const forceRefresh = refresh === '1'
  const base = `/${locale}/client/${client.slug}/entregas`

  let report: (DeliveryReport & { cacheHit: boolean; cacheFetchedAt: string }) | null = null
  let loadError: string | null = null

  if (repos.length > 0) {
    try {
      report = await getDeliveryReport(
        client.slug,
        repos,
        days,
        client.delivery?.manualEffort,
        { forceRefresh }
      )
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Erro ao gerar relatório'
    }
  }

  const blockedRepos = report?.repos.filter(r => !r.ok) ?? []

  return (
    <div className="w-full pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20">
      <header className="border-b-2 border-neutral-900 pb-5 mb-8 sm:mb-10 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 lg:gap-8">
        <div className="min-w-0">
          <p className="text-[12px] text-neutral-400 uppercase tracking-[0.08em] mb-1.5">
            {client.name}
          </p>
          <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold tracking-[-0.02em] text-neutral-900">
            Relatório de Entregas
          </h1>
        </div>
        {report && (
          <div className="shrink-0 lg:text-right">
            <ReportPeriod report={report} />
          </div>
        )}
      </header>

      <div className="mb-8 sm:mb-10">
        <PeriodSwitcher base={base} days={days} />
        {report && (
          <CacheRefreshLink
            base={base}
            days={days}
            cacheHit={report.cacheHit}
            cacheFetchedAt={report.cacheFetchedAt}
          />
        )}
      </div>

      {repos.length === 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          Nenhum repositório configurado para este workspace ainda.
        </div>
      )}

      {loadError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-800">
          {loadError}
        </div>
      )}

      {blockedRepos.length > 0 && (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800 leading-relaxed">
          {blockedRepos.map(r => (
            <p key={r.repo}>
              <span className="font-mono">{r.repo}</span>
              {r.error === 'token'
                ? ' — repositório privado aguardando token de acesso (GITHUB_TOKEN / GITHUB_PAT); números abaixo não incluem este repo.'
                : r.error === 'rate'
                  ? ' — limite da API pública do GitHub atingido; configure GITHUB_TOKEN ou GITHUB_PAT.'
                  : ` — ${r.error}`}
            </p>
          ))}
        </div>
      )}

      {report && (
        <>
          <div className="mb-8">
            <SummaryStrip report={report} />
          </div>

          <section className="mb-10">
            <SectionTitle>KPIs de negócio</SectionTitle>
            <KpiStrip kpis={report.kpis} />
          </section>

          <section className="mb-10 lg:mb-12">
            <SectionTitle>Gráficos</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-12 gap-4">
              <div className="lg:col-span-2 2xl:col-span-7">
                <WeeklyChart weekly={report.weekly} />
              </div>
              <div className="lg:col-span-2 2xl:col-span-5">
                <MixChart report={report} />
              </div>
              <div className="lg:col-span-2 2xl:col-span-12">
                <ProductChart byProduct={report.byProduct} />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10 mb-10 lg:mb-12">
            <section>
              <SectionTitle>Roadmap — linha do tempo</SectionTitle>
              <RoadmapTimeline roadmap={report.roadmap} />
            </section>

            <section>
              <SectionTitle>Análise com IA</SectionTitle>
              <AiAnalysisPanel clientId={client.slug} periodDays={days} clientName={client.name} />
            </section>
          </div>

          <section className="mb-10 lg:mb-12">
            <SectionTitle>Estimativa de esforço</SectionTitle>
            <EffortSection report={report} />
          </section>

          <section className="mb-10 lg:mb-12">
            <SectionTitle>Módulos e funcionalidades entregues</SectionTitle>
            <ModulesSection modules={report.modules} />
          </section>

          <section className="mb-10 lg:mb-12">
            <SectionTitle>
              Pull Requests mescladas ({report.stats.pullRequests} no período)
            </SectionTitle>
            <PrsTable report={report} />
          </section>

          <footer className="mt-14 pt-5 border-t border-black/[0.06] flex flex-col sm:flex-row justify-between gap-2 text-[12px] text-neutral-400">
            <span>{client.name} · PixelPulseLab</span>
            <span>
              Fonte: git log · {report.repos.map(r => r.repo.split('/')[1]).join(' · ')}
            </span>
          </footer>
        </>
      )}
    </div>
  )
}
