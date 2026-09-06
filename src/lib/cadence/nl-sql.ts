import 'server-only'

import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import { cadenceDb, hasCadenceDatabase } from './db'
import { assertReadOnlySelect, inferChart } from './query'

const SCHEMA = `Tabelas (sempre filtrar client_id = $1):

cadence_cards(
  client_id text, card_id text, board_id text, project_id text, column_id text,
  title text, level text, persona text, want text, so_that text, acceptance jsonb,
  context text, priority text, source_kind text, source_ref text,
  created_at timestamptz, updated_at timestamptz
)
column_id ∈ requirement | story | ready | dev | done
board_id exemplos: likeme-landing, likeme-app, likeme-backend, colmeia, banco-ativos, agentes, visibilidade

cadence_delivery_prs(
  client_id text, repo text, number int, title text, branch text, type text,
  fix_kind text, product text, merged_at timestamptz, additions int, deletions int,
  changed_files int, commit_count int
)
type ∈ feature | fix | improvement | maintenance
fix_kind ∈ bug | evolution

cadence_delivery_commits(
  id uuid, client_id text, committed_at date, type text, fix_kind text
)

cadence_meetings(
  client_id text, meeting_id text, title text, occurred_at timestamptz,
  duration text, status text, attendees jsonb, owner text, summary text
)

cadence_documents(
  client_id text, document_id text, title text, kind text, file_name text,
  status text, board_id text, source_url text, updated_at timestamptz, created_at timestamptz
)`

export interface NlQueryResult {
  sql: string
  explanation: string
  columns: string[]
  rows: Record<string, unknown>[]
  chart: { labelKey: string; valueKey: string } | null
}

function asSqlDraft(value: unknown): { sql: string; explanation: string } {
  if (!value || typeof value !== 'object') throw new Error('A IA retornou um formato inválido.')
  const raw = value as Record<string, unknown>
  const sql = typeof raw.sql === 'string' ? raw.sql.trim() : ''
  const explanation = typeof raw.explanation === 'string' ? raw.explanation.trim() : ''
  if (!sql) throw new Error('A IA não gerou SQL.')
  return { sql, explanation: explanation || 'Consulta gerada a partir da pergunta.' }
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
Retorne somente JSON: {"sql":"SELECT ...","explanation":"1 ou 2 frases em português"}.`,
      `Pergunta: ${question}\n\nSchema:\n${SCHEMA}`,
      { temperature: 0.1, maxTokens: 800, model: chatModel() }
    )
  )

  const sqlText = assertReadOnlySelect(draft.sql)
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
    explanation: draft.explanation,
    columns: normalized[0] ? Object.keys(normalized[0]) : [],
    rows: normalized,
    chart: inferChart(normalized),
  }
}
