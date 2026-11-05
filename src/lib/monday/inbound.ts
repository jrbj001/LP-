import { getBacklogBoards } from '@/lib/backlog/boards'
import type { BacklogBoardId, BacklogCard } from '@/lib/backlog/types'
import { collectMondayAssets, type MondayAsset } from './attachments'
import {
  BE180_MONDAY_CLIENT_ID,
  COLMEIA_AGENT_CHAT,
  formatMondayItemName,
  isStoryReadyForMonday,
  mondayItemUrl,
} from './story'

export { COLMEIA_AGENT_CHAT }

export interface MondayCreatedItem {
  boardId: string
  itemId: string
  name: string
}

export type MondayWebhookEvent =
  | { type: 'challenge'; challenge: string }
  | { type: 'created'; item: MondayCreatedItem }
  | { type: 'ignore' }

export type MondayRoundTripPlan = 'import' | 'enrich' | 'return' | 'done'

const CREATE_EVENTS = new Set(['create_pulse', 'create_item'])

export function interpretMondayWebhook(body: unknown): MondayWebhookEvent {
  if (!body || typeof body !== 'object') return { type: 'ignore' }
  const record = body as Record<string, unknown>
  if (typeof record.challenge === 'string' && record.challenge) {
    return { type: 'challenge', challenge: record.challenge }
  }

  const event = record.event
  if (!event || typeof event !== 'object') return { type: 'ignore' }
  const raw = event as Record<string, unknown>
  if (!CREATE_EVENTS.has(String(raw.type ?? ''))) return { type: 'ignore' }
  const boardId = asId(raw.boardId)
  const itemId = asId(raw.pulseId)
  const name = typeof raw.pulseName === 'string' ? raw.pulseName.trim() : ''
  if (!boardId || !itemId || !name) return { type: 'ignore' }
  return { type: 'created', item: { boardId, itemId, name } }
}

export type MondayAgentTrigger = 'chat' | 'mention' | 'assigned'

export interface MondayAgentEvent {
  trigger: MondayAgentTrigger
  stream: boolean
  text: string
  itemId?: string
  boardId?: string
  updateId?: string
  updateBody?: string
  /** Só em chat: token para responder depois com send_custom_agent_message. */
  conversationId?: string
  sessionId?: string
}

export function interpretMondayAgentEvent(body: unknown): MondayAgentEvent | null {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  if (record.event !== 'agent_triggered') return null
  const trigger = normalizeAgentTrigger(record.triggerType)
  if (!trigger) return null
  const payload =
    record.payload && typeof record.payload === 'object'
      ? (record.payload as Record<string, unknown>)
      : {}
  const updateBody = typeof payload.updateBody === 'string' ? payload.updateBody.trim() : ''
  const text = typeof payload.text === 'string' ? payload.text.trim() : ''
  return {
    trigger,
    stream: record.stream !== false,
    text: trigger === 'mention' && updateBody ? updateBody : text,
    itemId: asId(payload.itemId) || undefined,
    boardId: asId(payload.boardId) || undefined,
    updateId: asId(payload.updateId) || undefined,
    updateBody: updateBody || undefined,
    conversationId: typeof payload.conversationId === 'string' ? payload.conversationId : undefined,
    sessionId: typeof record.sessionId === 'string' ? record.sessionId : undefined,
  }
}

/** Ack para assigned/mention: visível só via GraphQL, o corpo HTTP não é mostrado. */
export function mondayAgentAck(stream: boolean): Response {
  if (!stream) return Response.json({ success: true, message: '' })
  return agentSse(sseEvent({ type: 'done', success: true }))
}

/** Resposta síncrona de chat, sem conversationId — o corpo HTTP é a mensagem. */
export function mondayAgentChat(message: string, stream: boolean): Response {
  if (!stream) return Response.json({ success: true, message })
  return agentSse(sseEvent({ type: 'text', content: message }) + sseEvent({ type: 'done', success: true }))
}

/** Ack imediato de chat com conversationId — a resposta real vai depois via send_custom_agent_message. */
export function mondayAgentConversationAck(stream: boolean): Response {
  if (!stream) return Response.json({ ack: true })
  return agentSse(sseEvent({ type: 'ack' }))
}

