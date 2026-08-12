import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { runAndPersistTurn } from '@/lib/backlog/copilot-turn'
import { createCopilotThread, listCopilotThreads } from '@/lib/backlog/store'
import type { BacklogBoardId } from '@/lib/backlog/types'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { getBacklogBoards } from '@/lib/backlog/boards'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  if (!isBacklogEnabled(client.slug)) {
    return NextResponse.json({ ok: false, error: 'Backlog indisponível para este cliente.' }, { status: 403 })
  }

  const threads = await listCopilotThreads(client.slug)
  return NextResponse.json({ ok: true, threads })
}

export async function POST(req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  if (!isBacklogEnabled(client.slug)) {
    return NextResponse.json({ ok: false, error: 'Backlog indisponível para este cliente.' }, { status: 403 })
  }

  let body: { boardId?: string; cardId?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }

  const boardId = body.boardId as BacklogBoardId | undefined
  const message = body.message?.trim()
  const boardIds = new Set(getBacklogBoards(client.slug).map(board => board.id))
  if (!boardId || !boardIds.has(boardId)) {
    return NextResponse.json({ ok: false, error: 'Board inválido.' }, { status: 400 })
  }
  if (!message) {
    return NextResponse.json(
      { ok: false, error: 'Escreva uma pergunta para o copiloto.' },
      { status: 400 }
    )
  }

  const thread = await createCopilotThread(client.slug, {
    boardId,
    cardId: body.cardId?.trim() || undefined,
    title: message,
  })

  try {
    const updated = await runAndPersistTurn({
      clientId: client.slug,
      clientName: client.name,
      clientSector: client.sector,
      thread,
      message,
      repos: client.delivery?.repos ?? [],
    })
    return NextResponse.json({ ok: true, thread: updated })
  } catch (e) {
    console.error('[client/backlog/copilot]', e)
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : 'Erro ao falar com o copiloto.',
        thread,
      },
      { status: 502 }
    )
  }
}
