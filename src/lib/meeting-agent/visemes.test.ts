import { describe, expect, it } from 'vitest'
import { parseAlignment, visemeAt, visemeFor } from './visemes'

describe('visemeFor', () => {
  it('mapeia vogais com e sem acento', () => {
    expect(visemeFor('a')).toBe('a')
    expect(visemeFor('Ã')).toBe('a')
    expect(visemeFor('é')).toBe('e')
    expect(visemeFor('ô')).toBe('o')
    expect(visemeFor('ú')).toBe('u')
  })

  it('fecha os lábios em m, b e p e deixa pontuação em repouso', () => {
    expect(visemeFor('m')).toBe('mbp')
    expect(visemeFor('P')).toBe('mbp')
    expect(visemeFor(' ')).toBe('rest')
    expect(visemeFor(',')).toBe('rest')
    expect(visemeFor('ç')).toBe('consonant')
  })
})

describe('visemeAt', () => {
  const alignment = {
    characters: ['O', 'i', ' ', 'm'],
    starts: [0, 0.1, 0.2, 0.3],
    ends: [0.1, 0.2, 0.3, 0.4],
  }

  it('encontra o caractere falado no instante', () => {
    expect(visemeAt(alignment, 0.05)).toBe('o')
    expect(visemeAt(alignment, 0.15)).toBe('i')
    expect(visemeAt(alignment, 0.25)).toBe('rest')
    expect(visemeAt(alignment, 0.35)).toBe('mbp')
  })

  it('fica em repouso antes e depois da fala', () => {
    expect(visemeAt(alignment, -1)).toBe('rest')
    expect(visemeAt(alignment, 2)).toBe('rest')
  })
})

describe('parseAlignment', () => {
  it('lê o formato do ElevenLabs', () => {
    expect(
      parseAlignment({
        characters: ['O', 'i'],
        character_start_times_seconds: [0, 0.1],
        character_end_times_seconds: [0.1, 0.2],
      })
    ).toEqual({ characters: ['O', 'i'], starts: [0, 0.1], ends: [0.1, 0.2] })
  })

  it('descarta alinhamento incoerente', () => {
    expect(parseAlignment(null)).toBeNull()
    expect(parseAlignment({ characters: ['a'], starts: [0], ends: [] })).toBeNull()
    expect(parseAlignment({ characters: ['a'], starts: ['x'], ends: [1] })).toBeNull()
  })
})
