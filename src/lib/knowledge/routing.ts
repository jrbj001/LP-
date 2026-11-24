import { WORKSPACE_SOURCES, WORKSPACE_SOURCE_IDS, type WorkspaceSourceId } from './source-guide'

export interface KnowledgePlanSource {
  id: string
  label: string
  description: string
}

export interface KnowledgePlan {
  searchQuery: string
  databaseSourceIds: string[]
  workspaceSourceIds: WorkspaceSourceId[]
  reason: string
}

/** Teto de fontes por pergunta: mantém a latência previsível. */
export const MAX_KNOWLEDGE_SOURCES = 4
export const MAX_DATABASE_SOURCES = 2

export const FACTUAL_ASK =
  /\b(quantos?|quantas|total|quantidade|n[uú]mero|lista|liste|ranking|m[eé]dia|status|existem|temos|hoje|atualmente)\b/i
export const WORKSPACE_ASK =
  /\b(cards?|backlog|prs?|pull requests?|commits?|reuni[aã]o|atas?|documentos?|workspace|cadence)\b/i

/** Aplica os tetos: bancos primeiro (dado de produção), depois fontes do workspace. */
export function capPlan(plan: KnowledgePlan): KnowledgePlan {
  const databaseSourceIds = [...new Set(plan.databaseSourceIds)].slice(0, MAX_DATABASE_SOURCES)
  const room = MAX_KNOWLEDGE_SOURCES - databaseSourceIds.length
  const workspaceSourceIds = [...new Set(plan.workspaceSourceIds)].slice(0, Math.max(0, room))
  return { ...plan, databaseSourceIds, workspaceSourceIds }
}

/**
 * Plano por regras, usado quando o planejador por LLM falha.
 * Sem nenhum sinal na pergunta, cai no padrão barato: reuniões e documentos.
 */
export function ruleBasedPlan(input: {
  question: string
  databaseSources: KnowledgePlanSource[]
  availableWorkspace: WorkspaceSourceId[]
}): KnowledgePlan {
  const { question, databaseSources, availableWorkspace } = input
  const workspace = WORKSPACE_SOURCES.filter(
    source => availableWorkspace.includes(source.id) && source.askPattern.test(question)
  ).map(source => source.id)

  const cadence = databaseSources.find(source => source.id === 'cadence')
  const production = databaseSources.find(source => source.id !== 'cadence') ?? databaseSources[0]
  const databaseSourceIds: string[] = []
  if (WORKSPACE_ASK.test(question) && cadence) {
    databaseSourceIds.push(cadence.id)
  } else if (FACTUAL_ASK.test(question) && production) {
    databaseSourceIds.push(production.id)
  }

  const hasSignal = workspace.length > 0 || databaseSourceIds.length > 0
  const fallback = hasSignal
    ? []
    : (['meetings', 'documents'] as WorkspaceSourceId[]).filter(id => availableWorkspace.includes(id))

  return capPlan({
    searchQuery: question,
    databaseSourceIds,
    workspaceSourceIds: [...workspace, ...fallback],
    reason: hasSignal ? 'Plano por regras da pergunta.' : 'Plano padrão: reuniões e documentos.',
  })
}

/**
 * Reforço por regras sobre o plano do LLM: se a pergunta pede claramente uma fonte do workspace
 * (decisões de reunião, código, documento) e o LLM não a escolheu, ela entra.
 */
export function applyWorkspaceRules(
  question: string,
  plan: KnowledgePlan,
  availableWorkspace: WorkspaceSourceId[]
): KnowledgePlan {
  const added = WORKSPACE_SOURCES.filter(
    source =>
      availableWorkspace.includes(source.id) &&
      !plan.workspaceSourceIds.includes(source.id) &&
      source.askPattern.test(question)
  ).map(source => source.id)
  if (added.length === 0) return plan
  return capPlan({
    ...plan,
    workspaceSourceIds: [...plan.workspaceSourceIds, ...added],
    reason: `${plan.reason}${plan.reason ? ' ' : ''}Fonte pedida pela pergunta: ${added.join(', ')}.`,
  })
}

export function isWorkspaceSourceId(value: string): value is WorkspaceSourceId {
  return (WORKSPACE_SOURCE_IDS as string[]).includes(value)
}
