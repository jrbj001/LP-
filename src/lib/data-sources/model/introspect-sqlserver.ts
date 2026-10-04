import 'server-only'

import sql from 'mssql'
import {
  describeSqlServerTables,
  poolConfig,
  testSqlServerConnection,
  type SqlServerDataSourceConfig,
} from '../sqlserver'
import { assembleTables, limitEntries, type TableStats } from './assemble'
import type { DataModelRelationship, DataModelTable } from './types'

interface StatsRow {
  schema_name: string
  table_name: string
  estimated_rows: number | null
  size_bytes: number | null
  last_analyzed_at: Date | string | null
  description: string | null
}

function toIso(value: Date | string | null): string | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

async function fetchSqlServerStats(config: SqlServerDataSourceConfig): Promise<TableStats[]> {
  const pool = new sql.ConnectionPool(poolConfig(config))
  try {
    await pool.connect()
    const result = await pool.request().query<StatsRow>(`
      select
        s.name as schema_name,
        o.name as table_name,
        ps.row_count as estimated_rows,
        ps.size_bytes,
        st.last_analyzed_at,
        cast(ep.value as nvarchar(400)) as description
      from sys.objects o
      join sys.schemas s on s.schema_id = o.schema_id
      outer apply (
        select
          sum(case when p.index_id in (0, 1) then p.row_count else 0 end) as row_count,
          sum(p.used_page_count) * 8192 as size_bytes
        from sys.dm_db_partition_stats p
        where p.object_id = o.object_id
      ) ps
      outer apply (
        select max(stats_date(stt.object_id, stt.stats_id)) as last_analyzed_at
        from sys.stats stt
        where stt.object_id = o.object_id
      ) st
      left join sys.extended_properties ep
        on ep.major_id = o.object_id
       and ep.minor_id = 0
       and ep.name = N'MS_Description'
      where o.type in ('U', 'V')
    `)
    return result.recordset.map(row => ({
      schema: row.schema_name,
      table: row.table_name,
      estimatedRows: row.estimated_rows == null ? null : Number(row.estimated_rows),
      sizeBytes: row.size_bytes == null ? null : Number(row.size_bytes),
      lastAnalyzedAt: toIso(row.last_analyzed_at),
      description: row.description,
    }))
  } catch (error) {
    console.warn('[data-sources/model] estatísticas SQL Server indisponíveis', error)
    return []
  } finally {
    await pool.close().catch(() => undefined)
  }
}

export async function introspectSqlServerModel(config: SqlServerDataSourceConfig): Promise<{
  tables: DataModelTable[]
  relationships: DataModelRelationship[]
  truncated: boolean
}> {
  const catalog = await testSqlServerConnection(config)
  const { entries, truncated } = limitEntries(catalog.entries)
  const columns = await describeSqlServerTables(config, entries)
  const stats = await fetchSqlServerStats(config)
  return { ...assembleTables(entries, columns, stats), truncated }
}
