import 'server-only'

import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import type { CopilotSqlEvidence } from '@/lib/backlog/types'
import { hasCadenceDatabase } from './db'
import { executeCadenceSelect } from './nl-sql'
import { CADENCE_SCHEMA } from './schema'

function asPlan(value: unknown): {
  shouldQuery: boolean
  question: string
  sql: string
  explanation: string
} {
  if (!value || typeof value !== 'object') {
    return { shouldQuery: false, question: '', sql: '', explanation: '' }
  }
  const raw = value as Record<string, unknown>
  return {
    shouldQuery: raw.shouldQuery === true,
    question: typeof raw.question === 'string' ? raw.question.trim() : '',
    sql: typeof raw.sql === 'string' ? raw.sql.trim() : '',
    explanation: typeof raw.explanation === 'string' ? raw.explanation.trim() : '',
  }
}

export async function gatherCopilotSqlContext(input: {
  clientId: string
  boardId: string
  message: string
  recentContext: string
}): Promise<CopilotSqlEvidence | null> {
  if (!hasCadenceDatabase()) return null

  try {
    const plan = asPlan(
      await callOpenAiJson(
        `Você decide se uma conversa de produto precisa consultar o banco Cadence e, quando útil,
gera um único SELECT PostgreSQL somente-leitura.

Consulte quando dados reais de cards, entregas, documentos ou reuniões ajudarem a entender o fluxo
da empresa ou responder objetivamente. Não consulte para saudações, opinião, redação pura ou quando
o contexto já trouxer a resposta.

Regras obrigatórias:
- use somente as tabelas cadence_* do schema;
- filtre client_id = $1 em todas as consultas;
- nunca use escrita, DDL, funções perigosas ou múltiplos statements;
- limite listagens a 25 linhas;
- priorize o board atual quando ele for relevante;
- não invente relações que o schema não contém.

Retorne somente JSON:
{"shouldQuery":true|false,"question":"o que a consulta verifica","sql":"SELECT ...","explanation":"por que este dado ajuda o Copilot"}.`,
        `Board atual: ${input.boardId}
Mensagem atual: ${input.message}
Contexto recente: ${input.recentContext}

Schema disponível:
${CADENCE_SCHEMA}`,
        { temperature: 0.1, maxTokens: 900, model: chatModel() }
      )
    )

    if (!plan.shouldQuery || !plan.question || !plan.sql) return null

    const result = await executeCadenceSelect(input.clientId, plan.sql)
    return {
      question: plan.question,
      sql: result.sql,
      explanation: plan.explanation || 'Dados consultados para enriquecer o fluxo da empresa.',
      columns: result.columns,
      rows: result.rows.slice(0, 25),
    }
  } catch (error) {
    console.warn(
      '[cadence/copilot-sql-context]',
      error instanceof Error ? error.message : error
    )
    return null
  }
}

export function formatCopilotSqlContext(evidence: CopilotSqlEvidence | null): string {
  if (!evidence) {
    return 'Nenhuma consulta SQL foi necessária ou o banco não está disponível neste turno.'
  }
  return [
    `Pergunta investigada: ${evidence.question}`,
    `Explicação: ${evidence.explanation}`,
    `SQL executado (somente leitura): ${evidence.sql}`,
    `Resultado (${evidence.rows.length} linhas):`,
    JSON.stringify(evidence.rows, null, 2),
  ].join('\n')
}
