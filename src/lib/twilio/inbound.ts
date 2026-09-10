import 'server-only'

import { isBacklogEnabled } from '@/lib/backlog/access'
import { firstTurnWelcome, isOrientationAsk } from '@/lib/backlog/welcome'
import { runAndPersistTurn } from '@/lib/backlog/copilot-turn'
import { createCopilotThread, findCopilotThreadByExternalId } from '@/lib/backlog/store'
import { getBacklogBoards } from '@/lib/backlog/boards'
import { getClient } from '@/lib/client/registry'
import { routeWhatsappSender } from './routing'
import { sendWhatsappTyping } from './typing'

export type WhatsappInboundResult =
  | { ok: true; clientSlug: string; reply: string }
  | { ok: false; error: string; reply?: string }

export async function handleWhatsappInbound(input: {
  from: string
  to: string
  body: string
  profileName?: string
  messageSid?: string
}): Promise<WhatsappInboundResult> {
  const message = input.body.trim()
  if (!message) return { ok: false, error: 'Mensagem vazia.' }

  const route = routeWhatsappSender(input.to)
  if (!route) return { ok: false, error: `Sender sem rota Cadence: ${input.to}` }

  const client = getClient(route.clientSlug)
  if (!client || !isBacklogEnabled(client.slug)) {
    return { ok: false, error: 'Workspace Cadence indisponível para este sender.' }
  }

  const boards = getBacklogBoards(client.slug)
  const boardId = boards.some(board => board.id === route.boardId) ? route.boardId : boards[0]?.id
  if (!boardId) return { ok: false, error: 'Workspace sem board para o WhatsApp.' }

  await sendWhatsappTyping(input.messageSid)

  const persist = async () => {
    const existing = await findCopilotThreadByExternalId(client.slug, input.from)
    const thread =
      existing ??
      (await createCopilotThread(client.slug, {
        boardId,
        channel: 'whatsapp',
        externalId: input.from,
        title: input.profileName
          ? `WhatsApp · ${client.name} · ${input.profileName}`
          : `WhatsApp · ${client.name} · ${input.from}`,
      }))
    return runAndPersistTurn({
      clientId: client.slug,
      clientName: client.name,
      clientSector: client.sector,
      thread,
      message,
      repos: client.delivery?.repos ?? [],
    })
  }

  if (isOrientationAsk(message)) {
    const reply = firstTurnWelcome(client.slug, client.name)
    await Promise.race([
      persist().catch(error => {
        console.error('[twilio/whatsapp] persist welcome', error)
      }),
      new Promise<void>(resolve => setTimeout(resolve, 2500)),
    ])
    return { ok: true, clientSlug: client.slug, reply }
  }

  try {
    const updated = await persist()
    const reply = [...updated.messages].reverse().find(item => item.role === 'assistant')?.content
    if (!reply) {
      return {
        ok: false,
        error: 'O copiloto não devolveu texto.',
        reply: 'Não consegui montar a resposta agora. Pode repetir em uma frase?',
      }
    }
    return { ok: true, clientSlug: client.slug, reply }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Falha no copiloto.',
      reply: 'Tive um problema para olhar isso agora. Pode tentar de novo em instantes?',
    }
  }
}
