import 'server-only'

import {
  DataSourceConnectionError,
  describeConnectionError,
  describePostgresTables,
  postgresClient,
  testPostgresConnection,
} from '../postgresql'
import type { PostgresDataSourceConfig } from '../types'
import { assembleTables, limitEntries, type TableStats } from './assemble'
import type { DataModelRelationship, DataModelTable } from './types'

interface StatsRow {
  schema_name: string
  table_name: string
  estimated_rows: number | string | null
  size_bytes: number | string | null
  last_analyzed_at: Date | string | null
  description: string | null
}

function toNumber(value: number | string | null): number | null {
  if (value == null) return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toIso(value: Date | string | null): string | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

async function fetchPostgresStats(
  config: PostgresDataSourceConfig,
  schemas: string[]
): Promise<TableStats[]> {
  if (schemas.length === 0) return []
  const sql = postgresClient(config)
  try {
    const rows = await sql<StatsRow[]>`
      select
        n.nspname as schema_name,
        c.relname as table_name,
        case when c.reltuples < 0 then null else c.reltuples::bigint end as estimated_rows,
        pg_total_relation_size(c.oid) as size_bytes,
        greatest(s.last_analyze, s.last_autoanalyze) as last_analyzed_at,
        obj_description(c.oid, 'pg_class') as description
      from pg_catalog.pg_class c
      join pg_catalog.pg_namespace n on n.oid = c.relnamespace
      left join pg_catalog.pg_stat_user_tables s on s.relid = c.oid
      where c.relkind in ('r', 'p', 'v', 'm', 'f')
        and n.nspname = any(${schemas})
    `
    return rows.map(row => ({
      schema: row.schema_name,
      table: row.table_name,
      estimatedRows: toNumber(row.estimated_rows),
      sizeBytes: toNumber(row.size_bytes),
      lastAnalyzedAt: toIso(row.last_analyzed_at),
      description: row.description,
    }))
  } catch (error) {
    console.warn('[data-sources/model] estatísticas PostgreSQL indisponíveis', describeConnectionError(error))
    return []
  } finally {
    await sql.end({ timeout: 2 })
  }
}

export async function introspectPostgresModel(config: PostgresDataSourceConfig): Promise<{
  tables: DataModelTable[]
  relationships: DataModelRelationship[]
  truncated: boolean
}> {
  const catalog = await testPostgresConnection(config)
  const { entries, truncated } = limitEntries(catalog.entries)
  const schemas = [...new Set(entries.map(entry => entry.schema))]

  let columns
  try {
    columns = await describePostgresTables(config, entries)
  } catch (error) {
    if (error instanceof DataSourceConnectionError) throw error
    throw new DataSourceConnectionError(describeConnectionError(error))
  }
  const stats = await fetchPostgresStats(config, schemas)

  return { ...assembleTables(entries, columns, stats), truncated }
}
