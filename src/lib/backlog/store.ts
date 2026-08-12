import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { buildSeedCards, listBoards } from './seed'
import {
  BACKLOG_COLUMNS,
  BACKLOG_STORE_VERSION,
  type BacklogCard,
  type BacklogSnapshot,
  type BacklogStorePayload,
  type CardPatch,
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
  const byId = new Map<string, BacklogCard>()

  for (const card of buildSeedCards()) {
    if (removed.has(card.id)) continue
    byId.set(card.id, card)
  }

  for (const card of Object.values(store.cards)) {
    if (removed.has(card.id)) continue
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
    boards: listBoards(),
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
  const store = await readBacklogStore(clientId)
  store.cards[card.id] = { ...card, updatedAt: new Date().toISOString() }
  store.removedIds = store.removedIds.filter(id => id !== card.id)
  await writeBacklogStore(clientId, store)
  return store.cards[card.id]
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
