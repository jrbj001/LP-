export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Distância em metros entre dois pontos (haversine). */
export function distanceMeters(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(bLat - aLat)
  const dLon = toRad(bLon - aLon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

type Dedupable = { name: string; lat: number; lon: number; wikidataId?: string }

const SAME_PLACE_RADIUS_M = 1500

export function isSamePlace(a: Dedupable, b: Dedupable): boolean {
  if (a.wikidataId && b.wikidataId) return a.wikidataId === b.wikidataId
  const na = normalizeName(a.name)
  const nb = normalizeName(b.name)
  if (!na || !nb) return false
  const nameMatch = na === nb || (Math.min(na.length, nb.length) >= 6 && (na.includes(nb) || nb.includes(na)))
  return nameMatch && distanceMeters(a.lat, a.lon, b.lat, b.lon) <= SAME_PLACE_RADIUS_M
}

/** Mantém a primeira ocorrência: passe as fontes prioritárias primeiro. */
export function dedupePlaces<T extends Dedupable>(items: T[]): T[] {
  const kept: T[] = []
  for (const item of items) {
    if (!kept.some(existing => isSamePlace(existing, item))) kept.push(item)
  }
  return kept
}
