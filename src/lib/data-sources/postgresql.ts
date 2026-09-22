import 'server-only'

import postgres from 'postgres'
import { columnKey, toDataSourceColumns } from './catalog-columns'
import type {
  DataSourceCatalog,
  DataSourceCatalogEntry,
  DataSourceColumn,
  PostgresDataSourceConfig,
} from './types'

interface DiscoveryRow {
  schema_name: string
  table_name: string
  relation_kind: 'r' | 'p' | 'v' | 'm' | 'f'
}

export class DataSourceConnectionError extends Error {
  constructor(message?: string) {
    super(message || 'Não foi possível conectar ou consultar o catálogo da fonte PostgreSQL.')
  }
}

function describeConnectionError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error)
  const text = raw.toLowerCase()
  if (text.includes('password authentication failed') || text.includes('28p01')) {
    return 'Autenticação recusada: usuário ou senha inválidos.'
  }
  if (text.includes('does not exist') && text.includes('database')) {
    return 'O banco informado não existe neste host.'
  }
  if (text.includes('self-signed') || text.includes('unable to verify') || text.includes('cert')) {
    return 'Falha no certificado SSL. Tente SSL "Preferir" ou "Desabilitado" se o servidor não usar um certificado confiável.'
  }
  if (text.includes('does not support ssl')) {
    return 'Este PostgreSQL não aceita SSL. Use o modo "Desabilitado".'
  }
  if (text.includes('enotfound') || text.includes('getaddrinfo')) {
    return `Host não encontrado: ${raw}`
  }
  if (text.includes('econnrefused')) {
    return 'Conexão recusada. Confira host, porta e se o PostgreSQL aceita conexões remotas.'
  }
  if (text.includes('etimedout') || text.includes('timeout') || text.includes('connect_timeout')) {
    return 'Tempo esgotado ao conectar. Confira host/porta, firewall e se o IP desta máquina está liberado.'
  }
  if (text.includes('ehostunreach') || text.includes('enetunreach')) {
    return 'O host está inacessível a partir desta máquina.'
  }
  return `Não foi possível conectar ao PostgreSQL: ${raw.replace(/password=[^&\s]+/gi, 'password=***')}`
}

function sslOption(mode: PostgresDataSourceConfig['sslMode']) {
  if (mode === 'disable') return false
  return { rejectUnauthorized: false }
}

function relationType(
  kind: DiscoveryRow['relation_kind']
): DataSourceCatalogEntry['type'] {
  if (kind === 'v') return 'view'
  if (kind === 'm') return 'materialized_view'
  if (kind === 'f') return 'foreign_table'
  return 'table'
}

