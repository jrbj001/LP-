import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  runCadence: vi.fn(),
  runExternal: vi.fn(),
  gatherGithub: vi.fn(),
  planKnowledgeResearch: vi.fn(),
  gatherWorkspace: vi.fn(),
}))

vi.mock('@/lib/client/registry', () => ({
  getClient: () => ({
    slug: 'cliente',
    delivery: { repos: [{ owner: 'acme', repo: 'app', label: 'App' }] },
  }),
}))
vi.mock('@/lib/cadence/db', () => ({ hasCadenceDatabase: () => true }))
vi.mock('@/lib/cadence/seed', () => ({ seedCadenceClient: vi.fn() }))
vi.mock('@/lib/cadence/nl-sql', () => ({ runNaturalLanguageQuery: mocks.runCadence }))
vi.mock('@/lib/data-sources/nl-sql', () => ({ runExternalNaturalLanguageQuery: mocks.runExternal }))
vi.mock('@/lib/data-sources/seed', () => ({ seedEnvDataSources: vi.fn() }))
vi.mock('@/lib/data-sources/model/store', () => ({ getDataModel: vi.fn(async () => null) }))
vi.mock('@/lib/data-sources/store', () => ({
  listDataSources: () => [
    {
      id: 'prod',
      name: 'Produção',
      kind: 'postgresql',
      enabled: true,
      catalog: { entries: [{ schema: 'public', table: 'items' }] },
    },
  ],
}))
vi.mock('./planner', () => ({
  finalizeKnowledgePlan: (_clientId: string, _question: string, plan: unknown) => plan,
  planKnowledgeResearch: (input: unknown) => mocks.planKnowledgeResearch(input),
}))
vi.mock('@/lib/backlog/github-context', () => ({
  gatherGithubContextForQuery: mocks.gatherGithub,
}))
vi.mock('@/lib/cadence/workspace-gather', () => ({
  gatherWorkspaceContext: (...args: unknown[]) => mocks.gatherWorkspace(...args),
}))

import { gatherKnowledgeResearch } from './research'

const meetingBundle = {
  meetings: [
    {
      id: 'm1',
      title: 'Decisão de inventário',
      date: '2026-09-01',
      summary: 'Aprovada a promoção.',
      excerpt: 'O time aprovou a promoção do inventário.',
    },
  ],
  documents: [],
  catalog: { meetings: ['Decisão de inventário'], documents: [] },
}

const emptyBundle = {
  meetings: [],
  documents: [],
  catalog: { meetings: [] as string[], documents: [] as string[] },
}

