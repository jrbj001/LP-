import 'server-only'

import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import { inferChart } from '@/lib/cadence/query'
import { narrateQueryResult } from '@/lib/consultar/narrate'
import { isKnowledgePipelineEnabled } from '@/lib/knowledge/flag'
import {
  mergeConferenceSuggestions,
  PASSED_QUERY_CRITIQUE,
  reviewQueryResult,
  type QueryCritique,
} from '@/lib/knowledge/result-critic'
import { hashSql, logKnowledgeTrace } from '@/lib/knowledge/trace'
import { decryptDataSourceConfig } from './crypto'
import {
  describePostgresTables,
  executePostgresReadOnly,
  listPostgresCatalog,
  POSTGRES_CATALOG_SQL,
  testPostgresConnection,
} from './postgresql'
import { assertExternalReadOnlySelect, isCatalogQuestion } from './query'
import { applySourceTableSemantics, sourceSemanticHint } from './semantics'
import {
  describeSqlServerTables,
  executeSqlServerReadOnly,
  listSqlServerCatalog,
  SQL_SERVER_CATALOG_SQL,
  testSqlServerConnection,
  type SqlServerDataSourceConfig,
} from './sqlserver'

import { schemaForPrompt } from './schema-prompt'
import { executeSqlWithRepair, MAX_SQL_REPAIRS, sqlRepairContext } from './sql-repair'
import { getStoredDataSource } from './store'
import type { DataSourceCatalogEntry, PostgresDataSourceConfig } from './types'

export interface ExternalNlQueryResult {
  sourceName: string
  sql: string
  explanation: string
  answer: string
  suggestions: string[]
  columns: string[]
  rows: Record<string, unknown>[]
  chart: { labelKey: string; valueKey: string } | null
  critic: QueryCritique
}

function selectedEntries(value: unknown, catalog: DataSourceCatalogEntry[]): DataSourceCatalogEntry[] {
  if (!value || typeof value !== 'object') return []
  const raw = value as Record<string, unknown>
  if (!Array.isArray(raw.tables)) return []
  const allowed = new Map(catalog.map(entry => [`${entry.schema}.${entry.table}`.toLowerCase(), entry]))
  return [
    ...new Map(
      raw.tables
        .filter((item): item is string => typeof item === 'string')
        .map(item => allowed.get(item.replaceAll('"', '').replaceAll('[', '').replaceAll(']', '').trim().toLowerCase()))
        .filter((entry): entry is DataSourceCatalogEntry => Boolean(entry))
        .slice(0, 12)
        .map(entry => [`${entry.schema}.${entry.table}`, entry])
    ).values(),
  ]
}

function sqlDraft(
  value: unknown,
  sourceName: string
): { sql: string; explanation: string; suggestions: string[] } {
  if (!value || typeof value !== 'object') throw new Error('A IA retornou um formato inválido.')
  const raw = value as Record<string, unknown>
  const sql = typeof raw.sql === 'string' ? raw.sql.trim() : ''
  const explanation = typeof raw.explanation === 'string' ? raw.explanation.trim() : ''
  const suggestions = Array.isArray(raw.suggestions)
    ? raw.suggestions
        .filter((item): item is string => typeof item === 'string')
        .map(item => item.trim())
        .filter(item => item.endsWith('?'))
        .slice(0, 3)
    : []
  if (!sql) throw new Error('A IA não gerou SQL.')
  return {
    sql,
    explanation: explanation || `Consulta gerada para a fonte ${sourceName}.`,
    suggestions:
      suggestions.length === 3
        ? suggestions
        : [
            `Quais são os registros mais recentes disponíveis em ${sourceName}?`,
            `Quais tabelas de ${sourceName} têm dados relacionados a esta consulta?`,
            `Como os resultados desta consulta se distribuem por período?`,
          ],
  }
}

function normalizeRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map(row => {
    const normalized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(row)) {
      normalized[key] = value instanceof Date ? value.toISOString() : value
    }
    return normalized
  })
}

