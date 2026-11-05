import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { verifySlackSignature } from './signature'

const SECRET = 'slack-signing-secret'
const BODY = '{"type":"url_verification","challenge":"abc"}'
const NOW = 1_700_000_000

function sign(timestamp: string, body = BODY): string {
  return 'v0=' + createHmac('sha256', SECRET).update(`v0:${timestamp}:${body}`).digest('hex')
}

describe('verifySlackSignature', () => {
  it('aceita uma assinatura dentro da janela de 5 minutos', () => {
    const timestamp = String(NOW)
    expect(
      verifySlackSignature({
        rawBody: BODY,
        timestamp,
        signature: sign(timestamp),
        signingSecret: SECRET,
        nowSeconds: NOW + 30,
      })
    ).toBe(true)
  })

  it('recusa assinatura errada e timestamp expirado', () => {
    const timestamp = String(NOW)
    expect(
      verifySlackSignature({
        rawBody: BODY,
        timestamp,
        signature: sign(timestamp, '{"type":"outro"}'),
        signingSecret: SECRET,
        nowSeconds: NOW,
      })
    ).toBe(false)
    expect(
      verifySlackSignature({
        rawBody: BODY,
        timestamp,
        signature: sign(timestamp),
        signingSecret: SECRET,
        nowSeconds: NOW + 6 * 60,
      })
    ).toBe(false)
  })
})
