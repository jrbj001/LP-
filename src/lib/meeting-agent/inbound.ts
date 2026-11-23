import 'server-only'

import { getClient } from '@/lib/client/registry'
import { CADENCE_BOT_NAME, sendChatMessage } from '@/lib/recall/client'
import { answerMeetingQuestion } from './agent'
import { runPostMeeting } from './post-meeting'
import {
  consumePendingWake,
  getBotByRecallId,
  insertInteraction,
  insertSegment,
  setPendingWake,
  updateBotStatus,
} from './store'
import type { MeetingBotRecord, MeetingBotStatus } from './types'
import { detectWakeWord } from './wake-word'

const PENDING_WAKE_SECONDS = 20

const STATUS_BY_EVENT: Record<string, MeetingBotStatus> = {
  'bot.joining_call': 'joining',
  'bot.in_waiting_room': 'joining',
  'bot.in_call_not_recording': 'in_call',
  'bot.in_call_recording': 'recording',
  'bot.call_ended': 'ended',
  'bot.done': 'done',
  'bot.fatal': 'failed',
}

interface RecallParticipant {
  name?: string | null
}

interface RecallEnvelope {
  event?: string
  data?: {
    bot?: { id?: string }
    data?: {
      words?: { text?: string; start_timestamp?: { relative?: number }; end_timestamp?: { relative?: number } | null }[]
      participant?: RecallParticipant
      data?: { text?: string }
    }
  }
}

function isFromBot(participant: RecallParticipant | undefined): boolean {
  return (participant?.name ?? '').trim().toLowerCase() === CADENCE_BOT_NAME.toLowerCase()
}

async function respond(bot: MeetingBotRecord, question: string, speaker: string | null): Promise<void> {
  const client = getClient(bot.clientId)
  if (!client || !bot.recallBotId) return
  const recallBotId = bot.recallBotId
  const started = Date.now()

  void sendChatMessage(recallBotId, `Verificando: "${question.slice(0, 160)}"…`).catch(() => {})

  try {
    const result = await answerMeetingQuestion({ client, botId: bot.id, question, speaker })
    await sendChatMessage(recallBotId, result.answer)
    await insertInteraction({
      botId: bot.id,
      clientId: bot.clientId,
      speaker,
      question,
      answer: result.answer,
      tools: result.tools,
      sources: result.sources,
      latencyMs: Date.now() - started,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    console.error('[meeting-agent/respond]', message)
    await sendChatMessage(recallBotId, 'Não consegui responder agora. Pode repetir a pergunta daqui a pouco?').catch(() => {})
    await insertInteraction({
      botId: bot.id,
      clientId: bot.clientId,
      speaker,
      question,
      answer: null,
      tools: [],
      sources: [],
      latencyMs: Date.now() - started,
      error: message,
    })
  }
}

async function handleUtterance(
  bot: MeetingBotRecord,
  input: { text: string; speaker: string | null; source: 'speech' | 'chat'; tsStart: number | null; tsEnd: number | null }
): Promise<void> {
  await insertSegment({ botId: bot.id, clientId: bot.clientId, ...input })
  if (bot.status === 'created' || bot.status === 'joining' || bot.status === 'in_call') {
    await updateBotStatus(bot.id, 'recording')
  }

  const wake = detectWakeWord(input.text, input.source)
  if (wake.kind === 'question') {
    await respond(bot, wake.question, input.speaker)
    return
  }
  if (wake.kind === 'wake-only') {
    await setPendingWake(bot.id, input.speaker)
    return
  }
  if (input.source === 'speech' && (await consumePendingWake(bot.id, input.speaker, PENDING_WAKE_SECONDS))) {
    await respond(bot, input.text, input.speaker)
  }
}

export async function handleRecallEvent(envelope: RecallEnvelope): Promise<void> {
  const event = envelope.event ?? ''
  const recallBotId = envelope.data?.bot?.id
  if (!recallBotId) return
  const bot = await getBotByRecallId(recallBotId)
  if (!bot) return

  if (event === 'transcript.data') {
    const payload = envelope.data?.data
    if (isFromBot(payload?.participant)) return
    const words = payload?.words ?? []
    const text = words
      .map(word => word.text ?? '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (!text) return
    await handleUtterance(bot, {
      text,
      speaker: payload?.participant?.name ?? null,
      source: 'speech',
      tsStart: words[0]?.start_timestamp?.relative ?? null,
      tsEnd: words[words.length - 1]?.end_timestamp?.relative ?? null,
    })
    return
  }

  if (event === 'participant_events.chat_message') {
    const payload = envelope.data?.data
    if (isFromBot(payload?.participant)) return
    const text = payload?.data?.text?.trim()
    if (!text) return
    await handleUtterance(bot, {
      text,
      speaker: payload?.participant?.name ?? null,
      source: 'chat',
      tsStart: null,
      tsEnd: null,
    })
    return
  }

  const status = STATUS_BY_EVENT[event]
  if (!status) return
  await updateBotStatus(bot.id, status)
  if (status === 'done') await runPostMeeting(bot.clientId, bot.id)
}

/** Códigos de `status_changes` do Recall (sem o prefixo `bot.` dos webhooks). */
export function statusFromRecallCode(code: string | null): MeetingBotStatus | null {
  return code ? STATUS_BY_EVENT[`bot.${code}`] ?? null : null
}
