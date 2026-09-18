import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'

export interface KnowledgePlanSource {
  id: string
  label: string
  description: string
}

export interface KnowledgePlan {
  searchQuery: string
  databaseSourceIds: string[]
  reason: string
}

const FACTUAL_ASK =
  /\b(quantos?|quantas|total|quantidade|n[uú]mero|lista|liste|ranking|m[eé]dia|status|existem|temos|hoje|atualmente)\b/i
const WORKSPACE_ASK =
  /\b(cards?|backlog|prs?|pull requests?|commits?|reuni[aã]o|atas?|documentos?|workspace|cadence)\b/i

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
  return {
    ...plan,
    databaseSourceIds: [
      required.id,
      ...plan.databaseSourceIds.filter(id => id !== required.id && id !== 'cadence'),
    ].slice(0, 2),
    reason: `${plan.reason}${plan.reason ? ' ' : ''}Fonte de produção obrigatória para pergunta factual.`,
  }
}

export function parseKnowledgePlan(
  value: unknown,
  question: string,
  validDatabaseIds: string[]
): KnowledgePlan {
  const raw = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  const requested = Array.isArray(raw.databaseSourceIds)
    ? raw.databaseSourceIds.map(String)
    : []
  const allowed = new Set(validDatabaseIds)
  const databaseSourceIds = [...new Set(requested.filter(id => allowed.has(id)))].slice(0, 2)
  const searchQuery =
    typeof raw.searchQuery === 'string' && raw.searchQuery.trim()
      ? raw.searchQuery.trim().slice(0, 500)
      : question
  return {
    searchQuery,
    databaseSourceIds,
    reason: typeof raw.reason === 'string' ? raw.reason.trim().slice(0, 500) : '',
  }
}

export async function planKnowledgeResearch(input: {
  question: string
  recentContext?: string
  databaseSources: KnowledgePlanSource[]
}): Promise<KnowledgePlan> {
  if (input.databaseSources.length === 0) {
    return { searchQuery: input.question, databaseSourceIds: [], reason: 'Sem bancos disponíveis.' }
  }

  const sourceIds = input.databaseSources.map(source => source.id)
  const planned = await callOpenAiJson(
    `Você planeja uma pesquisa empresarial multi-fonte. GitHub, reuniões e documentos serão
sempre pesquisados por outro componente. Decida somente quais bancos precisam ser consultados.

Escolha até 2 bancos quando a pergunta pedir fatos, contagens, listas, datas, status, exemplos reais
ou cruzamento com dados operacionais. Não escolha banco para saudação, opinião ou explicação puramente
conceitual. "searchQuery" deve reescrever a pergunta com termos e sinônimos úteis para procurar no
código, reuniões e documentos, sem mudar a intenção.

Perguntas sobre usuários, registros ou volumes do produto Like:Me devem usar a fonte de produção
Like:Me/Supabase, nunca o Workspace Cadence. O Workspace Cadence só representa cards, entregas,
reuniões e documentos — seus totais não são totais de usuários do produto.

Use apenas ids disponíveis. Retorne somente JSON:
{"searchQuery":"consulta enriquecida","databaseSourceIds":["id"],"reason":"motivo curto"}.`,
    `Pergunta: ${input.question}
Contexto recente: ${input.recentContext || '—'}

Bancos disponíveis:
${input.databaseSources.map(source => `- ${source.id}: ${source.label} — ${source.description}`).join('\n')}`,
    { temperature: 0, maxTokens: 450, model: chatModel() }
  )

  return parseKnowledgePlan(planned, input.question, sourceIds)
}
