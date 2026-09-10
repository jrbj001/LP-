import { describe, expect, it } from 'vitest'
import { firstTurnFooter, firstTurnWelcome, isOrientationAsk, welcomeFollowUps } from './welcome'

describe('primeira mensagem do Copiloto', () => {
  it('trata saudação e pedido de ajuda como orientação', () => {
    expect(isOrientationAsk('oi')).toBe(true)
    expect(isOrientationAsk('ajuda')).toBe(true)
    expect(isOrientationAsk('o que você faz?')).toBe(true)
    expect(isOrientationAsk('quantos roteiros existem no Colmeia?')).toBe(false)
    expect(isOrientationAsk('Oi')).toBe(true)
  })

  it('explica o que a Be180 pode fazer e traz exemplos', () => {
    const text = firstTurnWelcome('be180-ooh', 'Be180 OOH')
    expect(text).toContain('Colmeia')
    expect(text).toContain('Banco de Ativos')
    expect(text).toContain('reuniões')
    expect(text).toContain('Quantos roteiros existem no Colmeia?')
    expect(text).toContain('reunião de inventário')
    expect(welcomeFollowUps('be180-ooh').length).toBe(3)
    expect(firstTurnFooter('be180-ooh')).toContain('Banco de Ativos')
  })
})
