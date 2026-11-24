import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import {
  capPlan,
  FACTUAL_ASK,
  type KnowledgePlan,
  type KnowledgePlanSource,
  WORKSPACE_ASK,
} from './routing'
import {
  WORKSPACE_SOURCE_GUIDE,
  WORKSPACE_SOURCE_IDS,
  WORKSPACE_SOURCES,
  type WorkspaceSourceId,
} from './source-guide'

export type { KnowledgePlan, KnowledgePlanSource } from './routing'

export function finalizeKnowledgePlan(
  clientId: string,
  question: string,
  plan: KnowledgePlan,
  sources: KnowledgePlanSource[]
): KnowledgePlan {
  if (!FACTUAL_ASK.test(question) || WORKSPACE_ASK.test(question)) return plan

  const external = sources.filter(source => source.id !== 'cadence')
  let required: KnowledgePlanSource | undefined
  if (clientId === 'likeme') {
    required =
      external.find(source => /like:?me|supabase/i.test(`${source.label} ${source.description}`)) ??
      external[0]
  } else if (clientId === 'be180-ooh') {
    if (/invent[aá]rio|pontos?|exibidor|ativos?|media kit/i.test(question)) {
      required = external.find(source => /ativos|postgres/i.test(`${source.label} ${source.description}`))
    } else if (/colmeia|roteiros?|campanhas?|planejador|usu[aá]rios?/i.test(question)) {
      required = external.find(source => /colmeia|sql server/i.test(`${source.label} ${source.description}`))
    }
  }

  if (!required) return plan
  return capPlan({
    ...plan,
    databaseSourceIds: [required.id],
    reason: `${plan.reason}${plan.reason ? ' ' : ''}Fonte de produção obrigatória para pergunta factual.`,
  })
}

export function parseKnowledgePlan(
  value: unknown,
  question: string,
  validDatabaseIds: string[],
  validWorkspaceIds: WorkspaceSourceId[] = WORKSPACE_SOURCE_IDS
): KnowledgePlan {
  const raw = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  const allowedDatabases = new Set(validDatabaseIds)
  const allowedWorkspace = new Set<string>(validWorkspaceIds)
  const databaseSourceIds = [
    ...new Set(asStrings(raw.databaseSourceIds).filter(id => allowedDatabases.has(id))),
  ]
  const workspaceSourceIds = [
    ...new Set(asStrings(raw.workspaceSourceIds).filter(id => allowedWorkspace.has(id))),
  ] as WorkspaceSourceId[]
  const searchQuery =
    typeof raw.searchQuery === 'string' && raw.searchQuery.trim()
      ? raw.searchQuery.trim().slice(0, 500)
      : question
  return capPlan({
    searchQuery,
    databaseSourceIds,
    workspaceSourceIds,
    reason: typeof raw.reason === 'string' ? raw.reason.trim().slice(0, 500) : '',
  })
}

function asStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

/**
 * Orquestrador: escolhe, pela pergunta, quais fontes consultar (bancos e fontes do workspace).
 * Falha ou plano vazio sem motivo cai no plano por regras.
 */
export async function planKnowledgeResearch(input: {
  question: string
  recentContext?: string
  databaseSources: KnowledgePlanSource[]
  workspaceSources: WorkspaceSourceId[]
}): Promise<KnowledgePlan> {
  const dbIds = input.databaseSources.map(source => source.id)
  if (dbIds.length === 0 && input.workspaceSources.length === 0) {
    return { searchQuery: input.question, databaseSourceIds: [], workspaceSourceIds: [], reason: 'Sem fontes disponíveis.' }
  }

  const availableWorkspace = WORKSPACE_SOURCES.filter(source => input.workspaceSources.includes(source.id))
  const planned = await callOpenAiJson(
    `Você é o orquestrador de pesquisa de uma empresa. Escolha quais fontes consultar para responder à pergunta.
Consultar tudo é desperdício: escolha só o que a pergunta pede, de 0 a 4 fontes no total.

Fontes do workspace (use o id entre parênteses):
${availableWorkspace.map(source => `- ${source.id} (${source.label}): ${source.description}`).join('\n') || '- nenhuma disponível'}

Bancos (use o id): escolha quando a pergunta pedir fatos, contagens, listas, datas, status atual ou cruzamento com dados operacionais.
Não escolha nada para saudação, opinião ou explicação puramente conceitual.
Quando pedir decisão, combinado ou "o que falamos", inclua reuniões. Quando pedir como algo funciona no código, inclua GitHub.
Quando a pergunta citar Notion ou Monday, inclua essa fonte. Não escolha uma fonte que não esteja na lista.
Se a pergunta misturar dado de negócio (status, quantidade, registro) com decisão ou contexto, escolha as fontes dos dois lados: banco e reuniões.
Perguntas sobre usuários, registros ou volumes de um produto devem usar o banco de produção desse produto, nunca o Workspace Cadence.

"searchQuery" reescreve a pergunta com termos e sinônimos úteis para procurar, sem mudar a intenção.

Use apenas ids disponíveis. Retorne somente JSON:
{"searchQuery":"consulta enriquecida","databaseSourceIds":["id"],"workspaceSourceIds":["github|meetings|documents|notion|monday"],"reason":"motivo curto"}.`,
    `Pergunta: ${input.question}
Contexto recente: ${input.recentContext || '—'}

Guia do workspace:
${WORKSPACE_SOURCE_GUIDE}

Bancos disponíveis (domínios do dicionário de dados quando existir; escolha pelo domínio e pelo nome das tabelas):
${input.databaseSources.map(source => `- ${source.id}: ${source.label} — ${source.description}`).join('\n') || '- nenhum'}`,
    { temperature: 0, maxTokens: 450, model: chatModel() }
  )

  return parseKnowledgePlan(planned, input.question, dbIds, input.workspaceSources)
}
