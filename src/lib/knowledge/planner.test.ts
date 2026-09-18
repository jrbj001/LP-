import { describe, expect, it } from 'vitest'
import { finalizeKnowledgePlan, parseKnowledgePlan } from './planner'

describe('parseKnowledgePlan', () => {
  it('aceita até duas fontes válidas e remove ids inventados', () => {
    expect(
      parseKnowledgePlan(
        {
          searchQuery: 'inventário promoção código decisão reunião',
          databaseSourceIds: ['cadence', 'prod', 'inventada', 'prod'],
          reason: 'Cruzar workspace e produção.',
        },
        'Como funciona?',
        ['cadence', 'prod']
      )
    ).toEqual({
      searchQuery: 'inventário promoção código decisão reunião',
      databaseSourceIds: ['cadence', 'prod'],
      reason: 'Cruzar workspace e produção.',
    })
  })

  it('usa a pergunta como busca quando o plano é inválido', () => {
    expect(parseKnowledgePlan(null, 'Pergunta original', ['cadence'])).toEqual({
      searchQuery: 'Pergunta original',
      databaseSourceIds: [],
      reason: '',
    })
  })

  it('obriga a fonte de produção Like:Me em perguntas factuais de usuários', () => {
    const result = finalizeKnowledgePlan(
      'likeme',
      'Quantos usuários temos hoje na base do Like:Me?',
      {
        searchQuery: 'usuários Like:Me',
        databaseSourceIds: ['cadence'],
        reason: 'Plano inicial.',
      },
      [
        { id: 'cadence', label: 'Workspace Cadence', description: 'cards e reuniões' },
        {
          id: 'prod',
          label: 'Supabase Like:Me',
          description: 'produção Like:Me, usuários e marketplace',
        },
      ]
    )
    expect(result.databaseSourceIds).toEqual(['prod'])
  })
})
