import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'

export type ResultCriticIssueCode =
  | 'empty_result'
  | 'empty_with_filter'
  | 'join_cardinality'
  | 'count_without_filter'
  | 'null_aggregation'
  | 'limit_saturated'
  | 'unrelated_columns'

export interface ResultCriticIssue {
  code: ResultCriticIssueCode
  message: string
  hypothesis: string
}

export interface QueryCritique {
  status: 'ok' | 'flagged'
  confidence: 'high' | 'inconclusive'
  issues: ResultCriticIssue[]
  conferenceQuestion: string | null
}

export interface CritiqueInput {
  question: string
  sql: string
  columns: string[]
  rows: Record<string, unknown>[]
  sourceName?: string
}

const FILTER_IN_QUESTION =
  /\b(ativo|inativo|publicado|pendente|status|hoje|ontem|semana|m[eê]s|ano|passad[oa]|[uú]ltim[oa]s?)\b/i
const COUNT_IN_QUESTION = /\b(quantos?|quantas|quantidade|total|n[uú]mero|contagem)\b/i
const COUNT_IN_SQL = /\b(count|sum|avg)\s*\(/i

function cellText(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

function isZeroish(value: unknown): boolean {
  if (value == null || value === '') return true
  if (typeof value === 'number') return value === 0
  if (typeof value === 'bigint') return value === BigInt(0)
  const text = cellText(value)
  return text !== '' && !Number.isNaN(Number(text)) && Number(text) === 0
}

function hasWhere(sql: string): boolean {
  return /\bwhere\b/i.test(sql)
}

function hasJoin(sql: string): boolean {
  return /\bjoin\b/i.test(sql) || /from\s+\S+\s*,\s*\S+/i.test(sql)
}

function hasAggregation(sql: string): boolean {
  return COUNT_IN_SQL.test(sql) || /\bgroup\s+by\b/i.test(sql) || /\bdistinct\b/i.test(sql)
}

function hitsRowCap(sql: string, rowCount: number): boolean {
  return rowCount >= 100 && /\b(limit\s+100|top\s+\(?100\)?)\b/i.test(sql)
}

function idColumn(columns: string[]): string | null {
  return (
    columns.find(column => /(^id$|_id$|uuid|codigo|code$)/i.test(column)) || columns[0] || null
  )
}

function distinctRatio(rows: Record<string, unknown>[], column: string): number {
  if (rows.length === 0) return 1
  const unique = new Set(rows.map(row => cellText(row[column]) || JSON.stringify(row[column])))
  return unique.size / rows.length
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(token => token.length >= 4)
}

export function critiqueQueryResult(input: CritiqueInput): QueryCritique {
  const issues: ResultCriticIssue[] = []
  const sql = input.sql.trim()
  const question = input.question.trim()
  let confidence: QueryCritique['confidence'] = 'high'
  let conferenceQuestion: string | null = null

  if (input.rows.length === 0) {
    if (hasWhere(sql)) {
      issues.push({
        code: 'empty_with_filter',
        message: 'A consulta não retornou linhas.',
        hypothesis:
          'O filtro ou o período pode ter zerado o resultado; isso não prova que a métrica sem recorte seja zero.',
      })
      conferenceQuestion = 'Quantos registros existem na mesma fonte sem aplicar esse filtro?'
    } else {
      issues.push({
        code: 'empty_result',
        message: 'A consulta não retornou linhas.',
        hypothesis: 'Pode não haver dados nesta tabela, ou a entidade consultada não é a canônica.',
      })
    }
  }

  if (
    input.rows.length === 1 &&
    input.columns.length > 0 &&
    input.columns.every(column => isZeroish(input.rows[0][column])) &&
    COUNT_IN_SQL.test(sql)
  ) {
    issues.push({
      code: 'null_aggregation',
      message: 'A agregação veio zerada.',
      hypothesis: hasWhere(sql)
        ? 'O recorte (filtro ou período) pode ter excluído todas as linhas da métrica pedida.'
        : 'A métrica canônica pode estar em outra tabela, ou a agregação não encontrou valores.',
    })
    if (!conferenceQuestion && hasWhere(sql)) {
      conferenceQuestion = 'Qual o total da mesma métrica sem este filtro?'
    }
  }

  if (COUNT_IN_QUESTION.test(question) && FILTER_IN_QUESTION.test(question) && COUNT_IN_SQL.test(sql) && !hasWhere(sql)) {
    issues.push({
      code: 'count_without_filter',
      message: 'A pergunta pedia um recorte, mas o COUNT não tem WHERE.',
      hypothesis: 'O número pode ser o total geral, não o subconjunto pedido.',
    })
    conferenceQuestion =
      conferenceQuestion ||
      'Qual o total aplicando o filtro ou o período que a pergunta citou?'
  }

  if (COUNT_IN_QUESTION.test(question) && hitsRowCap(sql, input.rows.length) && !COUNT_IN_SQL.test(sql)) {
    issues.push({
      code: 'limit_saturated',
      message: 'A pergunta pedia um total, mas a consulta listou até o limite de 100 linhas.',
      hypothesis: 'O número visível é o teto da listagem, não a contagem completa.',
    })
    conferenceQuestion = conferenceQuestion || 'Qual o COUNT(*) desta mesma consulta, sem listar linhas?'
  }

  if (hasJoin(sql) && input.rows.length >= 8 && !hasAggregation(sql)) {
    const column = idColumn(input.columns)
    const ratio = column ? distinctRatio(input.rows, column) : 1
    if (ratio < 0.5) {
      issues.push({
        code: 'join_cardinality',
        message: 'O JOIN parece duplicar a entidade pedida.',
        hypothesis:
          'A cardinalidade explodiu: o mesmo identificador aparece várias vezes. O total pode estar inflado.',
      })
      conferenceQuestion =
        conferenceQuestion || 'Qual o total distinto desta entidade, sem duplicar por JOIN?'
    } else if (ratio < 0.85) {
      confidence = 'inconclusive'
      issues.push({
        code: 'join_cardinality',
        message: 'O JOIN pode ter repetido algumas linhas.',
        hypothesis: 'Vale conferir um COUNT DISTINCT da chave antes de tratar o total como fato.',
      })
    }
  }

  const questionTokens = tokenize(question).filter(
    token => !['quantos', 'quantas', 'quais', 'lista', 'neste', 'dessa', 'desse', 'como'].includes(token)
  )
  const columnTokens = tokenize(input.columns.join(' '))
  if (
    input.rows.length > 0 &&
    questionTokens.length >= 2 &&
    columnTokens.length >= 2 &&
    !questionTokens.some(token => columnTokens.some(column => column.includes(token) || token.includes(column))) &&
    !COUNT_IN_SQL.test(sql)
  ) {
    issues.push({
      code: 'unrelated_columns',
      message: 'As colunas devolvidas não lembram o que a pergunta pediu.',
      hypothesis: 'A consulta pode ter lido a tabela errada ou projetado campos irrelevantes.',
    })
    confidence = issues.some(issue => issue.code !== 'unrelated_columns') ? confidence : 'inconclusive'
  }

  return {
    status: issues.length === 0 ? 'ok' : 'flagged',
    confidence: issues.length === 0 ? 'high' : confidence,
    issues,
    conferenceQuestion,
  }
}

export const PASSED_QUERY_CRITIQUE: QueryCritique = {
  status: 'ok',
  confidence: 'high',
  issues: [],
  conferenceQuestion: null,
}

export function formatCritiqueForPrompt(critique: QueryCritique): string {
  if (critique.issues.length === 0) {
    return 'O resultado passou nas checagens automáticas de vazio, JOIN e agregação.'
  }
  return critique.issues.map(issue => `${issue.message} Hipótese: ${issue.hypothesis}`).join(' ')
}

export function mergeConferenceSuggestions(
  suggestions: string[],
  conferenceQuestion: string | null
): string[] {
  const extra = conferenceQuestion?.trim()
  if (!extra || !extra.endsWith('?')) return suggestions.slice(0, 3)
  return [extra, ...suggestions.filter(item => item !== extra)].slice(0, 3)
}

export async function reviewQueryResult(input: CritiqueInput): Promise<QueryCritique> {
  const heuristic = critiqueQueryResult(input)
  if (heuristic.confidence !== 'inconclusive') return heuristic
  try {
    return await refineQueryCritiqueWithLlm(input, heuristic)
  } catch {
    return heuristic
  }
}

async function refineQueryCritiqueWithLlm(
  input: CritiqueInput,
  heuristic: QueryCritique
): Promise<QueryCritique> {
  const value = await callOpenAiJson(
    `Você audita se um resultado SQL responde a pergunta de negócio. Não invente números.
Use somente pergunta, SQL, colunas e amostra.
Retorne JSON:
{"ok":true|false,"hypothesis":"frase curta","conferenceQuestion":"pergunta?"|null}.
Se ok=false, conferenceQuestion deve ser uma pergunta executável terminada em "?".`,
    `Pergunta: ${input.question}
Fonte: ${input.sourceName || 'banco'}
SQL: ${input.sql}
Checagem automática: ${formatCritiqueForPrompt(heuristic)}
Colunas: ${input.columns.join(', ') || '(nenhuma)'}
Linhas: ${input.rows.length}
Amostra: ${JSON.stringify(input.rows.slice(0, 8))}`,
    { temperature: 0, maxTokens: 400, model: chatModel() }
  )
  if (!value || typeof value !== 'object') return heuristic
  const raw = value as Record<string, unknown>
  const hypothesis = typeof raw.hypothesis === 'string' ? raw.hypothesis.trim() : ''
  const conference =
    typeof raw.conferenceQuestion === 'string' && raw.conferenceQuestion.trim().endsWith('?')
      ? raw.conferenceQuestion.trim()
      : heuristic.conferenceQuestion
  if (raw.ok === true) {
    return { status: 'ok', confidence: 'high', issues: [], conferenceQuestion: null }
  }
  const issues =
    heuristic.issues.length > 0
      ? heuristic.issues.map(issue =>
          hypothesis ? { ...issue, hypothesis } : issue
        )
      : [
          {
            code: 'unrelated_columns' as const,
            message: 'O auditor não considerou o resultado confiável para a pergunta.',
            hypothesis: hypothesis || 'O SQL pode não medir o que foi pedido.',
          },
        ]
  return {
    status: 'flagged',
    confidence: 'high',
    issues,
    conferenceQuestion: conference,
  }
}
