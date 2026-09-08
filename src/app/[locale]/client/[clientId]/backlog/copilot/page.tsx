import { notFound, redirect } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { isBacklogEnabled } from '@/lib/backlog/access'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
  searchParams: Promise<{ board?: string; card?: string }>
}

export default async function BacklogCopilotRedirect({ params, searchParams }: Props) {
  const { locale, clientId } = await params
  const { board, card } = await searchParams
  const client = getClient(clientId)
  if (!client || !isBacklogEnabled(client.slug)) notFound()

  const query = new URLSearchParams()
  if (board) query.set('board', board)
  if (card) query.set('card', card)
  const suffix = query.toString() ? `?${query.toString()}` : ''
  redirect(`/${locale}/client/${client.slug}/copilot${suffix}`)
}
