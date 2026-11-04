const SLACK_TEXT_LIMIT = 3500

export function clipSlackText(text: string): string {
  const trimmed = text.trim()
  if (trimmed.length <= SLACK_TEXT_LIMIT) return trimmed
  return `${trimmed.slice(0, SLACK_TEXT_LIMIT - 1).trimEnd()}…`
}

interface SlackApiResult {
  ok: boolean
  error?: string
  ts?: string
}

async function slackApi(method: string, body: Record<string, string>): Promise<SlackApiResult> {
  const token = process.env.SLACK_BOT_TOKEN?.trim()
  if (!token) throw new Error('SLACK_BOT_TOKEN não configurado.')

  const response = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  })
  const data = (await response.json()) as SlackApiResult
  if (!response.ok || !data.ok) {
    throw new Error(data.error || `Slack recusou ${method} (${response.status}).`)
  }
  return data
}

export async function postSlackMessage(input: {
  channel: string
  threadTs: string
  text: string
}): Promise<string> {
  const data = await slackApi('chat.postMessage', {
    channel: input.channel,
    thread_ts: input.threadTs,
    text: clipSlackText(input.text),
  })
  if (!data.ts) throw new Error('O Slack não devolveu o identificador da mensagem.')
  return data.ts
}

export async function updateSlackMessage(input: {
  channel: string
  ts: string
  text: string
}): Promise<void> {
  await slackApi('chat.update', {
    channel: input.channel,
    ts: input.ts,
    text: clipSlackText(input.text),
  })
}
