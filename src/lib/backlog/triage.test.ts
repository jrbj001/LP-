import { describe, expect, it } from 'vitest'
import { triageCopilotAsk } from './triage'

describe('triageCopilotAsk', () => {
  it('reconhece o oi como orientação, sem ferramentas', () => {
    expect(triageCopilotAsk({ message: 'oi' })).toEqual({ intent: 'orient', tools: [] })
    expect(triageCopilotAsk({ message: 'oi', channel: 'whatsapp' })).toEqual({
      intent: 'orient',
      tools: [],
    })
  })

  it('WhatsApp e portal usam o mesmo Copiloto numa pergunta de volume', () => {
    const expected = { intent: 'numbers', tools: ['sql', 'workspace'] }
    expect(
      triageCopilotAsk({ message: 'Quantos roteiros existem no Colmeia?', channel: 'whatsapp' })
    ).toEqual(expected)
    expect(triageCopilotAsk({ message: 'Quantos roteiros existem no Colmeia?' })).toEqual(expected)
  })

  it('reunião e documento entram pelo workspace, com o agente de dados decidindo', () => {
    expect(triageCopilotAsk({ message: 'O que combinamos na reunião de inventário?' })).toEqual({
      intent: 'workspace',
      tools: ['sql', 'workspace'],
    })
  })

  it('fluxo de produto abre o agente de código nos dois canais', () => {
    const expected = { intent: 'code', tools: ['sql', 'workspace', 'github'] }
    expect(triageCopilotAsk({ message: 'Como o Colmeia monta um roteiro?' })).toEqual(expected)
    expect(
      triageCopilotAsk({ message: 'Como o Colmeia monta um roteiro?', channel: 'whatsapp' })
    ).toEqual(expected)
  })

  it('pedido misto não escolhe uma faixa — workspace entra e o agente de dados decide', () => {
    const expected = { intent: 'mixed', tools: ['sql', 'workspace'] }
    expect(
      triageCopilotAsk({
        message: 'Quantos pontos tem e o que ficou na reunião?',
        channel: 'whatsapp',
      })
    ).toEqual(expected)
    expect(
      triageCopilotAsk({ message: 'Quantos pontos tem e o que ficou na reunião?' })
    ).toEqual(expected)
  })

  it('pergunta aberta ainda carrega workspace e deixa o agente de dados decidir', () => {
    expect(triageCopilotAsk({ message: 'Como a operação promove inventário do Colmeia?' })).toEqual({
      intent: 'unclear',
      tools: ['sql', 'workspace'],
    })
  })
})
