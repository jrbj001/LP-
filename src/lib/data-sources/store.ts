import 'server-only'

import { randomUUID } from 'node:crypto'
import { getDb } from '@/lib/postgres'
import type {
  DataSourceCatalog,
  DataSourceMetadata,
  StoredDataSource,
} from './types'

interface DataSourceRow {
  id: string
  client_id: string
  name: string
  kind: 'postgresql' | 'sqlserver'
  encrypted_config: string
  enabled: boolean
  catalog: DataSourceCatalog | string
  last_tested_at: Date | string | null
  created_at: Date | string
  updated_at: Date | string
  seed_key?: string | null
}

let ensureTablePromise: Promise<void> | null = null

export async function ensureDataSourcesTable(): Promise<void> {
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      const sql = getDb()
      await sql`
        create table if not exists data_sources (
          id text primary key,
          client_id text not null,
          name text not null,
          kind text not null default 'postgresql',
          encrypted_config text not null,
          enabled boolean not null default true,
          catalog jsonb not null,
          last_tested_at timestamptz,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          seed_key text
        )
      `
      await sql`
        alter table data_sources
          add column if not exists seed_key text
      `
      await sql`
        alter table data_sources
          drop constraint if exists data_sources_kind_check
      `
      await sql`
        alter table data_sources
          add constraint data_sources_kind_check
          check (kind in ('postgresql', 'sqlserver'))
      `
      await sql`
        create index if not exists data_sources_client_id_idx
          on data_sources (client_id)
      `
      await sql`
        create unique index if not exists data_sources_seed_key_idx
          on data_sources (client_id, seed_key)
          where seed_key is not null
      `
    })().catch(error => {
      ensureTablePromise = null
      throw error
    })
  }
  await ensureTablePromise
}

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

function parseCatalog(value: DataSourceRow['catalog']): DataSourceCatalog {
  return typeof value === 'string'
    ? (JSON.parse(value) as DataSourceCatalog)
    : value
}

function toStored(row: DataSourceRow): StoredDataSource {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    kind: row.kind,
    encryptedConfig: row.encrypted_config,
    enabled: row.enabled,
    catalog: parseCatalog(row.catalog),
    lastTestedAt: row.last_tested_at ? iso(row.last_tested_at) : null,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  }
}

export function toDataSourceMetadata(
  source: StoredDataSource
): DataSourceMetadata {
  const { encryptedConfig: _encryptedConfig, ...metadata } = source
  return metadata
}

export async function listDataSources(
  clientId: string
): Promise<DataSourceMetadata[]> {
  await ensureDataSourcesTable()
  const sql = getDb()
  const rows = await sql<DataSourceRow[]>`
    select *
    from data_sources
    where client_id = ${clientId}
    order by created_at desc
  `
  return rows.map(row => toDataSourceMetadata(toStored(row)))
}

export async function getStoredDataSource(
  clientId: string,
  sourceId: string
): Promise<StoredDataSource | null> {
  await ensureDataSourcesTable()
  const sql = getDb()
  const rows = await sql<DataSourceRow[]>`
    select *
    from data_sources
    where client_id = ${clientId} and id = ${sourceId}
    limit 1
  `
  return rows[0] ? toStored(rows[0]) : null
}

export async function upsertSeededDataSource(params: {
  clientId: string
  seedKey: string
  name: string
  kind: StoredDataSource['kind']
  encryptedConfig: string
  catalog: DataSourceCatalog
}): Promise<DataSourceMetadata> {
  await ensureDataSourcesTable()
  const sql = getDb()
  const catalog = JSON.stringify(params.catalog)
  const existing = await sql<DataSourceRow[]>`
    select *
    from data_sources
    where client_id = ${params.clientId} and seed_key = ${params.seedKey}
    limit 1
  `
  const rows = existing[0]
    ? await sql<DataSourceRow[]>`
        update data_sources
        set name = ${params.name},
            kind = ${params.kind},
            encrypted_config = ${params.encryptedConfig},
            catalog = ${catalog}::jsonb,
            last_tested_at = now(),
            updated_at = now(),
            enabled = true
        where client_id = ${params.clientId} and seed_key = ${params.seedKey}
        returning *
      `
    : await sql<DataSourceRow[]>`
        insert into data_sources (
          id, client_id, name, kind, encrypted_config, enabled, catalog,
          last_tested_at, created_at, updated_at, seed_key
        )
        values (
          ${randomUUID()}, ${params.clientId}, ${params.name}, ${params.kind},
          ${params.encryptedConfig}, true, ${catalog}::jsonb,
          now(), now(), now(), ${params.seedKey}
        )
        returning *
      `
  return toDataSourceMetadata(toStored(rows[0]))
}

export async function createDataSource(params: {
  clientId: string
  name: string
  encryptedConfig: string
  enabled: boolean
  catalog: DataSourceCatalog
}): Promise<DataSourceMetadata> {
  await ensureDataSourcesTable()
  const sql = getDb()
  const id = randomUUID()
  const catalog = JSON.stringify(params.catalog)
  const rows = await sql<DataSourceRow[]>`
    insert into data_sources (
      id, client_id, name, kind, encrypted_config, enabled, catalog,
      last_tested_at, created_at, updated_at
    )
    values (
      ${id}, ${params.clientId}, ${params.name}, 'postgresql',
      ${params.encryptedConfig}, ${params.enabled}, ${catalog}::jsonb,
      now(), now(), now()
    )
    returning *
  `
  return toDataSourceMetadata(toStored(rows[0]))
}

export async function updateDataSourceCatalog(
  clientId: string,
  sourceId: string,
  catalog: DataSourceCatalog
): Promise<DataSourceMetadata | null> {
  await ensureDataSourcesTable()
  const sql = getDb()
  const serializedCatalog = JSON.stringify(catalog)
  const rows = await sql<DataSourceRow[]>`
    update data_sources
    set catalog = ${serializedCatalog}::jsonb,
        last_tested_at = now(),
        updated_at = now()
    where client_id = ${clientId} and id = ${sourceId}
    returning *
  `
  return rows[0] ? toDataSourceMetadata(toStored(rows[0])) : null
}

export async function deleteDataSource(
  clientId: string,
  sourceId: string
): Promise<boolean> {
  await ensureDataSourcesTable()
  const sql = getDb()
  const rows = await sql<{ id: string }[]>`
    delete from data_sources
    where client_id = ${clientId} and id = ${sourceId}
    returning id
  `
  return rows.length > 0
}
