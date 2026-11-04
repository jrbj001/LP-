import { createHmac } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const answerBe180Question = vi.fn(async (_question?: unknown) => 'Há 12 pontos.')
const postMondayAgentUpdate = vi.fn(async (_input?: unknown) => undefined)

vi.mock('./answer', () => ({
  answerBe180Question: (question: unknown) => answerBe180Question(question),
}))
vi.mock('./graphql', () => ({
  postMondayAgentUpdate: (input: unknown) => postMondayAgentUpdate(input),
}))

import { prepareMondayAgentRequest } from './inbound'

const SECRET = 'monday-signing-secret'

function signed(body: unknown) {
  const rawBody = JSON.stringify(body)
  const timestamp = String(Date.now())
  const signature = 'sha256=' + createHmac('sha256', SECRET).update(`${timestamp}.${rawBody}`).digest('hex')
  return new Request('https://pixelpulselab.dev/api/webhooks/monday/agent', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-monday-timestamp': timestamp,
      'x-monday-signature': signature,
    },
    body: rawBody,
  })
}

describe('prepareMondayAgentRequest', () => {
  const previous = process.env.MONDAY_AGENT_SIGNING_SECRET

  afterEach(() => {
    answerBe180Question.mockClear()
    postMondayAgentUpdate.mockClear()
    if (previous === undefined) delete process.env.MONDAY_AGENT_SIGNING_SECRET
    else process.env.MONDAY_AGENT_SIGNING_SECRET = previous
  })

  it('recusa assinatura inválida', async () => {
    process.env.MONDAY_AGENT_SIGNING_SECRET = SECRET
    const request = signed({ event: 'agent_triggered', triggerType: 'chat', payload: { text: 'oi' } })
    request.headers.set('x-monday-signature', 'sha256=00')
    const prepared = await prepareMondayAgentRequest(request)
    expect(prepared.response.status).toBe(401)
    expect(answerBe180Question).not.toHaveBeenCalled()
  })

  it('responde o chat no corpo da requisição', async () => {
    process.env.MONDAY_AGENT_SIGNING_SECRET = SECRET
    const prepared = await prepareMondayAgentRequest(
      signed({
        event: 'agent_triggered',
        triggerType: 'chat',
        payload: { text: 'quantos pontos?' },
        stream: false,
      })
    )
    expect(answerBe180Question).toHaveBeenCalledWith('quantos pontos?')
    await expect(prepared.response.json()).resolves.toEqual({ message: 'Há 12 pontos.' })
    expect(prepared.work).toBeUndefined()
  })

  it('confirma a menção na hora e publica a resposta no item', async () => {
    process.env.MONDAY_AGENT_SIGNING_SECRET = SECRET
    const prepared = await prepareMondayAgentRequest(
      signed({
        event: 'agent_triggered',
        triggerType: 'mention',
        payload: { text: 'prompt', updateBody: 'quantos roteiros?', itemId: 7, updateId: 8 },
        stream: false,
      })
    )
    await expect(prepared.response.json()).resolves.toEqual({ message: '' })
    expect(answerBe180Question).not.toHaveBeenCalled()
    await prepared.work!()
    expect(postMondayAgentUpdate).toHaveBeenCalledWith({
      itemId: '7',
      body: 'Há 12 pontos.',
      parentId: '8',
    })
  })
})
