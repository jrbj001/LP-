import { notFound } from 'next/navigation'
import { ExternalLink, FolderKanban, Lightbulb, PauseCircle, Sparkles } from 'lucide-react'
import { getClient } from '@/lib/client/registry'
import type { ClientProject, ClientProjectStatus } from '@/lib/client/types'
import { EmptyWorkspaceState, WorkspacePageHeader } from '@/components/client/workspace-page'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

const STATUS_META: Record<
  ClientProjectStatus,
  { label: string; tone: string }
> = {
  active: { label: 'Ativo', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  discovery: { label: 'Discovery', tone: 'bg-sky-50 text-sky-700 border-sky-100' },
  proposed: { label: 'Novo', tone: 'bg-amber-50 text-amber-700 border-amber-100' },
  deferred: { label: 'Adiado', tone: 'bg-neutral-100 text-neutral-500 border-neutral-200' },
  done: { label: 'Concluído', tone: 'bg-neutral-900 text-white border-neutral-900' },
}

const PRIORITY_DOT: Record<NonNullable<ClientProject['priority']>, string> = {
  Alta: 'bg-rose-500',
  Média: 'bg-amber-500',
  Baixa: 'bg-neutral-300',
}

function ProjectCard({
  project,
  accent,
}: {
  project: ClientProject
  accent: string
}) {
  const status = STATUS_META[project.status]

  return (
    <article className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}12`, color: accent }}
        >
          {project.status === 'proposed' ? (
            <Lightbulb className="w-4.5 h-4.5" strokeWidth={1.8} />
          ) : project.status === 'deferred' ? (
            <PauseCircle className="w-4.5 h-4.5" strokeWidth={1.8} />
          ) : project.status === 'discovery' ? (
            <Sparkles className="w-4.5 h-4.5" strokeWidth={1.8} />
          ) : (
            <FolderKanban className="w-4.5 h-4.5" strokeWidth={1.8} />
          )}
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${status.tone}`}>
          {status.label}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">{project.pillar}</p>
        <h3 className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">{project.name}</h3>
        <p className="mt-2 text-[13px] text-neutral-500 leading-relaxed">{project.description}</p>
      </div>

      {(project.tags?.length || project.priority) && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.priority && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-black/[0.06] bg-neutral-50 px-2 py-1 text-[10px] font-medium text-neutral-500">
              <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[project.priority]}`} />
              Prioridade {project.priority}
            </span>
          )}
          {project.tags?.map(tag => (
            <span key={tag} className="rounded-md border border-black/[0.06] bg-neutral-50 px-2 py-1 text-[10px] text-neutral-400">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-black/[0.05] flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] text-neutral-400">
          {project.owner && <span>{project.owner}</span>}
          {project.owner && project.updatedAt && <span> · </span>}
          {project.updatedAt && <span>Atualizado em {project.updatedAt}</span>}
        </div>
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-600 hover:text-neutral-900"
          >
            Abrir
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  )
}

function ProjectSection({
  title,
  hint,
  projects,
  accent,
}: {
  title: string
  hint: string
  projects: ClientProject[]
  accent: string
}) {
  if (projects.length === 0) return null

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="text-[15px] font-semibold text-neutral-900">{title}</h2>
        <span className="text-[12px] text-neutral-400">{hint}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} accent={accent} />
        ))}
      </div>
    </section>
  )
}

export default async function ClientProjectsPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()

  const base = `/${locale}/client/${client.slug}`
  const projects = client.projects ?? []
  const active = projects.filter(p => p.status === 'active' || p.status === 'discovery')
  const proposed = projects.filter(p => p.status === 'proposed')
  const deferred = projects.filter(p => p.status === 'deferred')
  const done = projects.filter(p => p.status === 'done')

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Portfólio`}
        title="Projetos"
        description="Iniciativas ativas, novas propostas e o que ficou deliberadamente fora desta fase."
        backHref={base}
      />

      {projects.length === 0 ? (
        <EmptyWorkspaceState
          icon={FolderKanban}
          title="Nenhum projeto cadastrado"
          description="O portfólio e as novas iniciativas do cliente aparecerão aqui."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Ativos', value: active.length },
              { label: 'Novos', value: proposed.length },
              { label: 'Adiados', value: deferred.length },
              { label: 'Total', value: projects.length },
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-black/[0.06] bg-white px-4 py-3">
                <p className="text-xl font-semibold tracking-tight text-neutral-900">{item.value}</p>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">{item.label}</p>
              </div>
            ))}
          </div>

          <ProjectSection
            title="Em andamento"
            hint={`${active.length} iniciativa${active.length === 1 ? '' : 's'}`}
            projects={active}
            accent={client.accent}
          />
          <ProjectSection
            title="Novas iniciativas"
            hint="Intake a partir do roadmap e demandas recentes"
            projects={proposed}
            accent={client.accent}
          />
          <ProjectSection
            title="Adiados"
            hint="Mapeados, fora do escopo desta fase"
            projects={deferred}
            accent={client.accent}
          />
          <ProjectSection
            title="Concluídos"
            hint={`${done.length} finalizado${done.length === 1 ? '' : 's'}`}
            projects={done}
            accent={client.accent}
          />
        </>
      )}
    </div>
  )
}
