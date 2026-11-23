import { describe, expect, it } from 'vitest'
import { speakableText } from './speech-text'

describe('speakableText', () => {
  it('remove a linha de fontes e a marcação', () => {
    const answer = '*Status:* o PR #42 foi mergeado.\nFontes: #42, src/lib/x.ts'
    expect(speakableText(answer)).toBe('Status: o PR número 42 foi mergeado.')
  })

  it('troca links por texto e descarta URLs', () => {
    expect(speakableText('Veja [o guia](https://exemplo.com/a) para detalhes.')).toBe('Veja o guia para detalhes.')
  })

  it('corta em uma frase completa quando passa do limite', () => {
    const long = `${'Primeira frase bem completa aqui. '.repeat(3)}${'x'.repeat(400)}`
    const out = speakableText(long, 120)
    expect(out.length).toBeLessThanOrEqual(120)
    expect(out.endsWith('.')).toBe(true)
  })
})
