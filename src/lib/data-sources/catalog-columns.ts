import type { DataSourceColumn } from './types'

export function columnKey(schema: string, table: string, column: string): string {
  return `${schema}.${table}.${column}`.toLowerCase()
}

export function toDataSourceColumns(
  rows: Array<{
    schema: string
    table: string
    column: string
    dataType: string
    nullable: boolean
  }>,
  extras?: {
    primaryKeys?: Iterable<string>
    foreignKeys?: Iterable<readonly [string, string]>
    comments?: Iterable<readonly [string, string]>
  }
): DataSourceColumn[] {
  const primaryKeys = new Set(
    [...(extras?.primaryKeys ?? [])].map(value => value.toLowerCase())
  )
  const foreignKeys = new Map(
    [...(extras?.foreignKeys ?? [])].map(([key, value]) => [key.toLowerCase(), value] as const)
  )
  const comments = new Map(
    [...(extras?.comments ?? [])].map(([key, value]) => [key.toLowerCase(), value] as const)
  )

  return rows.map(row => {
    const key = columnKey(row.schema, row.table, row.column)
    const comment = comments.get(key)?.trim()
    return {
      schema: row.schema,
      table: row.table,
      column: row.column,
      dataType: row.dataType,
      nullable: row.nullable,
      primaryKey: primaryKeys.has(key),
      foreignKey: foreignKeys.get(key) ?? null,
      comment: comment || null,
    }
  })
}
