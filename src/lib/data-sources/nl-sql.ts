import 'server-only'

import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import { inferChart } from '@/lib/cadence/query'
import { decryptDataSourceConfig } from './crypto'
import {
  describePostgresTables,
  executePostgresReadOnly,
  testPostgresConnection,
} from './postgresql'
import { assertExternalReadOnlySelect } from './query'
import {
  describeSqlServerTables,
  executeSqlServerReadOnly,
  testSqlServerConnection,
  type SqlServerDataSourceConfig,
} from './sqlserver'
import { getStoredDataSource } from './store'
import type { DataSourceCatalogEntry, DataSourceColumn, PostgresDataSourceConfig } from './types'

export interface ExternalNlQueryResult {
  sourceName: string
  sql: string
  explanation: string
  suggestions: string[]
  columns: string[]
  rows: Record<string, unknown>[]
  chart: { labelKey: string; valueKey: string } | null
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

function schemaForPrompt(entries: DataSourceCatalogEntry[], columns: DataSourceColumn[]): string {
  return entries
    .map(entry => {
      const fields = columns
        .filter(column => column.schema === entry.schema && column.table === entry.table)
        .map(column => `${column.column} ${column.dataType}${column.nullable ? '' : ' not null'}`)
      return `${entry.schema}.${entry.table}(\n  ${fields.join(',\n  ')}\n)`
    })
    .join('\n\n')
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

  const catalog =
    dialect === 'sqlserver'
      ? await testSqlServerConnection(decryptDataSourceConfig<SqlServerDataSourceConfig>(source.encryptedConfig))
      : await testPostgresConnection(decryptDataSourceConfig<PostgresDataSourceConfig>(source.encryptedConfig))
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
  const entries = selectedEntries(choice, catalog.entries)
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
  const draft = sqlDraft(
    await callOpenAiJson(
      `Você traduz perguntas em português do Brasil para um único SELECT ${engine} somente-leitura.
Use somente as tabelas e colunas fornecidas. Qualifique cada tabela com o schema.
Não use escrita, DDL, comentários, múltiplos statements ou subconsultas em FROM/JOIN.
${dialect === 'sqlserver' ? 'Use SELECT TOP 100 ao listar registros.' : 'Use LIMIT 100 ao listar registros. Não use funções pg_*.'}
Prefira agregações curtas.
Sempre gere 3 próximas consultas úteis como perguntas executáveis e terminadas em "?".
Retorne somente JSON:
{"sql":"SELECT ...","explanation":"1 ou 2 frases","suggestions":["pergunta 1?","pergunta 2?","pergunta 3?"]}.`,
      `Hoje é ${new Date().toISOString().slice(0, 10)}.
Fonte: ${source.name}
Pergunta: ${input.question}

Schema autorizado:
${schemaForPrompt(entries, columns)}`,
      { temperature: 0.1, maxTokens: 1000, model: chatModel() }
    ),
    source.name
  )

  const sql = assertExternalReadOnlySelect(draft.sql, entries, dialect)
  const rows = normalizeRows(
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
  return {
    sourceName: source.name,
    sql,
    explanation: draft.explanation,
    suggestions: draft.suggestions,
    columns: rows[0] ? Object.keys(rows[0]) : [],
    rows,
    chart: inferChart(rows),
  }
}
