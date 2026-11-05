import { createHmac } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'

const postSlackMessage = vi.fn(async (_input?: unknown) => '170.1')
const updateSlackMessage = vi.fn(async (_input?: unknown) => undefined)
const answerSlackQuestion = vi.fn(async (_question?: unknown) => 'Há 12 pontos.')

vi.mock('./send', () => ({
  postSlackMessage: (input: unknown) => postSlackMessage(input),
  updateSlackMessage: (input: unknown) => updateSlackMessage(input),
}))
vi.mock('./agent', () => ({
  answerSlackQuestion: (question: unknown) => answerSlackQuestion(question),
}))

import { prepareSlackEvent } from './inbound'

const SECRET = 'slack-signing-secret'

function signed(body: unknown, now = Math.floor(Date.now() / 1000)) {
  const rawBody = JSON.stringify(body)
  const timestamp = String(now)
  const signature =
    'v0=' + createHmac('sha256', SECRET).update(`v0:${timestamp}:${rawBody}`).digest('hex')
  return new Request('https://cadence.example/api/webhooks/slack/events', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-slack-request-timestamp': timestamp,
      'x-slack-signature': signature,
    },
    body: rawBody,
  })
}

describe('prepareSlackEvent', () => {
  const previous = process.env.SLACK_SIGNING_SECRET

  afterEach(() => {
    postSlackMessage.mockClear()
    updateSlackMessage.mockClear()
    answerSlackQuestion.mockClear()
    if (previous === undefined) delete process.env.SLACK_SIGNING_SECRET
    else process.env.SLACK_SIGNING_SECRET = previous
  })

  it('recusa assinatura inválida', async () => {
    process.env.SLACK_SIGNING_SECRET = SECRET
    const request = signed({ type: 'url_verification', challenge: 'abc' })
    request.headers.set('x-slack-signature', 'v0=00')
    const prepared = await prepareSlackEvent(request)
    expect(prepared.response.status).toBe(401)
    expect(prepared.work).toBeUndefined()
  })

  it('responde o challenge e não agenda trabalho', async () => {
    process.env.SLACK_SIGNING_SECRET = SECRET
    const prepared = await prepareSlackEvent(signed({ type: 'url_verification', challenge: 'abc' }))
    expect(prepared.response.status).toBe(200)
    await expect(prepared.response.json()).resolves.toEqual({ challenge: 'abc' })
    expect(prepared.work).toBeUndefined()
  })

  it('ignora reentrega do Slack', async () => {
    process.env.SLACK_SIGNING_SECRET = SECRET
    const request = signed({
      type: 'event_callback',
      event: { type: 'app_mention', channel: 'C1', ts: '1', text: '<@UBOT> oi' },
    })
    request.headers.set('x-slack-retry-num', '1')
    const prepared = await prepareSlackEvent(request)
    expect(prepared.response.status).toBe(200)
    expect(prepared.work).toBeUndefined()
  })

  it('agenda a consulta e publica a resposta no fio', async () => {
    process.env.SLACK_SIGNING_SECRET = SECRET
    const prepared = await prepareSlackEvent(
      signed({
        type: 'event_callback',
        event: { type: 'message', channel_type: 'im', channel: 'D1', user: 'U1', ts: '9', text: 'quantos pontos?' },
      })
    )
    expect(prepared.work).toBeTypeOf('function')
    await prepared.work!()
    expect(answerSlackQuestion).toHaveBeenCalledWith('quantos pontos?')
    expect(postSlackMessage).toHaveBeenCalledWith(
      expect.objectContaining({ channel: 'D1', threadTs: '9', text: 'Consultando o Cadence…' })
    )
    expect(updateSlackMessage).toHaveBeenCalledWith(
      expect.objectContaining({ channel: 'D1', ts: '170.1', text: 'Há 12 pontos.' })
    )
  })
})
