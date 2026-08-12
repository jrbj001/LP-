import type { ClientWorkspace } from '@/lib/client/types'
import type { DeliveryTeaser } from '@/lib/delivery/teaser'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  FileText,
  FolderKanban,
} from 'lucide-react'

type Props = {
  client: ClientWorkspace
  locale: string
  deliveryTeaser?: DeliveryTeaser | null
}

export function ClientHome({ client, locale, deliveryTeaser }: Props) {
  const base = `/${locale}/client/${client.slug}`
  const meetings = client.meetings ?? []
  const documents = client.documents ?? []
  const projects = client.projects ?? []
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'discovery')
  const proposedProjects = projects.filter(p => p.status === 'proposed')

  const areas = [
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
    {
      title: 'Entregas',
      description: 'Evolução técnica, métricas e atividade dos repositórios.',
      href: `${base}/entregas?periodo=90`,
      icon: BarChart3,
      meta: deliveryTeaser
        ? `${deliveryTeaser.prs} PRs · ~${deliveryTeaser.hours.toLocaleString('pt-BR')}h`
        : 'Relatório técnico',
    },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: client.accent }} />
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-neutral-400">
            {client.status === 'pilot' ? 'Piloto' : 'Ativo'} · {client.sector}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
          <div>
            <p className="text-[13px] font-medium text-neutral-400 mb-2">Área do cliente</p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.04em] text-neutral-900">
              Olá, {client.name.split(' ')[0]}.
            </h1>
            <p className="mt-4 text-[16px] text-neutral-500 max-w-2xl leading-relaxed">
              Acompanhe o engajamento em um só lugar: projetos, reuniões, documentos e entregas técnicas.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-4 py-3">
            <FolderKanban className="w-4 h-4" style={{ color: client.accent }} />
            <div>
              <p className="text-[11px] text-neutral-400">Status do engajamento</p>
              <p className="text-[13px] font-semibold text-neutral-800">Cliente ativo</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <h2 className="text-[15px] font-semibold text-neutral-900">Workspace</h2>
          <span className="text-[12px] text-neutral-400">Tudo sobre o engajamento</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areas.map(area => {
            const Icon = area.icon
            return (
              <Link
                key={area.title}
                href={area.href}
                className="group rounded-2xl border border-black/[0.06] bg-white p-6 hover:border-black/[0.13] hover:shadow-[0_10px_35px_rgba(0,0,0,0.04)] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${client.accent}12`, color: client.accent }}>
                    <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.02em] text-neutral-900">{area.title}</h3>
                <p className="mt-1.5 text-[13px] text-neutral-500 leading-relaxed">{area.description}</p>
                <p className="mt-5 pt-4 border-t border-black/[0.05] text-[11px] font-mono uppercase tracking-wider text-neutral-400">
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
