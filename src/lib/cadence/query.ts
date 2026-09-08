import { CADENCE_TABLES } from './schema'

const ALLOWED_TABLES = new Set<string>(CADENCE_TABLES)

const FORBIDDEN =
  /\b(insert|update|delete|drop|alter|truncate|grant|revoke|copy|create|comment|do\s|call|execute|vacuum|lock|notify|listen|set\s|reset|security|into\s+outfile|pg_sleep|dblink)\b/i

export function assertReadOnlySelect(sql: string): string {
  const stripped = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
    .replace(/;+\s*$/, '')

  if (!stripped) throw new Error('Consulta vazia.')
  if (stripped.includes(';')) throw new Error('Apenas um statement SELECT é permitido.')
  if (!/^\s*select\b/i.test(stripped)) throw new Error('Somente SELECT é permitido.')
  if (FORBIDDEN.test(stripped)) throw new Error('A consulta contém um comando não permitido.')

  const tables = [...stripped.matchAll(/\b(?:from|join)\s+([a-z_][a-z0-9_]*)/gi)].map(match =>
    match[1].toLowerCase()
  )
  if (tables.length === 0) throw new Error('A consulta precisa ler uma tabela cadence_*.')
  for (const table of tables) {
    if (!ALLOWED_TABLES.has(table)) {
      throw new Error(`Tabela não permitida: ${table}. Use apenas cadence_*.`)
    }
  }

  const tenantFilter =
    /(?:\b[a-z_][a-z0-9_]*\.)?\bclient_id\s*=\s*\$1\b/i.test(stripped) ||
    /\$1\s*=\s*(?:\b[a-z_][a-z0-9_]*\.)?\bclient_id\b/i.test(stripped)
  if (!tenantFilter) {
    throw new Error('A consulta deve filtrar client_id = $1.')
  }

  const limited = /\blimit\s+\d+/i.test(stripped) ? stripped : `${stripped} LIMIT 100`
  return limited
}

export function inferChart(
  rows: Record<string, unknown>[]
): { labelKey: string; valueKey: string } | null {
  if (rows.length < 2) return null
  const keys = Object.keys(rows[0] ?? {})
  const labelKey = keys.find(key => typeof rows[0][key] === 'string')
  const valueKey = keys.find(key => {
    const value = rows[0][key]
    return typeof value === 'number' || (typeof value === 'string' && value !== '' && !Number.isNaN(Number(value)))
  })
  if (!labelKey || !valueKey || labelKey === valueKey) return null
  return { labelKey, valueKey }
}
