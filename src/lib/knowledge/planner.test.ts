import { describe, expect, it } from 'vitest'
import { finalizeKnowledgePlan, parseKnowledgePlan } from './planner'

describe('parseKnowledgePlan', () => {
  it('aceita até duas fontes de banco válidas e remove ids inventados', () => {
    expect(
      parseKnowledgePlan(
        {
          searchQuery: 'inventário promoção código decisão reunião',
          databaseSourceIds: ['cadence', 'prod', 'inventada', 'prod'],
          workspaceSourceIds: [],
          reason: 'Cruzar workspace e produção.',
        },
        'Como funciona?',
        ['cadence', 'prod']
      )
    ).toEqual({
      searchQuery: 'inventário promoção código decisão reunião',
      databaseSourceIds: ['cadence', 'prod'],
      workspaceSourceIds: [],
      reason: 'Cruzar workspace e produção.',
    })
  })

  it('aceita fontes do workspace e ignora ids que não existem', () => {
    const result = parseKnowledgePlan(
      {
        searchQuery: 'decisão do inventário',
        databaseSourceIds: ['prod'],
        workspaceSourceIds: ['meetings', 'notion', 'github', 'meetings'],
        reason: 'Decisão e dados.',
      },
      'o que decidimos e quantos itens?',
      ['prod'],
      ['github', 'meetings']
    )
    expect(result.workspaceSourceIds).toEqual(['meetings', 'github'])
  })

  it('limita o plano a 4 fontes no total', () => {
    const result = parseKnowledgePlan(
      {
        databaseSourceIds: ['a', 'b'],
        workspaceSourceIds: ['github', 'meetings', 'documents'],
      },
      'pergunta',
      ['a', 'b'],
      ['github', 'meetings', 'documents']
    )
    expect(result.databaseSourceIds).toEqual(['a', 'b'])
    expect(result.workspaceSourceIds).toEqual(['github', 'meetings'])
  })

  it('usa a pergunta como busca quando o plano é inválido', () => {
    expect(parseKnowledgePlan(null, 'Pergunta original', ['cadence'])).toEqual({
      searchQuery: 'Pergunta original',
      databaseSourceIds: [],
      workspaceSourceIds: [],
      reason: '',
    })
  })
})

describe('finalizeKnowledgePlan', () => {
  it('obriga a fonte de produção Like:Me em perguntas factuais de usuários', () => {
    const result = finalizeKnowledgePlan(
      'likeme',
      'Quantos usuários temos hoje na base do Like:Me?',
      {
        searchQuery: 'usuários Like:Me',
        databaseSourceIds: ['cadence'],
        workspaceSourceIds: [],
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

  it('não mantém um segundo banco quando a fonte de produção já está definida', () => {
    const result = finalizeKnowledgePlan(
      'be180-ooh',
      'quantos pontos de mídia ativos temos hoje?',
      {
        searchQuery: 'pontos ativos',
        databaseSourceIds: ['be180-colmeia', 'be180-ativos'],
        workspaceSourceIds: [],
        reason: 'dois bancos',
      },
      [
        { id: 'be180-ativos', label: 'Ativos PostgreSQL', description: 'inventário de pontos' },
        { id: 'be180-colmeia', label: 'Colmeia SQL Server', description: 'roteiros' },
      ]
    )
    expect(result.databaseSourceIds).toEqual(['be180-ativos'])
  })
})
