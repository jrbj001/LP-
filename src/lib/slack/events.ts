export type SlackInbound =
  | { kind: 'challenge'; challenge: string }
  | { kind: 'ignore' }
  | { kind: 'help'; channel: string; threadTs: string }
  | { kind: 'question'; channel: string; threadTs: string; text: string; user: string }

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

export function stripSlackMention(text: string): string {
  return text.replace(/<@[A-Z0-9]+>/gi, ' ').replace(/\s+/g, ' ').trim()
}

export function interpretSlackEvent(body: unknown): SlackInbound {
  const raw = asRecord(body)
  if (!raw) return { kind: 'ignore' }

  if (raw.type === 'url_verification' && typeof raw.challenge === 'string') {
    return { kind: 'challenge', challenge: raw.challenge }
  }
  if (raw.type !== 'event_callback') return { kind: 'ignore' }

  const event = asRecord(raw.event)
  if (!event) return { kind: 'ignore' }
  if (typeof event.bot_id === 'string' || typeof event.subtype === 'string') return { kind: 'ignore' }

  const channel = typeof event.channel === 'string' ? event.channel : ''
  const ts = typeof event.ts === 'string' ? event.ts : ''
  const threadTs = typeof event.thread_ts === 'string' ? event.thread_ts : ts
  const user = typeof event.user === 'string' ? event.user : ''
  const text = typeof event.text === 'string' ? event.text : ''
  if (!channel || !ts) return { kind: 'ignore' }

  const isMention = event.type === 'app_mention'
  const isDirectMessage = event.type === 'message' && event.channel_type === 'im'
  if (!isMention && !isDirectMessage) return { kind: 'ignore' }

  const question = stripSlackMention(text)
  if (!question) return { kind: 'help', channel, threadTs }
  return { kind: 'question', channel, threadTs, text: question, user }
}
