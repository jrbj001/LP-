import { NextResponse } from 'next/server'
import { isBacklogEnabled } from '@/lib/backlog/access'
import {
  meetingItemsToCards,
  parseMeetingApplyItems,
} from '@/lib/backlog/meeting-export'
import { createBacklogCardsBatch } from '@/lib/backlog/store'
import { getClient } from '@/lib/client/registry'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string; meetingId: string }> }
) {
  const { clientId, meetingId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado.' }, { status: 404 })
  }
  if (!isBacklogEnabled(client.slug)) {
    return NextResponse.json({ ok: false, error: 'Backlog indisponível para este cliente.' }, { status: 403 })
  }
  const meeting = client.meetings?.find(item => item.id === meetingId)
  if (!meeting) {
    return NextResponse.json({ ok: false, error: 'Reunião não encontrada.' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }

  try {
    const { items } = parseMeetingApplyItems(body, client.slug)
    const cards = meetingItemsToCards(meeting, items)
    const result = await createBacklogCardsBatch(client.slug, cards)
    return NextResponse.json({
      ok: true,
      created: result.created,
      skipped: result.skipped,
      counts: { created: result.created.length, skipped: result.skipped.length },
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Payload inválido.' },
      { status: 400 }
    )
  }
}
