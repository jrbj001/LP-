import 'server-only'

import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import { narrateQueryResult } from '@/lib/consultar/narrate'
import { cadenceDb, hasCadenceDatabase } from './db'
import { assertReadOnlySelect, inferChart } from './query'
import { CADENCE_SCHEMA } from './schema'

export interface NlQueryResult {
  sql: string
  explanation: string
  answer: string
  suggestions: string[]
  columns: string[]
  rows: Record<string, unknown>[]
  chart: { labelKey: string; valueKey: string } | null
}

export async function executeCadenceSelect(
  clientId: string,
  sqlDraft: string
): Promise<{ sql: string; columns: string[]; rows: Record<string, unknown>[] }> {
  if (!hasCadenceDatabase()) {
    throw new Error('DATABASE_URL não configurado — a consulta precisa do Neon.')
  }

  const sqlText = assertReadOnlySelect(sqlDraft)
  const sql = cadenceDb()
  const rows = (await sql.unsafe(sqlText, [clientId])) as Record<string, unknown>[]
  const normalized = rows.map(row => {
    const next: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(row)) {
      next[key] = value instanceof Date ? value.toISOString() : value
    }
    return next
  })

  return {
    sql: sqlText,
    columns: normalized[0] ? Object.keys(normalized[0]) : [],
    rows: normalized,
  }
}

const FALLBACK_SUGGESTIONS = [
  'Quantos cards existem no Colmeia e no Banco de Ativos, separados por produto?',
  'Quais cards de Colmeia e Banco de Ativos estão prontos para desenvolvimento?',
  'Quais foram as entregas mais recentes relacionadas ao Colmeia e ao Banco de Ativos?',
]

function asSqlDraft(value: unknown): { sql: string; explanation: string; suggestions: string[] } {
  if (!value || typeof value !== 'object') throw new Error('A IA retornou um formato inválido.')
  const raw = value as Record<string, unknown>
  const sql = typeof raw.sql === 'string' ? raw.sql.trim() : ''
  const explanation = typeof raw.explanation === 'string' ? raw.explanation.trim() : ''
  const suggestions = Array.isArray(raw.suggestions)
    ? raw.suggestions
        .filter((item): item is string => typeof item === 'string')
        .map(item => item.trim())
        .filter(item => item.endsWith('?'))
        .slice(0, 3)
    : []
  if (!sql) throw new Error('A IA não gerou SQL.')
  return {
    sql,
    explanation: explanation || 'Consulta gerada a partir da pergunta.',
    suggestions: suggestions.length === 3 ? suggestions : FALLBACK_SUGGESTIONS,
  }
}

export async function runNaturalLanguageQuery(
  clientId: string,
  question: string
): Promise<NlQueryResult> {
  if (!hasCadenceDatabase()) {
    throw new Error('DATABASE_URL não configurado — a consulta precisa do Neon.')
  }

  const today = new Date().toISOString().slice(0, 10)
  const draft = asSqlDraft(
    await callOpenAiJson(
      `Você traduz perguntas em português do Brasil para SQL PostgreSQL somente-leitura.
Use APENAS as tabelas cadence_* abaixo. Sempre filtre client_id = $1 (único parâmetro).
Não use INSERT/UPDATE/DELETE/DDL. Prefira agregações curtas. LIMIT 100 se listar linhas.
Hoje é ${today}. Quando o usuário citar um mês sem ano, use o ano corrente.
Colmeia e Banco de Ativos são produtos identificados principalmente por board_id = 'colmeia'
e board_id = 'banco-ativos'. Você pode consultar e combinar todas as tabelas cadence_* listadas.
Quando a pergunta pedir divisão, comparação ou contagem "por produto", agrupe por board_id em
cadence_cards/cadence_documents ou por product em cadence_delivery_prs; nunca agrupe por title.
Sempre sugira 3 próximas perguntas úteis em linguagem natural, relacionadas ao resultado e diferentes
da pergunta atual. Cada sugestão deve ser uma consulta interrogativa executável nesta mesma interface e
terminar com "?". "suggestions" deve ser um array de strings, nunca objetos e nunca instruções técnicas.
Retorne somente JSON:
{"sql":"SELECT ...","explanation":"1 ou 2 frases em português","suggestions":["pergunta 1","pergunta 2","pergunta 3"]}.`,
      `Pergunta: ${question}\n\nSchema:\n${CADENCE_SCHEMA}`,
      { temperature: 0.1, maxTokens: 800, model: chatModel() }
    )
  )

  const executed = await executeCadenceSelect(clientId, draft.sql)

  return {
    sql: executed.sql,
    explanation: draft.explanation,
    answer: await narrateQueryResult({
      question,
      explanation: draft.explanation,
      columns: executed.columns,
      rows: executed.rows,
    }),
    suggestions: draft.suggestions,
    columns: executed.columns,
    rows: executed.rows,
    chart: inferChart(executed.rows),
  }
}
