import { handleWhatsappInbound } from './inbound'
import { shouldSkipTwilioSignature, verifyTwilioSignature } from './signature'
import { renderTwiml } from './twiml'

export type TwilioWebhookResult = {
  status: number
  body: string
  contentType: string
}

function xml(): TwilioWebhookResult {
  return { status: 200, body: renderTwiml(), contentType: 'text/xml' }
}

function json(status: number, payload: Record<string, unknown>): TwilioWebhookResult {
  return { status, body: JSON.stringify(payload), contentType: 'application/json' }
}

/** Mesmo fluxo da primeira versão que entregava: Copiloto → API Messages → TwiML vazio. */
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

  try {
    const result = await handleWhatsappInbound({
      from,
      to,
      body,
      profileName: input.params.ProfileName?.trim(),
    })
    if (!result.ok) {
      console.error('[twilio/whatsapp]', result.error)
    }
  } catch (error) {
    console.error('[twilio/whatsapp]', error)
  }

  return xml()
}
