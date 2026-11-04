import { answerBe180Question } from './answer'
import { interpretMondayAgentEvent, type MondayAgentEvent } from './events'
import { postMondayAgentUpdate } from './graphql'
import { mondayReply } from './reply'
import { verifyMondaySignature } from './signature'

export async function publishMondayAnswer(event: MondayAgentEvent): Promise<void> {
  if (!event.itemId) return
  const answer = await answerBe180Question(event.question)
  await postMondayAgentUpdate({
    itemId: event.itemId,
    body: answer,
    parentId: event.trigger === 'mention' ? event.updateId : undefined,
  })
}

export async function prepareMondayAgentRequest(request: Request): Promise<{
  response: Response
  work?: () => Promise<void>
}> {
  const rawBody = await request.text()
  const signed = verifyMondaySignature({
    rawBody,
    timestamp: request.headers.get('x-monday-timestamp'),
    signature: request.headers.get('x-monday-signature'),
  })
  if (!signed) {
    return { response: Response.json({ error: 'Assinatura Monday inválida.' }, { status: 401 }) }
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody) as unknown
  } catch {
    return { response: Response.json({ error: 'JSON inválido.' }, { status: 400 }) }
  }

  const event = interpretMondayAgentEvent(body)
  if (!event) return { response: mondayReply(true, '') }

  if (event.trigger === 'chat') {
    const answer = await answerBe180Question(event.question)
    return { response: mondayReply(event.stream, answer) }
  }

  return {
    response: mondayReply(event.stream, ''),
    work: () => publishMondayAnswer(event),
  }
}
