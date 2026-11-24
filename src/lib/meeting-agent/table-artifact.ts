import type { MeetingTableArtifact } from './types'

/** Até este tamanho a resposta mostra a grade. Acima disso, vai um CSV. */
export const GRID_ROW_LIMIT = 12

function cell(value: unknown): string {
  if (value == null) return ''
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function csvCell(value: unknown): string {
  const text = cell(value)
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export function rowsToCsv(columns: string[], rows: Record<string, unknown>[]): string {
  const header = columns.map(csvCell).join(',')
  const body = rows.map(row => columns.map(column => csvCell(row[column])).join(','))
  return [header, ...body].join('\n')
}

export function buildTableArtifact(input: {
  sourceName: string
  columns: string[]
  rows: Record<string, unknown>[]
}): MeetingTableArtifact | null {
  if (input.rows.length === 0 || input.columns.length === 0) return null
  const base = {
    sourceName: input.sourceName,
    columns: input.columns,
    rowCount: input.rows.length,
  }
  if (input.rows.length <= GRID_ROW_LIMIT) {
    return { ...base, kind: 'grid', rows: input.rows }
  }
  return { ...base, kind: 'csv', csv: rowsToCsv(input.columns, input.rows) }
}

/** Tabela em texto para o chat da call, que só aceita texto. */
export function formatGridForChat(artifact: MeetingTableArtifact): string {
  if (artifact.kind !== 'grid') return ''
  const header = artifact.columns.join(' | ')
  const lines = (artifact.rows ?? []).map(row => artifact.columns.map(column => cell(row[column])).join(' | '))
  return [artifact.sourceName, header, ...lines].join('\n')
}