export function mondayWebhookAuthorized(header: string | null, secret: string | undefined): boolean {
  const expected = secret?.trim()
  if (!expected) return true
  const value = header?.trim()
  return value === expected || value === `Bearer ${expected}`
}

export function cadenceBoardForMonday(raw: string | undefined): BacklogBoardId {
  const boards = getBacklogBoards(BE180_MONDAY_CLIENT_ID)
  const id = raw?.trim()
  if (id && boards.some(board => board.id === id)) return id as BacklogBoardId
  return 'colmeia'
}

export function planMondayRoundTrip(card: BacklogCard | null): MondayRoundTripPlan {
  if (!card) return 'import'
  if (isStoryReadyForMonday(card) && card.monday?.syncedAt) return 'done'
  if (isStoryReadyForMonday(card)) return 'return'
  return 'enrich'
}

export function cardFromMondayItem(input: {
  item: MondayCreatedItem
  context?: string
  cadenceBoardId: BacklogBoardId
  accountSlug?: string
  now: string
}): BacklogCard {
  const context = input.context?.trim()
  return {
    id: `monday-${input.item.itemId}`,
    boardId: input.cadenceBoardId,
    column: 'requirement',
    title: formatMondayItemName(input.item.name),
    level: 'raw',
    context: context || undefined,
    source: { kind: 'monday', ref: input.item.itemId },
    monday: {
      itemId: input.item.itemId,
      boardId: input.item.boardId,
      url: input.accountSlug
        ? mondayItemUrl(input.accountSlug, input.item.boardId, input.item.itemId)
        : undefined,
    },
    createdAt: input.now,
    updatedAt: input.now,
  }
}

export function readMondayItemDetails(
  data: unknown
): { name: string; context: string; boardId?: string; assets: MondayAsset[] } | null {
  if (!data || typeof data !== 'object') return null
  const items = (data as { items?: unknown }).items
  const item = Array.isArray(items) ? items[0] : null
  if (!item || typeof item !== 'object') return null
  const record = item as {
    name?: unknown
    board?: { id?: unknown }
    column_values?: { text?: string | null }[]
    updates?: { text_body?: string | null; body?: string | null }[]
  }
  const name = typeof record.name === 'string' ? record.name.trim() : ''
  if (!name) return null
  const boardId = asId(record.board?.id)
  const parts = [
    ...(record.column_values ?? []).map(column => column.text ?? ''),
    ...(record.updates ?? []).map(update => update.text_body || update.body || ''),
  ]
  const context = parts
    .map(plainMondayText)
    .filter(text => text && text !== name)
    .filter((text, index, all) => all.indexOf(text) === index)
    .join('\n\n')
    .slice(0, 4000)
  const assets = collectMondayAssets(item)
  return boardId ? { name, context, boardId, assets } : { name, context, assets }
}

export async function runMondayRoundTrip(input: {
  existing: BacklogCard | null
  draft: BacklogCard
  enrich: (card: BacklogCard) => Promise<BacklogCard>
  writeBack: (card: BacklogCard) => Promise<BacklogCard>
  save: (card: BacklogCard) => Promise<BacklogCard>
  /** Atribuição ou menção pede o enriquecimento de novo. */
  force?: boolean
}): Promise<{ card: BacklogCard; status: 'imported' | 'already-returned' }> {
  if (!input.force && planMondayRoundTrip(input.existing) === 'done' && input.existing) {
    return { card: input.existing, status: 'already-returned' }
  }

  let card = input.existing ?? (await input.save(input.draft))
  if (input.force || !isStoryReadyForMonday(card)) {
    card = await input.save(await input.enrich(card))
  }
  if (!isStoryReadyForMonday(card)) {
    throw new Error('A user story enriquecida ficou incompleta.')
  }
  card = await input.save(await input.writeBack(card))
  return { card, status: 'imported' }
}

function normalizeAgentTrigger(value: unknown): MondayAgentTrigger | null {
  if (value === 'chat') return 'chat'
  if (value === 'mention' || value === 'mentioned') return 'mention'
  if (value === 'assigned' || value === 'assign') return 'assigned'
  return null
}

function sseEvent(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

function agentSse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

function asId(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'string') return value.trim()
  return ''
}

function plainMondayText(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
