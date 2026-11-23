export const MIN_RADIUS_M = 200
export const MAX_RADIUS_M = 10000
export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 30

export type NearbyParams = { lat: number; lon: number; radius: number; limit: number }

export function parseNearbyParams(search: URLSearchParams): { ok: true; value: NearbyParams } | { ok: false; error: string } {
  const lat = Number(search.get('lat'))
  const lon = Number(search.get('lon'))
  const radius = Number(search.get('radius') ?? 5000)
  const limitRaw = search.get('limit')
  const limit = limitRaw === null ? DEFAULT_LIMIT : Number(limitRaw)

  if (search.get('lat') === null || !Number.isFinite(lat) || lat < -90 || lat > 90) {
    return { ok: false, error: 'lat deve estar entre -90 e 90.' }
  }
  if (search.get('lon') === null || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return { ok: false, error: 'lon deve estar entre -180 e 180.' }
  }
  if (!Number.isFinite(radius) || radius < MIN_RADIUS_M || radius > MAX_RADIUS_M) {
    return { ok: false, error: `radius deve estar entre ${MIN_RADIUS_M} e ${MAX_RADIUS_M} metros.` }
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return { ok: false, error: `limit deve ser um inteiro entre 1 e ${MAX_LIMIT}.` }
  }
  return { ok: true, value: { lat, lon, radius: Math.round(radius), limit } }
}

/** Chave de cache por região: ~1 km de grade e raio em faixas de 1 km. */
export function regionKey({ lat, lon, radius, limit }: NearbyParams): string {
  return `${lat.toFixed(2)}|${lon.toFixed(2)}|${Math.ceil(radius / 1000)}|${limit}`
}
