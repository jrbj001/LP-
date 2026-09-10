import { formatWhatsappReply } from './format'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/**
 * Resposta inbound oficial da Twilio.
 * Não usar from/to aqui: se o from for rejeitado, a Message não sai.
 */
export function renderTwiml(body?: string): string {
  const text = body?.trim() ? formatWhatsappReply(body) : ''
  if (!text) {
    return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
  }
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(text)}</Message></Response>`
}
