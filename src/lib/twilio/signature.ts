import { createHmac, timingSafeEqual } from 'node:crypto'

export function verifyTwilioSignature(input: {
  url: string
  params: Record<string, string>
  signature?: string | null
  authToken?: string
}): boolean {
  const token = input.authToken || process.env.TWILIO_AUTH_TOKEN
  const signature = input.signature?.trim()
  if (!token || !signature) return false

  const payload =
    input.url +
    Object.keys(input.params)
      .sort()
      .map(key => `${key}${input.params[key]}`)
      .join('')
  const expected = createHmac('sha1', token).update(payload, 'utf8').digest('base64')
  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function shouldSkipTwilioSignature(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.TWILIO_SKIP_SIGNATURE === '1'
}
