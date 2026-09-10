import 'server-only'

import { formatWhatsappReply } from './format'
import { normalizeSender } from './routing'

function auth(sid: string, token: string): string {
  return `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`
}

function statusCallback(): string | undefined {
  const webhook = process.env.TWILIO_WEBHOOK_URL?.trim()
  if (!webhook) return undefined
  return webhook.replace(/\/whatsapp\/?$/, '/status')
}

async function postForm(
  url: string,
  sid: string,
  token: string,
  fields: URLSearchParams
): Promise<{ ok: boolean; status: number; body: string }> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: auth(sid, token),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: fields,
  })
  return { ok: response.ok, status: response.status, body: await response.text() }
}

export async function sendWhatsappMessage(input: {
  to: string
  body: string
  from?: string
  conversationSid?: string
}): Promise<{ sid: string; status: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = normalizeSender(input.from || process.env.TWILIO_WHATSAPP_FROM || '')
  const to = normalizeSender(input.to)
  const body = formatWhatsappReply(input.body)
  if (!sid || !token || !from) {
    throw new Error('Twilio não configurado (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM).')
  }
  if (!body) {
    throw new Error('Corpo vazio: a Twilio não enviaria mensagem.')
  }

  const conversationSid = input.conversationSid?.trim()
  if (conversationSid?.startsWith('CH')) {
    const conversation = await postForm(
      `https://conversations.twilio.com/v1/Conversations/${conversationSid}/Messages`,
      sid,
      token,
      new URLSearchParams({ Body: body, Author: from })
    )
    if (conversation.ok) {
      console.info('[twilio/send]', { via: 'conversations', http: conversation.status })
      try {
        const parsed = JSON.parse(conversation.body) as { sid?: string }
        return { sid: parsed.sid ?? '', status: 'sent' }
      } catch {
        return { sid: '', status: 'sent' }
      }
    }
    console.warn('[twilio/send]', {
      via: 'conversations',
      http: conversation.status,
      detail: conversation.body.slice(0, 160),
    })
  }

  const fields = new URLSearchParams({ From: from, To: to, Body: body })
  const callback = statusCallback()
  if (callback) fields.set('StatusCallback', callback)
  const service = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim()
  if (service) {
    fields.delete('From')
    fields.set('MessagingServiceSid', service)
  }

  const response = await postForm(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    sid,
    token,
    fields
  )
  if (!response.ok) {
    console.error('[twilio/send]', { via: 'messages', http: response.status, detail: response.body.slice(0, 160) })
    throw new Error(`Twilio recusou o envio (${response.status}): ${response.body.slice(0, 240)}`)
  }

  try {
    const parsed = JSON.parse(response.body) as { sid?: string; status?: string; error_code?: number }
    console.info('[twilio/send]', {
      via: 'messages',
      http: response.status,
      status: parsed.status ?? 'queued',
      error: parsed.error_code ?? null,
    })
    return { sid: parsed.sid ?? '', status: parsed.status ?? 'queued' }
  } catch {
    return { sid: '', status: 'queued' }
  }
}
