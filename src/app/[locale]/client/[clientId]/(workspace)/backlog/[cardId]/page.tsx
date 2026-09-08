import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { getBacklogCard } from '@/lib/backlog/store'
import { BacklogCardDetail } from '@/components/client/backlog/backlog-card-detail'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { getBacklogBoards } from '@/lib/backlog/boards'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string; cardId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId, cardId } = await params
  const client = getClient(clientId)
  if (!client || !isBacklogEnabled(client.slug)) return { title: 'Card do Backlog' }
  const card = await getBacklogCard(client.slug, cardId)
  return {
    title: card ? `${card.title} | Backlog ${client.name}` : 'Card do Backlog',
    robots: { index: false, follow: false },
  }
}

export default async function BacklogCardPage({ params }: Props) {
  const { locale, clientId, cardId } = await params
  const client = getClient(clientId)
  if (!client || !isBacklogEnabled(client.slug)) notFound()

  const card = await getBacklogCard(client.slug, cardId)
  if (!card) notFound()

  return (
    <BacklogCardDetail
      card={card}
      boards={getBacklogBoards(client.slug)}
      backHref={`/${locale}/client/${client.slug}/backlog`}
    />
  )
}
