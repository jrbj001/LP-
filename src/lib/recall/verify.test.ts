import { createHmac } from 'crypto'
import { describe, expect, it } from 'vitest'
import { verifyRecallSignature } from './verify'

const key = Buffer.from('segredo-de-teste-do-recall')
const secret = `whsec_${key.toString('base64')}`

function sign(id: string, timestamp: string, payload: string): string {
  return `v1,${createHmac('sha256', key).update(`${id}.${timestamp}.${payload}`).digest('base64')}`
}

describe('verifyRecallSignature', () => {
  const payload = '{"event":"transcript.data"}'
  const now = 1_800_000_000
  const timestamp = String(now)

  it('aceita assinatura válida, inclusive entre várias (rotação de segredo)', () => {
    const signature = `v1,outra-assinatura ${sign('msg_1', timestamp, payload)}`
    expect(
      verifyRecallSignature({ secret, headers: { id: 'msg_1', timestamp, signature }, payload, nowSeconds: now })
    ).toBe(true)
  })

  it('recusa corpo alterado', () => {
    const signature = sign('msg_1', timestamp, payload)
    expect(
      verifyRecallSignature({
        secret,
        headers: { id: 'msg_1', timestamp, signature },
        payload: '{"event":"bot.done"}',
        nowSeconds: now,
      })
    ).toBe(false)
  })

  it('recusa timestamp fora da janela', () => {
    const signature = sign('msg_1', timestamp, payload)
    expect(
      verifyRecallSignature({ secret, headers: { id: 'msg_1', timestamp, signature }, payload, nowSeconds: now + 3600 })
    ).toBe(false)
  })

  it('recusa sem cabeçalhos ou com segredo sem prefixo', () => {
    expect(
      verifyRecallSignature({ secret, headers: { id: null, timestamp, signature: 'v1,x' }, payload, nowSeconds: now })
    ).toBe(false)
    expect(
      verifyRecallSignature({
        secret: 'sem-prefixo',
        headers: { id: 'msg_1', timestamp, signature: sign('msg_1', timestamp, payload) },
        payload,
        nowSeconds: now,
      })
    ).toBe(false)
  })
})
