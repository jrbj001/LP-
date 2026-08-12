import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { buildSeedCards, listBoards } from './seed'
import { getBacklogBoards } from './boards'
import {
  BACKLOG_COLUMNS,
  BACKLOG_STORE_VERSION,
  type BacklogBoardId,
  type BacklogCard,
  type BacklogSnapshot,
  type BacklogStorePayload,
  type CardPatch,
  type CopilotMessage,
  type CopilotThread,
  type CopilotThreadSummary,
} from './types'

const CACHE_DIR = process.env.VERCEL
  ? path.join('/tmp', 'pixelpulselab', 'backlog')
  : path.join(process.cwd(), '.cache', 'backlog')

const memory = new Map<string, BacklogStorePayload>()

function storePath(clientId: string): string {
  return path.join(CACHE_DIR, `${clientId}.json`)
}

function emptyStore(clientId: string): BacklogStorePayload {
  return {
    version: BACKLOG_STORE_VERSION,
    clientId,
    updatedAt: new Date().toISOString(),
    cards: {},
    removedIds: [],
    threads: {},
  }
}

export async function readBacklogStore(clientId: string): Promise<BacklogStorePayload> {
  const cached = memory.get(clientId)
  if (cached && cached.version === BACKLOG_STORE_VERSION) return cached

  try {
    const raw = await readFile(storePath(clientId), 'utf8')
    const payload = JSON.parse(raw) as BacklogStorePayload
    if (payload.version !== BACKLOG_STORE_VERSION) {
      const fresh = emptyStore(clientId)
      memory.set(clientId, fresh)
      return fresh
    }
    // Stores gravados antes do copiloto não têm threads.
    payload.threads ??= {}
    memory.set(clientId, payload)
    return payload
  } catch {
    const fresh = emptyStore(clientId)
    memory.set(clientId, fresh)
    return fresh
  }
}

export async function writeBacklogStore(clientId: string, payload: BacklogStorePayload): Promise<void> {
  const next = { ...payload, updatedAt: new Date().toISOString(), version: BACKLOG_STORE_VERSION }
  memory.set(clientId, next)
  try {
    await mkdir(CACHE_DIR, { recursive: true })
    await writeFile(storePath(clientId), JSON.stringify(next, null, 2), 'utf8')
  } catch (e) {
    console.warn('[backlog/store] persistência em disco indisponível:', e)
  }
}

/** Merge seed + overrides do PM (overrides ganham). */
export function mergeCards(store: BacklogStorePayload): BacklogCard[] {
  const removed = new Set(store.removedIds)
  const boardIds = new Set(getBacklogBoards(store.clientId).map(board => board.id))
  const byId = new Map<string, BacklogCard>()

  for (const card of buildSeedCards(store.clientId)) {
    if (removed.has(card.id) || !boardIds.has(card.boardId)) continue
    byId.set(card.id, card)
  }

  for (const card of Object.values(store.cards)) {
    if (removed.has(card.id) || !boardIds.has(card.boardId)) continue
    byId.set(card.id, card)
  }

  return [...byId.values()].sort((a, b) => {
    if (a.boardId !== b.boardId) return a.boardId.localeCompare(b.boardId)
    if (a.column !== b.column) return a.column.localeCompare(b.column)
    return a.title.localeCompare(b.title, 'pt-BR')
  })
}

export async function getBacklogSnapshot(clientId: string): Promise<BacklogSnapshot> {
  const store = await readBacklogStore(clientId)
  return {
    boards: listBoards(clientId),
    columns: BACKLOG_COLUMNS,
    cards: mergeCards(store),
    updatedAt: store.updatedAt,
  }
}

export async function getBacklogCard(
  clientId: string,
  cardId: string
): Promise<BacklogCard | null> {
  const snapshot = await getBacklogSnapshot(clientId)
  return snapshot.cards.find(c => c.id === cardId) ?? null
}

export async function upsertBacklogCard(clientId: string, card: BacklogCard): Promise<BacklogCard> {
  if (!getBacklogBoards(clientId).some(board => board.id === card.boardId)) {
    throw new Error('Board inválido para este cliente.')
  }
  const store = await readBacklogStore(clientId)
  store.cards[card.id] = { ...card, updatedAt: new Date().toISOString() }
  store.removedIds = store.removedIds.filter(id => id !== card.id)
  await writeBacklogStore(clientId, store)
  return store.cards[card.id]
}

