'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CameraIdle } from '@/components/globe-view'
import type { NearbyResponse, Place } from '@/lib/types'

/** Só explora quando a câmera está a menos de 60 km do solo. */
export const EXPLORE_HEIGHT = 60_000
const IDLE_DELAY_MS = 450
const MAX_DISCOVERED = 400

export type NearbyStatus = 'idle' | 'loading' | 'error'

function radiusFor(height: number): number {
  return Math.min(10_000, Math.max(1_500, Math.round(height * 0.9)))
}

export function useNearby() {
  const [discovered, setDiscovered] = useState<Place[]>([])
  const [status, setStatus] = useState<NearbyStatus>('idle')
  const cacheRef = useRef(new Map<string, Place[]>())
  const seqRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const merge = useCallback((places: Place[]) => {
    setDiscovered(current => {
      const byId = new Map(current.map(place => [place.id, place]))
      for (const place of places) byId.set(place.id, place)
      return [...byId.values()].slice(-MAX_DISCOVERED)
    })
  }, [])

  const explore = useCallback(
    (camera: CameraIdle) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (camera.height > EXPLORE_HEIGHT) {
        seqRef.current++
        abortRef.current?.abort()
        setStatus(current => (current === 'loading' ? 'idle' : current))
        return
      }
      timerRef.current = setTimeout(async () => {
        const radius = radiusFor(camera.height)
        const key = `${camera.lat.toFixed(2)}|${camera.lon.toFixed(2)}|${Math.ceil(radius / 1000)}`
        const cached = cacheRef.current.get(key)
        if (cached) {
          merge(cached)
          return
        }
        const seq = ++seqRef.current
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller
        setStatus('loading')
        try {
          const query = new URLSearchParams({
            lat: camera.lat.toFixed(5),
            lon: camera.lon.toFixed(5),
            radius: String(radius),
          })
          const res = await fetch(`/api/places/nearby?${query}`, { signal: controller.signal })
          const data = (await res.json()) as NearbyResponse
          if (seq !== seqRef.current) return
          if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
          cacheRef.current.set(key, data.places)
          merge(data.places)
          setStatus('idle')
        } catch (error) {
          if (controller.signal.aborted || seq !== seqRef.current) return
          console.warn('[descoberta] falhou', error)
          setStatus('error')
        }
      }, IDLE_DELAY_MS)
    },
    [merge]
  )

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      abortRef.current?.abort()
    },
    []
  )

  const dismissError = useCallback(() => setStatus(current => (current === 'error' ? 'idle' : current)), [])

  return { discovered, status, explore, dismissError }
}
