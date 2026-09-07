import 'server-only'

import postgres from 'postgres'
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
    return rows
      .filter(row => allowed.has(`${row.table_schema}.${row.table_name}`))
      .map(row => ({
        schema: row.table_schema,
        table: row.table_name,
        column: row.column_name,
        dataType: row.data_type,
        nullable: row.is_nullable === 'YES',
      }))
  } catch (error) {
    throw new DataSourceConnectionError(describeConnectionError(error))
  } finally {
    await sql.end({ timeout: 2 })
  }
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
