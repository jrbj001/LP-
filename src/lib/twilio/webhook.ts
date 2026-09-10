import { orientationWelcome } from './quick-reply'
import { sendWhatsappMessage } from './send'
import { shouldSkipTwilioSignature, verifyTwilioSignature } from './signature'
import { sendWhatsappTyping } from './typing'
import { renderTwiml } from './twiml'

export type TwilioWebhookResult = {
  status: number
  body: string
  contentType: string
}

function xml(body?: string, addresses?: { to: string; from: string }): TwilioWebhookResult {
  return { status: 200, body: renderTwiml(body, addresses), contentType: 'text/xml' }
}

function json(status: number, payload: Record<string, unknown>): TwilioWebhookResult {
  return { status, body: JSON.stringify(payload), contentType: 'application/json' }
}

async function deliverReply(input: { to: string; from: string; body: string }): Promise<TwilioWebhookResult> {
  try {
    await sendWhatsappMessage(input)
  } catch (error) {
    console.error('[twilio/whatsapp] send', error)
  }
  // Nunca devolver Response vazio depois do oi: a Twilio trata isso como “não responder”
  // e o indicador de digitação some sem texto.
  return xml(input.body, { to: input.to, from: input.from })
}

export async function handleTwilioWhatsappWebhook(input: {
  url: string
  params: Record<string, string>
  signature?: string | null
}): Promise<TwilioWebhookResult> {
  const signed =
    shouldSkipTwilioSignature() ||
    verifyTwilioSignature({
      url: input.url,
      params: input.params,
      signature: input.signature,
    })
  if (!signed) {
    return json(403, { ok: false, error: 'Assinatura Twilio inválida.' })
  }

  const from = input.params.From?.trim()
  const to = input.params.To?.trim()
  const body = input.params.Body?.trim() ?? ''
  if (!from || !to) {
    return json(400, { ok: false, error: 'From/To ausentes.' })
  }

  const messageSid = input.params.MessageSid?.trim() || input.params.SmsSid?.trim()
  await sendWhatsappTyping(messageSid)

  const welcome = orientationWelcome(to, body)
  if (welcome) {
    return deliverReply({ to: from, from: welcome.from, body: welcome.reply })
  }

  try {
    const { handleWhatsappInbound } = await import('./inbound')
    const result = await handleWhatsappInbound({
      from,
      to,
      body,
      profileName: input.params.ProfileName?.trim(),
      messageSid,
    })
    if (!result.ok) {
      console.error('[twilio/whatsapp]', result.error)
    }
    if (!result.reply) return xml()
    return deliverReply({ to: from, from: to, body: result.reply })
  } catch (error) {
    console.error('[twilio/whatsapp]', error)
    return xml()
  }
}
