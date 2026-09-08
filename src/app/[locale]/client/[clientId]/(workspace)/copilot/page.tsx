import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { getBacklogCard } from '@/lib/backlog/store'
import type { BacklogBoardId } from '@/lib/backlog/types'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { getBacklogBoards } from '@/lib/backlog/boards'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import { CopilotChat } from '@/components/client/backlog/copilot-chat'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
  searchParams: Promise<{ board?: string; card?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client || !isBacklogEnabled(client.slug)) return { title: 'Copilot' }
  return {
    title: `Copilot | ${client.name}`,
    description: 'Pergunte sobre fluxo, código, documentos do portal e o que precisa virar user story.',
    robots: { index: false, follow: false },
  }
}

export default async function CopilotPage({ params, searchParams }: Props) {
  const { locale, clientId } = await params
  const { board, card: cardId } = await searchParams
  const client = getClient(clientId)
  if (!client || !isBacklogEnabled(client.slug)) notFound()

  const boards = getBacklogBoards(client.slug)
  const boardId = (boards.find(item => item.id === board)?.id ?? boards[0].id) as BacklogBoardId
  const card = cardId ? await getBacklogCard(client.slug, cardId) : null
  const base = `/${locale}/client/${client.slug}`

  return (
    <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10 2xl:px-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Workspace`}
        title="Copilot"
        description="Pergunte sobre fluxo, GitHub, documentos do portal e o que precisa virar trabalho no board. Fatos de produção ficam em Consultar."
        backHref={base}
      />
      <CopilotChat
        clientId={client.slug}
        boards={boards}
        accent={client.accent}
        detailBase={`${base}/backlog`}
        boardId={card?.boardId ?? boardId}
        card={card ? { id: card.id, title: card.title } : null}
      />
    </div>
  )
}
