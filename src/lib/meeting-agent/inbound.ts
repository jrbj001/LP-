import 'server-only'

import { getClient } from '@/lib/client/registry'
import { CADENCE_BOT_NAME, sendChatMessage } from '@/lib/recall/client'
import { answerMeetingQuestion } from './agent'
import { artifactUrl } from './artifact-link'
import { questionNeedsLookup } from './lookup'
import { runPostMeeting } from './post-meeting'
import { answerMeetingLookup } from './research-reply'
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
import { formatGridForChat } from './table-artifact'
import type { MeetingBotRecord, MeetingBotStatus, MeetingTableArtifact } from './types'
import { detectWakeWord, priorQuestion } from './wake-word'
import { voiceEnabled } from './voice'

const PENDING_WAKE_SECONDS = 90
const LOOKBACK_MINUTES = 3
/** Sem notícia da página do avatar por esse tempo, a transcrição do Recall volta a disparar respostas. */
const LIVE_LISTENING_STALE_MS = 2 * 60_000
const ASK_PROMPT = 'Oi, tô aqui. Pode perguntar.'
const FAILURE_REPLY = 'Não consegui responder agora. Pode repetir a pergunta daqui a pouco?'
const LOOKUP_ACK = 'Vou verificar e mando o detalhe no chat.'

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

/**
 * Até duas falas por resposta, em ordem: o aviso de consulta e o resultado.
 * A conversa genérica usa só uma. Texto repetido não entra de novo.
 */
function speaker(bot: MeetingBotRecord) {
  const pending: Promise<void>[] = []
  const said = new Set<string>()
  return {
    say(text: string) {
      const clean = speakableText(text)
      if (!clean || said.has(clean) || said.size >= 2 || !voiceEnabled()) return
      said.add(clean)
      pending.push(
        enqueueSpeech(bot.id, bot.clientId, clean).catch((error: unknown) => {
          console.error('[meeting-agent/speech-queue]', error instanceof Error ? error.message : error)
        })
      )
    },
    done: () => Promise.all(pending),
  }
}

/** O chat da call só recebe texto: a grade vira linhas e o CSV vira link. */
function chatBody(answer: string, artifact: MeetingTableArtifact | null, interactionId: string): string {
  if (!artifact) return answer
  if (artifact.kind === 'grid') return `${answer}\n\n${formatGridForChat(artifact)}`
  const link = artifactUrl(interactionId)
  const line = link
    ? `Planilha com ${artifact.rowCount} linhas (${artifact.sourceName}): ${link}`
    : `Há ${artifact.rowCount} linhas em ${artifact.sourceName}. A planilha está no painel da reunião.`
  return `${answer}\n\n${line}`
}

/** Chat da call pelo Recall. No sandbox não há call: a resposta aparece pelas interações. */
async function sendChat(bot: MeetingBotRecord, text: string): Promise<void> {
  if (bot.recallBotId) await sendChatMessage(bot.recallBotId, text)
}

async function respond(bot: MeetingBotRecord, question: string, from: string | null): Promise<void> {
  const client = getClient(bot.clientId)
  if (!client || (!bot.recallBotId && !bot.sandbox)) return
  const started = Date.now()
  const voice = speaker(bot)
  const lookup = questionNeedsLookup(question)
  if (lookup) {
    voice.say(LOOKUP_ACK)
    void sendChat(bot, 'Verificando…').catch(() => {})
  }

  try {
    const result = lookup
      ? await answerMeetingLookup({ client, botId: bot.id, question })
      : await answerMeetingQuestion({
          client,
          botId: bot.id,
          question,
          speaker: from,
          onSpoken: text => voice.say(text),
        })
    const artifact = result.artifact
    voice.say(result.spoken)
    const interactionId = await insertInteraction({
      botId: bot.id,
      clientId: bot.clientId,
      speaker: from,
      question,
      answer: result.answer,
      tools: result.tools,
      sources: result.sources,
      latencyMs: Date.now() - started,
      artifact,
    })
    await sendChat(bot, chatBody(result.answer, artifact, interactionId))
    await voice.done()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    console.error('[meeting-agent/respond]', message)
    voice.say(FAILURE_REPLY)
    await sendChat(bot, FAILURE_REPLY).catch(() => {})
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
  if (!bot.recallBotId && !bot.sandbox) return
  await sendChat(bot, ASK_PROMPT).catch(() => {})
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

/**
 * Fala ou mensagem da reunião simulada. A transcrição é gravada por quem chama, para a tela
 * mostrar na hora; aqui só decide se o Cadence responde. Sem exigir o nome, responde a tudo.
 */
export async function handleSandboxUtterance(
  bot: MeetingBotRecord,
  input: { text: string; speaker: string | null; source: 'speech' | 'chat'; requireWake: boolean }
): Promise<void> {
  if (!bot.sandbox || bot.status !== 'recording') return
  if (!input.requireWake) {
    await clearPendingWake(bot.id)
    await respond(bot, input.text, input.speaker)
    return
  }
  await routeUtterance(bot, input, async () => {
    const recent = await listRecentSegments(bot.id, LOOKBACK_MINUTES)
    return priorQuestion(recent.slice(0, -1), input.speaker)
  })
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
