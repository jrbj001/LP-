import 'server-only'
import { classifyPage } from './classify'
import { dedupePlaces, distanceMeters } from './geo'
import type { Place, PlaceImage } from './types'

export type WikiLang = 'pt' | 'en' | 'es'

const USER_AGENT = 'AtlasDeViagem/0.1 (https://github.com/jrbj001/LP-; atlas-de-viagem)'
const TIMEOUT_MS = 7000

function endpoint(lang: WikiLang): string {
  const template = process.env.WIKIPEDIA_API_ENDPOINT || 'https://{lang}.wikipedia.org/w/api.php'
  return template.replace('{lang}', lang)
}

type Params = Record<string, string>

async function mediawiki<T>(lang: WikiLang, params: Params): Promise<T> {
  const url = `${endpoint(lang)}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`MediaWiki ${lang} respondeu ${res.status}`)
  return (await res.json()) as T
}

type RawPage = {
  pageid: number
  title: string
  index?: number
  coordinates?: { lat: number; lon: number }[]
  pageprops?: { wikibase_item?: string; disambiguation?: string }
  description?: string
  extract?: string
  fullurl?: string
  pageimage?: string
  categories?: { title: string }[]
}

type QueryResponse = {
  continue?: Record<string, string>
  query?: { pages?: RawPage[] }
}

/** Busca páginas por coordenada, seguindo a continuação para juntar categorias e extratos. */
async function geosearchPages(lang: WikiLang, lat: number, lon: number, radius: number): Promise<RawPage[]> {
  const base: Params = {
    action: 'query',
    generator: 'geosearch',
    ggscoord: `${lat}|${lon}`,
    ggsradius: String(radius),
    ggslimit: '50',
    ggsnamespace: '0',
    prop: 'coordinates|pageprops|description|extracts|info|pageimages|categories',
    ppprop: 'wikibase_item|disambiguation',
    exintro: '1',
    explaintext: '1',
    exsentences: '2',
    exlimit: 'max',
    inprop: 'url',
    piprop: 'name',
    clshow: '!hidden',
    cllimit: 'max',
  }
  const pages = new Map<number, RawPage>()
  let cont: Record<string, string> | undefined
  for (let i = 0; i < 5; i++) {
    const data = await mediawiki<QueryResponse>(lang, { ...base, ...(cont ?? {}) })
    for (const page of data.query?.pages ?? []) {
      const current = pages.get(page.pageid)
      if (!current) {
        pages.set(page.pageid, { ...page, categories: [...(page.categories ?? [])] })
        continue
      }
      current.categories = [...(current.categories ?? []), ...(page.categories ?? [])]
      current.extract ||= page.extract
      current.description ||= page.description
      current.pageimage ||= page.pageimage
      current.coordinates ||= page.coordinates
    }
    if (!data.continue) break
    cont = data.continue
  }
  return [...pages.values()]
}

function trimText(text: string, max = 280): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

export type Candidate = Place & { pageimage?: string; distance: number }

export async function nearbyCandidates(lang: WikiLang, lat: number, lon: number, radius: number): Promise<Candidate[]> {
  const pages = await geosearchPages(lang, lat, lon, radius)
  const candidates: Candidate[] = []
  for (const page of pages) {
    const coord = page.coordinates?.[0]
    if (!coord || page.pageprops?.disambiguation !== undefined) continue
    const verdict = classifyPage({
      title: page.title,
      description: page.description,
      categories: (page.categories ?? []).map(c => c.title),
    })
    if (!verdict.eligible) continue
    const wikidataId = page.pageprops?.wikibase_item
    const description = trimText(page.extract || page.description || '')
    if (!description) continue
    candidates.push({
      id: wikidataId ? `wd-${wikidataId}` : `wp-${lang}-${page.pageid}`,
      name: page.title,
      lat: coord.lat,
      lon: coord.lon,
      category: verdict.category,
      description,
      sourceUrl: page.fullurl ?? `https://${lang}.wikipedia.org/?curid=${page.pageid}`,
      sourceLabel: lang === 'pt' ? 'Wikipédia' : `Wikipedia (${lang})`,
      wikidataId,
      wiki: { lang, title: page.title },
      curated: false,
      pageimage: page.pageimage,
      distance: distanceMeters(lat, lon, coord.lat, coord.lon),
    })
  }
  return dedupePlaces(candidates.sort((a, b) => a.distance - b.distance))
}

