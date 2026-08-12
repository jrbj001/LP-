import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { getBacklogCard } from '@/lib/backlog/store'
import { BacklogCardDetail } from '@/components/client/backlog/backlog-card-detail'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string; cardId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId, cardId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') return { title: 'Card do Backlog' }
  const card = await getBacklogCard(client.slug, cardId)
  return {
    title: card ? `${card.title} | Backlog Be180` : 'Card do Backlog',
    robots: { index: false, follow: false },
  }
}

export default async function BacklogCardPage({ params }: Props) {
  const { locale, clientId, cardId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') notFound()

  const card = await getBacklogCard(client.slug, cardId)
  if (!card) notFound()

  return (
    <BacklogCardDetail
      card={card}
      backHref={`/${locale}/client/${client.slug}/backlog`}
    />
  )
}
