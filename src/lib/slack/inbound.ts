import { answerSlackQuestion } from './agent'
import type { SlackInbound } from './events'
import { interpretSlackEvent } from './events'
import { verifySlackSignature } from './signature'
import { postSlackMessage, updateSlackMessage } from './send'

const HELP =
  'Pergunte em português sobre o *Banco de Ativos* ou o *Colmeia*. Exemplo: quantos pontos ativos existem em São Paulo?'

export async function replyOnSlack(input: {
  channel: string
  threadTs: string
  text: string
}): Promise<void> {
  const placeholder = await postSlackMessage({
    channel: input.channel,
    threadTs: input.threadTs,
    text: 'Consultando o Cadence…',
  })
  try {
    const answer = await answerSlackQuestion(input.text)
    await updateSlackMessage({ channel: input.channel, ts: placeholder, text: answer })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Falha desconhecida.'
    await updateSlackMessage({
      channel: input.channel,
      ts: placeholder,
      text: `Não consegui concluir a consulta. ${detail}`,
    })
  }
}

export async function postSlackHelp(input: { channel: string; threadTs: string }): Promise<void> {
  await postSlackMessage({ channel: input.channel, threadTs: input.threadTs, text: HELP })
}

export async function prepareSlackEvent(request: Request): Promise<{
  response: Response
  work?: () => Promise<void>
}> {
  const rawBody = await request.text()
  const signed = verifySlackSignature({
    rawBody,
    timestamp: request.headers.get('x-slack-request-timestamp'),
    signature: request.headers.get('x-slack-signature'),
  })
  if (!signed) {
    return { response: Response.json({ ok: false, error: 'Assinatura Slack inválida.' }, { status: 401 }) }
  }
  if (request.headers.get('x-slack-retry-num')) {
    return { response: new Response(null, { status: 200 }) }
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody) as unknown
  } catch {
    return { response: Response.json({ ok: false, error: 'JSON inválido.' }, { status: 400 }) }
  }

  const inbound: SlackInbound = interpretSlackEvent(body)
  if (inbound.kind === 'challenge') {
    return { response: Response.json({ challenge: inbound.challenge }) }
  }
  if (inbound.kind === 'help') {
    return {
      response: new Response(null, { status: 200 }),
      work: () => postSlackHelp(inbound),
    }
  }
  if (inbound.kind === 'question') {
    return {
      response: new Response(null, { status: 200 }),
      work: () => replyOnSlack(inbound),
    }
  }
  return { response: new Response(null, { status: 200 }) }
}
