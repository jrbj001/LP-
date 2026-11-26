import { gatherGithubContextForQuery } from '@/lib/backlog/github-context'
import { asStringArray, callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import type { BacklogBoardId } from '@/lib/backlog/types'
import { hasCadenceDatabase } from '@/lib/cadence/db'
import { runNaturalLanguageQuery } from '@/lib/cadence/nl-sql'
import { seedCadenceClient } from '@/lib/cadence/seed'
import { gatherWorkspaceContext } from '@/lib/cadence/workspace-gather'
import { getClient } from '@/lib/client/registry'
import type { ClientWorkspace } from '@/lib/client/types'
import { runExternalNaturalLanguageQuery } from '@/lib/data-sources/nl-sql'
import { dictionaryOverviewForPrompt } from '@/lib/data-sources/model/dictionary'
import { getDataModel } from '@/lib/data-sources/model/store'
import type { DataModelAi } from '@/lib/data-sources/model/types'
import { seedEnvDataSources } from '@/lib/data-sources/seed'
import { listDataSources } from '@/lib/data-sources/store'
import { readBe180MondayConfig, searchMondayBoardItems, type MondayBoardHit } from '@/lib/monday/publish'
import { BE180_MONDAY_CLIENT_ID } from '@/lib/monday/story'
import { hasNotionAccess, searchNotionPages, type NotionPageHit } from '@/lib/notion/search'
import { isKnowledgePipelineEnabled } from './flag'
import { inferQuestionIntent, resolveQuestionIntent } from './intent'
import { sanitizeSourceError } from './safe-status'
import { logKnowledgeTrace } from './trace'
import { finalizeKnowledgePlan, planKnowledgeResearch } from './planner'
import { isPortfolioWorkspace, knowledgeClients, knowledgeRepos } from './portfolio'
import { applyWorkspaceRules, type KnowledgePlan, type KnowledgePlanSource, ruleBasedPlan } from './routing'
import { WORKSPACE_SOURCE_IDS, type WorkspaceSourceId, workspaceSourceLabel } from './source-guide'
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

function databaseDescription(
  name: string,
  kind: string,
  tables: string[],
  ai: DataModelAi | null
): string {
  const catalog = tables.slice(0, 40).join(', ')
  const domains = dictionaryOverviewForPrompt(ai)
  return `${name} (${kind})${domains ? `; domínios: ${domains}` : ''}; tabelas: ${catalog || 'catálogo indisponível'}`
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

/** O seed testa a conexão de cada banco; repetir isso a cada pergunta atrasa a resposta. */
const SEED_TTL_MS = 10 * 60 * 1000
const seededAt = new Map<string, number>()

async function seedOnce(clientId: string): Promise<void> {
  const last = seededAt.get(clientId)
  if (last && Date.now() - last < SEED_TTL_MS) return
  try {
    await seedEnvDataSources(clientId)
    seededAt.set(clientId, Date.now())
  } catch (error) {
    console.warn('[knowledge/research] seed data sources', clientId, error)
  }
}

/** Fonte de banco consultável: o dono é o workspace que cadastrou o banco. */
interface DatabaseSourceRef {
  clientId: string
  sourceId: string
}

/** No portfólio, o id do planejador leva o workspace dono para não colidir entre clientes. */
function plannerSourceId(hostSlug: string, clientId: string, sourceId: string): string {
  return clientId === hostSlug ? sourceId : `${clientId}::${sourceId}`
}

async function availableDatabaseSources(
  hostSlug: string,
  clients: ClientWorkspace[]
): Promise<{
  planner: KnowledgePlanSource[]
  refs: Map<string, DatabaseSourceRef>
}> {
  const labelled = clients.length > 1 || clients[0]?.slug !== hostSlug
  const planner: KnowledgePlanSource[] = []
  const refs = new Map<string, DatabaseSourceRef>()
  if (hasCadenceDatabase()) {
    planner.push({
      id: 'cadence',
      label: 'Workspace Cadence',
      description: 'cards, PRs, commits, reuniões e metadados de documentos do workspace',
    })
    refs.set('cadence', { clientId: hostSlug, sourceId: 'cadence' })
  }

  const perClient = await Promise.all(
    clients.map(async client => {
      await seedOnce(client.slug)
      const enabled = (await listDataSources(client.slug)).filter(source => source.enabled)
      const models = await Promise.all(
        enabled.map(source => getDataModel(client.slug, source.id).catch(() => null))
      )
      return { client, enabled, models }
    })
  )

  for (const { client, enabled, models } of perClient) {
    enabled.forEach((source, index) => {
      const id = plannerSourceId(hostSlug, client.slug, source.id)
      const label =
        labelled && !source.name.toLowerCase().includes(client.name.toLowerCase())
          ? `${client.name} · ${source.name}`
          : source.name
      planner.push({
        id,
        label,
        description: databaseDescription(
          label,
          source.kind,
          source.catalog.entries.map(entry => `${entry.schema}.${entry.table}`),
          models[index]?.ai ?? null
        ),
      })
      refs.set(id, { clientId: client.slug, sourceId: source.id })
    })
  }
  return { planner, refs }
}

async function runDatabase(
  ref: DatabaseSourceRef,
  plannerId: string,
  sourceName: string,
  question: string
): Promise<KnowledgeDatabaseResult> {
  if (ref.sourceId === 'cadence') {
    await seedCadenceClient(ref.clientId)
    const result = await runNaturalLanguageQuery(ref.clientId, question)
    return { sourceId: plannerId, sourceName, question, ...result }
  }
  const result = await runExternalNaturalLanguageQuery({
    clientId: ref.clientId,
    sourceId: ref.sourceId,
    question,
  })
  return { sourceId: plannerId, question, ...result, sourceName: sourceName || result.sourceName }
}

export async function gatherKnowledgeResearch(input: {
  clientId: string
  question: string
  boardId?: BacklogBoardId
  recentContext?: string
  sourceId?: string
}): Promise<KnowledgeResearch> {
  const started = Date.now()
  const client = getClient(input.clientId)
  if (!client) throw new Error('Cliente não encontrado.')

  const enhanced = isKnowledgePipelineEnabled(client.slug)
  const intent = inferQuestionIntent({ clientId: client.slug, question: input.question })
  const question = enhanced ? intent.rewrittenQuestion : input.question
  logKnowledgeTrace({
    stage: 'intent',
    clientId: client.slug,
    intent: intent.intent,
    ok: true,
    ms: Date.now() - started,
  })

  // Fonte escolhida na tela Consultar é sempre do próprio workspace.
  const scope = input.sourceId ? [client] : knowledgeClients(client, input.question)
  const portfolio = isPortfolioWorkspace(client)
  const repos = knowledgeRepos(scope)
  const dbSources = await availableDatabaseSources(client.slug, scope)
  const selectedSources = input.sourceId
    ? dbSources.planner.filter(source => source.id === input.sourceId)
    : dbSources.planner
  if (input.sourceId && selectedSources.length === 0) {
    throw new Error('Fonte de dados indisponível ou desativada.')
  }

  const searchAllKnowledge = !input.sourceId
  const hasGithub = repos.length > 0
  const mondayReady =
    scope.some(item => item.slug === BE180_MONDAY_CLIENT_ID) && readBe180MondayConfig().ok
  const availableWorkspace: WorkspaceSourceId[] = searchAllKnowledge
    ? WORKSPACE_SOURCE_IDS.filter(id => {
        if (id === 'github') return hasGithub
        if (id === 'notion') return hasNotionAccess()
        if (id === 'monday') return mondayReady
        return true
      })
    : []

  let plan: KnowledgePlan
  if (input.sourceId) {
    plan = {
      searchQuery: question,
      databaseSourceIds: [input.sourceId],
      workspaceSourceIds: [],
      reason: 'Fonte selecionada pelo usuário.',
    }
  } else {
    try {
      plan = await planKnowledgeResearch({
        question,
        recentContext: input.recentContext,
        databaseSources: selectedSources,
        workspaceSources: availableWorkspace,
      })
    } catch (error) {
      console.warn('[knowledge/research] planner', error)
      plan = ruleBasedPlan({ question, databaseSources: selectedSources, availableWorkspace })
    }
    plan = applyWorkspaceRules(question, plan, availableWorkspace)
  }
  // No portfólio, a regra de banco obrigatório vale quando a pergunta cai num único cliente.
  const ruleClient = portfolio && scope.length === 1 ? scope[0].slug : client.slug
  plan = finalizeKnowledgePlan(ruleClient, question, plan, selectedSources)

  const sourceIds = [...plan.databaseSourceIds, ...plan.workspaceSourceIds]
  logKnowledgeTrace({
    stage: 'plan',
    clientId: client.slug,
    intent: intent.intent,
    sourceId: plan.databaseSourceIds[0],
    sources: sourceIds.join(','),
    ok: true,
    ms: Date.now() - started,
  })

  const wantsGithub = searchAllKnowledge && plan.workspaceSourceIds.includes('github')
  const wantsMeetings = searchAllKnowledge && plan.workspaceSourceIds.includes('meetings')
  const wantsDocuments = searchAllKnowledge && plan.workspaceSourceIds.includes('documents')
  const wantsNotion = searchAllKnowledge && plan.workspaceSourceIds.includes('notion')
  const wantsMonday = searchAllKnowledge && plan.workspaceSourceIds.includes('monday')
  const githubPromise = wantsGithub
    ? gatherGithubContextForQuery(
        {
          clientId: client.slug,
          boardId: input.boardId,
          query: plan.searchQuery,
        },
        repos,
        { allRepos: true, maxRepos: portfolio ? 8 : undefined }
      ).catch(error => ({
        repos: repos.map(repo => `${repo.owner}/${repo.repo}`),
        snippets: [],
        activity: [],
        notes: [`GitHub indisponível: ${sanitizeSourceError(error)}`],
      }))
    : Promise.resolve({ repos: [], snippets: [], activity: [], notes: [] })
  const workspacePromise =
    wantsMeetings || wantsDocuments
      ? gatherWorkspaceContext(scope.map(item => item.slug), plan.searchQuery, {
          meetings: wantsMeetings,
          documents: wantsDocuments,
        })
      : Promise.resolve({
          meetings: [],
          documents: [],
          catalog: { meetings: [] as string[], documents: [] as string[] },
        })
  const notionPromise: Promise<{ ok: true; pages: NotionPageHit[] } | { ok: false; error: string }> = wantsNotion
    ? searchNotionPages(plan.searchQuery)
        .then(pages => ({ ok: true as const, pages }))
        .catch(error => ({ ok: false as const, error: sanitizeSourceError(error) }))
    : Promise.resolve({ ok: true as const, pages: [] })
  const mondayConfig = wantsMonday ? readBe180MondayConfig() : null
  const mondayPromise: Promise<{ ok: true; items: MondayBoardHit[] } | { ok: false; error: string }> =
    wantsMonday && mondayConfig?.ok
      ? searchMondayBoardItems(mondayConfig.config, plan.searchQuery)
          .then(items => ({ ok: true as const, items }))
          .catch(error => ({ ok: false as const, error: sanitizeSourceError(error) }))
      : Promise.resolve({ ok: true as const, items: [] })

  const databaseTasks = plan.databaseSourceIds.map(async sourceId => {
    const source = selectedSources.find(item => item.id === sourceId)
    const ref = dbSources.refs.get(sourceId)
    if (!source || !ref) return null
    try {
      return {
        ok: true as const,
        result: await runDatabase(ref, source.id, source.label, question),
      }
    } catch (error) {
      const errorCode = sanitizeSourceError(error)
      logKnowledgeTrace({
        stage: 'error',
        clientId: client.slug,
        sourceId,
        ok: false,
        errorCode,
      })
      return {
        ok: false as const,
        source,
        error: errorCode,
      }
    }
  })

  const [github, workspace, notion, monday, ...databaseOutcomes] = await Promise.all([
    githubPromise,
    workspacePromise,
    notionPromise,
    mondayPromise,
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
    ...github.activity
      .filter(item => item.pulls.length > 0 || item.commits.length > 0)
      .map((item, index) => ({
        id: `github-activity-${index + 1}`,
        kind: 'github' as const,
        source: item.repo,
        title: 'PRs mescladas e commits recentes (6 semanas)',
        excerpt: clip(
          [
            `PRs: ${item.pulls.map(pr => `#${pr.number} ${pr.title} (${pr.mergedAt.slice(0, 10)})`).join('; ') || '—'}`,
            `Commits: ${item.commits.map(commit => `${commit.date.slice(0, 10)} ${commit.message}`).join('; ') || '—'}`,
          ].join('\n')
        ),
        href: `https://github.com/${item.repo}/pulls?q=is%3Amerged`,
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
    ...(notion.ok
      ? notion.pages.map((page, index) => ({
          id: `notion-${index + 1}`,
          kind: 'notion' as const,
          source: 'Notion',
          title: page.title,
          excerpt: clip(page.text || page.title),
          href: page.url,
        }))
      : []),
    ...(monday.ok
      ? monday.items.map((item, index) => ({
          id: `monday-${index + 1}`,
          kind: 'monday' as const,
          source: 'Monday',
          title: item.name,
          excerpt: clip(item.excerpt || item.name),
          href: item.url,
        }))
      : []),
  ]

  const statuses: KnowledgeSourceStatus[] = []
  if (wantsGithub) {
    statuses.push(
      github.repos.length === 0
        ? { id: 'github', label: 'GitHub', state: 'unavailable', detail: github.notes.join(' ') || 'Nenhum repositório configurado.' }
        : statusFor('github', 'GitHub', github.snippets.length, github.notes.join(' ') || 'Nenhum trecho relevante encontrado.')
    )
  }
  if (wantsMeetings) {
    statuses.push(statusFor('meetings', 'Reuniões', workspace.meetings.length, 'Nenhuma reunião relevante encontrada.'))
  }
  if (wantsDocuments) {
    statuses.push(statusFor('documents', 'Documentos', workspace.documents.length, 'Nenhum documento relevante encontrado.'))
  }
  if (wantsNotion) {
    statuses.push(
      notion.ok
        ? statusFor('notion', 'Notion', notion.pages.length, 'Nenhuma página relevante encontrada.')
        : { id: 'notion', label: 'Notion', state: 'error', detail: notion.error }
    )
  }
  if (wantsMonday) {
    statuses.push(
      monday.ok
        ? statusFor('monday', 'Monday', monday.items.length, 'Nenhum item relevante encontrado.')
        : { id: 'monday', label: 'Monday', state: 'error', detail: monday.error }
    )
  }
  const skippedSources = availableWorkspace
    .filter(id => !plan.workspaceSourceIds.includes(id))
    .map(id => workspaceSourceLabel(id))
  for (const sourceId of plan.databaseSourceIds) {
    const source = selectedSources.find(item => item.id === sourceId)
    const outcome = databaseOutcomes.find(item =>
      item?.ok ? item.result.sourceId === sourceId : item?.source.id === sourceId
    )
    if (!source) continue
    statuses.push(
      outcome?.ok
        ? {
            id: sourceId,
            label: source.label,
            state: outcome.result.rows.length > 0 ? 'used' : 'empty',
            detail:
              outcome.result.rows.length > 0
                ? `${outcome.result.rows.length} linha(s)`
                : 'Nenhuma linha no recorte consultado.',
          }
        : {
            id: sourceId,
            label: source.label,
            state: 'error',
            detail: outcome && !outcome.ok ? outcome.error : 'Consulta não executada.',
          }
    )
  }

  return { question, searchQuery: plan.searchQuery, intent, evidence, databases, statuses, skippedSources }
}

export function formatKnowledgeResearchForPrompt(research: KnowledgeResearch): string {
  const skipped = research.skippedSources?.length
    ? `\nFontes não consultadas para esta pergunta (não afirme que elas não têm a informação): ${research.skippedSources.join(', ')}.`
    : ''
  if (research.evidence.length === 0) {
    const failures = research.statuses
      .filter(status => status.state === 'error' || status.state === 'unavailable')
      .map(status => `${status.label}: ${status.detail}`)
      .join('; ')
    return `Nenhuma evidência encontrada.${failures ? ` Fontes indisponíveis: ${failures}` : ''}${skipped}`
  }
  const body = research.evidence
    .map(
      (item, index) =>
        `[${index + 1}] ${item.kind.toUpperCase()} · ${item.source} · ${item.title}${
          item.href ? ` · ${item.href}` : ''
        }\n${item.excerpt}`
    )
    .join('\n\n')
  return `${body}${skipped}`
}

export async function answerKnowledgeQuestion(input: {
  clientId: string
  question: string
  sourceId?: string
}): Promise<KnowledgeAnswer> {
  if (isKnowledgePipelineEnabled(input.clientId)) {
    const resolved = resolveQuestionIntent({
      clientId: input.clientId,
      question: input.question,
    })
    if (resolved.clarification) {
      logKnowledgeTrace({
        stage: 'intent',
        clientId: input.clientId,
        intent: resolved.intent.intent,
        ok: true,
      })
      return {
        question: input.question,
        searchQuery: input.question,
        intent: resolved.intent,
        evidence: [],
        databases: [],
        statuses: [],
        answer: resolved.clarification.question,
        suggestions: resolved.clarification.options,
      }
    }
  }

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
