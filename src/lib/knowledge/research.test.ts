import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  runCadence: vi.fn(),
  runExternal: vi.fn(),
  gatherGithub: vi.fn(),
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
  planKnowledgeResearch: () => ({
    searchQuery: 'fluxo inventário',
    databaseSourceIds: ['cadence', 'prod'],
    reason: 'Cruzar fontes.',
  }),
}))
vi.mock('@/lib/backlog/github-context', () => ({
  gatherGithubContextForQuery: mocks.gatherGithub,
}))
vi.mock('@/lib/cadence/workspace-gather', () => ({
  gatherWorkspaceContext: () => ({
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
  }),
}))

import { gatherKnowledgeResearch } from './research'

describe('gatherKnowledgeResearch', () => {
  beforeEach(() => {
    mocks.runCadence.mockReset()
    mocks.runExternal.mockReset()
    mocks.gatherGithub.mockReset()
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

    expect(result.evidence.map(item => item.kind)).toEqual([
      'github',
      'meeting',
      'database',
    ])
    expect(result.statuses).toContainEqual(
      expect.objectContaining({ id: 'prod', state: 'error', detail: 'timeout de produção' })
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
})
