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
import type { DeliveryReport, RepoConfig, RepoStatus } from '@/lib/delivery/types'
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  Tags,
} from 'lucide-react'

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

function SourceDisclaimer() {
  const details = [
    {
      icon: GitPullRequest,
      title: 'Fonte versionada',
      description:
        'PRs mescladas no período e commits da branch padrão, consultados diretamente pela API do GitHub.',
    },
    {
      icon: Tags,
      title: 'Classificação',
      description:
        'Produto e tipo de entrega são derivados do repositório, título e branch. Exibidor e inventário entram em Banco de Ativos.',
    },
    {
      icon: Calculator,
      title: 'Estimativa de esforço',
      description:
        'As horas são uma estimativa técnica baseada nas mudanças de código; esforços sem commits aparecem separadamente.',
    },
  ]

  return (
    <section className="mb-8 sm:mb-10 rounded-2xl border border-sky-200/80 bg-sky-50/50 overflow-hidden">
      <div className="px-5 sm:px-6 py-5 border-b border-sky-200/70">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-sky-700 mb-1.5">
          Como ler este relatório
        </p>
        <h2 className="text-[17px] font-semibold tracking-tight text-neutral-900">
          Evidências extraídas diretamente do GitHub
        </h2>
        <p className="text-[13px] text-neutral-600 leading-relaxed mt-1.5 max-w-4xl">
          O painel transforma o histórico técnico dos repositórios monitorados em uma visão de entregas,
          produtos, ritmo e esforço. Não há lançamento manual das PRs exibidas abaixo.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-sky-200/60">
        {details.map(item => (
          <div key={item.title} className="bg-white/75 px-5 sm:px-6 py-4">
            <item.icon className="w-4 h-4 text-sky-700 mb-2" strokeWidth={1.8} />
            <p className="text-[12px] font-semibold text-neutral-900">{item.title}</p>
            <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="px-5 sm:px-6 py-3.5 bg-amber-50/80 border-t border-amber-200/80 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" strokeWidth={1.8} />
        <p className="text-[11px] text-amber-900/80 leading-relaxed">
          <strong className="font-semibold text-amber-900">Importante:</strong> código mesclado representa
          entrega no Git, mas não comprova sozinho que o deploy chegou à produção. A confirmação de produção
          depende também do pipeline e do ambiente de deployment.
        </p>
      </div>
    </section>
  )
}

function RepositoriesSection({
  repos,
  statuses,
}: {
  repos: RepoConfig[]
  statuses: RepoStatus[]
}) {
  const statusByRepo = new Map(statuses.map(status => [status.repo.toLowerCase(), status]))

  return (
    <section className="mb-10">
      <SectionTitle>Repositórios GitHub monitorados ({repos.length})</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {repos.map(repo => {
          const fullName = `${repo.owner}/${repo.repo}`
          const status = statusByRepo.get(fullName.toLowerCase())
          return (
            <article key={fullName} className="rounded-xl border border-black/[0.06] bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  <GitBranch className="w-4 h-4 text-neutral-700" strokeWidth={1.8} />
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                    status?.ok
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : status
                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-500'
                  }`}
                >
                  {status?.ok ? (
                    <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                  ) : status ? (
                    <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                  ) : null}
                  {status?.ok ? 'Conectado' : status ? 'Acesso pendente' : 'Aguardando consulta'}
                </span>
              </div>
              <h3 className="text-[14px] font-semibold text-neutral-900 mt-3">{repo.label}</h3>
              <p className="text-[11px] font-mono text-neutral-400 mt-1 break-all">{fullName}</p>
              {repo.products && repo.products.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                    Classificações internas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {repo.products.map(product => (
                      <span
                        key={product.label}
                        className="rounded-md border border-black/[0.07] bg-[#fafaf8] px-2 py-1 text-[10px] text-neutral-600"
                      >
                        {product.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <a
                href={`https://github.com/${fullName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 mt-4"
              >
                Abrir no GitHub
                <ExternalLink className="w-3 h-3" strokeWidth={1.8} />
              </a>
            </article>
          )
        })}
      </div>
    </section>
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

  let report:
    | (DeliveryReport & { cacheHit: boolean; cacheStale: boolean; cacheFetchedAt: string })
    | null = null
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
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold tracking-[-0.02em] text-neutral-900">
              Relatório de Entregas
            </h1>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 bg-[#f5f5f3] border border-black/[0.06] rounded-full px-2.5 py-1">
              últimos {days} dias
            </span>
          </div>
        </div>
        {report && (
          <div className="shrink-0 lg:text-right">
            <ReportPeriod report={report} />
          </div>
        )}
      </header>

      <SourceDisclaimer />

      <div className="mb-8 sm:mb-10">
        <PeriodSwitcher base={base} days={days} />
        {report && (
          <CacheRefreshLink
            base={base}
            days={days}
            cacheHit={report.cacheHit}
            cacheStale={report.cacheStale}
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

      {repos.length > 0 && (
        <RepositoriesSection repos={repos} statuses={report?.repos ?? []} />
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
              <AiAnalysisPanel
                key={days}
                clientId={client.slug}
                periodDays={days}
                clientName={client.name}
              />
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
