import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { getBacklogSnapshot } from '@/lib/backlog/store'
import { isBacklogEnabled } from '@/lib/backlog/access'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
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

  const snapshot = await getBacklogSnapshot(client.slug)
  return NextResponse.json({ ok: true, ...snapshot })
}
