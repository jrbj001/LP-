import { formatWhatsappReply } from './format'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/** Resposta inbound: a Twilio entrega o texto sem segunda chamada REST. */
export function renderTwiml(body?: string): string {
  const text = body?.trim()
  const inner = text ? `<Message>${escapeXml(formatWhatsappReply(text))}</Message>` : ''
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`
}
