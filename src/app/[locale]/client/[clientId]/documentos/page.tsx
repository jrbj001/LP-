import { notFound } from 'next/navigation'
import { ExternalLink, FileText, FolderOpen } from 'lucide-react'
import { getClient } from '@/lib/client/registry'
import { EmptyWorkspaceState, WorkspacePageHeader } from '@/components/client/workspace-page'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

const STATUS_LABEL = {
  available: 'Disponível',
  draft: 'Em revisão',
  'coming-soon': 'Em breve',
} as const

export default async function ClientDocumentsPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()

  const base = `/${locale}/client/${client.slug}`
  const documents = client.documents ?? []

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Workspace`}
        title="Documentos"
        description="Fonte única para escopo, decisões, materiais de apoio e entregáveis do engajamento."
        backHref={base}
      />

      {documents.length === 0 ? (
        <EmptyWorkspaceState
          icon={FileText}
          title="Nenhum documento publicado"
          description="Os materiais do workspace serão organizados aqui, sem depender de links espalhados em mensagens."
        />
      ) : (
        <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.05] overflow-hidden">
          {documents.map(document => (
            <div key={document.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-black/[0.015] transition-colors">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${client.accent}12`, color: client.accent }}
              >
                <FileText className="w-4.5 h-4.5" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[14px] font-semibold text-neutral-900">{document.title}</h2>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-500">
                    {STATUS_LABEL[document.status]}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-neutral-500">{document.description}</p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  {document.category}{document.updatedAt ? ` · Atualizado em ${document.updatedAt}` : ''}
                </p>
              </div>
              {document.href && document.status === 'available' && (
                <a
                  href={document.href}
                  target={document.external ? '_blank' : undefined}
                  rel={document.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Abrir
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <h2 className="text-[15px] font-semibold text-neutral-900">Biblioteca do workspace</h2>
          <span className="text-[12px] text-neutral-400">Estrutura preparada</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {client.docs.categories.map(category => (
            <div key={category.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${client.accent}12`, color: client.accent }}
                >
                  <FolderOpen className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">{category.badge}</span>
              </div>
              <h3 className="mt-4 text-[14px] font-semibold text-neutral-900">{category.title}</h3>
              <p className="mt-1 text-[12px] text-neutral-500 leading-relaxed">{category.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {category.articles.map(article => (
                  <span key={article} className="rounded-md bg-neutral-50 px-2 py-1 text-[10px] text-neutral-400">
                    {article}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
