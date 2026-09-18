import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { getBacklogCard } from '@/lib/backlog/store'
import type { BacklogBoardId } from '@/lib/backlog/types'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { getBacklogBoards } from '@/lib/backlog/boards'
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
    <div className="h-[calc(100dvh-3.5rem)] lg:h-[100dvh]">
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
