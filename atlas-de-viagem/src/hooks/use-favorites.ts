'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Place } from '@/lib/types'

export const FAVORITES_KEY = 'atlas-de-viagem:favoritos:v1'

function isPlace(value: unknown): value is Place {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.id === 'string' && typeof v.name === 'string' && typeof v.lat === 'number' && typeof v.lon === 'number'
}

function read(): Place[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isPlace) : []
  } catch {
    return []
  }
}

/** Favoritos guardam o lugar inteiro, porque pontos descobertos não existem no catálogo local. */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Place[]>([])

  useEffect(() => {
    setFavorites(read())
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_KEY) setFavorites(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((place: Place) => {
    setFavorites(current => {
      const exists = current.some(item => item.id === place.id)
      const next = exists ? current.filter(item => item.id !== place.id) : [place, ...current]
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      } catch {
        // armazenamento cheio ou bloqueado: mantém só em memória
      }
      return next
    })
  }, [])

  const isFavorite = useCallback((id: string) => favorites.some(item => item.id === id), [favorites])

  return { favorites, toggle, isFavorite }
}
