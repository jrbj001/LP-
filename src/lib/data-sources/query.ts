import type { DataSourceCatalogEntry } from './types'

const FORBIDDEN =
  /\b(insert|update|delete|merge|drop|alter|truncate|grant|revoke|copy|create|comment|do\s|call|execute|vacuum|lock|notify|listen|set\s|reset|security|into\s+outfile|dblink|set_config)\b/i

/** Views de catálogo somente-leitura — listar tabelas, colunas e descrições. */
const CATALOG_RELATIONS = new Set([
  'information_schema.tables',
  'information_schema.columns',
  'information_schema.views',
  'information_schema.schemata',
  'sys.tables',
  'sys.views',
  'sys.schemas',
  'sys.columns',
  'sys.objects',
  'sys.extended_properties',
])

const USER_ROW_CAP = 100
const CATALOG_ROW_CAP = 500

function identifier(value: string): string {
  return value.replace(/\s+/g, '').replaceAll('"', '').replaceAll('[', '').replaceAll(']', '').toLowerCase()
}

export function isCatalogQuestion(question: string): boolean {
  return /information_schema|sys\.(tables|views|objects)|quais (s[aã]o )?as tabelas|nome e (a )?descri|listar (as )?tabelas|todas as tabelas|cada tabela|cat[aá]logo (do banco|das tabelas)|tabelas que (temos|existem|h[aá])/i.test(
    question
  )
}

export function isCatalogRelation(reference: string): boolean {
  const normalized = identifier(reference)
  if (CATALOG_RELATIONS.has(normalized)) return true
  const parts = normalized.split('.')
  for (let index = 0; index < parts.length - 1; index += 1) {
    if (CATALOG_RELATIONS.has(`${parts[index]}.${parts[index + 1]}`)) return true
  }
  return false
}

export function assertExternalReadOnlySelect(
  draft: string,
  allowedEntries: DataSourceCatalogEntry[],
  dialect: 'postgresql' | 'sqlserver' = 'postgresql'
): string {
  const stripped = draft
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
    .replace(/;+\s*$/, '')

  if (!stripped) throw new Error('Consulta vazia.')
  if (stripped.includes(';')) throw new Error('Apenas um statement SELECT é permitido.')
  if (!/^select\b/i.test(stripped)) throw new Error('Somente SELECT é permitido.')
  if (FORBIDDEN.test(stripped)) throw new Error('A consulta contém um comando não permitido.')
  if (/\b(?:pg|lo)_[a-z0-9_]+\s*\(/i.test(stripped)) {
    throw new Error('Funções internas do PostgreSQL não são permitidas.')
  }
  if (/\b(?:from|join)\s*\(/i.test(stripped)) {
    throw new Error('Subconsultas em FROM/JOIN não são permitidas.')
  }

  const references = [
    ...stripped.matchAll(
      /\b(?:from|join)\s+((?:\[[^\]]+\]|"[^"]+"|[a-z_][a-z0-9_$]*)(?:\s*\.\s*(?:\[[^\]]+\]|"[^"]+"|[a-z_][a-z0-9_$]*)){0,2})/gi
    ),
  ].map(match => identifier(match[1]))
  if (references.length === 0) throw new Error('A consulta precisa ler uma tabela.')

  const qualified = new Set(
    allowedEntries.map(entry => `${entry.schema}.${entry.table}`.toLowerCase())
  )
  const byTable = new Map<string, string[]>()
  for (const entry of allowedEntries) {
    const table = entry.table.toLowerCase()
    byTable.set(table, [...(byTable.get(table) ?? []), `${entry.schema}.${entry.table}`.toLowerCase()])
  }

  for (const reference of references) {
    const permitted = isCatalogRelation(reference)
      ? true
      : reference.includes('.')
        ? qualified.has(reference)
        : (byTable.get(reference)?.length ?? 0) === 1
    if (!permitted) throw new Error(`Tabela não permitida ou ambígua: ${reference}.`)
  }

  const catalogOnly = references.every(isCatalogRelation)
  const cap = catalogOnly ? CATALOG_ROW_CAP : USER_ROW_CAP

  if (dialect === 'sqlserver') {
    if (/\btop\s+(\d+)/i.test(stripped)) {
      return stripped.replace(/\btop\s+\d+/i, match => {
        const n = Number(match.replace(/\D/g, ''))
        return `TOP ${Math.min(n || cap, cap)}`
      })
    }
    return stripped.replace(/^select\b/i, `SELECT TOP ${cap}`)
  }

  const limit = stripped.match(/\blimit\s+(\d+)/i)
  if (limit && Number(limit[1]) > cap) {
    return stripped.replace(/\blimit\s+\d+/i, `LIMIT ${cap}`)
  }
  return limit ? stripped : `${stripped} LIMIT ${cap}`
}
