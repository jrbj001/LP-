import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { DeliveryType, FixKind, PrRow, RepoStatus } from './types'

export interface CachedCommit {
  date: string
  type: DeliveryType
  fixKind?: FixKind
}

export interface DeliveryCachePayload {
  /** Descarta caches gravados por versões antigas do coletor. */
  version?: number
  fetchedAt: string
  /** Janela coberta pelo fetch (sempre o máximo, ex.: 90 dias). */
  windowDays: number
  windowStart: string
  windowEnd: string
  repos: RepoStatus[]
  prs: Omit<PrRow, 'estimatedHours'>[]
  commits: CachedCommit[]
}

export const CACHE_VERSION = 2

// O filesystem do bundle é somente leitura na Vercel; /tmp permanece gravável
// durante a vida da instância. Localmente mantemos o cache dentro do projeto.
const CACHE_DIR = process.env.VERCEL
  ? path.join('/tmp', 'pixelpulselab', 'deliveries')
  : path.join(process.cwd(), '.cache', 'deliveries')
/** Passado não muda — refresca a cada 6h só para pegar merges novos. */
export const CACHE_TTL_MS = 6 * 60 * 60 * 1000

/** Espelho em memória: evita reler o disco a cada request da mesma instância. */
const memory = new Map<string, DeliveryCachePayload>()

function cachePath(clientId: string): string {
  return path.join(CACHE_DIR, `${clientId}.json`)
}

export async function readDeliveryCache(clientId: string): Promise<DeliveryCachePayload | null> {
  const cached = memory.get(clientId)
  if (cached) return cached

  try {
    const raw = await readFile(cachePath(clientId), 'utf8')
    const payload = JSON.parse(raw) as DeliveryCachePayload
    if ((payload.version ?? 1) !== CACHE_VERSION) return null
    memory.set(clientId, payload)
    return payload
  } catch {
    return null
  }
}

export async function writeDeliveryCache(clientId: string, payload: DeliveryCachePayload): Promise<void> {
  memory.set(clientId, payload)
  try {
    await mkdir(CACHE_DIR, { recursive: true })
    await writeFile(cachePath(clientId), JSON.stringify(payload), 'utf8')
  } catch (e) {
    // Disco indisponível (ex.: FS somente leitura): o espelho em memória basta
    // para a vida da instância.
    console.warn('[delivery/cache] persistência em disco indisponível:', e)
  }
}

/** Acima disso o cache é velho demais para ser exibido enquanto revalida. */
export const CACHE_MAX_STALE_MS = 7 * 24 * 60 * 60 * 1000

function ageOf(cache: DeliveryCachePayload): number {
  return Date.now() - new Date(cache.fetchedAt).getTime()
}

export function isCacheFresh(cache: DeliveryCachePayload, ttlMs = CACHE_TTL_MS): boolean {
  const age = ageOf(cache)
  return age >= 0 && age < ttlMs
}

/** Vencido, mas ainda bom o suficiente para responder na hora e revalidar ao fundo. */
export function isCacheUsableAsStale(
  cache: DeliveryCachePayload,
  maxStaleMs = CACHE_MAX_STALE_MS
): boolean {
  const age = ageOf(cache)
  return age >= 0 && age < maxStaleMs
}
