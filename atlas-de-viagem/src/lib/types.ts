export type Category = 'natureza' | 'cultura' | 'historia'

export const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: 'natureza', label: 'Natureza', color: '#2FA36B' },
  { id: 'cultura', label: 'Cultura', color: '#E2704A' },
  { id: 'historia', label: 'História', color: '#D4A72C' },
]

export const UNCATEGORIZED_COLOR = '#7F93A8'

export type PlaceImage = {
  url: string
  width?: number
  height?: number
  artist: string
  license: string
  licenseUrl?: string
  descriptionUrl: string
}

export type Place = {
  id: string
  name: string
  lat: number
  lon: number
  /** `null` quando não foi possível identificar a categoria com confiança. */
  category: Category | null
  description: string
  sourceUrl: string
  sourceLabel: string
  wikidataId?: string
  wiki?: { lang: 'pt' | 'en' | 'es'; title: string }
  regionId?: string
  curated: boolean
  image?: PlaceImage | null
}

export type Destination = {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  /** Altura da câmera (m) ao voar para a região. */
  height: number
  summary: string
  /** Lado do rótulo na visão continental, para destinos vizinhos não se sobreporem. */
  labelSide: 'left' | 'right' | 'below'
}

export type NearbyResponse = {
  places: Place[]
  languages: string[]
  cached: boolean
  error?: string
}
