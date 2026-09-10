import { orientationWelcome } from './quick-reply'
import { persistWhatsappWelcome } from './persist-welcome'
import { sendWhatsappMessage } from './send'
import { shouldSkipTwilioSignature, verifyTwilioSignature } from './signature'
import { sendWhatsappTyping, withWhatsappTyping } from './typing'
import { renderTwiml } from './twiml'

export type TwilioWebhookResult = {
  status: number
  body: string
  contentType: string
}

function xml(body?: string): TwilioWebhookResult {
  return { status: 200, body: renderTwiml(body), contentType: 'text/xml' }
}

function json(status: number, payload: Record<string, unknown>): TwilioWebhookResult {
  return { status, body: JSON.stringify(payload), contentType: 'application/json' }
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
    try {
      await sendWhatsappMessage({ to: from, from: to, body: welcome.reply })
    } catch (error) {
      console.error('[twilio/whatsapp] send', error)
      return xml(welcome.reply)
    }
    try {
      await persistWhatsappWelcome({
        from,
        to,
        body,
        reply: welcome.reply,
        profileName: input.params.ProfileName?.trim(),
      })
    } catch (error) {
      console.error('[twilio/whatsapp] persist', error)
    }
    return xml()
  }

  try {
    const { handleWhatsappInbound } = await import('./inbound')
    const result = await withWhatsappTyping(messageSid, () =>
      handleWhatsappInbound({
        from,
        to,
        body,
        profileName: input.params.ProfileName?.trim(),
      })
    )
    if (!result.ok) {
      console.error('[twilio/whatsapp]', result.error)
    }
  } catch (error) {
    console.error('[twilio/whatsapp]', error)
  }

  return xml()
}
