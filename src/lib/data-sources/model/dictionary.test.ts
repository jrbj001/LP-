import { describe, expect, it } from 'vitest'
import type { DataModelAi } from './types'
import {
  describeTableForPrompt,
  dictionaryDetailKeys,
  dictionaryKeywords,
  dictionaryOverviewForPrompt,
} from './dictionary'

const ai: DataModelAi = {
  overview: 'Banco de campanhas e pontos de mídia.',
  domains: [
    { name: 'Mídia', description: 'Pontos, exibidores e ativos.', tables: ['dbo.ativos'] },
    { name: 'Roteiros', description: 'Planejamento e roteiros de campanha.', tables: ['dbo.roteiros'] },
  ],
  tables: {
    'dbo.ativos': {
      description: 'Pontos de mídia ativos no inventário.',
      purpose: 'inventário',
      keyColumns: ['id_ativo', 'cidade'],
    },
    'dbo.roteiros': {
      description: 'Roteiros de campanha com datas de início.',
      purpose: 'planejamento',
      keyColumns: ['id_roteiro'],
    },
    'dbo.log_tecnico': {
      description: 'Logs técnicos de integração.',
      purpose: 'auditoria',
      keyColumns: [],
    },
  },
  risks: [],
  suggestedQuestions: [],
  generatedAt: '2026-10-04T00:00:00.000Z',
}

describe('dictionaryKeywords', () => {
  it('extrai palavras relevantes sem acento e sem stopwords', () => {
    expect(dictionaryKeywords('Quantos pontos de mídia ativos existem na cidade?')).toEqual(
      expect.arrayContaining(['pontos', 'midia', 'ativos', 'cidade'])
    )
    expect(dictionaryKeywords('quantos de pontos')).not.toContain('quantos')
  })
})

describe('describeTableForPrompt', () => {
  it('retorna vazio quando não há dicionário ou a tabela não está descrita', () => {
    expect(describeTableForPrompt(null, 'dbo.ativos')).toBe('')
    expect(describeTableForPrompt(ai, 'dbo.nao_existe')).toBe('')
  })

  it('inclui descrição e colunas-chave', () => {
    expect(describeTableForPrompt(ai, 'dbo.ativos')).toBe(
      'Pontos de mídia ativos no inventário. · colunas-chave: id_ativo, cidade'
    )
  })
})

describe('dictionaryOverviewForPrompt', () => {
  it('resume overview e domínios', () => {
    const text = dictionaryOverviewForPrompt(ai)
    expect(text).toContain('Banco de campanhas')
    expect(text).toContain('Mídia: Pontos, exibidores e ativos.')
    expect(text).toContain('Roteiros: Planejamento')
    expect(dictionaryOverviewForPrompt(null)).toBe('')
  })
})

describe('dictionaryDetailKeys', () => {
  const entries = [
    { schema: 'dbo', table: 'ativos' },
    { schema: 'dbo', table: 'roteiros' },
    { schema: 'dbo', table: 'log_tecnico' },
    { schema: 'dbo', table: 'sem_dicionario' },
  ]

  it('seleciona só as tabelas cuja descrição casa com a pergunta', () => {
    const keys = dictionaryDetailKeys('Quantos pontos de mídia ativos temos?', entries, ai)
    expect([...keys]).toEqual(['dbo.ativos'])
  })

  it('respeita o limite e ignora tabelas fora do catálogo', () => {
    const keys = dictionaryDetailKeys('roteiros de campanha', entries, ai, 1)
    expect([...keys]).toEqual(['dbo.roteiros'])
    expect(dictionaryDetailKeys('roteiros', entries, null).size).toBe(0)
  })
})
