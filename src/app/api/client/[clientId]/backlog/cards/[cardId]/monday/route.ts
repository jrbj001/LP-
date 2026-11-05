import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { getBacklogBoards } from '@/lib/backlog/boards'
import { getBacklogCard, upsertBacklogCard } from '@/lib/backlog/store'
import { BE180_MONDAY_CLIENT_ID, isStoryReadyForMonday } from '@/lib/monday/story'
import { writeStoryBackToMonday } from '@/lib/monday/publish'

export const dynamic = 'force-dynamic'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ clientId: string; cardId: string }> }
) {
  const { clientId, cardId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  if (!isBacklogEnabled(client.slug)) {
    return NextResponse.json({ ok: false, error: 'Backlog indisponível para este cliente.' }, { status: 403 })
  }
  if (client.slug !== BE180_MONDAY_CLIENT_ID) {
    return NextResponse.json(
      { ok: false, error: 'O piloto do Monday está ligado só na Be180.' },
      { status: 403 }
    )
  }

  const current = await getBacklogCard(client.slug, cardId)
  if (!current) {
    return NextResponse.json({ ok: false, error: 'Card não encontrado.' }, { status: 404 })
  }
  if (!current.monday?.itemId) {
    return NextResponse.json(
      { ok: false, error: 'Esta story não veio do Monday.' },
      { status: 409 }
    )
  }
  if (!isStoryReadyForMonday(current)) {
    return NextResponse.json(
      { ok: false, error: 'Enriqueça a user story antes de devolver ao Monday.' },
      { status: 409 }
    )
  }

  const boardLabel =
    getBacklogBoards(client.slug).find(board => board.id === current.boardId)?.productLabel ??
    current.boardId

  try {
    const card = await upsertBacklogCard(client.slug, await writeStoryBackToMonday(current, boardLabel))
    return NextResponse.json({ ok: true, card })
  } catch (error) {
    console.error('[client/backlog/monday]', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Erro ao devolver ao Monday.',
        card: current,
      },
      { status: 502 }
    )
  }
}
