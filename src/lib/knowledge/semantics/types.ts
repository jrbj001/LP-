import type { DataSourceCatalogEntry } from '@/lib/data-sources/types'
import { KNOWLEDGE_TIME_ZONE } from '../intent'

export type SemanticSourceId = 'likeme' | 'be180-colmeia' | 'be180-ativos'

export interface SemanticTableRef {
  schema?: string
  table: RegExp
  required?: boolean
}

export interface SemanticMetric {
  id: string
  label: string
  match: RegExp
  canonical: SemanticTableRef[]
  forbid: SemanticTableRef[]
  defaultFilters: string[]
  timeColumnHint?: string
  joins: string[]
  notes: string[]
}

export interface SemanticPack {
  id: SemanticSourceId
  matchSource: (sourceName: string) => boolean
  timeZone: string
  metrics: SemanticMetric[]
}

export const SEMANTIC_TIME_ZONE = KNOWLEDGE_TIME_ZONE

export function tableKey(entry: Pick<DataSourceCatalogEntry, 'schema' | 'table'>): string {
  return `${entry.schema}.${entry.table}`.toLowerCase()
}

export function matchesTableRef(
  entry: DataSourceCatalogEntry,
  ref: SemanticTableRef
): boolean {
  if (ref.schema && entry.schema.toLowerCase() !== ref.schema.toLowerCase()) return false
  return ref.table.test(entry.table)
}

export function findCatalogMatches(
  catalog: DataSourceCatalogEntry[],
  refs: SemanticTableRef[]
): DataSourceCatalogEntry[] {
  const found: DataSourceCatalogEntry[] = []
  const seen = new Set<string>()
  for (const ref of refs) {
    for (const entry of catalog) {
      const key = tableKey(entry)
      if (seen.has(key) || !matchesTableRef(entry, ref)) continue
      seen.add(key)
      found.push(entry)
    }
  }
  return found
}
