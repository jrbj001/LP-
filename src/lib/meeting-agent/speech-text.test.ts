import { describe, expect, it } from 'vitest'
import { completedSpoken, speakableText, splitAgentReply } from './speech-text'

describe('splitAgentReply', () => {
  it('separa a fala curta do texto completo do chat', () => {
    const reply = 'FALA: O fluxo passa pela validação do inventário. Mandei os detalhes no chat.\nCHAT: 1. Valida o inventário\n2. Publica no board\nFontes: #149'
    expect(splitAgentReply(reply)).toEqual({
      spoken: 'O fluxo passa pela validação do inventário. Mandei os detalhes no chat.',
      chat: '1. Valida o inventário\n2. Publica no board\nFontes: #149',
    })
  })

  it('sem marcações, fala o começo e manda tudo no chat', () => {
    const reply = 'A PixelPulseLab constrói plataformas de IA para operações reais.'
    expect(splitAgentReply(reply)).toEqual({ spoken: reply, chat: reply })
  })

  it('só considera a fala pronta quando o chat começa', () => {
    expect(completedSpoken('FALA: Claro, a PixelPulse')).toBeNull()
    expect(completedSpoken('FALA: Claro, posso apresentar.\nCHAT: A Pixel')).toBe('Claro, posso apresentar.')
  })
})

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