export async function createBacklogCardsBatch(
  clientId: string,
  cards: BacklogCard[]
): Promise<{ created: BacklogCard[]; skipped: BacklogCard[] }> {
  const boardIds = new Set(getBacklogBoards(clientId).map(board => board.id))
  if (cards.some(card => !boardIds.has(card.boardId))) {
    throw new Error('Board inválido para este cliente.')
  }

  const store = await readBacklogStore(clientId)
  const existing = mergeCards(store)
  const existingIds = new Set(existing.map(card => card.id))
  const existingRefs = new Set(
    existing.map(card => card.source.ref).filter((ref): ref is string => Boolean(ref))
  )
  const created: BacklogCard[] = []
  const skipped: BacklogCard[] = []

  for (const card of cards) {
    if (existingIds.has(card.id) || (card.source.ref && existingRefs.has(card.source.ref))) {
      skipped.push(card)
      continue
    }
    store.cards[card.id] = card
    existingIds.add(card.id)
    if (card.source.ref) existingRefs.add(card.source.ref)
    created.push(card)
  }

  if (created.length > 0) await writeBacklogStore(clientId, store)
  return { created, skipped }
}

export async function patchBacklogCard(
  clientId: string,
  cardId: string,
  patch: CardPatch
): Promise<BacklogCard | null> {
  const current = await getBacklogCard(clientId, cardId)
  if (!current) return null
  const next: BacklogCard = {
    ...current,
    ...patch,
    id: current.id,
    source: current.source,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  }
  return upsertBacklogCard(clientId, next)
}

// ─── Copiloto ────────────────────────────────────────────────────────────────

function threadTitleFrom(message: string): string {
  const clean = message.trim().replace(/\s+/g, ' ')
  if (clean.length <= 60) return clean || 'Nova conversa'
  return `${clean.slice(0, 57)}…`
}

export async function listCopilotThreads(clientId: string): Promise<CopilotThreadSummary[]> {
  const store = await readBacklogStore(clientId)
  const boardIds = new Set(getBacklogBoards(clientId).map(board => board.id))
  return Object.values(store.threads ?? {})
    .filter(thread => boardIds.has(thread.boardId))
    .map(thread => ({
      id: thread.id,
      title: thread.title,
      boardId: thread.boardId,
      cardId: thread.cardId,
      messageCount: thread.messages.length,
      updatedAt: thread.updatedAt,
    }))
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
}

export async function getCopilotThread(
  clientId: string,
  threadId: string
): Promise<CopilotThread | null> {
  const store = await readBacklogStore(clientId)
  const thread = store.threads?.[threadId]
  if (!thread || !getBacklogBoards(clientId).some(board => board.id === thread.boardId)) return null
  return thread
}

export async function createCopilotThread(
  clientId: string,
  input: { boardId: BacklogBoardId; cardId?: string; title?: string }
): Promise<CopilotThread> {
  if (!getBacklogBoards(clientId).some(board => board.id === input.boardId)) {
    throw new Error('Board inválido para este cliente.')
  }
  const store = await readBacklogStore(clientId)
  const ts = new Date().toISOString()
  const thread: CopilotThread = {
    id: `thread-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title ? threadTitleFrom(input.title) : 'Nova conversa',
    boardId: input.boardId,
    cardId: input.cardId,
    messages: [],
    createdAt: ts,
    updatedAt: ts,
  }
  store.threads ??= {}
  store.threads[thread.id] = thread
  await writeBacklogStore(clientId, store)
  return thread
}

export async function appendCopilotMessages(
  clientId: string,
  threadId: string,
  messages: CopilotMessage[]
): Promise<CopilotThread | null> {
  const store = await readBacklogStore(clientId)
  const thread = store.threads?.[threadId]
  if (!thread) return null

  thread.messages.push(...messages)
  thread.updatedAt = new Date().toISOString()

  const firstUser = thread.messages.find(m => m.role === 'user')
  if (thread.title === 'Nova conversa' && firstUser) {
    thread.title = threadTitleFrom(firstUser.content)
  }

  await writeBacklogStore(clientId, store)
  return thread
}

export async function markMessageApplied(
  clientId: string,
  threadId: string,
  messageId: string,
  cardId: string
): Promise<CopilotThread | null> {
  const store = await readBacklogStore(clientId)
  const thread = store.threads?.[threadId]
  if (!thread) return null
  const message = thread.messages.find(m => m.id === messageId)
  if (!message) return null
  message.appliedCardId = cardId
  thread.updatedAt = new Date().toISOString()
  await writeBacklogStore(clientId, store)
  return thread
}

export async function createManualCard(
  clientId: string,
  input: {
    boardId: BacklogCard['boardId']
    title: string
    priority?: BacklogCard['priority']
    context?: string
  }
): Promise<BacklogCard> {
  const ts = new Date().toISOString()
  const card: BacklogCard = {
    id: `manual-${Date.now().toString(36)}`,
    boardId: input.boardId,
    column: 'requirement',
    title: input.title.trim(),
    level: 'raw',
    context: input.context,
    priority: input.priority ?? 'Média',
    source: { kind: 'manual' },
    createdAt: ts,
    updatedAt: ts,
  }
  return upsertBacklogCard(clientId, card)
}
