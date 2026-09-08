import { callOpenAiText, chatModel } from '@/lib/backlog/llm'

const SAMPLE_ROWS = 24

function cellText(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value instanceof Date) return value.toISOString()
  return ''
}

function countBy(rows: Record<string, unknown>[], key: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const label = cellText(row[key]) || '(sem valor)'
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return counts
}

function formatCounts(counts: Map<string, number>): string {
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([label, total]) => `${label} (${total})`)
    .join(', ')
}

export function narrateCatalogRows(
  sourceName: string,
  rows: Record<string, unknown>[]
): string {
  if (rows.length === 0) {
    return `Não encontrei tabelas no catálogo de ${sourceName}.`
  }

  const schemas = countBy(rows, 'table_schema')
  const types = countBy(rows, 'table_type')
  const withDescription = rows.filter(row => Boolean(cellText(row.description))).length
  const typeLabel = formatCounts(types)
  const schemaLabel = formatCounts(schemas)
  const descriptionLabel =
    withDescription === 0
      ? 'Nenhuma tabela tem descrição cadastrada no banco (MS_Description ou comentário).'
      : withDescription === rows.length
        ? 'Todas as tabelas têm descrição no banco.'
        : `${withDescription} de ${rows.length} tabelas têm descrição; as demais não têm comentário no banco.`

  return [
    `No ${sourceName} há ${rows.length} objetos no catálogo: ${typeLabel}.`,
    `Distribuição por schema: ${schemaLabel}.`,
    `${descriptionLabel} A lista completa de nomes está na tabela abaixo.`,
  ].join(' ')
}

export function fallbackAnswer(input: {
  question: string
  explanation: string
  columns: string[]
  rows: Record<string, unknown>[]
}): string {
  if (input.rows.length === 0) {
    return `Não encontrei linhas para “${input.question}”.`
  }
  if (input.rows.length === 1 && input.columns.length > 0) {
    const facts = input.columns
      .map(column => `${column}: ${cellText(input.rows[0][column]) || '—'}`)
      .join('; ')
    return `Resultado: ${facts}.`
  }
  return input.explanation
    ? `${input.explanation} A consulta retornou ${input.rows.length} linhas.`
    : `A consulta retornou ${input.rows.length} linhas.`
}

export async function narrateQueryResult(input: {
  question: string
  sourceName?: string
  explanation: string
  columns: string[]
  rows: Record<string, unknown>[]
  catalog?: boolean
}): Promise<string> {
  if (input.catalog) {
    return narrateCatalogRows(input.sourceName || 'banco', input.rows)
  }

  const sample = input.rows.slice(0, SAMPLE_ROWS)
  try {
    return await callOpenAiText(
      `Você responde perguntas de negócio em português do Brasil.
Use somente os dados SQL fornecidos. Não invente números, nomes ou totais.
Se a lista for uma amostra, diga quantas linhas existem no total.
Responda em 2 a 5 frases, direto ao ponto, sem markdown e sem repetir o SQL.`,
      `Pergunta: ${input.question}
Fonte: ${input.sourceName || 'Workspace Cadence'}
Notas da consulta: ${input.explanation}
Colunas: ${input.columns.join(', ') || '(nenhuma)'}
Total de linhas: ${input.rows.length}
Amostra:
${JSON.stringify(sample)}`,
      { temperature: 0.2, maxTokens: 400, model: chatModel() }
    )
  } catch {
    return fallbackAnswer(input)
  }
}
