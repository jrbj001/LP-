import { gatherGithubContextForQuery } from '@/lib/backlog/github-context'
import { asStringArray, callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import type { BacklogBoardId } from '@/lib/backlog/types'
import { hasCadenceDatabase } from '@/lib/cadence/db'
import { runNaturalLanguageQuery } from '@/lib/cadence/nl-sql'
import { seedCadenceClient } from '@/lib/cadence/seed'
import { gatherWorkspaceContext } from '@/lib/cadence/workspace-gather'
import { getClient } from '@/lib/client/registry'
import { runExternalNaturalLanguageQuery } from '@/lib/data-sources/nl-sql'
import { seedEnvDataSources } from '@/lib/data-sources/seed'
import { listDataSources } from '@/lib/data-sources/store'
import {
  finalizeKnowledgePlan,
  planKnowledgeResearch,
  type KnowledgePlanSource,
} from './planner'
import type {
  KnowledgeAnswer,
  KnowledgeDatabaseResult,
  KnowledgeEvidence,
  KnowledgeResearch,
  KnowledgeSourceStatus,
} from './types'

function clip(value: string, max = 1800): string {
  const text = value.replace(/\s+/g, ' ').trim()
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`
}

function databaseDescription(name: string, kind: string, tables: string[]): string {
  const catalog = tables.slice(0, 40).join(', ')
  return `${name} (${kind}); tabelas: ${catalog || 'catálogo indisponível'}`
}

function databaseEvidence(result: KnowledgeDatabaseResult, index: number): KnowledgeEvidence {
  return {
    id: `database-${index + 1}`,
    kind: 'database',
    source: result.sourceName,
    title: result.question,
    excerpt: clip(
      `${result.answer}\nResultado: ${JSON.stringify(result.rows.slice(0, 12))}`,
      2400
    ),
  }
}

function statusFor(
  id: string,
  label: string,
  count: number,
  emptyDetail: string
): KnowledgeSourceStatus {
  return count > 0
    ? { id, label, state: 'used', detail: `${count} evidência${count === 1 ? '' : 's'}` }
    : { id, label, state: 'empty', detail: emptyDetail }
}

async function availableDatabaseSources(clientId: string): Promise<{
  planner: KnowledgePlanSource[]
  externalNames: Map<string, string>
}> {
  try {
    await seedEnvDataSources(clientId)
  } catch (error) {
    console.warn('[knowledge/research] seed data sources', error)
  }
  const external = await listDataSources(clientId)
  const enabled = external.filter(source => source.enabled)
  const planner: KnowledgePlanSource[] = []
  if (hasCadenceDatabase()) {
    planner.push({
      id: 'cadence',
      label: 'Workspace Cadence',
      description: 'cards, PRs, commits, reuniões e metadados de documentos do workspace',
    })
  }
  for (const source of enabled) {
    planner.push({
      id: source.id,
      label: source.name,
      description: databaseDescription(
        source.name,
        source.kind,
        source.catalog.entries.map(entry => `${entry.schema}.${entry.table}`)
      ),
    })
  }
  return {
    planner,
    externalNames: new Map(enabled.map(source => [source.id, source.name])),
  }
}

async function runDatabase(
  clientId: string,
  sourceId: string,
  sourceName: string,
  question: string
): Promise<KnowledgeDatabaseResult> {
  if (sourceId === 'cadence') {
    await seedCadenceClient(clientId)
    const result = await runNaturalLanguageQuery(clientId, question)
    return { sourceId, sourceName, question, ...result }
  }
  const result = await runExternalNaturalLanguageQuery({ clientId, sourceId, question })
  return { sourceId, question, ...result, sourceName: result.sourceName || sourceName }
}

export async function gatherKnowledgeResearch(input: {
  clientId: string
  question: string
  boardId?: BacklogBoardId
  recentContext?: string
  sourceId?: string
}): Promise<KnowledgeResearch> {
  const client = getClient(input.clientId)
  if (!client) throw new Error('Cliente não encontrado.')

  const dbSources = await availableDatabaseSources(client.slug)
  const selectedSources = input.sourceId
    ? dbSources.planner.filter(source => source.id === input.sourceId)
    : dbSources.planner
  if (input.sourceId && selectedSources.length === 0) {
    throw new Error('Fonte de dados indisponível ou desativada.')
  }

  let plan
  try {
    plan = input.sourceId
      ? {
          searchQuery: input.question,
          databaseSourceIds: [input.sourceId],
          reason: 'Fonte selecionada pelo usuário.',
        }
      : await planKnowledgeResearch({
          question: input.question,
          recentContext: input.recentContext,
          databaseSources: selectedSources,
        })
  } catch (error) {
    console.warn('[knowledge/research] planner', error)
    plan = { searchQuery: input.question, databaseSourceIds: [], reason: 'Planejamento indisponível.' }
  }
  plan = finalizeKnowledgePlan(client.slug, input.question, plan, selectedSources)

  const searchAllKnowledge = !input.sourceId
  const githubPromise = searchAllKnowledge
    ? gatherGithubContextForQuery(
        {
          clientId: client.slug,
          boardId: input.boardId,
          query: plan.searchQuery,
        },
        client.delivery?.repos ?? [],
        { allRepos: true }
      )
    : Promise.resolve({ repos: [], snippets: [], activity: [], notes: [] })
  const workspacePromise = searchAllKnowledge
    ? gatherWorkspaceContext(client.slug, plan.searchQuery)
    : Promise.resolve({
        meetings: [],
        documents: [],
        catalog: { meetings: [] as string[], documents: [] as string[] },
      })

  const databaseTasks = plan.databaseSourceIds.map(async sourceId => {
    const source = selectedSources.find(item => item.id === sourceId)
    if (!source) return null
    try {
      return {
        ok: true as const,
        result: await runDatabase(client.slug, source.id, source.label, input.question),
      }
    } catch (error) {
      return {
        ok: false as const,
        source,
        error: error instanceof Error ? error.message : 'Falha ao consultar a fonte.',
      }
    }
  })

  const [github, workspace, ...databaseOutcomes] = await Promise.all([
    githubPromise,
    workspacePromise,
    ...databaseTasks,
  ])
  const databases = databaseOutcomes.flatMap(outcome =>
    outcome?.ok ? [outcome.result] : []
  )
  const evidence: KnowledgeEvidence[] = [
    ...github.snippets.map((item, index) => ({
      id: `github-${index + 1}`,
      kind: 'github' as const,
      source: item.repo,
      title: item.path,
      excerpt: clip(item.excerpt),
      href: item.url,
    })),
    ...workspace.meetings.map((item, index) => ({
      id: `meeting-${index + 1}`,
      kind: 'meeting' as const,
      source: 'Cadence',
      title: item.title,
      excerpt: clip(`${item.summary}\n${item.excerpt}`),
    })),
    ...workspace.documents.map((item, index) => ({
      id: `document-${index + 1}`,
      kind: 'document' as const,
      source: 'Cadence',
      title: item.title,
      excerpt: clip(item.excerpt || item.description),
    })),
    ...databases.map(databaseEvidence),
  ]

  const statuses: KnowledgeSourceStatus[] = []
  if (searchAllKnowledge) {
    statuses.push(
      github.repos.length === 0
        ? { id: 'github', label: 'GitHub', state: 'unavailable', detail: github.notes.join(' ') || 'Nenhum repositório configurado.' }
        : statusFor('github', 'GitHub', github.snippets.length, github.notes.join(' ') || 'Nenhum trecho relevante encontrado.'),
      statusFor('meetings', 'Reuniões', workspace.meetings.length, 'Nenhuma reunião relevante encontrada.'),
      statusFor('documents', 'Documentos', workspace.documents.length, 'Nenhum documento relevante encontrado.')
    )
  }
  for (const sourceId of plan.databaseSourceIds) {
    const source = selectedSources.find(item => item.id === sourceId)
    const outcome = databaseOutcomes.find(item =>
      item?.ok ? item.result.sourceId === sourceId : item?.source.id === sourceId
    )
    if (!source) continue
    statuses.push(
      outcome?.ok
        ? { id: sourceId, label: source.label, state: 'used', detail: `${outcome.result.rows.length} linha(s)` }
        : {
            id: sourceId,
            label: source.label,
            state: 'error',
            detail: outcome && !outcome.ok ? outcome.error : 'Consulta não executada.',
          }
    )
  }

  return { question: input.question, searchQuery: plan.searchQuery, evidence, databases, statuses }
}

export function formatKnowledgeResearchForPrompt(research: KnowledgeResearch): string {
  if (research.evidence.length === 0) {
    const failures = research.statuses
      .filter(status => status.state === 'error' || status.state === 'unavailable')
      .map(status => `${status.label}: ${status.detail}`)
      .join('; ')
    return `Nenhuma evidência encontrada.${failures ? ` Fontes indisponíveis: ${failures}` : ''}`
  }
  return research.evidence
    .map(
      (item, index) =>
        `[${index + 1}] ${item.kind.toUpperCase()} · ${item.source} · ${item.title}${
          item.href ? ` · ${item.href}` : ''
        }\n${item.excerpt}`
    )
    .join('\n\n')
}

export async function answerKnowledgeQuestion(input: {
  clientId: string
  question: string
  sourceId?: string
}): Promise<KnowledgeAnswer> {
  const research = await gatherKnowledgeResearch(input)
  const parsed = (await callOpenAiJson(
    `Você é o agente unificado do Cadence. Responda em português do Brasil, de forma natural,
direta e verificável, usando somente as evidências fornecidas. Cruze código, banco, reuniões e
documentos quando houver relação. Depois de cada afirmação factual, cite uma ou mais evidências
como [1] ou [2][4]. Não cite uma fonte que não sustente a afirmação. Se faltar evidência ou uma
fonte tiver falhado, diga isso claramente. Nunca invente dados, arquivos, decisões ou números.

Retorne somente JSON:
{"answer":"resposta com citações","suggestions":["pergunta útil?","pergunta útil?","pergunta útil?"]}.`,
    `Pergunta: ${input.question}

Status das fontes:
${research.statuses.map(status => `- ${status.label}: ${status.state}${status.detail ? ` — ${status.detail}` : ''}`).join('\n')}

Evidências:
${formatKnowledgeResearchForPrompt(research)}`,
    { temperature: 0.15, maxTokens: 1400, model: chatModel() }
  )) as Record<string, unknown>
  const answer = typeof parsed.answer === 'string' ? parsed.answer.trim() : ''
  if (!answer) throw new Error('A IA não conseguiu formular uma resposta.')
  const suggestions = asStringArray(parsed.suggestions).slice(0, 3)
  return { ...research, answer, suggestions }
}
