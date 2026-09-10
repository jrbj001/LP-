import { formatWhatsappReply } from './format'
import { normalizeSender } from './routing'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function renderTwiml(body?: string, addresses?: { to?: string; from?: string }): string {
  const text = body?.trim() ? formatWhatsappReply(body) : ''
  if (!text) {
    return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
  }
  const to = addresses?.to ? ` to="${escapeXml(normalizeSender(addresses.to))}"` : ''
  const from = addresses?.from ? ` from="${escapeXml(normalizeSender(addresses.from))}"` : ''
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message${from}${to}><Body>${escapeXml(text)}</Body></Message></Response>`
}
