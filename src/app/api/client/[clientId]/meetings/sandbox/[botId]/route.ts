import { after, NextResponse } from 'next/server'
import { requireClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'
import { handleSandboxUtterance } from '@/lib/meeting-agent/inbound'
import { runPostMeeting } from '@/lib/meeting-agent/post-meeting'
import {
  getBotRecord,
  insertSegment,
  meetingAgentErrorMessage,
  requireMeetingAgentDatabase,
  updateBotStatus,
} from '@/lib/meeting-agent/store'
import type { MeetingBotRecord } from '@/lib/meeting-agent/types'
import { transcribeSpeech, voiceEnabled } from '@/lib/meeting-agent/voice'
import { detectWakeWord } from '@/lib/meeting-agent/wake-word'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Params = { params: Promise<{ clientId: string; botId: string }> }

const MAX_AUDIO_BYTES = 3 * 1024 * 1024
const MAX_TEXT_CHARS = 2000
const DEFAULT_SPEAKER = 'Você'

function speakerName(value: unknown): string {
  return (typeof value === 'string' ? value.trim().slice(0, 60) : '') || DEFAULT_SPEAKER
}

/** Diz à tela se vale mostrar o Cadence "pensando" enquanto a resposta não chega. */
function willRespond(text: string, source: 'speech' | 'chat', requireWake: boolean): boolean {
  return !requireWake || detectWakeWord(text, source).kind !== 'none'
}

async function record(
  bot: MeetingBotRecord,
  input: { text: string; speaker: string; source: 'speech' | 'chat'; requireWake: boolean }
) {
  await insertSegment({
    botId: bot.id,
    clientId: bot.clientId,
    speaker: input.speaker,
    text: input.text,
    source: input.source,
    tsStart: null,
    tsEnd: null,
  })
  after(() =>
    handleSandboxUtterance(bot, input).catch(error => {
      console.error('[meetings/sandbox]', error instanceof Error ? error.message : error)
    })
  )
  return NextResponse.json({
    ok: true,
    text: input.text,
    responding: willRespond(input.text, input.source, input.requireWake),
  })
}

/**
 * Entrada da reunião simulada: fala em áudio (multipart) ou JSON com `chat` ou `end`.
 * A transcrição e as respostas são lidas pelo GET de `/meetings/bot/[botId]`.
 */
export async function POST(req: Request, { params }: Params) {
  const { clientId, botId } = await params
  const session = await requireClientSession(clientId)
  if (session instanceof NextResponse) return session
  const client = getClient(clientId)!

  let bot: MeetingBotRecord | null
  try {
    requireMeetingAgentDatabase()
    bot = /^[0-9a-f-]{36}$/i.test(botId) ? await getBotRecord(client.slug, botId) : null
  } catch (error) {
    return NextResponse.json({ ok: false, error: meetingAgentErrorMessage(error) }, { status: 503 })
  }
  if (!bot?.sandbox) return NextResponse.json({ ok: false, error: 'Sessão não encontrada.' }, { status: 404 })
  if (bot.status !== 'recording') {
    return NextResponse.json({ ok: false, error: 'A reunião simulada já terminou.' }, { status: 409 })
  }

  if ((req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
    if (!voiceEnabled()) {
      return NextResponse.json({ ok: false, error: 'Voz não configurada.' }, { status: 503 })
    }
    const form = await req.formData().catch(() => null)
    const audio = form?.get('audio')
    if (!(audio instanceof Blob) || audio.size === 0 || audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ ok: false, error: 'Áudio inválido.' }, { status: 400 })
    }
    let text: string
    try {
      text = await transcribeSpeech(audio)
    } catch (error) {
      console.error('[meetings/sandbox/listen]', error instanceof Error ? error.message : error)
      return NextResponse.json({ ok: false, error: 'Falha ao transcrever.' }, { status: 502 })
    }
    if (!text) return NextResponse.json({ ok: true, text: '', responding: false })
    return record(bot, {
      text,
      speaker: speakerName(form?.get('speaker')),
      source: 'speech',
      requireWake: form?.get('requireWake') !== 'false',
    })
  }

  let body: { action?: unknown; text?: unknown; speaker?: unknown; requireWake?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }

  if (body.action === 'chat') {
    const text = typeof body.text === 'string' ? body.text.trim().slice(0, MAX_TEXT_CHARS) : ''
    if (!text) return NextResponse.json({ ok: false, error: 'Mensagem vazia.' }, { status: 400 })
    return record(bot, {
      text,
      speaker: speakerName(body.speaker),
      source: 'chat',
      requireWake: body.requireWake !== false,
    })
  }

  if (body.action === 'end') {
    await updateBotStatus(bot.id, 'done')
    const ended = bot
    after(() => runPostMeeting(ended.clientId, ended.id))
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false, error: 'Ação inválida.' }, { status: 400 })
}
