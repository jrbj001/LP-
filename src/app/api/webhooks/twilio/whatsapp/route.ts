import { NextResponse } from 'next/server'
import { handleTwilioWhatsappWebhook } from '@/lib/twilio/webhook'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request) {
  const params = Object.fromEntries((await request.formData()).entries()) as Record<string, string>
  const result = await handleTwilioWhatsappWebhook({
    url: process.env.TWILIO_WEBHOOK_URL?.trim() || request.url,
    params,
    signature: request.headers.get('x-twilio-signature'),
  })
  return new NextResponse(result.body, {
    status: result.status,
    headers: { 'Content-Type': result.contentType },
  })
}
