import 'server-only'

import { getClient } from '@/lib/client/registry'
import { CADENCE_BOT_NAME, sendChatMessage } from '@/lib/recall/client'
import { answerMeetingQuestion } from './agent'
import { runPostMeeting } from './post-meeting'
import {
  clearPendingWake,
  consumePendingWake,
  enqueueSpeech,
  getBotById,
  getBotByRecallId,
  insertInteraction,
  insertSegment,
  listRecentSegments,
  setPendingWake,
  updateBotStatus,
} from './store'
import { speakableText } from './speech-text'
import type { MeetingBotRecord, MeetingBotStatus } from './types'
import { detectWakeWord, priorQuestion } from './wake-word'
import { voiceEnabled } from './voice'

const PENDING_WAKE_SECONDS = 90
const LOOKBACK_MINUTES = 3
/** Sem notícia da página do avatar por esse tempo, a transcrição do Recall volta a disparar respostas. */
const LIVE_LISTENING_STALE_MS = 2 * 60_000
const ASK_PROMPT = 'Oi, tô aqui. Pode perguntar.'
const FAILURE_REPLY = 'Não consegui responder agora. Pode repetir a pergunta daqui a pouco?'

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

function isLiveListening(bot: MeetingBotRecord): boolean {
  if (!bot.liveListeningAt) return false
  return Date.now() - new Date(bot.liveListeningAt).getTime() < LIVE_LISTENING_STALE_MS
}

/** Enfileira no máximo uma fala por resposta; a página do avatar toca assim que chega. */
function speaker(bot: MeetingBotRecord) {
  const pending: Promise<void>[] = []
  let spoken = false
  return {
    say(text: string) {
      if (spoken || !text.trim() || !voiceEnabled()) return
      spoken = true
      pending.push(
        enqueueSpeech(bot.id, bot.clientId, speakableText(text)).catch((error: unknown) => {
          console.error('[meeting-agent/speech-queue]', error instanceof Error ? error.message : error)
        })
      )
    },
    done: () => Promise.all(pending),
  }
}

async function respond(bot: MeetingBotRecord, question: string, from: string | null): Promise<void> {
  const client = getClient(bot.clientId)
  if (!client || !bot.recallBotId) return
  const recallBotId = bot.recallBotId
  const started = Date.now()
  const voice = speaker(bot)

  void sendChatMessage(recallBotId, `Verificando: "${question.slice(0, 160)}"…`).catch(() => {})

  try {
    const result = await answerMeetingQuestion({
      client,
      botId: bot.id,
      question,
      speaker: from,
      onSpoken: text => voice.say(text),
    })
    voice.say(result.spoken)
    await sendChatMessage(recallBotId, result.answer)
    await voice.done()
    await insertInteraction({
      botId: bot.id,
      clientId: bot.clientId,
      speaker: from,
      question,
      answer: result.answer,
      tools: result.tools,
      sources: result.sources,
      latencyMs: Date.now() - started,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    console.error('[meeting-agent/respond]', message)
    voice.say(FAILURE_REPLY)
    await sendChatMessage(recallBotId, FAILURE_REPLY).catch(() => {})
    await voice.done()
    await insertInteraction({
      botId: bot.id,
      clientId: bot.clientId,
      speaker: from,
      question,
      answer: null,
      tools: [],
      sources: [],
      latencyMs: Date.now() - started,
      error: message,
    })
  }
}

/** Chamaram o Cadence sem pergunta: usa a fala anterior ou pede a pergunta. */
async function answerBareWake(bot: MeetingBotRecord, from: string | null, previous: string | null): Promise<void> {
  if (previous) {
    await clearPendingWake(bot.id)
    await respond(bot, previous, from)
    return
  }
  await setPendingWake(bot.id, from)
  if (!bot.recallBotId) return
  await sendChatMessage(bot.recallBotId, ASK_PROMPT).catch(() => {})
  const voice = speaker(bot)
  voice.say(ASK_PROMPT)
  await voice.done()
}

async function routeUtterance(
  bot: MeetingBotRecord,
  input: { text: string; speaker: string | null; source: 'speech' | 'chat' },
  previous: () => Promise<string | null>
): Promise<void> {
  const wake = detectWakeWord(input.text, input.source)
  if (wake.kind === 'question') {
    await clearPendingWake(bot.id)
    await respond(bot, wake.question, input.speaker)
    return
  }
  if (wake.kind === 'wake-only') {
    await answerBareWake(bot, input.speaker, await previous())
    return
  }
  if (await consumePendingWake(bot.id, input.speaker, PENDING_WAKE_SECONDS)) {
    await respond(bot, input.text, input.speaker)
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

  // Com a página ouvindo ao vivo, a fala transcrita pelo Recall chega minutos depois:
  // serve ao relatório, mas responder a ela repetiria a resposta.
  if (input.source === 'speech' && isLiveListening(bot)) return

  await routeUtterance(bot, input, async () => {
    const recent = await listRecentSegments(bot.id, LOOKBACK_MINUTES)
    return priorQuestion(recent.slice(0, -1), input.speaker)
  })
}

/** Fala transcrita ao vivo pela página do avatar. Não entra na transcrição: o Recall já registra. */
export async function handleLiveUtterance(botId: string, text: string, previous: string | null): Promise<void> {
  const bot = await getBotById(botId)
  if (!bot?.recallBotId) return
  if (bot.status === 'ended' || bot.status === 'done' || bot.status === 'failed') return

  await routeUtterance(bot, { text, speaker: null, source: 'speech' }, async () =>
    previous ? priorQuestion([{ speaker: null, text: previous }], null) : null
  )
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
