import 'server-only'

import { isBacklogEnabled } from '@/lib/backlog/access'
import { firstTurnWelcome, isOrientationAsk } from '@/lib/backlog/welcome'
import { runAndPersistTurn } from '@/lib/backlog/copilot-turn'
import { createCopilotThread, findCopilotThreadByExternalId } from '@/lib/backlog/store'
import { getBacklogBoards } from '@/lib/backlog/boards'
import { getClient } from '@/lib/client/registry'
import { routeWhatsappSender } from './routing'
import { sendWhatsappMessage } from './send'
import { sendWhatsappTyping } from './typing'

export async function handleWhatsappInbound(input: {
  from: string
  to: string
  body: string
  profileName?: string
  messageSid?: string
}): Promise<{ ok: true; clientSlug: string } | { ok: false; error: string }> {
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

  if (isOrientationAsk(message)) {
    try {
      await sendWhatsappMessage({
        to: input.from,
        from: input.to,
        body: firstTurnWelcome(client.slug, client.name),
      })
    } catch (error) {
      console.error('[twilio/whatsapp] send welcome', error)
      return { ok: false, error: error instanceof Error ? error.message : 'Falha ao enviar o menu.' }
    }
  }

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

  try {
    const updated = await runAndPersistTurn({
      clientId: client.slug,
      clientName: client.name,
      clientSector: client.sector,
      thread,
      message,
      repos: client.delivery?.repos ?? [],
    })
    if (isOrientationAsk(message)) {
      return { ok: true, clientSlug: client.slug }
    }
    const reply = [...updated.messages].reverse().find(item => item.role === 'assistant')?.content
    if (!reply) {
      await sendWhatsappMessage({
        to: input.from,
        from: input.to,
        body: 'Não consegui montar a resposta agora. Pode repetir em uma frase?',
      })
      return { ok: false, error: 'O copiloto não devolveu texto.' }
    }

    await sendWhatsappMessage({ to: input.from, from: input.to, body: reply })
    return { ok: true, clientSlug: client.slug }
  } catch (error) {
    if (!isOrientationAsk(message)) {
      await sendWhatsappMessage({
        to: input.from,
        from: input.to,
        body: 'Tive um problema para olhar isso agora. Pode tentar de novo em instantes?',
      }).catch(() => undefined)
    }
    return { ok: false, error: error instanceof Error ? error.message : 'Falha no copiloto.' }
  }
}
