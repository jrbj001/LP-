import { createHmac, timingSafeEqual } from 'node:crypto'

const MAX_AGE_MS = 5 * 60 * 1000

export function verifyMondaySignature(input: {
  rawBody: string
  timestamp: string | null
  signature: string | null
  signingSecret?: string
  nowMs?: number
}): boolean {
  const secret = input.signingSecret ?? process.env.MONDAY_AGENT_SIGNING_SECRET?.trim()
  const timestamp = input.timestamp?.trim() ?? ''
  const signature = input.signature?.trim() ?? ''
  if (!secret || !timestamp || !signature) return false

  const issuedAt = Number(timestamp)
  if (!Number.isFinite(issuedAt)) return false
  const now = input.nowMs ?? Date.now()
  if (Math.abs(now - issuedAt) > MAX_AGE_MS) return false

  const expected =
    'sha256=' + createHmac('sha256', secret).update(`${timestamp}.${input.rawBody}`).digest('hex')
  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}
