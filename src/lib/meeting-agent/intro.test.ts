import { describe, expect, it } from 'vitest'
import { CADENCE_INTRO_CHAT, CADENCE_INTRO_SPOKEN, isSelfIntro } from './intro'

describe('isSelfIntro', () => {
  it('reconhece pedido de apresentação', () => {
    expect(isSelfIntro('me apresenta em uma frase')).toBe(true)
    expect(isSelfIntro('Cadence, se apresenta')).toBe(true)
    expect(isSelfIntro('quem é você?')).toBe(true)
  })

  it('não dispara em conversa comum nem quando pedem a empresa', () => {
    expect(isSelfIntro('o que você acha de microsserviços?')).toBe(false)
    expect(isSelfIntro('me apresenta a PixelPulseLab')).toBe(false)
  })

  it('a fala é curta e o chat explica como usar', () => {
    expect(CADENCE_INTRO_SPOKEN).toContain('Product Engineer')
    expect(CADENCE_INTRO_SPOKEN.length).toBeLessThan(CADENCE_INTRO_CHAT.length)
    expect(CADENCE_INTRO_CHAT).toContain('@Cadence')
    expect(CADENCE_INTRO_CHAT).toContain('só falo quando me chamam')
  })
})
