/**
 * Formatos de boca do avatar do Cadence, guiados pelo alinhamento por caractere que o
 * ElevenLabs devolve junto com o áudio (`/with-timestamps`).
 */

export interface SpeechAlignment {
  characters: string[]
  starts: number[]
  ends: number[]
}

/** Largura (px no viewBox), abertura (px) e sorriso (0 a 1, cantos levantados). */
export interface MouthShape {
  width: number
  open: number
  smile: number
}

export type Viseme = 'rest' | 'mbp' | 'a' | 'e' | 'i' | 'o' | 'u' | 'fv' | 'consonant'

export const MOUTH_SHAPES: Record<Viseme, MouthShape> = {
  rest: { width: 44, open: 0, smile: 0.55 },
  mbp: { width: 40, open: 0, smile: 0.2 },
  a: { width: 52, open: 28, smile: 0.25 },
  e: { width: 56, open: 15, smile: 0.6 },
  i: { width: 58, open: 8, smile: 0.9 },
  o: { width: 36, open: 22, smile: 0 },
  u: { width: 28, open: 11, smile: 0 },
  fv: { width: 48, open: 4, smile: 0.3 },
  consonant: { width: 48, open: 8, smile: 0.4 },
}

export function visemeFor(character: string): Viseme {
  const char = character.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (!/[a-z]/.test(char)) return 'rest'
  if (char === 'a') return 'a'
  if (char === 'e') return 'e'
  if (char === 'i' || char === 'y') return 'i'
  if (char === 'o') return 'o'
  if (char === 'u' || char === 'w') return 'u'
  if (char === 'm' || char === 'b' || char === 'p') return 'mbp'
  if (char === 'f' || char === 'v') return 'fv'
  return 'consonant'
}

/** Formato da boca no instante `seconds` do áudio; fora da fala, boca em repouso. */
export function visemeAt(alignment: SpeechAlignment, seconds: number): Viseme {
  const { characters, starts, ends } = alignment
  let low = 0
  let high = characters.length - 1
  while (low <= high) {
    const mid = (low + high) >> 1
    if (seconds < starts[mid]) high = mid - 1
    else if (seconds >= ends[mid]) low = mid + 1
    else return visemeFor(characters[mid])
  }
  return 'rest'
}

/** Aceita o formato bruto do ElevenLabs e descarta alinhamentos incoerentes. */
export function parseAlignment(raw: unknown): SpeechAlignment | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>
  const characters = data.characters
  const starts = data.character_start_times_seconds ?? data.starts
  const ends = data.character_end_times_seconds ?? data.ends
  if (!Array.isArray(characters) || !Array.isArray(starts) || !Array.isArray(ends)) return null
  if (characters.length === 0 || characters.length !== starts.length || characters.length !== ends.length) return null
  if (![...starts, ...ends].every(value => typeof value === 'number' && Number.isFinite(value))) return null
  return { characters: characters.map(String), starts: starts as number[], ends: ends as number[] }
}
