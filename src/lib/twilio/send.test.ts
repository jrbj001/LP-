import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { sendWhatsappMessage } from './send'

describe('sendWhatsappMessage', () => {
  const previous = {
    sid: process.env.TWILIO_ACCOUNT_SID,
    token: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_WHATSAPP_FROM,
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    if (previous.sid === undefined) delete process.env.TWILIO_ACCOUNT_SID
    else process.env.TWILIO_ACCOUNT_SID = previous.sid
    if (previous.token === undefined) delete process.env.TWILIO_AUTH_TOKEN
    else process.env.TWILIO_AUTH_TOKEN = previous.token
    if (previous.from === undefined) delete process.env.TWILIO_WHATSAPP_FROM
    else process.env.TWILIO_WHATSAPP_FROM = previous.from
  })

  it('posta From/To/Body na API de Messages', async () => {
    process.env.TWILIO_ACCOUNT_SID = 'ACtest'
    process.env.TWILIO_AUTH_TOKEN = 'token'
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ sid: 'SM123', status: 'queued' }), { status: 201 })
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      sendWhatsappMessage({
        to: 'whatsapp:+5511999999999',
        from: 'whatsapp:+15553533015',
        body: 'Oi — menu Colmeia',
      })
    ).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toContain('/Accounts/ACtest/Messages.json')
    const posted = new URLSearchParams(String(init.body))
    expect(posted.get('From')).toBe('whatsapp:+15553533015')
    expect(posted.get('To')).toBe('whatsapp:+5511999999999')
    expect(posted.get('Body')).toContain('Colmeia')
  })

  it('falha se a Twilio recusar — não fingir que enviou', async () => {
    process.env.TWILIO_ACCOUNT_SID = 'ACtest'
    process.env.TWILIO_AUTH_TOKEN = 'token'
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('{"code":21656,"message":"From is invalid"}', { status: 400 }))
    )
    await expect(
      sendWhatsappMessage({
        to: 'whatsapp:+5511999999999',
        from: 'whatsapp:+15553533015',
        body: 'oi',
      })
    ).rejects.toThrow(/21656|400/)
  })
})
