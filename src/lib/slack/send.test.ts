import { afterEach, describe, expect, it, vi } from 'vitest'
import { postSlackMessage, updateSlackMessage } from './send'

describe('Slack Web API', () => {
  const previous = process.env.SLACK_BOT_TOKEN

  afterEach(() => {
    vi.unstubAllGlobals()
    if (previous === undefined) delete process.env.SLACK_BOT_TOKEN
    else process.env.SLACK_BOT_TOKEN = previous
  })

  it('posta e atualiza mensagem no fio', async () => {
    process.env.SLACK_BOT_TOKEN = 'xoxb-test'
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { text: string }
      return new Response(JSON.stringify({ ok: true, ts: body.text.startsWith('oi') ? '1.2' : '1.2' }), {
        status: 200,
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(postSlackMessage({ channel: 'C1', threadTs: '1.0', text: 'oi' })).resolves.toBe('1.2')
    await updateSlackMessage({ channel: 'C1', ts: '1.2', text: 'resposta' })

    const [postUrl, postInit] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(postUrl).toBe('https://slack.com/api/chat.postMessage')
    expect(JSON.parse(String(postInit.body))).toMatchObject({ channel: 'C1', thread_ts: '1.0', text: 'oi' })
    const [updateUrl, updateInit] = fetchMock.mock.calls[1] as unknown as [string, RequestInit]
    expect(updateUrl).toBe('https://slack.com/api/chat.update')
    expect(JSON.parse(String(updateInit.body))).toMatchObject({ channel: 'C1', ts: '1.2', text: 'resposta' })
  })

  it('propaga o erro do Slack', async () => {
    process.env.SLACK_BOT_TOKEN = 'xoxb-test'
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: false, error: 'not_in_channel' }), { status: 200 })))
    await expect(postSlackMessage({ channel: 'C1', threadTs: '1', text: 'oi' })).rejects.toThrow('not_in_channel')
  })
})
