import { NextResponse } from 'next/server'
import { handleWhatsappInbound } from '@/lib/twilio/inbound'
import { shouldSkipTwilioSignature, verifyTwilioSignature } from '@/lib/twilio/signature'
import { renderTwiml } from '@/lib/twilio/twiml'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function twiml(body?: string): NextResponse {
  return new NextResponse(renderTwiml(body), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}

export async function POST(request: Request) {
  const params = Object.fromEntries((await request.formData()).entries()) as Record<string, string>
  const url = process.env.TWILIO_WEBHOOK_URL?.trim() || request.url
  const signed =
    shouldSkipTwilioSignature() ||
    verifyTwilioSignature({
      url,
      params,
      signature: request.headers.get('x-twilio-signature'),
    })
  if (!signed) {
    return NextResponse.json({ ok: false, error: 'Assinatura Twilio inválida.' }, { status: 403 })
  }

  const from = params.From?.trim()
  const to = params.To?.trim()
  const body = params.Body?.trim() ?? ''
  if (!from || !to) {
    return NextResponse.json({ ok: false, error: 'From/To ausentes.' }, { status: 400 })
  }

  try {
    const result = await handleWhatsappInbound({
      from,
      to,
      body,
      profileName: params.ProfileName?.trim(),
      messageSid: params.MessageSid?.trim() || params.SmsSid?.trim(),
    })
    if (!result.ok) {
      console.error('[twilio/whatsapp]', result.error)
    }
    return twiml(result.reply)
  } catch (error) {
    console.error('[twilio/whatsapp]', error)
    return twiml()
  }
}
