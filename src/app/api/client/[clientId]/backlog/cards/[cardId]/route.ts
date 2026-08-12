import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { patchBacklogCard } from '@/lib/backlog/store'
import type { BacklogColumnId, CardPatch } from '@/lib/backlog/types'
import { BACKLOG_BOARDS, BACKLOG_COLUMNS } from '@/lib/backlog/types'

export const dynamic = 'force-dynamic'

const BOARD_IDS = new Set(BACKLOG_BOARDS.map(b => b.id))
const COLUMN_IDS = new Set(BACKLOG_COLUMNS.map(c => c.id))

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ clientId: string; cardId: string }> }
) {
  const { clientId, cardId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  if (client.slug !== 'be180-ooh') {
    return NextResponse.json(
      { ok: false, error: 'Backlog em piloto apenas para Be180 OOH.' },
      { status: 403 }
    )
  }

  let body: CardPatch
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }

  if (body.boardId && !BOARD_IDS.has(body.boardId)) {
    return NextResponse.json({ ok: false, error: 'Board inválido.' }, { status: 400 })
  }
  if (body.column && !COLUMN_IDS.has(body.column as BacklogColumnId)) {
    return NextResponse.json({ ok: false, error: 'Coluna inválida.' }, { status: 400 })
  }

  const card = await patchBacklogCard(client.slug, cardId, body)
  if (!card) {
    return NextResponse.json({ ok: false, error: 'Card não encontrado.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, card })
}
