export interface SchemaPromptEntry {
  schema: string
  table: string
}

export interface SchemaPromptColumn {
  schema: string
  table: string
  column: string
  dataType: string
  nullable: boolean
  primaryKey?: boolean
  foreignKey?: string | null
  comment?: string | null
}

export function formatColumnForPrompt(column: SchemaPromptColumn): string {
  const flags = [
    column.nullable ? '' : 'not null',
    column.primaryKey ? 'pk' : '',
    column.foreignKey ? `fk ${column.foreignKey}` : '',
  ].filter(Boolean)
  const comment = column.comment?.trim().replace(/\s+/g, ' ').slice(0, 160)
  return `${column.column} ${column.dataType}${flags.length ? ` ${flags.join(' ')}` : ''}${
    comment ? ` -- ${comment}` : ''
  }`
}

export function schemaForPrompt(
  entries: SchemaPromptEntry[],
  columns: SchemaPromptColumn[]
): string {
  return entries
    .map(entry => {
      const fields = columns
        .filter(column => column.schema === entry.schema && column.table === entry.table)
        .map(formatColumnForPrompt)
      return `${entry.schema}.${entry.table}(\n  ${fields.join(',\n  ')}\n)`
    })
    .join('\n\n')
}
