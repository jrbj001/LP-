import { readDeliveryCache } from './cache'
import { DEFAULT_EFFORT_CONFIG } from './config'

export interface DeliveryTeaser {
  prs: number
  hours: number
  repos: number
}

/** Lê o cache local (sem bater no GitHub) para números rápidos na home. */
export async function getDeliveryTeaser(clientId: string, periodDays = 90): Promise<DeliveryTeaser | null> {
  const cache = await readDeliveryCache(clientId)
  if (!cache?.prs.length) return null

  const periodEnd = new Date()
  const periodStart = new Date(periodEnd.getTime() - periodDays * 86_400_000)
  const prs = cache.prs.filter(p => {
    const t = new Date(p.mergedAt)
    return t >= periodStart && t <= periodEnd
  })
  if (prs.length === 0) return null

  const linesAdded = prs.reduce((acc, p) => acc + p.additions, 0)
  const hours = Math.round(linesAdded / DEFAULT_EFFORT_CONFIG.effectiveLocPerHour)

  return {
    prs: prs.length,
    hours,
    repos: cache.repos.filter(r => r.ok).length,
  }
}
