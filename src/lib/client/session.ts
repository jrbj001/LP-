export interface ClientSession {
  slug: string
  name: string
  exp: number
}

export const CLIENT_SESSION_COOKIE = 'cadence.client.session'
export const CLIENT_SESSION_TTL_SECONDS = 60 * 60 * 12

export function clientSessionSecret(): string {
  const secret = process.env.CLIENT_SESSION_SECRET || process.env.ADAPTIVE_OPS_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV !== 'production') return 'cadence-client-local-development-secret'
  throw new Error('CLIENT_SESSION_SECRET não configurado')
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  return Uint8Array.from(binary, char => char.charCodeAt(0))
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false
  let diff = 0
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return diff === 0
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(clientSessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return toBase64Url(new Uint8Array(signature))
}

export async function createClientSessionToken(
  session: Omit<ClientSession, 'exp'>
): Promise<string> {
  const payload = toBase64Url(
    new TextEncoder().encode(
      JSON.stringify({
        ...session,
        exp: Math.floor(Date.now() / 1000) + CLIENT_SESSION_TTL_SECONDS,
      })
    )
  )
  return `${payload}.${await sign(payload)}`
}

export async function verifyClientSessionToken(
  token?: string
): Promise<ClientSession | null> {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  if (!safeEqual(signature, await sign(payload))) return null

  try {
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as ClientSession
    if (!parsed.slug || !parsed.name) return null
    if (parsed.exp <= Math.floor(Date.now() / 1000)) return null
    return parsed
  } catch {
    return null
  }
}

export function canAccessClient(session: ClientSession, slug: string): boolean {
  return session.slug === slug
}
