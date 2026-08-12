import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { getBacklogCard } from '@/lib/backlog/store'
import { BACKLOG_BOARDS, type BacklogBoardId } from '@/lib/backlog/types'
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
  if (!client || client.slug !== 'be180-ooh') return { title: 'Copiloto do Backlog' }
  return {
    title: `Copiloto de user stories | Backlog ${client.name}`,
    description:
      'Converse com o copiloto para construir user stories com contexto do GitHub, desenhos de fluxo e rascunhos aplicáveis ao board.',
    robots: { index: false, follow: false },
  }
}

export default async function BacklogCopilotPage({ params, searchParams }: Props) {
  const { locale, clientId } = await params
  const { board, card: cardId } = await searchParams
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') notFound()

  const boardId = (BACKLOG_BOARDS.find(b => b.id === board)?.id ??
    BACKLOG_BOARDS[0].id) as BacklogBoardId
  const card = cardId ? await getBacklogCard(client.slug, cardId) : null
  const base = `/${locale}/client/${client.slug}`

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Backlog`}
        title="Copiloto de user stories"
        description="Descreva a necessidade em linguagem natural. O copiloto lê o código no GitHub, desenha o fluxo, responde dúvidas e propõe o rascunho da story — você aplica no board com um clique."
        backHref={`${base}/backlog`}
      />
      <CopilotChat
        clientId={client.slug}
        accent={client.accent}
        detailBase={`${base}/backlog`}
        boardId={card?.boardId ?? boardId}
        card={card ? { id: card.id, title: card.title } : null}
      />
    </div>
  )
}
