'use client'

import { useMemo, useState } from 'react'
import { normalizeName } from '@/lib/geo'
import { CATEGORIES, type Destination, type Place } from '@/lib/types'

type Result =
  | { kind: 'destino'; id: string; title: string; subtitle: string }
  | { kind: 'lugar'; id: string; title: string; subtitle: string }

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]))

export function SearchBox({
  destinations,
  places,
  onPickDestination,
  onPickPlace,
}: {
  destinations: Destination[]
  places: Place[]
  onPickDestination: (id: string) => void
  onPickPlace: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const results = useMemo<Result[]>(() => {
    const q = normalizeName(query)
    if (!q) return []
    const matches = (text: string) => normalizeName(text).includes(q)
    const destinationHits: Result[] = destinations
      .filter(d => matches(d.name) || matches(d.country))
      .map(d => ({ kind: 'destino', id: d.id, title: d.name, subtitle: `Destino · ${d.country}` }))
    const placeHits: Result[] = places
      .filter(p => matches(p.name))
      .map(p => ({
        kind: 'lugar',
        id: p.id,
        title: p.name,
        subtitle: [p.category ? CATEGORY_LABEL[p.category] : 'Atração', p.curated ? 'Curadoria' : 'Descoberto'].join(' · '),
      }))
    return [...destinationHits, ...placeHits].slice(0, 8)
  }, [query, destinations, places])

  function pick(result: Result) {
    if (result.kind === 'destino') onPickDestination(result.id)
    else onPickPlace(result.id)
    setQuery('')
    setOpen(false)
    setActive(0)
  }

  return (
    <div className="search" role="search">
      <svg className="search__icon" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={query}
        placeholder="Buscar destinos e atrações"
        aria-label="Buscar destinos e atrações"
        aria-expanded={open && results.length > 0}
        aria-controls="search-results"
        role="combobox"
        aria-autocomplete="list"
        onChange={event => {
          setQuery(event.target.value)
          setOpen(true)
          setActive(0)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={event => {
          if (!results.length) return
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActive(i => (i + 1) % results.length)
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActive(i => (i - 1 + results.length) % results.length)
          } else if (event.key === 'Enter') {
            event.preventDefault()
            pick(results[active] ?? results[0])
          } else if (event.key === 'Escape') {
            setOpen(false)
          }
        }}
      />
      {open && query.trim() && (
        <ul id="search-results" className="search__results" role="listbox">
          {results.length === 0 && <li className="search__empty">Nada encontrado no catálogo.</li>}
          {results.map((result, index) => (
            <li key={`${result.kind}:${result.id}`} role="option" aria-selected={index === active}>
              <button
                type="button"
                className={index === active ? 'is-active' : ''}
                onMouseDown={event => event.preventDefault()}
                onClick={() => pick(result)}
              >
                <span className="search__title">{result.title}</span>
                <span className="search__subtitle">{result.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
