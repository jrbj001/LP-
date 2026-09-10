import { describe, expect, it } from 'vitest'
import { routeWhatsappSender } from './routing'
import { formatWhatsappReply, isChitChat } from './format'
import { verifyTwilioSignature } from './signature'
import { renderTwiml } from './twiml'
import { firstTurnWelcome } from '@/lib/backlog/welcome'

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

describe('isChitChat', () => {
  it('reconhece saudação curta', () => {
    expect(isChitChat('oi')).toBe(true)
    expect(isChitChat('Olá!')).toBe(true)
    expect(isChitChat('bom dia')).toBe(true)
    expect(isChitChat('tudo bem?')).toBe(true)
    expect(isChitChat('Oi, tudo bem?')).toBe(true)
  })

  it('não trata pergunta de negócio como saudação', () => {
    expect(isChitChat('quantos roteiros existem no Colmeia?')).toBe(false)
    expect(isChitChat('oi, quantos roteiros tem?')).toBe(false)
  })
})

describe('formatWhatsappReply', () => {
  it('tira markdown pesado', () => {
    expect(formatWhatsappReply('## Título\n\n**negrito** e\n- item')).toContain('• item')
    expect(formatWhatsappReply('## Título\n\n**negrito**')).toContain('negrito')
  })

  it('não vaza SQL nem rótulos técnicos', () => {
    const out = formatWhatsappReply('Olhei agora.\nSQL: SELECT count(*) FROM roteiros\nFonte: Colmeia')
    expect(out).toContain('Olhei agora.')
    expect(out.toLowerCase()).not.toContain('select')
    expect(out.toLowerCase()).not.toMatch(/^fonte:/m)
  })
})

describe('renderTwiml', () => {
  it('devolve o menu do oi dentro do Message', () => {
    const xml = renderTwiml(firstTurnWelcome('be180-ooh', 'Be180 OOH'))
    expect(xml).toContain('<Response>')
    expect(xml).toContain('<Message>')
    expect(xml).toContain('Colmeia')
    expect(xml).toContain('Banco de Ativos')
  })

  it('escapa XML e aceita resposta vazia', () => {
    expect(renderTwiml()).toBe('<?xml version="1.0" encoding="UTF-8"?><Response></Response>')
    expect(renderTwiml('preço < 10 & ok')).toContain('preço &lt; 10 &amp; ok')
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
