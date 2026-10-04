import 'server-only'

import { getDb } from '@/lib/postgres'
import type { DataModelAi, DataModelSnapshot, StoredDataModel } from './types'

interface DataModelRow {
  source_id: string
  client_id: string
  snapshot: DataModelSnapshot | string
  ai: DataModelAi | string | null
  generated_at: Date | string
  ai_generated_at: Date | string | null
}

let ensureTablePromise: Promise<void> | null = null

export async function ensureDataModelsTable(): Promise<void> {
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      const sql = getDb()
      await sql`
        create table if not exists data_source_models (
          source_id text primary key,
          client_id text not null,
          snapshot jsonb not null,
          ai jsonb,
          generated_at timestamptz not null default now(),
          ai_generated_at timestamptz
        )
      `
      await sql`
        create index if not exists data_source_models_client_id_idx
          on data_source_models (client_id)
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

function parseJson<T>(value: T | string): T {
  return typeof value === 'string' ? (JSON.parse(value) as T) : value
}

function toStored(row: DataModelRow): StoredDataModel {
  return {
    sourceId: row.source_id,
    clientId: row.client_id,
    snapshot: parseJson(row.snapshot),
    ai: row.ai ? parseJson(row.ai) : null,
    generatedAt: iso(row.generated_at),
    aiGeneratedAt: row.ai_generated_at ? iso(row.ai_generated_at) : null,
  }
}

export async function getDataModel(
  clientId: string,
  sourceId: string
): Promise<StoredDataModel | null> {
  await ensureDataModelsTable()
  const sql = getDb()
  const rows = await sql<DataModelRow[]>`
    select *
    from data_source_models
    where client_id = ${clientId} and source_id = ${sourceId}
    limit 1
  `
  return rows[0] ? toStored(rows[0]) : null
}

export async function saveDataModelSnapshot(
  clientId: string,
  sourceId: string,
  snapshot: DataModelSnapshot
): Promise<StoredDataModel> {
  await ensureDataModelsTable()
  const sql = getDb()
  const serialized = JSON.stringify(snapshot)
  const rows = await sql<DataModelRow[]>`
    insert into data_source_models (source_id, client_id, snapshot, generated_at)
    values (${sourceId}, ${clientId}, ${serialized}::jsonb, now())
    on conflict (source_id) do update
      set client_id = excluded.client_id,
          snapshot = excluded.snapshot,
          generated_at = now()
    returning *
  `
  return toStored(rows[0])
}

export async function saveDataModelAi(
  clientId: string,
  sourceId: string,
  ai: DataModelAi
): Promise<StoredDataModel | null> {
  await ensureDataModelsTable()
  const sql = getDb()
  const serialized = JSON.stringify(ai)
  const rows = await sql<DataModelRow[]>`
    update data_source_models
    set ai = ${serialized}::jsonb,
        ai_generated_at = now()
    where client_id = ${clientId} and source_id = ${sourceId}
    returning *
  `
  return rows[0] ? toStored(rows[0]) : null
}

export async function deleteDataModel(clientId: string, sourceId: string): Promise<void> {
  await ensureDataModelsTable()
  const sql = getDb()
  await sql`
    delete from data_source_models
    where client_id = ${clientId} and source_id = ${sourceId}
  `
}
