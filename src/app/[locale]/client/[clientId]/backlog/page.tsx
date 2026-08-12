import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { getBacklogSnapshot } from '@/lib/backlog/store'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import { BacklogWorkspace } from '@/components/client/backlog/backlog-workspace'
import { isBacklogEnabled } from '@/lib/backlog/access'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export default async function ClientBacklogPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()
  if (!isBacklogEnabled(client.slug)) notFound()

  const snapshot = await getBacklogSnapshot(client.slug)
  const base = `/${locale}/client/${client.slug}`

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Produto`}
        title="Backlog"
        description={
          client.slug === 'likeme'
            ? 'Boards por repositório para criar requisitos e user stories do zero. O PM usa IA + GitHub para enriquecer os cards e deixá-los prontos para desenvolvimento.'
            : 'Boards por frente de produto com user stories dos documentos. O PM enriquece requisitos e specs com IA + GitHub para deixar cards prontos para um agente de desenvolvimento.'
        }
        backHref={base}
      />
      <BacklogWorkspace
        clientId={client.slug}
        clientName={client.name}
        accent={client.accent}
        detailBase={`${base}/backlog`}
        copilotBase={`${base}/backlog/copilot`}
        initial={snapshot}
      />
    </div>
  )
}
