import { createHmac, timingSafeEqual } from 'node:crypto'

const MAX_AGE_SECONDS = 5 * 60

export function verifySlackSignature(input: {
  rawBody: string
  timestamp: string | null
  signature: string | null
  signingSecret?: string
  nowSeconds?: number
}): boolean {
  const secret = input.signingSecret ?? process.env.SLACK_SIGNING_SECRET?.trim()
  const timestamp = input.timestamp?.trim() ?? ''
  const signature = input.signature?.trim() ?? ''
  if (!secret || !timestamp || !signature) return false

  const issuedAt = Number(timestamp)
  if (!Number.isFinite(issuedAt)) return false
  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000)
  if (Math.abs(now - issuedAt) > MAX_AGE_SECONDS) return false

  const expected =
    'v0=' + createHmac('sha256', secret).update(`v0:${timestamp}:${input.rawBody}`, 'utf8').digest('hex')
  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}
