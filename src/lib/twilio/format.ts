const WHATSAPP_LIMIT = 1500

const CHITCHAT =
  /^(oi+|ol[áa]|hey|e a[ií]|eai|opa|fala|bom dia|boa tarde|boa noite|obrigad[oa]|valeu|ok+|beleza|tudo bem\??|td bem\??|como vai\??)[\s!.?]*$/i

/** Saudação curta — não dispara consulta nem GitHub. */
export function isChitChat(message: string): boolean {
  return CHITCHAT.test(message.trim())
}

export function formatWhatsappReply(text: string): string {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/^\s*(fonte|sql|query|endpoint|boardid)\s*:\s*.+$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (cleaned.length <= WHATSAPP_LIMIT) return cleaned
  return `${cleaned.slice(0, WHATSAPP_LIMIT - 1).trimEnd()}…`
}
