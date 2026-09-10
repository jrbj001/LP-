import 'server-only'

import { isBacklogEnabled } from '@/lib/backlog/access'
import { getBacklogBoards } from '@/lib/backlog/boards'
import { appendCopilotMessages, createCopilotThread, findCopilotThreadByExternalId } from '@/lib/backlog/store'
import type { CopilotMessage } from '@/lib/backlog/types'
import { welcomeDiagram, welcomeFollowUps } from '@/lib/backlog/welcome'
import { getClient } from '@/lib/client/registry'
import { routeWhatsappSender } from './routing'

function messageId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/** Grava o oi depois do envio — não pode bloquear a entrega do menu. */
export async function persistWhatsappWelcome(input: {
  from: string
  to: string
  body: string
  reply: string
  profileName?: string
}): Promise<void> {
  const route = routeWhatsappSender(input.to)
  if (!route) return

  const client = getClient(route.clientSlug)
  if (!client || !isBacklogEnabled(client.slug)) return

  const boards = getBacklogBoards(client.slug)
  const boardId = boards.some(board => board.id === route.boardId) ? route.boardId : boards[0]?.id
  if (!boardId) return

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

  const now = new Date().toISOString()
  const messages: CopilotMessage[] = [
    { id: messageId('msg'), role: 'user', content: input.body, createdAt: now },
    {
      id: messageId('msg'),
      role: 'assistant',
      content: input.reply,
      diagram: welcomeDiagram(client.name),
      followUps: welcomeFollowUps(client.slug),
      createdAt: now,
    },
  ]
  await appendCopilotMessages(client.slug, thread.id, messages)
}
