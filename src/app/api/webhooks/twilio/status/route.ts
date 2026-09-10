import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Callback da Twilio: só loga status/erro da mensagem de saída, sem PII. */
export async function POST(request: Request) {
  const params = Object.fromEntries((await request.formData()).entries()) as Record<string, string>
  console.info('[twilio/status]', {
    status: params.MessageStatus || params.SmsStatus,
    error: params.ErrorCode || null,
    sidPrefix: (params.MessageSid || params.SmsSid || '').slice(0, 2),
  })
  return new NextResponse('<Response></Response>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
