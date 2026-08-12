import { NextResponse } from 'next/server'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { getBacklogBoards } from '@/lib/backlog/boards'
import {
  generateMeetingBacklogDrafts,
  markAlreadyExported,
  type MeetingExportMode,
} from '@/lib/backlog/meeting-export'
import { getBacklogSnapshot } from '@/lib/backlog/store'
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

  let body: { mode?: unknown; brief?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }
  const mode: MeetingExportMode | null =
    body.mode === 'requirement' || body.mode === 'story' ? body.mode : null
  if (!mode) {
    return NextResponse.json({ ok: false, error: 'Modo inválido.' }, { status: 400 })
  }
  if (body.brief !== undefined && (typeof body.brief !== 'string' || body.brief.length > 6000)) {
    return NextResponse.json({ ok: false, error: 'Brief inválido ou muito extenso.' }, { status: 400 })
  }

  try {
    const [generated, snapshot] = await Promise.all([
      generateMeetingBacklogDrafts(client, meeting, mode, body.brief),
      getBacklogSnapshot(client.slug),
    ])
    const drafts = markAlreadyExported(meeting.id, generated, snapshot.cards)
    return NextResponse.json({
      ok: true,
      mode,
      drafts,
      boards: getBacklogBoards(client.slug),
    })
  } catch (error) {
    console.error('[client/meeting-backlog/generate]', error)
    const message = error instanceof Error ? error.message : 'Erro ao gerar itens para o backlog.'
    const status = message.includes('OPENAI_API_KEY') ? 503 : 502
    return NextResponse.json({ ok: false, error: message }, { status })
  }
}
