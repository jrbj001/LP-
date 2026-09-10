import { describe, expect, it } from 'vitest'
import { routeWhatsappSender } from './routing'
import { formatWhatsappReply } from './format'
import { verifyTwilioSignature } from './signature'

describe('routeWhatsappSender', () => {
  it('manda Pixelpulselab.dev para o workspace Be180', () => {
    expect(routeWhatsappSender('whatsapp:+15553533015')).toEqual({
      from: 'whatsapp:+15553533015',
      clientSlug: 'be180-ooh',
      boardId: 'cadence',
    })
    expect(routeWhatsappSender('+15553533015')?.clientSlug).toBe('be180-ooh')
  })

  it('mantém os senders Like:Me no tenant likeme', () => {
    expect(routeWhatsappSender('whatsapp:+17752275705')?.clientSlug).toBe('likeme')
    expect(routeWhatsappSender('whatsapp:+15553668393')?.clientSlug).toBe('likeme')
  })
})

describe('formatWhatsappReply', () => {
  it('tira markdown pesado', () => {
    expect(formatWhatsappReply('## Título\n\n**negrito** e\n- item')).toContain('• item')
    expect(formatWhatsappReply('## Título\n\n**negrito**')).toContain('negrito')
  })
})

describe('verifyTwilioSignature', () => {
  it('rejeita assinatura vazia', () => {
    expect(
      verifyTwilioSignature({
        url: 'https://example.com/hook',
        params: { Body: 'oi' },
        signature: '',
        authToken: 'token',
      })
    ).toBe(false)
  })
})
