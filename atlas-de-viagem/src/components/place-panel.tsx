'use client'

import { useEffect, useState } from 'react'
import { CATEGORIES, UNCATEGORIZED_COLOR, type Destination, type Place, type PlaceImage } from '@/lib/types'

const mediaCache = new Map<string, PlaceImage | null>()
const CATEGORY = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

function usePlaceImage(place: Place): { image: PlaceImage | null; loading: boolean } {
  const key = place.wiki ? `${place.wiki.lang}|${place.wiki.title}` : ''
  const known = place.image !== undefined ? place.image : key ? mediaCache.get(key) : null
  const [state, setState] = useState<{ key: string; image: PlaceImage | null } | null>(null)

  useEffect(() => {
    if (known !== undefined || !place.wiki) return
    let alive = true
    const query = new URLSearchParams({ lang: place.wiki.lang, title: place.wiki.title })
    if (place.wikidataId) query.set('wikidata', place.wikidataId)
    fetch(`/api/places/media?${query}`)
      .then(async res => {
        if (!res.ok) throw new Error(`media ${res.status}`)
        const data = (await res.json()) as { image: PlaceImage | null }
        mediaCache.set(key, data.image)
        if (alive) setState({ key, image: data.image })
      })
      .catch(() => alive && setState({ key, image: null }))
    return () => {
      alive = false
    }
  }, [key, known, place.wiki, place.wikidataId])

  if (known !== undefined) return { image: known ?? null, loading: false }
  if (state?.key === key) return { image: state.image, loading: false }
  return { image: null, loading: Boolean(place.wiki) }
}

export function PlaceDetails({
  place,
  favorite,
  onToggleFavorite,
}: {
  place: Place
  favorite: boolean
  onToggleFavorite: () => void
}) {
  const { image, loading } = usePlaceImage(place)
  const category = place.category ? CATEGORY[place.category] : null

  return (
    <article className="details">
      <div className={`details__media${image ? '' : ' is-empty'}${loading ? ' is-loading' : ''}`}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={place.name} width={image.width} height={image.height} />
        ) : (
          <span>{loading ? 'Carregando foto…' : 'Sem foto com licença identificada'}</span>
        )}
      </div>
      {image && (
        <p className="details__credit">
          Foto:{' '}
          <a href={image.descriptionUrl} target="_blank" rel="noreferrer">
            {image.artist}
          </a>{' '}
          ·{' '}
          {image.licenseUrl ? (
            <a href={image.licenseUrl} target="_blank" rel="noreferrer">
              {image.license}
            </a>
          ) : (
            image.license
          )}
        </p>
      )}

      <span className="details__category" style={{ ['--tag' as string]: category?.color ?? UNCATEGORIZED_COLOR }}>
        {category?.label ?? 'Atração'}
        {!place.curated && ' · descoberta perto de você'}
      </span>
      <h2 className="details__title">{place.name}</h2>
      <p className="details__description">{place.description}</p>

      <div className="details__actions">
        <button
          type="button"
          className={`button button--primary${favorite ? ' is-saved' : ''}`}
          aria-pressed={favorite}
          onClick={onToggleFavorite}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M10 17s-6.5-3.9-6.5-8.6A3.6 3.6 0 0110 6.1a3.6 3.6 0 016.5 2.3C16.5 13.1 10 17 10 17z"
              fill={favorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          {favorite ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
        </button>
        <a className="button button--ghost" href={place.sourceUrl} target="_blank" rel="noreferrer">
          Ler na fonte · {place.sourceLabel}
        </a>
      </div>
      {!place.curated && (
        <p className="details__license">
          Texto: trecho da{' '}
          <a href={place.sourceUrl} target="_blank" rel="noreferrer">
            {place.sourceLabel}
          </a>
          , sob{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br" target="_blank" rel="noreferrer">
            CC BY-SA 4.0
          </a>
          .
        </p>
      )}
    </article>
  )
}

export function RegionDetails({
  destination,
  places,
  onPickPlace,
}: {
  destination: Destination
  places: Place[]
  onPickPlace: (id: string) => void
}) {
  return (
    <section className="region">
      <span className="details__category" style={{ ['--tag' as string]: '#E2704A' }}>
        Destino · {destination.country}
      </span>
      <h2 className="details__title">{destination.name}</h2>
      <p className="details__description">{destination.summary}</p>
      <h3 className="region__heading">Pontos turísticos ({places.length})</h3>
      <ul className="region__list">
        {places.map(place => {
          const category = place.category ? CATEGORY[place.category] : null
          return (
            <li key={place.id}>
              <button type="button" onClick={() => onPickPlace(place.id)}>
                <span className="dot" style={{ background: category?.color ?? UNCATEGORIZED_COLOR }} />
                <span className="region__name">{place.name}</span>
                <span className="region__tag">{category?.label ?? 'Atração'}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