type ImageInfoResponse = {
  query?: {
    normalized?: { from: string; to: string }[]
    pages?: {
      title: string
      imageinfo?: {
        thumburl?: string
        thumbwidth?: number
        thumbheight?: number
        url?: string
        descriptionurl?: string
        extmetadata?: Record<string, { value?: string } | undefined>
      }[]
    }[]
  }
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Resolve imagens com licença e autoria identificáveis. Arquivos sem licença,
 * sem autor ou marcados como não livres ficam de fora.
 */
export async function licensedImages(lang: WikiLang, fileNames: string[]): Promise<Map<string, PlaceImage>> {
  const result = new Map<string, PlaceImage>()
  const unique = [...new Set(fileNames.filter(Boolean))].slice(0, 50)
  if (!unique.length) return result
  const data = await mediawiki<ImageInfoResponse>(lang, {
    action: 'query',
    titles: unique.map(name => `File:${name}`).join('|'),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '640',
    iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|Credit|NonFree|UsageTerms',
  })
  const byTitle = new Map<string, string>()
  for (const name of unique) byTitle.set(`File:${name}`, name)
  for (const n of data.query?.normalized ?? []) {
    const original = byTitle.get(n.from)
    if (original) byTitle.set(n.to, original)
  }
  for (const page of data.query?.pages ?? []) {
    const info = page.imageinfo?.[0]
    const meta = info?.extmetadata ?? {}
    const license = stripHtml(meta.LicenseShortName?.value ?? '')
    const artist = stripHtml(meta.Artist?.value ?? '') || stripHtml(meta.Credit?.value ?? '')
    const nonFree = String(meta.NonFree?.value ?? '').toLowerCase() === 'true' || /fair use|non-free/i.test(license)
    const url = info?.thumburl ?? info?.url
    const name = byTitle.get(page.title)
    if (!name || !info || !url || !info.descriptionurl || !license || !artist || nonFree) continue
    result.set(name, {
      url,
      width: info.thumbwidth,
      height: info.thumbheight,
      artist: trimText(artist, 120),
      license,
      licenseUrl: meta.LicenseUrl?.value,
      descriptionUrl: info.descriptionurl,
    })
  }
  return result
}

type PageImageResponse = { query?: { pages?: { title: string; pageimage?: string; missing?: boolean }[] } }

export async function pageImageFor(lang: WikiLang, title: string): Promise<PlaceImage | null> {
  const data = await mediawiki<PageImageResponse>(lang, {
    action: 'query',
    titles: title,
    redirects: '1',
    prop: 'pageimages',
    piprop: 'name',
  })
  const file = data.query?.pages?.[0]?.pageimage
  if (!file) return null
  return (await licensedImages(lang, [file])).get(file) ?? null
}

type ClaimsResponse = { claims?: { P18?: { mainsnak?: { datavalue?: { value?: unknown } } }[] } }

/** Imagem principal (P18) do item no Wikidata, para páginas sem foto própria. */
export async function wikidataImageFor(wikidataId: string): Promise<PlaceImage | null> {
  const url = `https://www.wikidata.org/w/api.php?${new URLSearchParams({
    action: 'wbgetclaims',
    format: 'json',
    entity: wikidataId,
    property: 'P18',
  })}`
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Wikidata respondeu ${res.status}`)
  const data = (await res.json()) as ClaimsResponse
  const file = data.claims?.P18?.[0]?.mainsnak?.datavalue?.value
  if (typeof file !== 'string' || !file) return null
  return (await licensedImages('en', [file])).get(file) ?? null
}
