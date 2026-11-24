import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Segredo que assina o link da página do avatar. A página roda dentro do bot do Recall,
 * então não há sessão de login: o token prende o acesso a um único bot.
 */
export function avatarSecret(): string | null {
  return process.env.MEETING_AVATAR_SECRET?.trim() || process.env.CLIENT_SESSION_SECRET?.trim() || null
}

export function signAvatarToken(botRecordId: string, secret: string): string {
  return createHmac('sha256', secret).update(`avatar:${botRecordId}`).digest('base64url')
}

export function signArtifactToken(interactionId: string, secret: string): string {
  return createHmac('sha256', secret).update(`artifact:${interactionId}`).digest('base64url')
}

export function verifyArtifactToken(interactionId: string, token: string | null, secret: string | null): boolean {
  if (!token || !secret) return false
  const expected = Buffer.from(signArtifactToken(interactionId, secret))
  const received = Buffer.from(token)
  return received.length === expected.length && timingSafeEqual(received, expected)
}

export function verifyAvatarToken(botRecordId: string, token: string | null, secret: string | null): boolean {
  if (!token || !secret) return false
  const expected = Buffer.from(signAvatarToken(botRecordId, secret))
  const received = Buffer.from(token)
  return received.length === expected.length && timingSafeEqual(received, expected)
}
