const WHATSAPP_LIMIT = 1500

export function formatWhatsappReply(text: string): string {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (cleaned.length <= WHATSAPP_LIMIT) return cleaned
  return `${cleaned.slice(0, WHATSAPP_LIMIT - 1).trimEnd()}…`
}
