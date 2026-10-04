import type { DataSourceCatalogEntry, DataSourceColumn, DataSourceKind } from '../types'

export type DataModelTableType = DataSourceCatalogEntry['type']

export interface DataModelTable {
  schema: string
  table: string
  type: DataModelTableType
  /** Comentário/descrição vinda do próprio banco (pg_description / MS_Description). */
  description: string | null
  columns: DataSourceColumn[]
  estimatedRows: number | null
  sizeBytes: number | null
  lastAnalyzedAt: string | null
  hasPrimaryKey: boolean
}

export interface DataModelColumnRef {
  schema: string
  table: string
  column: string
}

export interface DataModelRelationship {
  from: DataModelColumnRef
  to: DataModelColumnRef
}

export type HealthSeverity = 'ok' | 'info' | 'low' | 'medium' | 'high'

export interface HealthCheck {
  id: string
  label: string
  severity: HealthSeverity
  summary: string
  /** Chaves `schema.table` afetadas (limitadas a 50). */
  affected: string[]
  affectedCount: number
  /** Proporção 0–1 de itens afetados sobre o universo avaliado. */
  ratio: number
}

export interface DataModelHealth {
  score: number
  checks: HealthCheck[]
  computedAt: string
}

export interface DataModelSnapshot {
  sourceId: string
  sourceName: string
  kind: DataSourceKind
  generatedAt: string
  schemas: string[]
  tables: DataModelTable[]
  relationships: DataModelRelationship[]
  health: DataModelHealth
  /** Verdadeiro quando o limite de tabelas foi atingido e nem tudo foi modelado. */
  truncated: boolean
}

export interface DataModelAiTable {
  description: string
  purpose: string
  keyColumns: string[]
}

export interface DataModelAiDomain {
  name: string
  description: string
  tables: string[]
}

export interface DataModelAi {
  overview: string
  domains: DataModelAiDomain[]
  tables: Record<string, DataModelAiTable>
  risks: string[]
  suggestedQuestions: string[]
  generatedAt: string
}

export interface StoredDataModel {
  sourceId: string
  clientId: string
  snapshot: DataModelSnapshot
  ai: DataModelAi | null
  generatedAt: string
  aiGeneratedAt: string | null
}

export const MAX_MODEL_TABLES = 300

export function modelTableKey(entry: Pick<DataModelTable, 'schema' | 'table'>): string {
  return `${entry.schema}.${entry.table}`
}
