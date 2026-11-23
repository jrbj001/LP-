import { NextResponse } from 'next/server'
import { TtlCache } from '@/lib/ttl-cache'
import type { PlaceImage } from '@/lib/types'
import { pageImageFor, wikidataImageFor, type WikiLang } from '@/lib/wikipedia'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LANGS: WikiLang[] = ['pt', 'en', 'es']
const cache = new TtlCache<PlaceImage | null>(6 * 60 * 60 * 1000, 500)

/**
 * Foto do lugar: a da página na Wikipédia ou, se ela não tiver, a do item no Wikidata.
 * Só é entregue quando licença e autoria são identificáveis.
 */
export async function GET(request: Request) {
  const search = new URL(request.url).searchParams
  const lang = search.get('lang') as WikiLang | null
  const title = search.get('title')?.trim() ?? ''
  const wikidata = search.get('wikidata')?.trim() ?? ''
  if (!lang || !LANGS.includes(lang) || !title || title.length > 200 || (wikidata && !/^Q\d{1,12}$/.test(wikidata))) {
    return NextResponse.json({ image: null, error: 'Parâmetros inválidos.' }, { status: 400 })
  }

  const key = `${lang}|${title}|${wikidata}`
  const hit = cache.get(key)
  if (hit !== undefined) return NextResponse.json({ image: hit })

  try {
    const fromPage = await pageImageFor(lang, title).catch(error => {
      if (!wikidata) throw error
      return null
    })
    const image = fromPage ?? (wikidata ? await wikidataImageFor(wikidata) : null)
    cache.set(key, image)
    return NextResponse.json(
      { image },
      { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' } }
    )
  } catch {
    return NextResponse.json({ image: null, error: 'Wikipédia indisponível no momento.' }, { status: 502 })
  }
}