function postgresClient(config: PostgresDataSourceConfig) {
  return postgres({
    host: config.host.replace(/^https?:\/\//, ''),
    port: config.port,
    database: config.database,
    username: config.username,
    password: config.password,
    ssl: sslOption(config.sslMode),
    max: 1,
    connect_timeout: 15,
    idle_timeout: 5,
    prepare: false,
    onnotice: () => undefined,
    connection: {
      application_name: 'lp-external-data-source',
      statement_timeout: 10000,
      lock_timeout: 3000,
      idle_in_transaction_session_timeout: 5000,
    },
  })
}

export async function testPostgresConnection(
  config: PostgresDataSourceConfig
): Promise<DataSourceCatalog> {
  const sql = postgresClient(config)

  try {
    await sql`select 1`

    let rows: DiscoveryRow[]
    if (config.schemas?.length) {
      rows = await sql<DiscoveryRow[]>`
        select
          namespace.nspname as schema_name,
          relation.relname as table_name,
          relation.relkind as relation_kind
        from pg_catalog.pg_class relation
        join pg_catalog.pg_namespace namespace
          on namespace.oid = relation.relnamespace
        where relation.relkind in ('r', 'p', 'v', 'm', 'f')
          and namespace.nspname = any(${config.schemas})
        order by namespace.nspname, relation.relname
      `
    } else {
      rows = await sql<DiscoveryRow[]>`
        select
          namespace.nspname as schema_name,
          relation.relname as table_name,
          relation.relkind as relation_kind
        from pg_catalog.pg_class relation
        join pg_catalog.pg_namespace namespace
          on namespace.oid = relation.relnamespace
        where relation.relkind in ('r', 'p', 'v', 'm', 'f')
          and namespace.nspname <> 'information_schema'
          and namespace.nspname not like 'pg\_%' escape '\'
        order by namespace.nspname, relation.relname
      `
    }

    const entries = rows.map(row => ({
      schema: row.schema_name,
      table: row.table_name,
      type: relationType(row.relation_kind),
    }))

    return {
      entries,
      count: entries.length,
      discoveredAt: new Date().toISOString(),
    }
  } catch (error) {
    const described = describeConnectionError(error)
    console.error('[data-sources/postgres]', described)
    throw new DataSourceConnectionError(described)
  } finally {
    await sql.end({ timeout: 2 })
  }
}

export const discoverPostgresCatalog = testPostgresConnection

export async function describePostgresTables(
  config: PostgresDataSourceConfig,
  entries: DataSourceCatalogEntry[]
): Promise<DataSourceColumn[]> {
  if (entries.length === 0) return []
  const sql = postgresClient(config)
  const schemas = [...new Set(entries.map(entry => entry.schema))]
  const tables = [...new Set(entries.map(entry => entry.table))]
  const allowed = new Set(entries.map(entry => `${entry.schema}.${entry.table}`))

  try {
    const rows = await sql<
      Array<{
        table_schema: string
        table_name: string
        column_name: string
        data_type: string
        is_nullable: 'YES' | 'NO'
      }>
    >`
      select table_schema, table_name, column_name, data_type, is_nullable
      from information_schema.columns
      where table_schema = any(${schemas})
        and table_name = any(${tables})
      order by table_schema, table_name, ordinal_position
    `
    const filtered = rows.filter(row => allowed.has(`${row.table_schema}.${row.table_name}`))

    const primaryKeys = new Set<string>()
    const foreignKeys: Array<readonly [string, string]> = []
    const comments: Array<readonly [string, string]> = []

    try {
      const pkRows = await sql<
        Array<{ table_schema: string; table_name: string; column_name: string }>
      >`
        select kcu.table_schema, kcu.table_name, kcu.column_name
        from information_schema.table_constraints tc
        join information_schema.key_column_usage kcu
          on tc.constraint_schema = kcu.constraint_schema
         and tc.constraint_name = kcu.constraint_name
        where tc.constraint_type = 'PRIMARY KEY'
          and kcu.table_schema = any(${schemas})
          and kcu.table_name = any(${tables})
      `
      for (const row of pkRows) {
        if (!allowed.has(`${row.table_schema}.${row.table_name}`)) continue
        primaryKeys.add(columnKey(row.table_schema, row.table_name, row.column_name))
      }

      const fkRows = await sql<
        Array<{
          table_schema: string
          table_name: string
          column_name: string
          referenced_schema: string
          referenced_table: string
          referenced_column: string
        }>
      >`
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
        where kcu.table_schema = any(${schemas})
          and kcu.table_name = any(${tables})
      `
      for (const row of fkRows) {
        if (!allowed.has(`${row.table_schema}.${row.table_name}`)) continue
        foreignKeys.push([
          columnKey(row.table_schema, row.table_name, row.column_name),
          `${row.referenced_schema}.${row.referenced_table}.${row.referenced_column}`,
        ])
      }

      const commentRows = await sql<
        Array<{
          table_schema: string
          table_name: string
          column_name: string
          description: string | null
        }>
      >`
        select n.nspname as table_schema, c.relname as table_name, a.attname as column_name, d.description
        from pg_catalog.pg_description d
        join pg_catalog.pg_class c on c.oid = d.objoid
        join pg_catalog.pg_namespace n on n.oid = c.relnamespace
        join pg_catalog.pg_attribute a on a.attrelid = c.oid and a.attnum = d.objsubid
        where d.objsubid > 0
          and n.nspname = any(${schemas})
          and c.relname = any(${tables})
      `
      for (const row of commentRows) {
        if (!row.description || !allowed.has(`${row.table_schema}.${row.table_name}`)) continue
        comments.push([
          columnKey(row.table_schema, row.table_name, row.column_name),
          row.description,
        ])
      }
    } catch (error) {
      console.warn('[data-sources/postgres] metadados de pk/fk/comentário indisponíveis', error)
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
    throw new DataSourceConnectionError(describeConnectionError(error))
  } finally {
    await sql.end({ timeout: 2 })
  }
}

export const POSTGRES_CATALOG_SQL = `SELECT
  t.table_schema,
  t.table_name,
  t.table_type,
  obj_description(
    (quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass,
    'pg_class'
  ) AS description
FROM information_schema.tables t
WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog')
  AND t.table_type IN ('BASE TABLE', 'VIEW')
ORDER BY t.table_schema, t.table_name
LIMIT 500`

export async function listPostgresCatalog(
  config: PostgresDataSourceConfig
): Promise<Record<string, unknown>[]> {
  return executePostgresReadOnly(config, POSTGRES_CATALOG_SQL)
}

export async function executePostgresReadOnly(
  config: PostgresDataSourceConfig,
  sqlText: string
): Promise<Record<string, unknown>[]> {
  const sql = postgresClient(config)
  try {
    const rows = await sql.begin(async transaction => {
      await transaction.unsafe('set transaction read only')
      await transaction.unsafe(`set local statement_timeout = '10000ms'`)
      return transaction.unsafe(sqlText)
    })
    return rows as Record<string, unknown>[]
  } catch (error) {
    throw new DataSourceConnectionError(describeConnectionError(error))
  } finally {
    await sql.end({ timeout: 2 })
  }
}