export async function runExternalNaturalLanguageQuery(input: {
  clientId: string
  sourceId: string
  question: string
}): Promise<ExternalNlQueryResult> {
  const source = await getStoredDataSource(input.clientId, input.sourceId)
  if (!source || !source.enabled) throw new Error('Fonte de dados não encontrada ou desabilitada.')
  const dialect = source.kind === 'sqlserver' ? 'sqlserver' : 'postgresql'
  const engine = dialect === 'sqlserver' ? 'SQL Server (T-SQL)' : 'PostgreSQL'

  const config = decryptDataSourceConfig<SqlServerDataSourceConfig | PostgresDataSourceConfig>(
    source.encryptedConfig
  )
  const catalog =
    dialect === 'sqlserver'
      ? await testSqlServerConnection(config as SqlServerDataSourceConfig)
      : await testPostgresConnection(config as PostgresDataSourceConfig)

  if (isCatalogQuestion(input.question)) {
    const rows = normalizeRows(
      dialect === 'sqlserver'
        ? await listSqlServerCatalog(config as SqlServerDataSourceConfig)
        : await listPostgresCatalog(config as PostgresDataSourceConfig)
    )
    const columns = rows[0]
      ? Object.keys(rows[0])
      : ['table_schema', 'table_name', 'table_type', 'description']
    const explanation = `Lista do catálogo de ${source.name}: nome, tipo e descrição (quando o banco tiver comentário na tabela).`
    return {
      sourceName: source.name,
      sql: dialect === 'sqlserver' ? SQL_SERVER_CATALOG_SQL : POSTGRES_CATALOG_SQL,
      explanation,
      answer: await narrateQueryResult({
        question: input.question,
        sourceName: source.name,
        explanation,
        columns,
        rows,
        catalog: true,
      }),
      suggestions: [
        'Quais colunas existem na tabela mais usada desta fonte?',
        'Quantas tabelas existem em cada schema?',
        'Quais views estão disponíveis neste banco?',
      ],
      columns,
      rows,
      chart: inferChart(rows),
      critic: PASSED_QUERY_CRITIQUE,
    }
  }

  const catalogText = catalog.entries
    .map(entry => `${entry.schema}.${entry.table} (${entry.type})`)
    .join('\n')

  const choice = await callOpenAiJson(
    `Selecione de 1 a 12 tabelas ${engine} que podem responder à pergunta.
Use somente nomes completos presentes no catálogo e não invente relações.
Retorne somente JSON: {"tables":["schema.tabela"]}.`,
    `Pergunta: ${input.question}\n\nCatálogo da fonte ${source.name}:\n${catalogText}`,
    { temperature: 0, maxTokens: 500, model: chatModel() }
  )
  const enhanced = isKnowledgePipelineEnabled(input.clientId)
  const started = Date.now()
  const selected = selectedEntries(choice, catalog.entries)
  const entries = enhanced
    ? applySourceTableSemantics(source.name, input.question, catalog.entries, selected)
    : selected
  if (entries.length === 0) {
    throw new Error('Não foi possível identificar tabelas relacionadas à pergunta.')
  }

  const columns =
    dialect === 'sqlserver'
      ? await describeSqlServerTables(
          decryptDataSourceConfig<SqlServerDataSourceConfig>(source.encryptedConfig),
          entries
        )
      : await describePostgresTables(
          decryptDataSourceConfig<PostgresDataSourceConfig>(source.encryptedConfig),
          entries
        )
  const authorizedSchema = schemaForPrompt(entries, columns)
  const systemPrompt = `Você traduz perguntas em português do Brasil para um único SELECT ${engine} somente-leitura.
Use somente as tabelas e colunas fornecidas, ou information_schema.tables / information_schema.columns / sys.tables quando a pergunta for sobre o catálogo.
Respeite chaves primárias e estrangeiras indicadas no schema (pk / fk) ao juntar tabelas.
Qualifique cada tabela com o schema.
Não use escrita, DDL, comentários, múltiplos statements ou subconsultas em FROM/JOIN.
${dialect === 'sqlserver' ? 'Use SELECT TOP 100 ao listar registros.' : 'Use LIMIT 100 ao listar registros. Não use funções pg_*.'}
Prefira agregações curtas.
${enhanced ? sourceSemanticHint(source.name, input.question) : ''}
Sempre gere 3 próximas consultas úteis como perguntas executáveis e terminadas em "?".
Retorne somente JSON:
{"sql":"SELECT ...","explanation":"1 ou 2 frases","suggestions":["pergunta 1?","pergunta 2?","pergunta 3?"]}.`
  const questionPrompt = `Hoje é ${new Date().toISOString().slice(0, 10)} (interprete datas no fuso America/Sao_Paulo).
Fonte: ${source.name}
Pergunta: ${input.question}

Schema autorizado:
${authorizedSchema}`

  const executed = await executeSqlWithRepair({
    generate: async repair =>
      sqlDraft(
        await callOpenAiJson(
          systemPrompt,
          repair
            ? `${questionPrompt}\n\n${sqlRepairContext(repair.sql, repair.error)}`
            : questionPrompt,
          { temperature: 0.1, maxTokens: 1000, model: chatModel() }
        ),
        source.name
      ),
    validateAndExecute: async draft => {
      const sql = assertExternalReadOnlySelect(draft.sql, entries, dialect)
      const result = normalizeRows(
        dialect === 'sqlserver'
          ? await executeSqlServerReadOnly(
              decryptDataSourceConfig<SqlServerDataSourceConfig>(source.encryptedConfig),
              sql
            )
          : await executePostgresReadOnly(
              decryptDataSourceConfig<PostgresDataSourceConfig>(source.encryptedConfig),
              sql
            )
      )
      return { sql, result }
    },
    maxRepairs: enhanced ? MAX_SQL_REPAIRS : 0,
  })

  const resultColumns = executed.result[0] ? Object.keys(executed.result[0]) : []
  const critic = enhanced
    ? await reviewQueryResult({
        question: input.question,
        sql: executed.sql,
        columns: resultColumns,
        rows: executed.result,
        sourceName: source.name,
      })
    : PASSED_QUERY_CRITIQUE
  logKnowledgeTrace({
    stage: 'sql',
    clientId: input.clientId,
    sourceId: input.sourceId,
    sqlHash: hashSql(executed.sql),
    ms: Date.now() - started,
    repairCount: Math.max(0, executed.attempts - 1),
    critic: critic.status,
    ok: true,
  })
  return {
    sourceName: source.name,
    sql: executed.sql,
    explanation: executed.draft.explanation,
    answer: await narrateQueryResult({
      question: input.question,
      sourceName: source.name,
      explanation: executed.draft.explanation,
      columns: resultColumns,
      rows: executed.result,
      critic,
    }),
    suggestions: mergeConferenceSuggestions(executed.draft.suggestions, critic.conferenceQuestion),
    columns: resultColumns,
    rows: executed.result,
    chart: inferChart(executed.result),
    critic,
  }
}
