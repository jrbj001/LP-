import 'server-only'

import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import type { ClientWorkspace } from '@/lib/client/types'
import { formatKnowledgeResearchForPrompt, gatherKnowledgeResearch } from '@/lib/knowledge/research'
import { formatTranscript } from './meetings'
import { speakableText } from './speech-text'
import { listRecentSegments } from './store'
import { buildTableArtifact } from './table-artifact'
import type { AgentSource, MeetingTableArtifact } from './types'

export interface LookupAnswer {
  spoken: string
  answer: string
  tools: string[]
  sources: AgentSource[]
  artifact: MeetingTableArtifact | null
}

const FALLBACK_SPOKEN = 'Mandei o que encontrei no chat.'

/**
 * Caminho de dado: a pesquisa já rodou no orquestrador. Aqui só sai uma fala curta
 * e o detalhe do chat, com a grade ou o CSV separados da fala.
 */
export async function answerMeetingLookup(input: {
  client: ClientWorkspace
  botId: string
  question: string
}): Promise<LookupAnswer> {
  const recent = await listRecentSegments(input.botId, 5)
  const transcript = formatTranscript(recent, 4000)
  const research = await gatherKnowledgeResearch({ clientId: input.client.slug, question: input.question })
  const table = research.databases.find(item => item.rows.length > 0) ?? null
  const artifact = table
    ? buildTableArtifact({ sourceName: table.sourceName, columns: table.columns, rows: table.rows })
    : null

  const sources: AgentSource[] = []
  for (const database of research.databases) {
    sources.push({
      kind: database.sourceId === 'cadence' ? 'cadence' : 'database',
      label: database.sourceName,
    })
  }
  for (const item of research.evidence.filter(item => item.kind !== 'database').slice(0, 3)) {
    sources.push({
      kind:
        item.kind === 'github' || item.kind === 'notion' || item.kind === 'monday' ? item.kind : 'cadence',
      label: item.title,
      url: item.href,
    })
  }

  let spoken = FALLBACK_SPOKEN
  let answer = formatKnowledgeResearchForPrompt(research).slice(0, 2400)
  try {
    const parsed = (await callOpenAiJson(
      `Você resume uma pesquisa já feita, para falar numa reunião ao vivo, em português do Brasil.
Use só as evidências. Não invente número, decisão ou arquivo.
"spoken": uma frase assertiva, até 25 palavras, com o fato principal. Sem lista, sem link, sem dizer que vai verificar.
"chat": o detalhe, até 8 tópicos curtos. Não despeje as linhas da tabela: a grade ou a planilha vão à parte. Cite a fonte pelo nome.
Se não houver evidência, diga isso nas duas partes.
Retorne somente JSON: {"spoken":"...","chat":"..."}.`,
      `Pergunta: ${input.question}
Trecho recente da reunião:
${transcript || '(sem transcrição ainda)'}
${artifact ? `Tabela separada: ${artifact.rowCount} linhas de ${artifact.sourceName}. Não liste essas linhas.` : 'Sem tabela.'}

Status:
${research.statuses.map(status => `- ${status.label}: ${status.state}${status.detail ? ` — ${status.detail}` : ''}`).join('\n') || '- nenhuma fonte'}

Evidências:
${formatKnowledgeResearchForPrompt(research)}`,
      { temperature: 0.1, maxTokens: 700, model: chatModel() }
    )) as Record<string, unknown>
    if (typeof parsed.spoken === 'string' && parsed.spoken.trim()) spoken = parsed.spoken.trim()
    if (typeof parsed.chat === 'string' && parsed.chat.trim()) answer = parsed.chat.trim()
  } catch (error) {
    console.warn('[meeting-agent/lookup]', error instanceof Error ? error.message : error)
  }

  return {
    spoken: speakableText(spoken, 220),
    answer,
    tools: ['consultar_dados'],
    sources,
    artifact,
  }
}
