import type { ClientWorkspace } from '@/lib/client/types'
import type { DeliveryTeaser } from '@/lib/delivery/teaser'
import type { BacklogSnapshot } from '@/lib/backlog/types'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CircleDot,
  FileText,
  FolderKanban,
  GitPullRequest,
  PanelTop,
  Sparkles,
} from 'lucide-react'

type Props = {
  client: ClientWorkspace
  locale: string
  deliveryTeaser?: DeliveryTeaser | null
  backlogSnapshot?: BacklogSnapshot | null
}

export function ClientHome({ client, locale, deliveryTeaser, backlogSnapshot }: Props) {
  const base = `/${locale}/client/${client.slug}`
  const meetings = client.meetings ?? []
  const documents = client.documents ?? []
  const projects = client.projects ?? []
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'discovery')
  const proposedProjects = projects.filter(p => p.status === 'proposed')
  const readyCards = backlogSnapshot?.cards.filter(card => card.column === 'ready') ?? []
  const devCards = backlogSnapshot?.cards.filter(card => card.column === 'dev') ?? []
  const openCards = backlogSnapshot?.cards.filter(card => card.column !== 'done') ?? []
  const recentCards = [...openCards]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)

  const areas = [
    ...(backlogSnapshot ? [{
      title: 'Boards',
      description: 'Requisitos, stories e specs agent-ready em fluxo.',
      href: `${base}/backlog`,
      icon: PanelTop,
      meta: `${openCards.length} abertas · ${readyCards.length} agent-ready`,
    }] : []),
    {
      title: 'Reuniões',
      description: 'Agenda, registros, participantes e próximos passos.',
      href: `${base}/reunioes`,
      icon: CalendarDays,
      meta: meetings.length ? `${meetings.length} registrada${meetings.length === 1 ? '' : 's'}` : 'Nenhuma publicada',
    },
    {
      title: 'Documentos',
      description: 'Materiais, escopo, decisões e entregáveis do projeto.',
      href: `${base}/documentos`,
      icon: FileText,
      meta: documents.length ? `${documents.length} documento${documents.length === 1 ? '' : 's'}` : 'Aguardando materiais',
    },
    {
      title: 'Projetos',
      description: 'Portfólio ativo e intake de novas iniciativas.',
      href: `${base}/projetos`,
      icon: FolderKanban,
      meta: projects.length
        ? `${activeProjects.length} ativos · ${proposedProjects.length} novos`
        : 'Sem projetos',
    },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <section className="border-b border-black/[0.06] pb-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: client.accent }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                {client.status === 'pilot' ? 'Piloto' : 'Workspace ativo'} · {client.sector}
              </span>
            </div>
            <h1 className="mt-3 font-[family-name:var(--font-cadence-display)] text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
              Bom dia, {client.name.split(' ')[0]}.
            </h1>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-neutral-500">
              Contexto vivo, trabalho em fluxo e entregas conectadas no mesmo ritmo.
            </p>
          </div>
          {backlogSnapshot && (
            <div className="flex items-center gap-2">
              <Link href={`${base}/backlog/copilot`} className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3.5 py-2 text-[11px] font-semibold text-neutral-700 hover:border-black/[0.16]">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                Abrir copiloto
              </Link>
              <Link href={`${base}/backlog`} className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-neutral-800">
                Ver boards
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {backlogSnapshot && (
        <section className="mt-7 grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
          <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3">
              <div>
                <h2 className="text-[12px] font-semibold text-neutral-900">Trabalho em movimento</h2>
                <p className="mt-0.5 text-[10px] text-neutral-400">Atualizações mais recentes nos boards</p>
              </div>
              <Link href={`${base}/backlog`} className="text-[10px] font-semibold text-teal-700 hover:text-teal-900">Ver tudo</Link>
            </div>
            {recentCards.length ? (
              <div className="divide-y divide-black/[0.05]">
                {recentCards.map(card => {
                  const board = backlogSnapshot.boards.find(item => item.id === card.boardId)
                  return (
                    <Link key={card.id} href={`${base}/backlog/${card.id}`} className="group flex items-center gap-3 px-4 py-3 hover:bg-black/[0.015]">
                      <CircleDot className={`h-3.5 w-3.5 shrink-0 ${card.column === 'ready' ? 'text-teal-600' : card.column === 'dev' ? 'text-amber-500' : 'text-neutral-300'}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-medium text-neutral-700 group-hover:text-neutral-950">{card.title}</span>
                        <span className="mt-0.5 block truncate text-[9px] uppercase tracking-wider text-neutral-400">{board?.title ?? card.boardId}</span>
                      </span>
                      <span className="rounded-md bg-neutral-100 px-2 py-1 text-[9px] font-medium text-neutral-500">
                        {backlogSnapshot.columns.find(column => column.id === card.column)?.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="px-4 py-10 text-center text-[12px] text-neutral-400">O próximo trabalho aparecerá aqui.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Em aberto', value: openCards.length, icon: PanelTop, tone: 'text-neutral-700' },
              { label: 'Agent-ready', value: readyCards.length, icon: Sparkles, tone: 'text-teal-700' },
              { label: 'Em desenvolvimento', value: devCards.length, icon: CircleDot, tone: 'text-amber-600' },
              { label: 'PRs em 90 dias', value: deliveryTeaser?.prs ?? '—', icon: GitPullRequest, tone: 'text-violet-600' },
            ].map(metric => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="rounded-xl border border-black/[0.07] bg-white p-4">
                  <Icon className={`h-4 w-4 ${metric.tone}`} strokeWidth={1.75} />
                  <p className="mt-4 font-[family-name:var(--font-cadence-display)] text-2xl font-semibold tracking-[-0.04em] text-neutral-950">{metric.value}</p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-neutral-400">{metric.label}</p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-[family-name:var(--font-cadence-display)] text-[14px] font-semibold text-neutral-900">Explore o workspace</h2>
          <Link href={`${base}/entregas?periodo=90`} className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-neutral-800">
            <BarChart3 className="h-3.5 w-3.5" />
            {deliveryTeaser ? `${deliveryTeaser.prs} PRs · ~${deliveryTeaser.hours.toLocaleString('pt-BR')}h` : 'Ver entregas'}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {areas.map(area => {
            const Icon = area.icon
            return (
              <Link
                key={area.title}
                href={area.href}
                className="group rounded-xl border border-black/[0.06] bg-white p-4 transition-all hover:border-black/[0.13] hover:shadow-[0_10px_35px_rgba(0,0,0,0.035)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-700" />
                </div>
                <h3 className="mt-4 text-[13px] font-semibold tracking-[-0.02em] text-neutral-900">{area.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">{area.description}</p>
                <p className="mt-4 border-t border-black/[0.05] pt-3 text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
                  {area.meta}
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-5">Indicadores</p>
          <div className="grid grid-cols-3 gap-4">
            {client.stats.map(stat => (
              <div key={stat.label}>
                <p className="text-xl font-semibold tracking-tight text-neutral-900">{stat.value}</p>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-5">Equipe do projeto</p>
          <div className="flex flex-col sm:flex-row gap-5">
            {client.contacts.map(contact => (
              <div key={contact.name} className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-semibold">
                  {contact.name.split(' ').map(part => part[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-neutral-900">{contact.name}</p>
                  <p className="text-[11px] text-neutral-400 truncate">{contact.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
