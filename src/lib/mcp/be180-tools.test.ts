import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const seedEnvDataSources = vi.fn(async (_clientId?: unknown) => undefined)
const listDataSources = vi.fn(async (_clientId?: unknown) => [] as unknown[])
const answerKnowledgeQuestion = vi.fn(async (_input?: unknown) => ({}))

vi.mock('@/lib/data-sources/seed', () => ({
  seedEnvDataSources: (clientId: unknown) => seedEnvDataSources(clientId),
}))
vi.mock('@/lib/data-sources/store', () => ({
  listDataSources: (clientId: unknown) => listDataSources(clientId),
}))
vi.mock('@/lib/knowledge/research', () => ({
  answerKnowledgeQuestion: (input: unknown) => answerKnowledgeQuestion(input),
}))

import { BANCO_DE_ATIVOS_SOURCE, BE180_CLIENT_ID, COLMEIA_SOURCE } from './be180-sources'
import { consultBe180Source, formatBe180SourceList, listBe180Sources } from './be180-tools'

describe('ferramentas Be180', () => {
  beforeEach(() => {
    seedEnvDataSources.mockClear()
    listDataSources.mockReset()
    answerKnowledgeQuestion.mockReset()
  })

  it('lista só Banco de Ativos e Colmeia', async () => {
    listDataSources.mockResolvedValue([
      { id: 'ativos', name: BANCO_DE_ATIVOS_SOURCE, kind: 'postgresql', enabled: true },
      { id: 'colmeia', name: COLMEIA_SOURCE, kind: 'sqlserver', enabled: false },
      { id: 'outra', name: 'Like:Me · Supabase', kind: 'postgresql', enabled: true },
    ])

    const sources = await listBe180Sources()
    expect(seedEnvDataSources).toHaveBeenCalledWith(BE180_CLIENT_ID)
    expect(sources.map(source => source.id)).toEqual(['ativos', 'colmeia'])
    expect(formatBe180SourceList(sources)).toContain(BANCO_DE_ATIVOS_SOURCE)
    expect(formatBe180SourceList(sources)).not.toContain(COLMEIA_SOURCE)
  })

  it('consulta a fonte pedida e não a outra', async () => {
    listDataSources.mockResolvedValue([
      { id: 'ativos', name: BANCO_DE_ATIVOS_SOURCE, kind: 'postgresql', enabled: true },
      { id: 'colmeia', name: COLMEIA_SOURCE, kind: 'sqlserver', enabled: true },
    ])
    answerKnowledgeQuestion.mockResolvedValue({
      answer: 'Há 12 pontos.',
      databases: [{ sql: 'SELECT 12', rows: [{ total: 12 }] }],
    })

    const text = await consultBe180Source(COLMEIA_SOURCE, 'quantos roteiros?')
    expect(answerKnowledgeQuestion).toHaveBeenCalledWith({
      clientId: BE180_CLIENT_ID,
      question: 'quantos roteiros?',
      sourceId: 'colmeia',
    })
    expect(text).toContain('Há 12 pontos.')
    expect(text).toContain('SELECT 12')
  })

  it('explica quando a fonte não está habilitada', async () => {
    listDataSources.mockResolvedValue([
      { id: 'ativos', name: BANCO_DE_ATIVOS_SOURCE, kind: 'postgresql', enabled: false },
    ])
    const text = await consultBe180Source(BANCO_DE_ATIVOS_SOURCE, 'quantos pontos?')
    expect(answerKnowledgeQuestion).not.toHaveBeenCalled()
    expect(text).toContain('não está disponível')
  })
})
