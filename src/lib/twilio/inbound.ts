import 'server-only'

import { isBacklogEnabled } from '@/lib/backlog/access'
import { runAndPersistTurn } from '@/lib/backlog/copilot-turn'
import { createCopilotThread, findCopilotThreadByExternalId } from '@/lib/backlog/store'
import { getClient } from '@/lib/client/registry'
import { routeWhatsappSender } from './routing'
import { sendWhatsappMessage } from './send'

export async function handleWhatsappInbound(input: {
  from: string
  to: string
  body: string
  profileName?: string
}): Promise<{ ok: true; clientSlug: string } | { ok: false; error: string }> {
  const message = input.body.trim()
  if (!message) return { ok: false, error: 'Mensagem vazia.' }

  const route = routeWhatsappSender(input.to)
  if (!route) return { ok: false, error: `Sender sem rota Cadence: ${input.to}` }

  const client = getClient(route.clientSlug)
  if (!client || !isBacklogEnabled(client.slug)) {
    return { ok: false, error: 'Workspace Cadence indisponível para este sender.' }
  }

  const existing = await findCopilotThreadByExternalId(client.slug, input.from)
  const thread =
    existing ??
    (await createCopilotThread(client.slug, {
      boardId: route.boardId,
      channel: 'whatsapp',
      externalId: input.from,
      title: input.profileName
        ? `WhatsApp · ${client.name} · ${input.profileName}`
        : `WhatsApp · ${client.name} · ${input.from}`,
    }))

  const updated = await runAndPersistTurn({
    clientId: client.slug,
    clientName: client.name,
    clientSector: client.sector,
    thread,
    message,
    repos: client.delivery?.repos ?? [],
  })
  const reply = [...updated.messages].reverse().find(item => item.role === 'assistant')?.content
  if (!reply) return { ok: false, error: 'O copiloto não devolveu texto.' }

  await sendWhatsappMessage({ to: input.from, from: input.to, body: reply })
  return { ok: true, clientSlug: client.slug }
}
