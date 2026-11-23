import { NextResponse } from 'next/server'
import { CURATED_PLACES } from '@/data/catalog'
import { dedupePlaces, isSamePlace } from '@/lib/geo'
import { parseNearbyParams, regionKey } from '@/lib/nearby-params'
import { TtlCache } from '@/lib/ttl-cache'
import type { NearbyResponse, Place } from '@/lib/types'
import { licensedImages, nearbyCandidates, type Candidate, type WikiLang } from '@/lib/wikipedia'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Abaixo disso, a busca em português é complementada pela Wikipédia em inglês. */
const MIN_ELIGIBLE_PT = 6

const cache = new TtlCache<Omit<NearbyResponse, 'cached'>>(60 * 60 * 1000, 300)

async function withImages(lang: WikiLang, candidates: Candidate[]): Promise<Map<string, Place['image']>> {
  const files = candidates.filter(c => c.wiki?.lang === lang && c.pageimage).map(c => c.pageimage!)
  if (!files.length) return new Map()
  try {
    return await licensedImages(lang, files)
  } catch {
    return new Map()
  }
}

export async function GET(request: Request) {
  const parsed = parseNearbyParams(new URL(request.url).searchParams)
  if (!parsed.ok) {
    return NextResponse.json({ places: [], languages: [], cached: false, error: parsed.error } satisfies NearbyResponse, {
      status: 400,
    })
  }
  const params = parsed.value
  const key = regionKey(params)
  const hit = cache.get(key)
  if (hit) {
    return NextResponse.json({ ...hit, cached: true } satisfies NearbyResponse, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' },
    })
  }

  const languages: WikiLang[] = []
  const failures: string[] = []
  let candidates: Candidate[] = []

  try {
    candidates = await nearbyCandidates('pt', params.lat, params.lon, params.radius)
    languages.push('pt')
  } catch (error) {
    failures.push(`pt: ${error instanceof Error ? error.message : 'falha'}`)
  }

  if (candidates.length < MIN_ELIGIBLE_PT) {
    try {
      const english = await nearbyCandidates('en', params.lat, params.lon, params.radius)
      languages.push('en')
      candidates = dedupePlaces([...candidates, ...english])
    } catch (error) {
      failures.push(`en: ${error instanceof Error ? error.message : 'falha'}`)
    }
  }

  if (!languages.length) {
    console.error('[places/nearby]', failures.join(' · '))
    return NextResponse.json(
      { places: [], languages: [], cached: false, error: 'Wikipédia indisponível no momento.' } satisfies NearbyResponse,
      { status: 502 }
    )
  }

  const fresh = candidates
    .filter(candidate => !CURATED_PLACES.some(curated => isSamePlace(curated, candidate)))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, params.limit)

  const [ptImages, enImages] = await Promise.all([withImages('pt', fresh), withImages('en', fresh)])
  const places: Place[] = fresh.map(({ pageimage, distance: _distance, ...place }) => ({
    ...place,
    image: pageimage ? ((place.wiki?.lang === 'en' ? enImages : ptImages).get(pageimage) ?? null) : null,
  }))

  const body = { places, languages }
  cache.set(key, body)
  return NextResponse.json({ ...body, cached: false } satisfies NearbyResponse, {
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
