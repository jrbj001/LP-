import 'server-only'

import sql from 'mssql'
import { columnKey, toDataSourceColumns } from './catalog-columns'
import { DataSourceConnectionError } from './postgresql'
import type { DataSourceCatalog, DataSourceCatalogEntry, DataSourceColumn } from './types'

function sqlInList(values: string[]): string {
  return values.map(value => `'${value.replaceAll("'", "''")}'`).join(',')
}

export interface SqlServerDataSourceConfig {
  server: string
  port?: number
  database: string
  username: string
  password: string
  encrypt?: boolean
}

function poolConfig(config: SqlServerDataSourceConfig): sql.config {
  return {
    server: config.server,
    port: config.port ?? 1433,
    database: config.database,
    user: config.username,
    password: config.password,
    options: {
      encrypt: config.encrypt !== false,
      trustServerCertificate: true,
      connectTimeout: 15000,
      requestTimeout: 15000,
    },
    pool: { max: 1, min: 0, idleTimeoutMillis: 5000 },
  }
}

export async function testSqlServerConnection(
  config: SqlServerDataSourceConfig
): Promise<DataSourceCatalog> {
  const pool = new sql.ConnectionPool(poolConfig(config))
  try {
    await pool.connect()
    const result = await pool.request().query<{
      schema_name: string
      table_name: string
      table_type: string
    }>(`
      select table_schema as schema_name, table_name, table_type
      from information_schema.tables
      where table_type in ('BASE TABLE', 'VIEW')
      order by table_schema, table_name
    `)
    const entries: DataSourceCatalogEntry[] = result.recordset.map(row => ({
      schema: row.schema_name,
      table: row.table_name,
      type: row.table_type === 'VIEW' ? 'view' : 'table',
    }))
    return {
      entries,
      count: entries.length,
      discoveredAt: new Date().toISOString(),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new DataSourceConnectionError(`Não foi possível conectar ao SQL Server: ${message}`)
  } finally {
    await pool.close().catch(() => undefined)
  }
}

export async function describeSqlServerTables(
  config: SqlServerDataSourceConfig,
  entries: DataSourceCatalogEntry[]
): Promise<DataSourceColumn[]> {
  if (entries.length === 0) return []
  const pool = new sql.ConnectionPool(poolConfig(config))
  try {
    await pool.connect()
    const schemas = [...new Set(entries.map(entry => entry.schema))]
    const tables = [...new Set(entries.map(entry => entry.table))]
    const allowed = new Set(entries.map(entry => `${entry.schema}.${entry.table}`))
    const schemaList = sqlInList(schemas)
    const tableList = sqlInList(tables)
    const result = await pool.request().query<{
      table_schema: string
      table_name: string
      column_name: string
      data_type: string
      is_nullable: 'YES' | 'NO'
    }>(`
      select table_schema, table_name, column_name, data_type, is_nullable
      from information_schema.columns
      where table_schema in (${schemaList})
        and table_name in (${tableList})
      order by table_schema, table_name, ordinal_position
    `)
    const filtered = result.recordset.filter(row =>
      allowed.has(`${row.table_schema}.${row.table_name}`)
    )

    const primaryKeys = new Set<string>()
    const foreignKeys: Array<readonly [string, string]> = []
    const comments: Array<readonly [string, string]> = []

    try {
      const pkResult = await pool.request().query<{
        table_schema: string
        table_name: string
        column_name: string
      }>(`
        select kcu.table_schema, kcu.table_name, kcu.column_name
        from information_schema.table_constraints tc
        join information_schema.key_column_usage kcu
          on tc.constraint_schema = kcu.constraint_schema
         and tc.constraint_name = kcu.constraint_name
        where tc.constraint_type = 'PRIMARY KEY'
          and kcu.table_schema in (${schemaList})
          and kcu.table_name in (${tableList})
      `)
      for (const row of pkResult.recordset) {
        if (!allowed.has(`${row.table_schema}.${row.table_name}`)) continue
        primaryKeys.add(columnKey(row.table_schema, row.table_name, row.column_name))
      }

      const fkResult = await pool.request().query<{
        table_schema: string
        table_name: string
        column_name: string
        referenced_schema: string
        referenced_table: string
        referenced_column: string
      }>(`
        select
          kcu.table_schema,
          kcu.table_name,
          kcu.column_name,
          pk.table_schema as referenced_schema,
          pk.table_name as referenced_table,
          pk.column_name as referenced_column
        from information_schema.referential_constraints rc
        join information_schema.key_column_usage kcu
          on rc.constraint_schema = kcu.constraint_schema
         and rc.constraint_name = kcu.constraint_name
        join information_schema.key_column_usage pk
          on rc.unique_constraint_schema = pk.constraint_schema
         and rc.unique_constraint_name = pk.constraint_name
         and kcu.ordinal_position = pk.ordinal_position
        where kcu.table_schema in (${schemaList})
          and kcu.table_name in (${tableList})
      `)
      for (const row of fkResult.recordset) {
        if (!allowed.has(`${row.table_schema}.${row.table_name}`)) continue
        foreignKeys.push([
          columnKey(row.table_schema, row.table_name, row.column_name),
          `${row.referenced_schema}.${row.referenced_table}.${row.referenced_column}`,
        ])
      }

      const commentResult = await pool.request().query<{
        table_schema: string
        table_name: string
        column_name: string
        description: string | null
      }>(`
        select
          s.name as table_schema,
          t.name as table_name,
          c.name as column_name,
          cast(ep.value as nvarchar(400)) as description
        from sys.columns c
        join sys.objects t on t.object_id = c.object_id
        join sys.schemas s on s.schema_id = t.schema_id
        left join sys.extended_properties ep
          on ep.major_id = c.object_id
         and ep.minor_id = c.column_id
         and ep.name = N'MS_Description'
        where s.name in (${schemaList})
          and t.name in (${tableList})
          and ep.value is not null
      `)
      for (const row of commentResult.recordset) {
        if (!row.description || !allowed.has(`${row.table_schema}.${row.table_name}`)) continue
        comments.push([
          columnKey(row.table_schema, row.table_name, row.column_name),
          row.description,
        ])
      }
    } catch (error) {
      console.warn('[data-sources/sqlserver] metadados de pk/fk/comentário indisponíveis', error)
    }

    return toDataSourceColumns(
      filtered.map(row => ({
        schema: row.table_schema,
        table: row.table_name,
        column: row.column_name,
        dataType: row.data_type,
        nullable: row.is_nullable === 'YES',
      })),
      { primaryKeys, foreignKeys, comments }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new DataSourceConnectionError(`Não foi possível ler colunas do SQL Server: ${message}`)
  } finally {
    await pool.close().catch(() => undefined)
  }
}

export const SQL_SERVER_CATALOG_SQL = `SELECT
  s.name AS table_schema,
  o.name AS table_name,
  CASE o.type WHEN 'U' THEN 'BASE TABLE' WHEN 'V' THEN 'VIEW' ELSE o.type END AS table_type,
  CAST(p.value AS nvarchar(400)) AS description
FROM sys.objects o
INNER JOIN sys.schemas s ON s.schema_id = o.schema_id
LEFT JOIN sys.extended_properties p
  ON p.major_id = o.object_id AND p.minor_id = 0 AND p.name = N'MS_Description'
WHERE o.type IN ('U', 'V')
ORDER BY s.name, o.name`

export async function listSqlServerCatalog(
  config: SqlServerDataSourceConfig
): Promise<Record<string, unknown>[]> {
  return executeSqlServerReadOnly(config, SQL_SERVER_CATALOG_SQL)
}

export async function executeSqlServerReadOnly(
  config: SqlServerDataSourceConfig,
  sqlText: string
): Promise<Record<string, unknown>[]> {
  const pool = new sql.ConnectionPool(poolConfig(config))
  try {
    await pool.connect()
    await pool.request().batch('set transaction isolation level read uncommitted')
    const result = await pool.request().query(sqlText)
    return (result.recordset ?? []) as Record<string, unknown>[]
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new DataSourceConnectionError(`Consulta SQL Server falhou: ${message}`)
  } finally {
    await pool.close().catch(() => undefined)
  }
}
