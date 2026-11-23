import { NextResponse } from 'next/server'
import { requireClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'
import {
  attachRecallBot,
  createBotRecord,
  listBotRecords,
  markBotFailed,
  meetingAgentErrorMessage,
  requireMeetingAgentDatabase,
} from '@/lib/meeting-agent/store'
import { createBot, hasRecallCredentials, isSupportedMeetingUrl, RecallError } from '@/lib/recall/client'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const session = await requireClientSession(clientId)
  if (session instanceof NextResponse) return session
  const client = getClient(clientId)!

  try {
    requireMeetingAgentDatabase()
    return NextResponse.json({ ok: true, bots: await listBotRecords(client.slug, 10) })
  } catch (error) {
    return NextResponse.json({ ok: false, error: meetingAgentErrorMessage(error) }, { status: 503 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const session = await requireClientSession(clientId)
  if (session instanceof NextResponse) return session
  const client = getClient(clientId)!

  let body: { meetingUrl?: unknown; title?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }
  const meetingUrl = typeof body.meetingUrl === 'string' ? body.meetingUrl.trim() : ''
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 140) : ''
  if (!isSupportedMeetingUrl(meetingUrl)) {
    return NextResponse.json(
      { ok: false, error: 'Informe um link https do Google Meet, Zoom ou Microsoft Teams.' },
      { status: 400 }
    )
  }
  if (!hasRecallCredentials()) {
    return NextResponse.json({ ok: false, error: 'CADENCE_API_KEY não configurado.' }, { status: 503 })
  }

  let record: Awaited<ReturnType<typeof createBotRecord>>
  try {
    requireMeetingAgentDatabase()
    record = await createBotRecord({ clientId: client.slug, meetingUrl, title: title || undefined })
  } catch (error) {
    return NextResponse.json({ ok: false, error: meetingAgentErrorMessage(error) }, { status: 503 })
  }

  try {
    const bot = await createBot({ meetingUrl, clientId: client.slug, botRecordId: record.id })
    await attachRecallBot(record.id, bot.id)
    return NextResponse.json({ ok: true, bot: { ...record, recallBotId: bot.id, status: 'joining' } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar o bot.'
    console.error('[client/meetings/bot]', message)
    await markBotFailed(record.id, message)
    const status = error instanceof RecallError && error.status < 500 ? 400 : 502
    return NextResponse.json({ ok: false, error: message }, { status })
  }
}