describe('gatherKnowledgeResearch', () => {
  beforeEach(() => {
    mocks.runCadence.mockReset()
    mocks.runExternal.mockReset()
    mocks.gatherGithub.mockReset()
    mocks.planKnowledgeResearch.mockReset()
    mocks.gatherWorkspace.mockReset()
    mocks.gatherWorkspace.mockImplementation(async (_clientId: string, _query: string, options?: { meetings?: boolean; documents?: boolean }) =>
      options?.meetings === false && options?.documents === false ? emptyBundle : meetingBundle
    )
    mocks.planKnowledgeResearch.mockResolvedValue({
      searchQuery: 'fluxo inventário',
      databaseSourceIds: ['cadence', 'prod'],
      workspaceSourceIds: ['github', 'meetings'],
      reason: 'Cruzar fontes.',
    })
    mocks.gatherGithub.mockResolvedValue({
      repos: ['acme/app'],
      snippets: [
        {
          repo: 'acme/app',
          path: 'src/inventory.ts',
          url: 'https://github.com/acme/app/blob/HEAD/src/inventory.ts',
          excerpt: 'export function promoteInventory() {}',
        },
      ],
      activity: [],
      notes: [],
    })
  })

  it('combina evidências e preserva falha parcial de banco', async () => {
    mocks.runCadence.mockResolvedValue({
      sql: 'select 1',
      explanation: 'Contagem.',
      answer: 'Há 1 item.',
      suggestions: [],
      columns: ['total'],
      rows: [{ total: 1 }],
      chart: null,
    })
    mocks.runExternal.mockRejectedValue(new Error('timeout de produção'))

    const result = await gatherKnowledgeResearch({
      clientId: 'cliente',
      question: 'Como funciona o inventário e quantos itens existem?',
    })

    expect(result.evidence.map(item => item.kind)).toEqual(['github', 'meeting', 'database'])
    expect(result.statuses).toContainEqual(
      expect.objectContaining({ id: 'prod', state: 'error', detail: 'timeout' })
    )
    expect(result.statuses).toContainEqual(
      expect.objectContaining({ id: 'cadence', state: 'used' })
    )
    expect(mocks.gatherGithub).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      { allRepos: true }
    )
  })

  it('não consulta GitHub nem reuniões quando o orquestrador escolhe só banco', async () => {
    mocks.planKnowledgeResearch.mockResolvedValue({
      searchQuery: 'quantos itens',
      databaseSourceIds: ['prod'],
      workspaceSourceIds: [],
      reason: 'Contagem.',
    })
    mocks.runExternal.mockResolvedValue({
      sql: 'select count(*)',
      explanation: 'Contagem.',
      answer: 'Há 3 itens.',
      suggestions: [],
      columns: ['total'],
      rows: [{ total: 3 }],
      chart: null,
    })

    const result = await gatherKnowledgeResearch({ clientId: 'cliente', question: 'quantos itens temos hoje?' })

    expect(mocks.gatherGithub).not.toHaveBeenCalled()
    expect(mocks.gatherWorkspace).not.toHaveBeenCalled()
    expect(result.evidence.map(item => item.kind)).toEqual(['database'])
    expect(result.skippedSources).toEqual(['GitHub', 'Reuniões', 'Documentos'])
  })

  it('busca só as reuniões quando só elas foram escolhidas', async () => {
    mocks.planKnowledgeResearch.mockResolvedValue({
      searchQuery: 'decisão inventário',
      databaseSourceIds: [],
      workspaceSourceIds: ['meetings'],
      reason: 'Decisão.',
    })

    const result = await gatherKnowledgeResearch({ clientId: 'cliente', question: 'o que decidimos sobre o inventário?' })

    expect(mocks.gatherGithub).not.toHaveBeenCalled()
    expect(mocks.gatherWorkspace).toHaveBeenCalledWith('cliente', 'decisão inventário', {
      meetings: true,
      documents: false,
    })
    expect(result.evidence.map(item => item.kind)).toEqual(['meeting'])
    expect(result.skippedSources).toEqual(['GitHub', 'Documentos'])
  })

  it('usa o plano por regras quando o orquestrador falha', async () => {
    mocks.planKnowledgeResearch.mockRejectedValue(new Error('LLM fora do ar'))

    const result = await gatherKnowledgeResearch({ clientId: 'cliente', question: 'quais decisões foram tomadas?' })

    expect(mocks.gatherWorkspace).toHaveBeenCalledWith(
      'cliente',
      'quais decisões foram tomadas?',
      { meetings: true, documents: false }
    )
    expect(mocks.gatherGithub).not.toHaveBeenCalled()
    expect(result.evidence.map(item => item.kind)).toEqual(['meeting'])
  })

  it('a regra de reuniões reforça um plano do LLM que esqueceu a fonte', async () => {
    mocks.planKnowledgeResearch.mockResolvedValue({
      searchQuery: 'promoção',
      databaseSourceIds: [],
      workspaceSourceIds: [],
      reason: '',
    })

    await gatherKnowledgeResearch({ clientId: 'cliente', question: 'o que foi decidido sobre a promoção?' })

    expect(mocks.gatherWorkspace).toHaveBeenCalledWith('cliente', 'promoção', {
      meetings: true,
      documents: false,
    })
  })

  it('com fonte escolhida pelo usuário, não consulta o workspace', async () => {
    mocks.runExternal.mockResolvedValue({
      sql: 'select 1',
      explanation: '',
      answer: 'ok',
      suggestions: [],
      columns: [],
      rows: [],
      chart: null,
    })

    const result = await gatherKnowledgeResearch({ clientId: 'cliente', question: 'contagem', sourceId: 'prod' })

    expect(mocks.planKnowledgeResearch).not.toHaveBeenCalled()
    expect(mocks.gatherGithub).not.toHaveBeenCalled()
    expect(mocks.gatherWorkspace).not.toHaveBeenCalled()
    expect(result.skippedSources).toEqual([])
  })
})
