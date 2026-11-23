import 'server-only'

export const CADENCE_BOT_NAME = 'Cadence'

const JOIN_MESSAGE =
  'Olá! Sou o Cadence, Product Engineer da equipe. Esta reunião está sendo transcrita para gerar resumo, decisões e próximos passos. ' +
  'Para me perguntar algo, diga "Cadence," seguido da pergunta ou escreva @Cadence aqui no chat. ' +
  'Se alguém não concordar com a transcrição, é só me remover da chamada.'

export class RecallError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}

function recallApiKey(): string | undefined {
  return process.env.CADENCE_API_KEY?.trim() || process.env.RECALL_API_KEY?.trim() || undefined
}

export function hasRecallCredentials(): boolean {
  return Boolean(recallApiKey())
}

function apiBase(): string {
  const region = process.env.RECALL_REGION?.trim() || 'us-west-2'
  return `https://${region}.recall.ai/api/v1`
}

/** Origem pública que o Recall alcança. Em dev é a URL do túnel apontando para o `vercel dev`. */
export function publicAppOrigin(): string {
  const explicit = process.env.CADENCE_PUBLIC_URL?.trim() || process.env.MCP_SERVER_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`
  throw new Error('CADENCE_PUBLIC_URL não configurado — o Recall precisa de uma URL pública para o webhook.')
}

export function recallWebhookUrl(): string {
  return `${publicAppOrigin()}/api/webhooks/recall`
}

async function recall<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = recallApiKey()
  if (!key) throw new RecallError('CADENCE_API_KEY não configurado.', 503)
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      Authorization: key,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    let detail = ''
    try {
      detail = JSON.stringify(await res.json()).slice(0, 400)
    } catch {
      /* corpo vazio */
    }
    throw new RecallError(`Recall ${res.status}${detail ? `: ${detail}` : ''}`, res.status)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export interface RecallBot {
  id: string
  meeting_url?: unknown
  status_changes?: { code: string; sub_code?: string | null; created_at: string }[]
}

export function isSupportedMeetingUrl(value: string): boolean {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return false
    return /(^|\.)meet\.google\.com$|(^|\.)zoom\.us$|(^|\.)teams\.microsoft\.com$|(^|\.)teams\.live\.com$/i.test(
      url.hostname
    )
  } catch {
    return false
  }
}

export async function createBot(input: {
  meetingUrl: string
  clientId: string
  botRecordId: string
}): Promise<RecallBot> {
  return recall<RecallBot>('/bot/', {
    method: 'POST',
    body: JSON.stringify({
      meeting_url: input.meetingUrl,
      bot_name: CADENCE_BOT_NAME,
      metadata: { client_id: input.clientId, bot_record_id: input.botRecordId },
      chat: { on_bot_join: { send_to: 'everyone', message: JOIN_MESSAGE } },
      recording_config: {
        transcript: {
          provider: {
            // prioritize_low_latency só aceita inglês. Em português o Recall exige
            // prioritize_accuracy; os eventos de fala chegam com alguns minutos de atraso.
            recallai_streaming: { mode: 'prioritize_accuracy', language_code: 'pt' },
          },
        },
        realtime_endpoints: [
          {
            type: 'webhook',
            url: recallWebhookUrl(),
            events: ['transcript.data', 'participant_events.chat_message'],
          },
        ],
      },
    }),
  })
}

export function getBot(botId: string): Promise<RecallBot> {
  return recall<RecallBot>(`/bot/${encodeURIComponent(botId)}/`)
}

export async function leaveCall(botId: string): Promise<void> {
  await recall<unknown>(`/bot/${encodeURIComponent(botId)}/leave_call/`, { method: 'POST' })
}

const CHAT_LIMIT = 4000

export async function sendChatMessage(botId: string, text: string): Promise<void> {
  const message = text.length > CHAT_LIMIT ? `${text.slice(0, CHAT_LIMIT - 1)}…` : text
  await recall<unknown>(`/bot/${encodeURIComponent(botId)}/send_chat_message/`, {
    method: 'POST',
    body: JSON.stringify({ to: 'everyone', message }),
  })
}

/** Fase 2: resposta em voz. `mp3` precisa ser o áudio já sintetizado (TTS). */
export async function outputAudio(botId: string, mp3: Buffer): Promise<void> {
  await recall<unknown>(`/bot/${encodeURIComponent(botId)}/output_audio/`, {
    method: 'POST',
    body: JSON.stringify({ kind: 'mp3', b64_data: mp3.toString('base64') }),
  })
}

export function latestBotStatus(bot: RecallBot): string | null {
  const changes = bot.status_changes ?? []
  return changes.length ? changes[changes.length - 1].code : null
}
