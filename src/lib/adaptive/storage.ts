import type { StoredOnboard } from '@/components/adaptive/data'
import { STORAGE_KEY } from '@/components/adaptive/data'

/** Chave usada pela Minha Área (portfolio) — sincronizada com o onboard */
export const MY_AREA_KEY = 'adaptive.orfeu.stakeholder'

export function readOnboard(): StoredOnboard | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredOnboard
  } catch {
    return null
  }
}

export function writeOnboard(data: StoredOnboard) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  // Liga Onboard ↔ Minha Área (mesma identidade)
  localStorage.setItem(MY_AREA_KEY, data.stakeholder)
}

export function clearOnboard() {
  localStorage.removeItem(STORAGE_KEY)
}

export function readMyAreaName(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(MY_AREA_KEY)
}

export function writeMyAreaName(name: string) {
  localStorage.setItem(MY_AREA_KEY, name)
}
