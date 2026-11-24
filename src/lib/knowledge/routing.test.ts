import { describe, expect, it } from 'vitest'
import { applyWorkspaceRules, capPlan, ruleBasedPlan } from './routing'
import { WORKSPACE_SOURCE_GUIDE } from './source-guide'

const databases = [
  { id: 'cadence', label: 'Workspace Cadence', description: 'cards e reuniões' },
  { id: 'prod', label: 'Supabase Like:Me', description: 'produção' },
]
const all = ['github', 'meetings', 'documents'] as const

describe('ruleBasedPlan', () => {
  it('sem sinal na pergunta, usa o padrão barato de reuniões e documentos', () => {
    const plan = ruleBasedPlan({
      question: 'bom dia, tudo bem?',
      databaseSources: databases,
      availableWorkspace: [...all],
    })
    expect(plan.workspaceSourceIds).toEqual(['meetings', 'documents'])
    expect(plan.databaseSourceIds).toEqual([])
  })

  it('pergunta factual usa a fonte de produção, não o Cadence', () => {
    const plan = ruleBasedPlan({
      question: 'quantos usuários temos hoje?',
      databaseSources: databases,
      availableWorkspace: [...all],
    })
    expect(plan.databaseSourceIds).toEqual(['prod'])
    expect(plan.workspaceSourceIds).toEqual([])
  })

  it('pergunta sobre código pede GitHub, mas só se houver repositório', () => {
    const withRepo = ruleBasedPlan({
      question: 'como o código implementa a promoção?',
      databaseSources: databases,
      availableWorkspace: [...all],
    })
    expect(withRepo.workspaceSourceIds).toEqual(['github'])

    const withoutRepo = ruleBasedPlan({
      question: 'como o código implementa a promoção?',
      databaseSources: databases,
      availableWorkspace: ['meetings', 'documents'],
    })
    expect(withoutRepo.workspaceSourceIds).toEqual(['meetings', 'documents'])
  })
})

describe('applyWorkspaceRules', () => {
  it('adiciona reuniões quando a pergunta pede decisão e o LLM não escolheu', () => {
    const plan = applyWorkspaceRules(
      'o que foi decidido sobre a promoção?',
      { searchQuery: 'promoção', databaseSourceIds: [], workspaceSourceIds: [], reason: '' },
      [...all]
    )
    expect(plan.workspaceSourceIds).toEqual(['meetings'])
  })

  it('não duplica fonte já escolhida e respeita fontes indisponíveis', () => {
    const plan = applyWorkspaceRules(
      'o que foi decidido e qual o código?',
      { searchQuery: 'x', databaseSourceIds: [], workspaceSourceIds: ['meetings'], reason: '' },
      ['meetings', 'documents']
    )
    expect(plan.workspaceSourceIds).toEqual(['meetings'])
  })

  it('pergunta simples não ganha fonte do workspace', () => {
    const plan = applyWorkspaceRules(
      'oi, tudo bem?',
      { searchQuery: 'oi', databaseSourceIds: [], workspaceSourceIds: [], reason: '' },
      [...all]
    )
    expect(plan.workspaceSourceIds).toEqual([])
  })
})

describe('capPlan', () => {
  it('mantém bancos primeiro e completa com fontes do workspace até 4', () => {
    const plan = capPlan({
      searchQuery: 'x',
      databaseSourceIds: ['a', 'b', 'c'],
      workspaceSourceIds: ['github', 'meetings', 'documents'],
      reason: '',
    })
    expect(plan.databaseSourceIds).toEqual(['a', 'b'])
    expect(plan.workspaceSourceIds).toEqual(['github', 'meetings'])
  })
})

describe('WORKSPACE_SOURCE_GUIDE', () => {
  it('descreve reuniões, documentos e GitHub, e separa a base Cadence', () => {
    expect(WORKSPACE_SOURCE_GUIDE).toContain('Reuniões:')
    expect(WORKSPACE_SOURCE_GUIDE).toContain('Documentos:')
    expect(WORKSPACE_SOURCE_GUIDE).toContain('GitHub:')
    expect(WORKSPACE_SOURCE_GUIDE).toContain('Workspace Cadence')
  })
})
