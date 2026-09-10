import { describe, expect, it } from 'vitest'
import { triageClarify, triageCopilotAsk } from './triage'

describe('triageCopilotAsk', () => {
  it('reconhece o oi como orientação, sem ferramentas', () => {
    expect(triageCopilotAsk({ message: 'oi' })).toEqual({ intent: 'orient', tools: [] })
  })

  it('no WhatsApp manda volume só para o agente de dados', () => {
    expect(
      triageCopilotAsk({ message: 'Quantos roteiros existem no Colmeia?', channel: 'whatsapp' })
    ).toEqual({
      intent: 'numbers',
      tools: ['sql'],
    })
  })

  it('no portal a mesma pergunta de volume continua com o Copilot completo', () => {
    expect(triageCopilotAsk({ message: 'Quantos roteiros existem no Colmeia?' }).tools).toEqual([
      'sql',
      'workspace',
      'github',
    ])
  })

  it('manda reunião e documento para o workspace', () => {
    expect(triageCopilotAsk({ message: 'O que combinamos na reunião de inventário?' }).intent).toBe(
      'workspace'
    )
  })

  it('manda fluxo de produto para o GitHub', () => {
    expect(triageCopilotAsk({ message: 'Como o Colmeia monta um roteiro?' }).intent).toBe('code')
  })

  it('no WhatsApp escolhe uma faixa quando o pedido mistura assuntos', () => {
    const triage = triageCopilotAsk({
      message: 'Quantos pontos tem e o que ficou na reunião?',
      channel: 'whatsapp',
    })
    expect(triage.intent).toBe('numbers')
    expect(triage.tools).toEqual(['sql'])
  })

  it('no portal um pedido amplo ainda abre todas as ferramentas', () => {
    const triage = triageCopilotAsk({
      message: 'Quantos pontos tem e o que ficou na reunião?',
    })
    expect(triage.intent).toBe('mixed')
    expect(triage.tools).toEqual(['sql', 'workspace', 'github'])
  })

  it('no portal uma pergunta aberta continua com todas as ferramentas', () => {
    expect(triageCopilotAsk({ message: 'Como a operação promove inventário do Colmeia?' }).tools).toEqual([
      'sql',
      'workspace',
      'github',
    ])
  })
})

describe('triageClarify', () => {
  it('oferece as três faixas da Be180', () => {
    const text = triageClarify('be180-ooh')
    expect(text).toContain('número')
    expect(text).toContain('reunião')
    expect(text).toContain('código')
  })
})
