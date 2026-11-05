import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { verifyMondayAgentSignature } from './signature'

describe('assinatura do agente Monday', () => {
  it('aceita o HMAC do corpo cru e recusa corpo alterado ou relógio velho', () => {
    const secret = 'segredo'
    const rawBody = '{"event":"agent_triggered"}'
    const timestamp = '1782326623754'
    const signature =
      'sha256=' + createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex')

    expect(
      verifyMondayAgentSignature({
        secret,
        rawBody,
        timestamp,
        signature,
        now: Number(timestamp),
      })
    ).toBe(true)
    expect(
      verifyMondayAgentSignature({
        secret,
        rawBody: rawBody + ' ',
        timestamp,
        signature,
        now: Number(timestamp),
      })
    ).toBe(false)
    expect(
      verifyMondayAgentSignature({
        secret,
        rawBody,
        timestamp,
        signature,
        now: Number(timestamp) + 10 * 60 * 1000,
      })
    ).toBe(false)
  })
})
