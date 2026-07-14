import type { StoredOnboard } from '@/components/adaptive/data'
import { STORAGE_KEY } from '@/components/adaptive/data'

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
}

export function clearOnboard() {
  localStorage.removeItem(STORAGE_KEY)
}
