import 'server-only'

import { formatWhatsappReply } from './format'

/** Mesmo envio que já entregou neste sender: Messages.json com From/To crus. */
export async function sendWhatsappMessage(input: {
  to: string
  body: string
  from?: string
}): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = input.from || process.env.TWILIO_WHATSAPP_FROM
  if (!sid || !token || !from) {
    throw new Error('Twilio não configurado (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM).')
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: from,
      To: input.to,
      Body: formatWhatsappReply(input.body),
    }),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Twilio recusou o envio (${response.status}): ${detail.slice(0, 240)}`)
  }
}
