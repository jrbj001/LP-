import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { DeliveryType, FixKind, PrRow, RepoStatus } from './types'

export interface CachedCommit {
  date: string
  type: DeliveryType
  fixKind?: FixKind
}

export interface DeliveryCachePayload {
  fetchedAt: string
  /** Janela coberta pelo fetch (sempre o máximo, ex.: 90 dias). */
  windowDays: number
  windowStart: string
  windowEnd: string
  repos: RepoStatus[]
  prs: Omit<PrRow, 'estimatedHours'>[]
  commits: CachedCommit[]
}

const CACHE_DIR = path.join(process.cwd(), '.cache', 'deliveries')
/** Passado não muda — refresca a cada 6h só para pegar merges novos. */
export const CACHE_TTL_MS = 6 * 60 * 60 * 1000

function cachePath(clientId: string): string {
  return path.join(CACHE_DIR, `${clientId}.json`)
}

export async function readDeliveryCache(clientId: string): Promise<DeliveryCachePayload | null> {
  try {
    const raw = await readFile(cachePath(clientId), 'utf8')
    return JSON.parse(raw) as DeliveryCachePayload
  } catch {
    return null
  }
}

export async function writeDeliveryCache(clientId: string, payload: DeliveryCachePayload): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(cachePath(clientId), JSON.stringify(payload, null, 2), 'utf8')
}

export function isCacheFresh(cache: DeliveryCachePayload, ttlMs = CACHE_TTL_MS): boolean {
  const age = Date.now() - new Date(cache.fetchedAt).getTime()
  return age >= 0 && age < ttlMs
}
