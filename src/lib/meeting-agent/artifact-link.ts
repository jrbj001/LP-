import 'server-only'

import { publicAppOrigin } from '@/lib/recall/client'
import { avatarSecret, signArtifactToken } from './avatar-token'

/** Caminho relativo, válido na própria aplicação (sandbox e painel). */
export function artifactPath(interactionId: string): string | null {
  const secret = avatarSecret()
  if (!secret) return null
  const token = signArtifactToken(interactionId, secret)
  return `/api/meeting-agent/artifact/${interactionId}?token=${token}`
}

/** URL absoluta para o chat da call. Sem origem pública, fica o caminho relativo. */
export function artifactUrl(interactionId: string): string | null {
  const path = artifactPath(interactionId)
  if (!path) return null
  try {
    return `${publicAppOrigin()}${path}`
  } catch {
    return path
  }
}
