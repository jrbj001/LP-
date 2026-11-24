import type { DataModelAi } from './types'

/** Limite de caracteres da descrição de cada tabela enviada ao prompt. */
const TABLE_DESCRIPTION_MAX = 160
const OVERVIEW_MAX = 800
/** Quantas tabelas recebem descrição completa no prompt de seleção (o resto vai só pelo nome). */
export const DICTIONARY_DETAIL_LIMIT = 60

const STOP = new Set([
  'como', 'quero', 'para', 'que', 'com', 'sem', 'uma', 'um', 'de', 'da', 'do', 'das', 'dos',
  'no', 'na', 'em', 'ao', 'e', 'o', 'a', 'os', 'as', 'por', 'quais', 'quantos', 'quantas',
  'qual', 'quando', 'onde', 'todos', 'todas', 'ultimos', 'ultimas', 'dados', 'sobre',
])

function clip(value: string, max: number): string {
  const text = value.replace(/\s+/g, ' ').trim()
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
}

export function dictionaryKeywords(question: string): string[] {
  return [
    ...new Set(
      normalize(question)
        .split(/\s+/)
        .filter(token => token.length >= 4 && !STOP.has(token))
    ),
  ].slice(0, 12)
}

/**
 * Descrição curta de uma tabela do dicionário (descrição de negócio + colunas-chave).
 * Vazia quando o dicionário não descreve a tabela.
 */
export function describeTableForPrompt(ai: DataModelAi | null | undefined, key: string): string {
  const table = ai?.tables?.[key]
  if (!table) return ''
  const description = clip(table.description ?? '', TABLE_DESCRIPTION_MAX)
  const keyColumns = (table.keyColumns ?? []).slice(0, 6)
  return [description, keyColumns.length ? `colunas-chave: ${keyColumns.join(', ')}` : '']
    .filter(Boolean)
    .join(' · ')
}

/** Visão geral do dicionário (overview + domínios) para o planejador escolher a fonte certa. */
export function dictionaryOverviewForPrompt(ai: DataModelAi | null | undefined): string {
  if (!ai) return ''
  const domains = (ai.domains ?? []).map(domain => `${domain.name}: ${clip(domain.description ?? '', 160)}`)
  const text = [ai.overview ? clip(ai.overview, 300) : '', ...domains].filter(Boolean).join('; ')
  return clip(text, OVERVIEW_MAX)
}

/**
 * Tabelas (schema.table) cuja descrição no dicionário casa com as palavras da pergunta.
 * Usado para mandar descrição completa só para o subconjunto relevante do catálogo.
 */
export function dictionaryDetailKeys(
  question: string,
  entries: Array<{ schema: string; table: string }>,
  ai: DataModelAi | null | undefined,
  limit = DICTIONARY_DETAIL_LIMIT
): Set<string> {
  const keywords = dictionaryKeywords(question)
  if (!ai?.tables || keywords.length === 0) return new Set()
  return new Set(
    entries
      .map(entry => {
        const key = `${entry.schema}.${entry.table}`
        const table = ai.tables[key]
        if (!table) return { key, score: 0 }
        const haystack = normalize(
          [entry.table, table.description ?? '', ...(table.keyColumns ?? [])].join(' ')
        )
        const score = keywords.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0)
        return { key, score }
      })
      .filter(item => item.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, limit)
      .map(item => item.key)
  )
}
