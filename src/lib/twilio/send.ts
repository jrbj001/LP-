import 'server-only'

import { formatWhatsappReply } from './format'
import { normalizeSender } from './routing'

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
    const conversation = await fetch(
      `https://conversations.twilio.com/v1/Conversations/${conversationSid}/Messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ Body: body }),
      }
    )
    const detail = await conversation.text()
    if (!conversation.ok) {
      throw new Error(`Twilio Conversations recusou (${conversation.status}): ${detail.slice(0, 240)}`)
    }
    try {
      const parsed = JSON.parse(detail) as { sid?: string }
      return { sid: parsed.sid ?? '', status: 'sent' }
    } catch {
      return { sid: '', status: 'sent' }
    }
  }

  const fields = new URLSearchParams({
    From: from,
    To: to,
    Body: body,
  })
  const webhook = process.env.TWILIO_WEBHOOK_URL?.trim()
  if (webhook) {
    fields.set('StatusCallback', webhook.replace(/\/whatsapp\/?$/, '/status'))
  }
  const service = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim()
  if (service) {
    fields.delete('From')
    fields.set('MessagingServiceSid', service)
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: fields,
  })
  const detail = await response.text()
  if (!response.ok) {
    throw new Error(`Twilio recusou o envio (${response.status}): ${detail.slice(0, 240)}`)
  }
  try {
    const parsed = JSON.parse(detail) as { sid?: string; status?: string }
    return { sid: parsed.sid ?? '', status: parsed.status ?? 'queued' }
  } catch {
    return { sid: '', status: 'queued' }
  }
}
