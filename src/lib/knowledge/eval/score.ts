import { applySourceTableSemantics } from '@/lib/data-sources/semantics'
import type { DataSourceCatalogEntry } from '@/lib/data-sources/types'
import { inferQuestionIntent } from '../intent'
import { finalizeKnowledgePlan, type KnowledgePlanSource } from '../planner'
import {
  KNOWLEDGE_EVAL_CASES,
  KNOWLEDGE_EVAL_NOW,
  type KnowledgeEvalCase,
} from './fixtures'

const LIKEME_CATALOG: DataSourceCatalogEntry[] = [
  { schema: 'auth', table: 'users', type: 'table' },
  { schema: 'public', table: 'user', type: 'table' },
  { schema: 'public', table: 'community_member', type: 'table' },
]

const COLMEIA_CATALOG: DataSourceCatalogEntry[] = [
  { schema: 'dbo', table: 'usuario_dm', type: 'table' },
  { schema: 'dbo', table: 'roteiros', type: 'table' },
]

const ATIVOS_CATALOG: DataSourceCatalogEntry[] = [
  { schema: 'public', table: 'bancoAtivosJoin_ft', type: 'table' },
  { schema: 'public', table: 'exibidor', type: 'table' },
]

export function evalSourcesFor(clientId: KnowledgeEvalCase['clientId']): KnowledgePlanSource[] {
  const cadence: KnowledgePlanSource = {
    id: 'cadence',
    label: 'Workspace Cadence',
    description: 'cards, PRs, reuniões e documentos do workspace',
  }
  if (clientId === 'likeme') {
    return [
      cadence,
      {
        id: 'likeme-supabase',
        label: 'Like:Me · Supabase',
        description: 'produção Like:Me, usuários, comunidade e marketplace',
      },
    ]
  }
  if (clientId === 'be180-ooh') {
    return [
      cadence,
      {
        id: 'be180-ativos',
        label: 'Banco de Ativos · PostgreSQL',
        description: 'produção Banco de Ativos Azure postgres, inventário e pontos',
      },
      {
        id: 'be180-colmeia',
        label: 'Colmeia · SQL Server',
        description: 'produção Colmeia Azure SQL Server, roteiros e campanhas',
      },
    ]
  }
  return [cadence]
}

function naivePlan(sources: KnowledgePlanSource[], question: string) {
  return {
    searchQuery: question,
    databaseSourceIds: sources.slice(0, 2).map(source => source.id),
    reason: 'Plano ingênuo do baseline (simula LLM escolhendo as primeiras fontes).',
  }
}

function actualSourceId(
  fixture: KnowledgeEvalCase,
  databaseSourceIds: string[]
): KnowledgeEvalCase['expected']['sourceId'] {
  if (fixture.expected.sourceId === 'none') {
    return databaseSourceIds.includes('cadence') && fixture.expected.intent !== 'chitchat'
      ? 'cadence'
      : 'none'
  }
  if (databaseSourceIds.includes(fixture.expected.sourceId)) return fixture.expected.sourceId
  if (databaseSourceIds[0] === 'cadence') return 'cadence'
  return (databaseSourceIds[0] as KnowledgeEvalCase['expected']['sourceId']) ?? 'none'
}

function catalogFor(sourceId: KnowledgeEvalCase['expected']['sourceId']) {
  if (sourceId === 'be180-colmeia') return COLMEIA_CATALOG
  if (sourceId === 'be180-ativos') return ATIVOS_CATALOG
  return LIKEME_CATALOG
}

function sourceNameFor(sourceId: KnowledgeEvalCase['expected']['sourceId']) {
  if (sourceId === 'be180-colmeia') return 'Colmeia · SQL Server'
  if (sourceId === 'be180-ativos') return 'Banco de Ativos · PostgreSQL'
  return 'Like:Me · Supabase'
}

function scoreTables(fixture: KnowledgeEvalCase): string | null {
  const expected = fixture.expected.tables
  if (!expected?.length) return null
  const catalog = catalogFor(fixture.expected.sourceId)
  const selected = applySourceTableSemantics(
    sourceNameFor(fixture.expected.sourceId),
    fixture.question,
    catalog,
    [catalog[0]]
  )
  const ok = expected.every(item =>
    selected.some(
      entry =>
        entry.schema.toLowerCase() === item.schema.toLowerCase() &&
        entry.table.toLowerCase() === item.table.toLowerCase()
    )
  )
  return ok ? null : `tabelas=${selected.map(item => `${item.schema}.${item.table}`).join(',')}`
}

