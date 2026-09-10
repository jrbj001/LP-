import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sendWhatsappTyping = vi.fn(async (_messageSid?: string) => true)
vi.mock('./typing', () => ({
  sendWhatsappTyping: (messageSid?: string) => sendWhatsappTyping(messageSid),
}))

const sendWhatsappMessage = vi.fn(async (_input: { to: string; from?: string; body: string }) => ({
  sid: 'SMsent',
  status: 'queued',
}))
vi.mock('./send', () => ({
  sendWhatsappMessage: (input: { to: string; from?: string; body: string }) => sendWhatsappMessage(input),
}))

const handleWhatsappInbound = vi.fn()
vi.mock('./inbound', () => ({
  handleWhatsappInbound: (input: unknown) => handleWhatsappInbound(input),
}))

import { handleTwilioWhatsappWebhook } from './webhook'

const TOKEN = 'test-twilio-token'
const URL = 'https://lp-sepia-six.vercel.app/api/webhooks/twilio/whatsapp'

function sign(params: Record<string, string>): string {
  const payload = URL + Object.keys(params).sort().map(key => `${key}${params[key]}`).join('')
  return createHmac('sha1', TOKEN).update(payload, 'utf8').digest('base64')
}

function inbound(overrides: Record<string, string> = {}) {
  return {
    From: 'whatsapp:+5511999999999',
    To: 'whatsapp:+15553533015',
    Body: 'oi',
    MessageSid: 'SMtestoi001',
    ...overrides,
  }
}

describe('handleTwilioWhatsappWebhook', () => {
  const previous = {
    token: process.env.TWILIO_AUTH_TOKEN,
    webhook: process.env.TWILIO_WEBHOOK_URL,
    skip: process.env.TWILIO_SKIP_SIGNATURE,
  }

  beforeEach(() => {
    process.env.TWILIO_AUTH_TOKEN = TOKEN
    process.env.TWILIO_WEBHOOK_URL = URL
    delete process.env.TWILIO_SKIP_SIGNATURE
    sendWhatsappTyping.mockClear()
    sendWhatsappMessage.mockClear()
    handleWhatsappInbound.mockClear()
    sendWhatsappMessage.mockResolvedValue({ sid: 'SMsent', status: 'queued' })
  })

  afterEach(() => {
    if (previous.token === undefined) delete process.env.TWILIO_AUTH_TOKEN
    else process.env.TWILIO_AUTH_TOKEN = previous.token
    if (previous.webhook === undefined) delete process.env.TWILIO_WEBHOOK_URL
    else process.env.TWILIO_WEBHOOK_URL = previous.webhook
    if (previous.skip === undefined) delete process.env.TWILIO_SKIP_SIGNATURE
    else process.env.TWILIO_SKIP_SIGNATURE = previous.skip
  })

  it('recusa assinatura inválida', async () => {
    const params = inbound()
    const result = await handleTwilioWhatsappWebhook({
      url: URL,
      params,
      signature: 'assinatura-falsa',
    })
    expect(result.status).toBe(403)
    expect(sendWhatsappTyping).not.toHaveBeenCalled()
    expect(sendWhatsappMessage).not.toHaveBeenCalled()
    expect(handleWhatsappInbound).not.toHaveBeenCalled()
  })

  it('no oi o TwiML NÃO pode vir vazio — senão os pontinhos somem sem texto', async () => {
    const params = inbound()
    const result = await handleTwilioWhatsappWebhook({
      url: URL,
      params,
      signature: sign(params),
    })
    expect(result.status).toBe(200)
    expect(result.contentType).toBe('text/xml')
    expect(result.body).toContain('<Message>')
    expect(result.body).toContain('Colmeia')
    expect(result.body).toContain('Banco de Ativos')
    expect(result.body).toContain('O que você quer ver primeiro?')
    expect(result.body).not.toContain(' from=')
    expect(result.body).not.toContain(' to=')
    expect(result.body).not.toMatch(/<Response><\/Response>/)
    expect(sendWhatsappTyping).toHaveBeenCalledWith('SMtestoi001')
    expect(sendWhatsappMessage).toHaveBeenCalledTimes(1)
    expect(handleWhatsappInbound).not.toHaveBeenCalled()
  })

  it('mesmo se a API de envio falhar, o menu continua no TwiML', async () => {
    sendWhatsappMessage.mockRejectedValueOnce(new Error('Twilio recusou o envio (400)'))
    const params = inbound()
    const result = await handleTwilioWhatsappWebhook({
      url: URL,
      params,
      signature: sign(params),
    })
    expect(result.body).toContain('<Message>')
    expect(result.body).toContain('Colmeia')
  })

  it('em pergunta de negócio também devolve o texto no TwiML', async () => {
    handleWhatsappInbound.mockResolvedValue({
      ok: true,
      clientSlug: 'be180-ooh',
      reply: 'Olhei agora no Colmeia: são 3.541 roteiros.',
    })
    const params = inbound({ Body: 'Quantos roteiros existem no Colmeia?' })
    const result = await handleTwilioWhatsappWebhook({
      url: URL,
      params,
      signature: sign(params),
    })
    expect(handleWhatsappInbound).toHaveBeenCalledTimes(1)
    expect(result.body).toContain('3.541 roteiros')
    expect(result.body).toContain('<Message>')
  })
})
