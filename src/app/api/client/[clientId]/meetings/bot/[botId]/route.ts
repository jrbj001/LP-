import { after, NextResponse } from 'next/server'
import { requireClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'
import { statusFromRecallCode } from '@/lib/meeting-agent/inbound'
import { runPostMeeting } from '@/lib/meeting-agent/post-meeting'
import {
  getBotRecord,
  listInteractions,
  listSegments,
  meetingAgentErrorMessage,
  requireMeetingAgentDatabase,
  updateBotStatus,
} from '@/lib/meeting-agent/store'
import type { MeetingBotRecord } from '@/lib/meeting-agent/types'
import { getBot, latestBotStatus, leaveCall } from '@/lib/recall/client'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Params = { params: Promise<{ clientId: string; botId: string }> }

const ACTIVE = new Set(['created', 'joining', 'in_call', 'recording', 'ended'])

async function load(params: Params['params']) {
  const { clientId, botId } = await params
  const session = await requireClientSession(clientId)
  if (session instanceof NextResponse) return { error: session }
  const client = getClient(clientId)!
  let bot: MeetingBotRecord | null
  try {
    requireMeetingAgentDatabase()
    bot = /^[0-9a-f-]{36}$/i.test(botId) ? await getBotRecord(client.slug, botId) : null
  } catch (error) {
    return { error: NextResponse.json({ ok: false, error: meetingAgentErrorMessage(error) }, { status: 503 }) }
  }
  if (!bot) return { error: NextResponse.json({ ok: false, error: 'Bot não encontrado.' }, { status: 404 }) }
  return { client, bot }
}

/** Fallback do webhook de status: consulta o Recall e dispara o relatório quando o bot terminou. */
async function syncWithRecall(bot: MeetingBotRecord): Promise<MeetingBotRecord> {
  if (!bot.recallBotId || !ACTIVE.has(bot.status)) return bot
  try {
    const status = statusFromRecallCode(latestBotStatus(await getBot(bot.recallBotId)))
    if (!status || status === bot.status) return bot
    await updateBotStatus(bot.id, status)
    return { ...bot, status }
  } catch (error) {
    console.warn('[client/meetings/bot/sync]', error instanceof Error ? error.message : error)
    return bot
  }
}

export async function GET(req: Request, { params }: Params) {
  const loaded = await load(params)
  if ('error' in loaded) return loaded.error
  const { client } = loaded
  let { bot } = loaded

  const url = new URL(req.url)
  const afterId = Math.max(0, Number(url.searchParams.get('after')) || 0)
  if (url.searchParams.get('sync') === '1') bot = await syncWithRecall(bot)
  if (bot.status === 'done' && bot.reportStatus === 'none') {
    after(() => runPostMeeting(client.slug, bot.id))
  }

  const [segments, interactions] = await Promise.all([listSegments(bot.id, afterId), listInteractions(bot.id)])
  return NextResponse.json({ ok: true, bot, segments, interactions })
}

export async function POST(req: Request, { params }: Params) {
  const loaded = await load(params)
  if ('error' in loaded) return loaded.error
  const { client, bot } = loaded

  let body: { action?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }

  if (body.action === 'leave') {
    if (!bot.recallBotId || !ACTIVE.has(bot.status)) {
      return NextResponse.json({ ok: false, error: 'O bot não está na chamada.' }, { status: 409 })
    }
    try {
      await leaveCall(bot.recallBotId)
      await updateBotStatus(bot.id, 'ended')
      return NextResponse.json({ ok: true })
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: error instanceof Error ? error.message : 'Erro ao remover o bot.' },
        { status: 502 }
      )
    }
  }

  if (body.action === 'report') {
    if (bot.status !== 'done' && bot.status !== 'ended') {
      return NextResponse.json({ ok: false, error: 'A reunião ainda não terminou.' }, { status: 409 })
    }
    if (bot.reportStatus === 'running') {
      return NextResponse.json({ ok: false, error: 'O relatório já está sendo gerado.' }, { status: 409 })
    }
    after(() => runPostMeeting(client.slug, bot.id))
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false, error: 'Ação inválida.' }, { status: 400 })
}
