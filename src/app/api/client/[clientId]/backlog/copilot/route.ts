import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { runAndPersistTurn } from '@/lib/backlog/copilot-turn'
import { createCopilotThread, listCopilotThreads } from '@/lib/backlog/store'
import { BACKLOG_BOARDS, type BacklogBoardId } from '@/lib/backlog/types'

export const dynamic = 'force-dynamic'

const BOARD_IDS = new Set(BACKLOG_BOARDS.map(b => b.id))

export async function GET(_req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
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

  const threads = await listCopilotThreads(client.slug)
  return NextResponse.json({ ok: true, threads })
}

export async function POST(req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
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

  let body: { boardId?: string; cardId?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }

  const boardId = body.boardId as BacklogBoardId | undefined
  const message = body.message?.trim()
  if (!boardId || !BOARD_IDS.has(boardId)) {
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
