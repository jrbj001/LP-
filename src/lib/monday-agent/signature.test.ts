import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { verifyMondaySignature } from './signature'

const SECRET = 'monday-signing-secret'
const BODY = '{"event":"agent_triggered"}'
const NOW = 1_782_326_623_754

function sign(timestamp: string, body = BODY): string {
  return 'sha256=' + createHmac('sha256', SECRET).update(`${timestamp}.${body}`).digest('hex')
}

describe('verifyMondaySignature', () => {
  it('aceita o HMAC timestamp.corpo dentro de 5 minutos', () => {
    const timestamp = String(NOW)
    expect(
      verifyMondaySignature({
        rawBody: BODY,
        timestamp,
        signature: sign(timestamp),
        signingSecret: SECRET,
        nowMs: NOW + 1_000,
      })
    ).toBe(true)
  })

  it('recusa corpo alterado e carimbo expirado', () => {
    const timestamp = String(NOW)
    expect(
      verifyMondaySignature({
        rawBody: BODY,
        timestamp,
        signature: sign(timestamp, '{}'),
        signingSecret: SECRET,
        nowMs: NOW,
      })
    ).toBe(false)
    expect(
      verifyMondaySignature({
        rawBody: BODY,
        timestamp,
        signature: sign(timestamp),
        signingSecret: SECRET,
        nowMs: NOW + 6 * 60 * 1000,
      })
    ).toBe(false)
  })
})
