import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const sendWhatsappMessage = vi.fn(async (_input: { to: string; from?: string; body: string }) => undefined)
vi.mock('./send', () => ({
  sendWhatsappMessage: (input: { to: string; from?: string; body: string }) => sendWhatsappMessage(input),
}))

vi.mock('./typing', () => ({
  sendWhatsappTyping: vi.fn(async () => true),
  withWhatsappTyping: async (_sid: string | undefined, work: () => Promise<unknown>) => work(),
}))

import { handleTwilioWhatsappWebhook } from './webhook'
import { sendWhatsappTyping } from './typing'

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
    sendWhatsappMessage.mockClear()
    vi.mocked(sendWhatsappTyping).mockClear()
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
    expect(sendWhatsappMessage).not.toHaveBeenCalled()
    expect(sendWhatsappTyping).not.toHaveBeenCalled()
  })

  it('no oi envia o menu pela API com From/To crus, sem pontinhos', async () => {
    const params = inbound()
    const result = await handleTwilioWhatsappWebhook({
      url: URL,
      params,
      signature: sign(params),
    })
    expect(result.status).toBe(200)
    expect(result.body).toBe('<?xml version="1.0" encoding="UTF-8"?><Response></Response>')
    expect(sendWhatsappTyping).not.toHaveBeenCalled()
    expect(sendWhatsappMessage).toHaveBeenCalledTimes(1)
    expect(sendWhatsappMessage).toHaveBeenCalledWith({
      to: 'whatsapp:+5511999999999',
      from: 'whatsapp:+15553533015',
      body: expect.stringContaining('Colmeia'),
    })
  })
})
