import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { getCopilotThread } from '@/lib/backlog/store'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
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

  const thread = await getCopilotThread(client.slug, threadId)
  if (!thread) {
    return NextResponse.json({ ok: false, error: 'Conversa não encontrada.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, thread })
}
