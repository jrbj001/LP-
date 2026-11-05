import { createHmac, timingSafeEqual } from 'node:crypto'

const MAX_SKEW_MS = 5 * 60 * 1000

export function verifyMondayAgentSignature(input: {
  secret: string
  rawBody: string
  timestamp: string | null
  signature: string | null
  now?: number
}): boolean {
  if (!input.secret || !input.timestamp || !input.signature) return false
  const sentAt = Number(input.timestamp)
  if (!Number.isFinite(sentAt)) return false
  const now = input.now ?? Date.now()
  if (Math.abs(now - sentAt) > MAX_SKEW_MS) return false

  const expected =
    'sha256=' + createHmac('sha256', input.secret).update(`${input.timestamp}.${input.rawBody}`).digest('hex')
  const left = Buffer.from(expected)
  const right = Buffer.from(input.signature)
  return left.length === right.length && timingSafeEqual(left, right)
}
