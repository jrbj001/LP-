import type { DataSourceCatalogEntry, DataSourceColumn } from '../types'
import {
  MAX_MODEL_TABLES,
  modelTableKey,
  type DataModelRelationship,
  type DataModelTable,
} from './types'

export interface TableStats {
  schema: string
  table: string
  estimatedRows: number | null
  sizeBytes: number | null
  lastAnalyzedAt: string | null
  description: string | null
}

export function limitEntries(entries: DataSourceCatalogEntry[]): {
  entries: DataSourceCatalogEntry[]
  truncated: boolean
} {
  if (entries.length <= MAX_MODEL_TABLES) return { entries, truncated: false }
  const tablesFirst = [...entries].sort((a, b) => {
    const weight = (entry: DataSourceCatalogEntry) => (entry.type === 'table' ? 0 : 1)
    return weight(a) - weight(b) || a.schema.localeCompare(b.schema) || a.table.localeCompare(b.table)
  })
  return { entries: tablesFirst.slice(0, MAX_MODEL_TABLES), truncated: true }
}

export function parseForeignKeyTarget(target: string): {
  schema: string
  table: string
  column: string
} | null {
  const parts = target.split('.')
  if (parts.length < 3) return null
  const column = parts.pop() as string
  const table = parts.pop() as string
  const schema = parts.join('.')
  if (!schema || !table || !column) return null
  return { schema, table, column }
}

export function assembleTables(
  entries: DataSourceCatalogEntry[],
  columns: DataSourceColumn[],
  stats: TableStats[]
): { tables: DataModelTable[]; relationships: DataModelRelationship[] } {
  const columnsByTable = new Map<string, DataSourceColumn[]>()
  for (const column of columns) {
    const key = `${column.schema}.${column.table}`
    const list = columnsByTable.get(key)
    if (list) list.push(column)
    else columnsByTable.set(key, [column])
  }
  const statsByTable = new Map(stats.map(stat => [`${stat.schema}.${stat.table}`, stat]))
  const known = new Set(entries.map(modelTableKey))

  const tables: DataModelTable[] = entries.map(entry => {
    const key = modelTableKey(entry)
    const tableColumns = columnsByTable.get(key) ?? []
    const stat = statsByTable.get(key)
    return {
      schema: entry.schema,
      table: entry.table,
      type: entry.type,
      description: stat?.description?.trim() || null,
      columns: tableColumns,
      estimatedRows: entry.type === 'table' ? (stat?.estimatedRows ?? null) : null,
      sizeBytes: stat?.sizeBytes ?? null,
      lastAnalyzedAt: stat?.lastAnalyzedAt ?? null,
      hasPrimaryKey: tableColumns.some(column => column.primaryKey),
    }
  })

  const relationships: DataModelRelationship[] = []
  const seen = new Set<string>()
  for (const column of columns) {
    if (!column.foreignKey) continue
    const target = parseForeignKeyTarget(column.foreignKey)
    if (!target) continue
    if (!known.has(`${target.schema}.${target.table}`)) continue
    const key = `${column.schema}.${column.table}.${column.column}->${column.foreignKey}`.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    relationships.push({
      from: { schema: column.schema, table: column.table, column: column.column },
      to: target,
    })
  }

  return { tables, relationships }
}
