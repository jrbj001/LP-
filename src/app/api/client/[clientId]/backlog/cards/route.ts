import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { createManualCard } from '@/lib/backlog/store'
import type { BacklogBoardId } from '@/lib/backlog/types'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { getBacklogBoards } from '@/lib/backlog/boards'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  if (!isBacklogEnabled(client.slug)) {
    return NextResponse.json({ ok: false, error: 'Backlog indisponível para este cliente.' }, { status: 403 })
  }

  let body: { boardId?: string; title?: string; priority?: string; context?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }

  const title = body.title?.trim()
  const boardId = body.boardId as BacklogBoardId | undefined
  const boardIds = new Set(getBacklogBoards(client.slug).map(board => board.id))
  if (!title) {
    return NextResponse.json({ ok: false, error: 'Informe o título do requisito.' }, { status: 400 })
  }
  if (!boardId || !boardIds.has(boardId)) {
    return NextResponse.json({ ok: false, error: 'Board inválido.' }, { status: 400 })
  }

  const priority =
    body.priority === 'Alta' || body.priority === 'Média' || body.priority === 'Baixa'
      ? body.priority
      : undefined

  const card = await createManualCard(client.slug, {
    boardId,
    title,
    priority,
    context: body.context?.trim(),
  })

  return NextResponse.json({ ok: true, card })
}
