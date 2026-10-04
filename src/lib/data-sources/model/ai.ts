import { asStringArray, callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import { schemaForPrompt } from '../schema-prompt'
import { sourceSemanticHint } from '../semantics'
import {
  modelTableKey,
  type DataModelAi,
  type DataModelAiDomain,
  type DataModelAiTable,
  type DataModelSnapshot,
  type DataModelTable,
} from './types'

export const AI_TABLE_BATCH_SIZE = 25
const MAX_DOMAINS = 12
const MAX_RISKS = 10
const MAX_QUESTIONS = 8
const MAX_KEY_COLUMNS = 6

function clean(value: unknown, max = 600): string {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\s+/g, ' ').slice(0, max)
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

/** Normaliza chaves `schema.table` ignorando caixa e espaços. */
function normalizeKey(value: unknown): string {
  return clean(value, 200).toLowerCase()
}

export function parseAiTableDescriptions(
  value: unknown,
  knownKeys: string[]
): Record<string, DataModelAiTable> {
  const lookup = new Map(knownKeys.map(key => [key.toLowerCase(), key] as const))
  const result: Record<string, DataModelAiTable> = {}
  const root = record(value)
  const rawTables = root?.tables
  const items: unknown[] = Array.isArray(rawTables)
    ? rawTables
    : rawTables && typeof rawTables === 'object'
      ? Object.entries(rawTables as Record<string, unknown>).map(([key, item]) => ({
          ...(record(item) ?? {}),
          key,
        }))
      : []

  for (const item of items) {
    const entry = record(item)
    if (!entry) continue
    const key = lookup.get(normalizeKey(entry.key ?? entry.table ?? entry.name))
    if (!key) continue
    const description = clean(entry.description)
    const purpose = clean(entry.purpose, 300)
    if (!description && !purpose) continue
    result[key] = {
      description,
      purpose,
      keyColumns: asStringArray(entry.keyColumns ?? entry.key_columns).slice(0, MAX_KEY_COLUMNS),
    }
  }
  return result
}

export function parseAiOverview(
  value: unknown,
  knownKeys: string[]
): Pick<DataModelAi, 'overview' | 'domains' | 'risks' | 'suggestedQuestions'> {
  const lookup = new Map(knownKeys.map(key => [key.toLowerCase(), key] as const))
  const root = record(value) ?? {}
  const domains: DataModelAiDomain[] = (Array.isArray(root.domains) ? root.domains : [])
    .map(item => {
      const entry = record(item)
      if (!entry) return null
      const name = clean(entry.name, 80)
      if (!name) return null
      const tables = asStringArray(entry.tables)
        .map(key => lookup.get(key.toLowerCase()))
        .filter((key): key is string => Boolean(key))
      return { name, description: clean(entry.description, 400), tables: [...new Set(tables)] }
    })
    .filter((domain): domain is DataModelAiDomain => domain !== null)
    .slice(0, MAX_DOMAINS)

  return {
    overview: clean(root.overview, 1600),
    domains,
    risks: asStringArray(root.risks).map(risk => clean(risk, 300)).filter(Boolean).slice(0, MAX_RISKS),
    suggestedQuestions: asStringArray(root.suggestedQuestions ?? root.suggested_questions)
      .map(question => clean(question, 200))
      .filter(Boolean)
      .slice(0, MAX_QUESTIONS),
  }
}

export function chunkTables<T>(items: T[], size = AI_TABLE_BATCH_SIZE): T[][] {
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

function tableStatsLine(table: DataModelTable): string {
  const parts = [
    `${modelTableKey(table)} [${table.type}]`,
    table.estimatedRows != null ? `~${table.estimatedRows} linhas` : null,
    table.description ? `descrição do banco: ${clean(table.description, 200)}` : null,
  ].filter(Boolean)
  return parts.join(' · ')
}

const TABLES_SYSTEM = [
  'Você é um arquiteto de dados. Receberá o schema de um conjunto de tabelas (nomes, colunas, tipos, pk/fk e comentários).',
  'Para cada tabela, escreva em português do Brasil: uma descrição clara do que ela armazena (description, 1–2 frases),',
  'o papel dela no negócio ou no sistema (purpose, 1 frase) e as colunas mais importantes para análise (keyColumns, até 6 nomes exatos).',
  'Baseie-se apenas no que está no schema; quando inferir, use linguagem cautelosa ("provavelmente").',
  'Responda somente com JSON no formato {"tables":[{"key":"schema.tabela","description":"...","purpose":"...","keyColumns":["..."]}]}.',
].join(' ')

const OVERVIEW_SYSTEM = [
  'Você é um arquiteto de dados explicando um banco para um time de negócio e engenharia, em português do Brasil.',
  'Receberá a lista de tabelas com descrições curtas, os relacionamentos (FKs) e indicadores de saúde do modelo.',
  'Produza: overview (2–4 parágrafos curtos sobre o que o banco representa, como os dados fluem e como está organizado),',
  'domains (agrupamentos de negócio com name, description e tables usando exatamente as chaves schema.tabela recebidas),',
  'risks (até 10 riscos ou lacunas concretas de modelagem/qualidade observadas) e',
  'suggestedQuestions (até 8 perguntas em linguagem natural que alguém poderia fazer a este banco e que o schema consegue responder).',
  'Responda somente com JSON no formato {"overview":"...","domains":[{"name":"...","description":"...","tables":["schema.tabela"]}],"risks":["..."],"suggestedQuestions":["..."]}.',
].join(' ')

export async function describeModelWithAi(snapshot: DataModelSnapshot): Promise<DataModelAi> {
  const knownKeys = snapshot.tables.map(modelTableKey)
  const hint = sourceSemanticHint(snapshot.sourceName)
  const tables: Record<string, DataModelAiTable> = {}

  for (const batch of chunkTables(snapshot.tables)) {
    const schemaText = schemaForPrompt(
      batch.map(table => ({ schema: table.schema, table: table.table })),
      batch.flatMap(table => table.columns)
    )
    const statsText = batch.map(tableStatsLine).join('\n')
    const user = [
      `Fonte: ${snapshot.sourceName} (${snapshot.kind}).`,
      hint ? `Contexto semântico conhecido:\n${hint}` : '',
      `Tabelas e estatísticas:\n${statsText}`,
      `Schema:\n${schemaText}`,
    ]
      .filter(Boolean)
      .join('\n\n')
    const parsed = await callOpenAiJson(TABLES_SYSTEM, user, {
      model: chatModel(),
      temperature: 0.2,
      maxTokens: 4000,
    })
    Object.assign(tables, parseAiTableDescriptions(parsed, batch.map(modelTableKey)))
  }

  const relationshipLines = snapshot.relationships
    .slice(0, 200)
    .map(rel => `${modelTableKey(rel.from)}.${rel.from.column} -> ${modelTableKey(rel.to)}.${rel.to.column}`)
  const healthLines = snapshot.health.checks
    .filter(check => check.severity !== 'ok')
    .map(check => `- ${check.label}: ${check.summary}`)
  const tableLines = snapshot.tables.map(table => {
    const ai = tables[modelTableKey(table)]
    return `${tableStatsLine(table)}${ai?.description ? ` — ${ai.description}` : ''}`
  })

  const overviewUser = [
    `Fonte: ${snapshot.sourceName} (${snapshot.kind}). Score de saúde: ${snapshot.health.score}/100.`,
    hint ? `Contexto semântico conhecido:\n${hint}` : '',
    `Tabelas (${snapshot.tables.length}):\n${tableLines.join('\n')}`,
    relationshipLines.length
      ? `Relacionamentos (${snapshot.relationships.length}):\n${relationshipLines.join('\n')}`
      : 'Relacionamentos: nenhuma chave estrangeira declarada.',
    healthLines.length ? `Indicadores de saúde:\n${healthLines.join('\n')}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  const overviewParsed = await callOpenAiJson(OVERVIEW_SYSTEM, overviewUser, {
    model: chatModel(),
    temperature: 0.3,
    maxTokens: 3000,
  })

  return {
    ...parseAiOverview(overviewParsed, knownKeys),
    tables,
    generatedAt: new Date().toISOString(),
  }
}
