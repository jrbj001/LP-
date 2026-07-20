import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { getDeliveries } from '@/lib/delivery/service'
import { DeliveryTimeline } from '@/components/client/delivery-timeline'
import type { DeliveriesData } from '@/lib/delivery/types'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
  searchParams: Promise<{ periodo?: string }>
}

const METHODOLOGY = [
  {
    title: '1 · Sessões de trabalho',
    text: 'Analisamos o ritmo real dos commits de cada entrega. Commits com menos de 2h de intervalo formam uma sessão contínua de trabalho; cada sessão soma ainda um baseline de preparação e contexto.',
  },
  {
    title: '2 · Complexidade da entrega',
    text: 'Cada entrega recebe uma base de horas pelo tipo (funcionalidade, correção, melhoria, manutenção), multiplicada por um fator de tamanho em escala logarítmica e acrescida do esforço de code review.',
  },
  {
    title: '3 · Horas faturáveis',
    text: 'O resultado final combina os dois sinais — 60% sessões, 40% complexidade — arredondado a 0,5h. Os coeficientes são calibrados mensalmente e o cálculo de cada item é aberto: clique em qualquer entrega.',
  },
]

function formatHours(h: number): string {
  return `${h.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}h`
}

function SummaryCards({ data }: { data: DeliveriesData }) {
  const s = data.summary
  const cards = [
    { label: 'Entregas', value: String(s.totalDeliveries) },
    { label: 'Funcionalidades', value: String(s.features) },
    { label: 'Correções', value: String(s.fixes) },
    { label: 'Em produção', value: String(s.productionDeploys) },
    { label: 'Horas estimadas', value: formatHours(s.totalHours) },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map(c => (
        <div key={c.label} className="rounded-xl border border-black/[0.06] bg-white p-5">
          <p className="text-[26px] font-semibold text-neutral-900 leading-none tabular-nums">{c.value}</p>
          <p className="text-[12px] text-neutral-500 mt-2">{c.label}</p>
        </div>
      ))}
    </div>
  )
}

export default async function EntregasPage({ params, searchParams }: Props) {
  const [{ locale, clientId }, { periodo }] = await Promise.all([params, searchParams])
  const client = getClient(clientId)
  if (!client) notFound()

  const repos = client.delivery?.repos ?? []
  const days = periodo === '30' ? 30 : 90
  const base = `/${locale}/client/${client.slug}/entregas`

  let data: DeliveriesData | null = null
  let loadError: string | null = null

  if (repos.length > 0) {
    try {
      data = await getDeliveries(repos, days)
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Erro ao carregar entregas'
    }
  }

  const blockedRepos = data?.repos.filter(r => !r.ok) ?? []

  return (
    <div className="mx-auto max-w-[1120px] px-6 pt-12 sm:pt-16 pb-16">
      <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
        Workspace · Entregas
      </p>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-neutral-900">
            Entregas ao vivo
          </h1>
          <p className="mt-3 text-[15px] text-neutral-500 max-w-xl leading-relaxed">
            Timeline gerada direto dos repositórios dos seus produtos: cada item é uma entrega
            revisada e integrada, com horas estimadas pela metodologia PulseEffort.
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {[
            { d: 30, label: '30 dias' },
            { d: 90, label: '90 dias' },
          ].map(p => (
            <Link
              key={p.d}
              href={`${base}?periodo=${p.d}`}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                days === p.d
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-black/[0.08] hover:border-neutral-300'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      {repos.length === 0 && (
        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          Nenhum repositório configurado para este workspace ainda.
        </div>
      )}

      {loadError && (
        <div className="mt-10 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-800">
          {loadError}
        </div>
      )}

      {blockedRepos.length > 0 && (
        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800 leading-relaxed">
          {blockedRepos.map(r => (
            <p key={r.repo}>
              <span className="font-mono">{r.repo}</span>
              {r.error === 'token'
                ? ' — repositório privado aguardando token de acesso (GITHUB_TOKEN).'
                : ` — ${r.error}`}
            </p>
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="mt-10">
            <SummaryCards data={data} />
          </div>

          {data.summary.byProduct.length > 0 && (
            <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                Por produto
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {data.summary.byProduct.map(p => (
                  <div key={p.product}>
                    <p className="text-[13px] font-medium text-neutral-900">{p.product}</p>
                    <p className="text-[12px] text-neutral-500 mt-0.5 tabular-nums">
                      {p.deliveries} entrega{p.deliveries === 1 ? '' : 's'} · {formatHours(p.hours)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12">
            <DeliveryTimeline weeks={data.weeks} />
          </div>
        </>
      )}

      <section className="mt-16 pt-12 border-t border-black/[0.05]">
        <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
          Metodologia
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-neutral-900 max-w-xl">
          PulseEffort{' '}
          <span className="text-neutral-500">— como estimamos as horas</span>
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {METHODOLOGY.map(m => (
            <div key={m.title} className="rounded-2xl border border-black/[0.06] bg-white p-6">
              <h3 className="text-[14px] font-semibold text-neutral-900">{m.title}</h3>
              <p className="mt-2.5 text-[13px] text-neutral-500 leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[12px] text-neutral-400 leading-relaxed max-w-2xl">
          Privacidade: esta página expõe apenas títulos, categorias, datas e métricas agregadas das
          entregas — nunca código-fonte, diffs ou caminhos de arquivos.
        </p>
      </section>
    </div>
  )
}
