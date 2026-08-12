import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { runAndPersistTurn } from '@/lib/backlog/copilot-turn'
import { getCopilotThread } from '@/lib/backlog/store'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string; threadId: string }> }
) {
  const { clientId, threadId } = await params
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

  let body: { message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }

  const message = body.message?.trim()
  if (!message) {
    return NextResponse.json(
      { ok: false, error: 'Escreva uma pergunta para o copiloto.' },
      { status: 400 }
    )
  }

  const thread = await getCopilotThread(client.slug, threadId)
  if (!thread) {
    return NextResponse.json({ ok: false, error: 'Conversa não encontrada.' }, { status: 404 })
  }

  try {
    const updated = await runAndPersistTurn({
      clientId: client.slug,
      thread,
      message,
      repos: client.delivery?.repos ?? [],
    })
    return NextResponse.json({ ok: true, thread: updated })
  } catch (e) {
    console.error('[client/backlog/copilot/messages]', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Erro ao falar com o copiloto.' },
      { status: 502 }
    )
  }
}
