import 'server-only'

import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import type { CopilotSqlEvidence } from '@/lib/backlog/types'
import { runExternalNaturalLanguageQuery } from '@/lib/data-sources/nl-sql'
import { seedEnvDataSources } from '@/lib/data-sources/seed'
import { listDataSources } from '@/lib/data-sources/store'
import { hasCadenceDatabase } from './db'
import { runNaturalLanguageQuery } from './nl-sql'

function asRoute(value: unknown): {
  shouldQuery: boolean
  sourceId: string
  question: string
  explanation: string
} {
  if (!value || typeof value !== 'object') {
    return { shouldQuery: false, sourceId: '', question: '', explanation: '' }
  }
  const raw = value as Record<string, unknown>
  return {
    shouldQuery: raw.shouldQuery === true,
    sourceId: typeof raw.sourceId === 'string' ? raw.sourceId.trim() : '',
    question: typeof raw.question === 'string' ? raw.question.trim() : '',
    explanation: typeof raw.explanation === 'string' ? raw.explanation.trim() : '',
  }
}

function catalogBrief(entries: { schema: string; table: string }[]): string {
  return entries
    .slice(0, 80)
    .map(entry => `${entry.schema}.${entry.table}`)
    .join(', ')
}

function preferredSourceHint(boardId: string, channel?: string): string {
  if (channel === 'whatsapp' || boardId === 'cadence') {
    return 'Canal WhatsApp da Be180: escolha Colmeia, Banco de Ativos ou Cadence pelo assunto. Consulte com liberdade — o usuário espera o número neste canal, não um redirecionamento.'
  }
  if (boardId === 'banco-ativos') {
    return 'O board atual é Banco de Ativos: prefira essa fonte para inventário, exibidores, pontos e media kit.'
  }
  if (boardId === 'colmeia' || boardId === 'agentes' || boardId === 'visibilidade') {
    return 'O board atual é Colmeia: prefira o SQL Server do Colmeia para roteiros, usuários, campanhas e operação.'
  }
  return 'Escolha a fonte pelo assunto da pergunta, não pelo nome do board se o assunto for outro.'
}

export async function gatherCopilotSqlContext(input: {
  clientId: string
  boardId: string
  message: string
  recentContext: string
  channel?: string
}): Promise<CopilotSqlEvidence | null> {
  try {
    if (input.clientId === 'be180-ooh') {
      try {
        await seedEnvDataSources(input.clientId)
      } catch (error) {
        console.warn(
          '[cadence/copilot-sql-context] seed',
          error instanceof Error ? error.message : error
        )
      }
    }

    const external = input.clientId === 'be180-ooh' ? await listDataSources(input.clientId) : []
    const sources = [
      ...(hasCadenceDatabase()
        ? [
            {
              id: 'cadence',
              name: 'Workspace Cadence',
              kind: 'postgresql',
              hint: 'cards, PRs, reuniões e documentos do workspace — não é o banco de produção',
              tables: 'cadence_cards, cadence_delivery_prs, cadence_delivery_commits, cadence_meetings, cadence_documents',
            },
          ]
        : []),
      ...external
        .filter(source => source.enabled)
        .map(source => ({
          id: source.id,
          name: source.name,
          kind: source.kind,
          hint:
            source.kind === 'sqlserver'
              ? 'produção Colmeia (Azure SQL)'
              : 'produção Banco de Ativos (Azure PostgreSQL)',
          tables: catalogBrief(source.catalog.entries),
        })),
    ]

    if (sources.length === 0) return null

    const route = asRoute(
      await callOpenAiJson(
        `Você é o agente de dados do Copilot. Decide se precisa executar uma consulta neste turno.

Consulte quando a pergunta pedir fatos, contagens, listas, status, divergências, exemplos reais
de roteiros, inventário, exibidores, cards, entregas ou reuniões.

No WhatsApp, consulte sempre que a resposta puder trazer um número, lista ou status real.

NÃO consulte quando for saudação, opinião, desenho de fluxo, redação de user story sem dado,
ou quando o contexto recente já tiver a resposta.

Fontes:
- cadence: só o workspace (backlog/PRs/reuniões). Nunca use para dados operacionais de produção.
- Banco de Ativos: inventário, pontos, exibidores, media kit, cadastro de ativos.
- Colmeia SQL Server: roteiros, campanhas, usuários, operação do planejador.

${preferredSourceHint(input.boardId, input.channel)}
sourceId deve ser exatamente um dos ids listados, ou vazio se shouldQuery for false.

Retorne somente JSON:
{"shouldQuery":true|false,"sourceId":"id-ou-cadence","question":"o que verificar em linguagem natural","explanation":"por que esta fonte"}.`,
        `Board atual: ${input.boardId}
Canal: ${input.channel ?? 'web'}
Mensagem atual: ${input.message}
Contexto recente: ${input.recentContext}

Fontes disponíveis:
${sources
  .map(source => `- ${source.id} · ${source.name} (${source.kind}) · ${source.hint}\n  tabelas: ${source.tables}`)
  .join('\n')}`,
        { temperature: 0, maxTokens: 500, model: chatModel() }
      )
    )

    if (!route.shouldQuery || !route.question) return null

    const chosen = sources.find(source => source.id === route.sourceId)
    if (!chosen) return null

    if (chosen.id === 'cadence') {
      const result = await runNaturalLanguageQuery(input.clientId, route.question)
      return {
        question: route.question,
        sql: result.sql,
        explanation: route.explanation || result.explanation,
        columns: result.columns,
        rows: result.rows.slice(0, 25),
        sourceName: chosen.name,
      }
    }

    const result = await runExternalNaturalLanguageQuery({
      clientId: input.clientId,
      sourceId: chosen.id,
      question: route.question,
    })
    return {
      question: route.question,
      sql: result.sql,
      explanation: route.explanation || result.explanation,
      columns: result.columns,
      rows: result.rows.slice(0, 25),
      sourceName: result.sourceName || chosen.name,
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
    return 'Nenhuma consulta SQL foi necessária neste turno. Não invente números de produção.'
  }
  return [
    `Fonte: ${evidence.sourceName ?? 'banco'}`,
    `Pergunta investigada: ${evidence.question}`,
    `Explicação: ${evidence.explanation}`,
    `SQL executado (somente leitura): ${evidence.sql}`,
    `Resultado (${evidence.rows.length} linhas):`,
    JSON.stringify(evidence.rows, null, 2),
  ].join('\n')
}
