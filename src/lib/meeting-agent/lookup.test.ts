import { describe, expect, it } from 'vitest'
import { questionNeedsLookup } from './lookup'

describe('questionNeedsLookup', () => {
  it('deixa conversa e tema genérico no caminho rápido', () => {
    expect(questionNeedsLookup('oi, tudo bem?')).toBe(false)
    expect(questionNeedsLookup('o que você acha de microsserviços?')).toBe(false)
    expect(questionNeedsLookup('me apresenta a PixelPulseLab')).toBe(false)
    expect(questionNeedsLookup('explica o que é um product engineer')).toBe(false)
    expect(questionNeedsLookup('o time está animado')).toBe(false)
    expect(questionNeedsLookup('como você está hoje?')).toBe(false)
  })

  it('apresentação e o nome dele no meio da frase ficam no caminho rápido', () => {
    expect(questionNeedsLookup('Se apresente pra mim, Cadence, primeiro')).toBe(false)
    expect(questionNeedsLookup('Cadence, o que você acha disso?')).toBe(false)
    expect(questionNeedsLookup('quem é você, Cadence?')).toBe(false)
    expect(questionNeedsLookup('Cadence, quantos exibidores temos no banco de ativos?')).toBe(true)
    expect(questionNeedsLookup('o que está no backlog do Cadence?')).toBe(true)
  })

  it('manda para a pesquisa quando há fato, código, reunião, documento ou dado', () => {
    expect(questionNeedsLookup('quantos pontos de mídia ativos temos hoje?')).toBe(true)
    expect(questionNeedsLookup('o que foi decidido sobre a promoção?')).toBe(true)
    expect(questionNeedsLookup('como o código calcula o inventário?')).toBe(true)
    expect(questionNeedsLookup('quais documentos descrevem a arquitetura?')).toBe(true)
    expect(questionNeedsLookup('qual o status do backlog?')).toBe(true)
    expect(questionNeedsLookup('lista os roteiros da última semana')).toBe(true)
    expect(questionNeedsLookup('o que o Notion diz sobre o PRD?')).toBe(true)
    expect(questionNeedsLookup('o que está no Monday sobre o inventário?')).toBe(true)
  })
})
