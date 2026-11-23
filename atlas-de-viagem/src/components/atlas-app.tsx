'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CURATED_PLACES, DESTINATIONS } from '@/data/catalog'
import { useFavorites } from '@/hooks/use-favorites'
import { useNearby } from '@/hooks/use-nearby'
import { CATEGORIES, type Category, type Place } from '@/lib/types'
import { GlobeView, type CameraIdle, type GlobeHandle, type GlobeMode } from './globe-view'
import { Logo } from './logo'
import { PlaceDetails, RegionDetails } from './place-panel'
import { SearchBox } from './search-box'

type Panel = { kind: 'place'; id: string } | { kind: 'region'; id: string } | null

export function AtlasApp() {
  const globeRef = useRef<GlobeHandle>(null)
  const [creditsEl, setCreditsEl] = useState<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<GlobeMode | null>(null)
  const [panel, setPanel] = useState<Panel>(null)
  const [sheetExpanded, setSheetExpanded] = useState(true)
  const [filters, setFilters] = useState<Set<Category>>(new Set())
  const [showFavorites, setShowFavorites] = useState(false)
  const { favorites, toggle, isFavorite } = useFavorites()
  const { discovered, status, explore, dismissError } = useNearby()

  const places = useMemo(() => {
    const byId = new Map<string, Place>()
    for (const place of [...CURATED_PLACES, ...discovered, ...favorites]) {
      if (!byId.has(place.id)) byId.set(place.id, place)
    }
    return [...byId.values()]
  }, [discovered, favorites])

  const placeById = useMemo(() => new Map(places.map(place => [place.id, place])), [places])
  const selected = panel?.kind === 'place' ? placeById.get(panel.id) ?? null : null
  const region = panel?.kind === 'region' ? DESTINATIONS.find(d => d.id === panel.id) ?? null : null

  const selectPlace = useCallback(
    (id: string) => {
      const place = placeById.get(id)
      if (!place) return
      setPanel({ kind: 'place', id })
      setSheetExpanded(true)
      setShowFavorites(false)
      globeRef.current?.flyToPlace(place)
    },
    [placeById]
  )

  const selectDestination = useCallback((id: string) => {
    const destination = DESTINATIONS.find(d => d.id === id)
    if (!destination) return
    setPanel({ kind: 'region', id })
    setSheetExpanded(true)
    setShowFavorites(false)
    globeRef.current?.flyToDestination(destination)
  }, [])

  const onCameraIdle = useCallback((camera: CameraIdle) => explore(camera), [explore])

  useEffect(() => {
    if (status !== 'error') return
    const timer = setTimeout(dismissError, 7000)
    return () => clearTimeout(timer)
  }, [status, dismissError])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPanel(null)
        setShowFavorites(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const regionPlaces = region ? places.filter(place => place.regionId === region.id) : []

  function toggleFilter(category: Category) {
    setFilters(current => {
      const next = new Set(current)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  return (
    <main className={`atlas${panel ? ' atlas--panel-open' : ''}`}>
      <div ref={setCreditsEl} className="credits" />
      {creditsEl && (
        <GlobeView
          ref={globeRef}
          places={places}
          visibleCategories={filters}
          selectedId={selected?.id ?? null}
          creditsContainer={creditsEl}
          onSelectPlace={selectPlace}
          onSelectDestination={selectDestination}
          onCameraIdle={onCameraIdle}
          onModeChange={setMode}
        />
      )}

      <header className="hud">
        <div className="brand">
          <button type="button" className="brand__home" onClick={() => globeRef.current?.flyHome()} title="Voltar à América do Sul">
            <Logo />
            <span>
              <strong>Atlas de Viagem</strong>
              <small>Descubra o mundo de cima</small>
            </span>
          </button>
          <button
            type="button"
            className={`favorites-toggle${showFavorites ? ' is-open' : ''}`}
            onClick={() => setShowFavorites(open => !open)}
            aria-expanded={showFavorites}
            aria-label={`Favoritos (${favorites.length})`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M10 17s-6.5-3.9-6.5-8.6A3.6 3.6 0 0110 6.1a3.6 3.6 0 016.5 2.3C16.5 13.1 10 17 10 17z"
                fill="currentColor"
              />
            </svg>
            <span className="favorites-toggle__label">Favoritos</span>
            <span className="badge">{favorites.length}</span>
          </button>
        </div>

        <SearchBox destinations={DESTINATIONS} places={places} onPickDestination={selectDestination} onPickPlace={selectPlace} />

        <nav className="chips" aria-label="Destinos em destaque">
          {DESTINATIONS.map(destination => (
            <button
              key={destination.id}
              type="button"
              className={`chip${region?.id === destination.id ? ' is-active' : ''}`}
              onClick={() => selectDestination(destination.id)}
            >
              {destination.name}
            </button>
          ))}
        </nav>

        <div className="chips chips--filters" role="group" aria-label="Filtrar por categoria">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              type="button"
              className={`chip chip--filter${filters.has(category.id) ? ' is-active' : ''}`}
              style={{ ['--tag' as string]: category.color }}
              aria-pressed={filters.has(category.id)}
              onClick={() => toggleFilter(category.id)}
            >
              <span className="dot" />
              {category.label}
            </button>
          ))}
        </div>

        {showFavorites && (
          <section className="favorites" aria-label="Favoritos">
            {favorites.length === 0 ? (
              <p className="favorites__empty">Toque no coração de um lugar para guardá-lo aqui.</p>
            ) : (
              <ul>
                {favorites.map(place => (
                  <li key={place.id}>
                    <button type="button" onClick={() => selectPlace(place.id)}>
                      {place.name}
                    </button>
                    <button type="button" className="favorites__remove" aria-label={`Remover ${place.name}`} onClick={() => toggle(place)}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <div className="hud__status">
          {mode?.kind === 'publico' && (
            <span className="pill" title="Configure NEXT_PUBLIC_CESIUM_ION_TOKEN para relevo 3D">
              {mode.token === 'recusado' ? 'Token recusado · satélite sem relevo' : 'Satélite · sem relevo 3D'}
            </span>
          )}
          {mode?.kind === 'basico' && (
            <span className="pill pill--warn" title="A imagem detalhada não carregou. O mapa simplificado continua navegável.">
              Mapa simplificado · imagem detalhada indisponível
            </span>
          )}
          {mode?.kind === 'satelite' && <span className="pill">Satélite · relevo 3D</span>}
          {mode?.kind === 'falha' && (
            <span className="pill pill--warn" title={mode.message}>
              O globo não carregou neste navegador · use a busca e os atalhos
            </span>
          )}
          {status === 'loading' && <span className="pill">Descobrindo lugares por perto…</span>}
        </div>

        {status === 'error' && (
          <div className="toast" role="status">
            Não conseguimos buscar mais lugares agora. Os pontos curados continuam no mapa.
            <button type="button" onClick={dismissError} aria-label="Fechar aviso">
              ×
            </button>
          </div>
        )}
      </header>

      {(selected || region) && (
        <aside className={`panel${sheetExpanded ? ' is-expanded' : ''}`} aria-label={selected ? 'Detalhes do lugar' : 'Destino'}>
          <div className="panel__bar">
            <button
              type="button"
              className="panel__handle"
              aria-label={sheetExpanded ? 'Recolher painel' : 'Expandir painel'}
              onClick={() => setSheetExpanded(value => !value)}
            />
            {selected?.regionId && (
              <button type="button" className="panel__back" onClick={() => setPanel({ kind: 'region', id: selected.regionId! })}>
                ← {DESTINATIONS.find(d => d.id === selected.regionId)?.name}
              </button>
            )}
            <button type="button" className="panel__close" aria-label="Fechar painel" onClick={() => setPanel(null)}>
              ×
            </button>
          </div>
          <div className="panel__body">
            {selected ? (
              <PlaceDetails place={selected} favorite={isFavorite(selected.id)} onToggleFavorite={() => toggle(selected)} />
            ) : region ? (
              <RegionDetails destination={region} places={regionPlaces} onPickPlace={selectPlace} />
            ) : null}
          </div>
        </aside>
      )}
    </main>
  )
}