export interface KnowledgeEvalGap {
  id: string
  field: 'intent' | 'clarification' | 'source' | 'tables' | 'rewrite'
  detail: string
}

export interface KnowledgeEvalRow {
  id: string
  class: KnowledgeEvalCase['class']
  passed: boolean
  gaps: KnowledgeEvalGap[]
}

export interface KnowledgeEvalReport {
  total: number
  passed: number
  failed: number
  byClass: Record<string, { total: number; passed: number }>
  rows: KnowledgeEvalRow[]
  gapIds: string[]
}

export function scoreKnowledgeEvalCase(
  fixture: KnowledgeEvalCase,
  now: Date = KNOWLEDGE_EVAL_NOW
): KnowledgeEvalRow {
  const intent = inferQuestionIntent({
    clientId: fixture.clientId,
    question: fixture.question,
    now,
  })
  const sources = evalSourcesFor(fixture.clientId)
  const plan = finalizeKnowledgePlan(
    fixture.clientId,
    intent.rewrittenQuestion,
    naivePlan(sources, intent.rewrittenQuestion),
    sources
  )
  const gaps: KnowledgeEvalGap[] = []

  if (intent.intent !== fixture.expected.intent) {
    gaps.push({
      id: fixture.id,
      field: 'intent',
      detail: `${intent.intent} ≠ ${fixture.expected.intent}`,
    })
  }
  if (intent.needsClarification !== fixture.expected.needsClarification) {
    gaps.push({
      id: fixture.id,
      field: 'clarification',
      detail: `${intent.needsClarification} ≠ ${fixture.expected.needsClarification}`,
    })
  }

  const skipSource =
    fixture.expected.sourceId === 'none' &&
    (intent.needsClarification ||
      intent.intent === 'chitchat' ||
      intent.intent === 'flow' ||
      intent.intent === 'catalog')
  if (!skipSource) {
    const got = actualSourceId(fixture, plan.databaseSourceIds)
    if (fixture.expected.sourceId === 'none') {
      if (plan.databaseSourceIds.includes('likeme-supabase') || plan.databaseSourceIds.includes('be180-colmeia') || plan.databaseSourceIds.includes('be180-ativos')) {
        gaps.push({
          id: fixture.id,
          field: 'source',
          detail: `produção inesperada: ${plan.databaseSourceIds.join(',')}`,
        })
      }
    } else if (got !== fixture.expected.sourceId) {
      gaps.push({
        id: fixture.id,
        field: 'source',
        detail: `${got} ≠ ${fixture.expected.sourceId} (${plan.databaseSourceIds.join(',')})`,
      })
    }
  }

  const tableGap = scoreTables(fixture)
  if (tableGap) {
    gaps.push({ id: fixture.id, field: 'tables', detail: tableGap })
  }

  if (
    fixture.expected.rewrittenContains &&
    !intent.rewrittenQuestion.includes(fixture.expected.rewrittenContains)
  ) {
    gaps.push({
      id: fixture.id,
      field: 'rewrite',
      detail: intent.rewrittenQuestion,
    })
  }

  return { id: fixture.id, class: fixture.class, passed: gaps.length === 0, gaps }
}

export function evaluateKnowledgeBaseline(now: Date = KNOWLEDGE_EVAL_NOW): KnowledgeEvalReport {
  const rows = KNOWLEDGE_EVAL_CASES.map(item => scoreKnowledgeEvalCase(item, now))
  const byClass: KnowledgeEvalReport['byClass'] = {}
  for (const row of rows) {
    const bucket = byClass[row.class] ?? { total: 0, passed: 0 }
    bucket.total += 1
    if (row.passed) bucket.passed += 1
    byClass[row.class] = bucket
  }
  const passed = rows.filter(row => row.passed).length
  return {
    total: rows.length,
    passed,
    failed: rows.length - passed,
    byClass,
    rows,
    gapIds: rows.filter(row => !row.passed).map(row => row.id),
  }
}

export function formatKnowledgeEvalReport(report: KnowledgeEvalReport): string {
  const classes = Object.entries(report.byClass)
    .map(([name, stats]) => `${name} ${stats.passed}/${stats.total}`)
    .join(', ')
  const gaps = report.gapIds.length ? ` gaps=${report.gapIds.join(',')}` : ''
  return `knowledge-eval passed=${report.passed}/${report.total} ${classes}${gaps}`
}
