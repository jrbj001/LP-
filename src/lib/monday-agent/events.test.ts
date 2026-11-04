import { describe, expect, it } from 'vitest'
import { interpretMondayAgentEvent } from './events'

describe('interpretMondayAgentEvent', () => {
  it('lê a pergunta do chat', () => {
    expect(
      interpretMondayAgentEvent({
        event: 'agent_triggered',
        triggerType: 'chat',
        payload: { text: 'quantos pontos em São Paulo?' },
        stream: true,
      })
    ).toEqual({
      trigger: 'chat',
      stream: true,
      question: 'quantos pontos em São Paulo?',
    })
  })

  it('prefere o texto da menção e normaliza o alias', () => {
    expect(
      interpretMondayAgentEvent({
        event: 'agent_triggered',
        triggerType: 'mentioned',
        payload: {
          text: 'instrução gerada pela monday',
          updateBody: 'qual a cobertura do roteiro?',
          itemId: 10,
          updateId: 20,
        },
        stream: false,
      })
    ).toEqual({
      trigger: 'mention',
      stream: false,
      question: 'qual a cobertura do roteiro?',
      itemId: '10',
      updateId: '20',
    })
  })

  it('ignora evento que não é do agente', () => {
    expect(interpretMondayAgentEvent({ event: 'outro' })).toBeNull()
  })
})
