import { createHmac, timingSafeEqual } from 'crypto'

const MAX_SKEW_SECONDS = 5 * 60

export interface RecallSignatureHeaders {
  id: string | null
  timestamp: string | null
  signature: string | null
}

export function recallSignatureHeaders(headers: Headers): RecallSignatureHeaders {
  return {
    id: headers.get('webhook-id') ?? headers.get('svix-id'),
    timestamp: headers.get('webhook-timestamp') ?? headers.get('svix-timestamp'),
    signature: headers.get('webhook-signature') ?? headers.get('svix-signature'),
  }
}

/** HMAC-SHA256 de `${id}.${timestamp}.${body}` com o segredo `whsec_…` do workspace Recall. */
export function verifyRecallSignature(input: {
  secret: string
  headers: RecallSignatureHeaders
  payload: string
  nowSeconds?: number
}): boolean {
  const { secret, headers, payload } = input
  if (!secret.startsWith('whsec_')) return false
  if (!headers.id || !headers.timestamp || !headers.signature) return false

  const timestamp = Number(headers.timestamp)
  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000)
  if (!Number.isFinite(timestamp) || Math.abs(now - timestamp) > MAX_SKEW_SECONDS) return false

  const key = Buffer.from(secret.slice('whsec_'.length), 'base64')
  const expected = createHmac('sha256', key)
    .update(`${headers.id}.${headers.timestamp}.${payload}`)
    .digest()

  for (const versioned of headers.signature.split(' ')) {
    const [version, signature] = versioned.split(',')
    if (version !== 'v1' || !signature) continue
    const received = Buffer.from(signature, 'base64')
    if (received.length === expected.length && timingSafeEqual(received, expected)) return true
  }
  return false
}
