import 'server-only'

import { answerKnowledgeQuestion } from '@/lib/knowledge/research'
import { seedEnvDataSources } from '@/lib/data-sources/seed'
import { listDataSources } from '@/lib/data-sources/store'
import { BANCO_DE_ATIVOS_SOURCE, BE180_CLIENT_ID, COLMEIA_SOURCE } from './be180-sources'

const SAMPLE_ROWS = 12
const MAX_TOOL_CHARS = 6000

export interface Be180SourceSummary {
  id: string
  name: string
  kind: string
  enabled: boolean
}

export async function listBe180Sources(): Promise<Be180SourceSummary[]> {
  await seedEnvDataSources(BE180_CLIENT_ID)
  const sources = await listDataSources(BE180_CLIENT_ID)
  return sources
    .filter(source => source.name === BANCO_DE_ATIVOS_SOURCE || source.name === COLMEIA_SOURCE)
    .map(source => ({
      id: source.id,
      name: source.name,
      kind: source.kind,
      enabled: source.enabled,
    }))
}

export function formatBe180SourceList(sources: Be180SourceSummary[]): string {
  const enabled = sources.filter(source => source.enabled)
  if (enabled.length === 0) {
    return 'Nenhuma fonte da Be180 está habilitada. Confira BE180_ATIVOS_PG_* e BE180_COLMEIA_SQL_* no ambiente do Cadence.'
  }
  return [
    'Fontes disponíveis para consulta somente leitura:',
    ...enabled.map(source => `- ${source.name} (${source.kind})`),
  ].join('\n')
}

function clip(value: string): string {
  return value.length <= MAX_TOOL_CHARS ? value : `${value.slice(0, MAX_TOOL_CHARS - 1).trimEnd()}…`
}

export async function consultBe180Source(sourceName: string, question: string): Promise<string> {
  const asked = question.trim()
  if (!asked) return 'Escreva uma pergunta.'

  const sources = await listBe180Sources()
  const source = sources.find(item => item.enabled && item.name === sourceName)
  if (!source) {
    return `A fonte "${sourceName}" não está disponível agora.\n\n${formatBe180SourceList(sources)}`
  }

  const result = await answerKnowledgeQuestion({
    clientId: BE180_CLIENT_ID,
    question: asked,
    sourceId: source.id,
  })
  const database = result.databases[0]
  const sample = database?.rows.slice(0, SAMPLE_ROWS) ?? []
  const parts = [result.answer.trim()]
  if (database?.sql) parts.push(`SQL executado:\n${database.sql}`)
  if (sample.length > 0) {
    parts.push(
      `Amostra (${sample.length} de ${database?.rows.length ?? sample.length} linha(s)):\n${JSON.stringify(sample)}`
    )
  }
  return clip(parts.filter(Boolean).join('\n\n'))
}
