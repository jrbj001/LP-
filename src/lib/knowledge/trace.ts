import { createHash } from 'node:crypto'

export type KnowledgeTraceStage = 'intent' | 'plan' | 'sql' | 'critic' | 'error'

export interface KnowledgeTraceEvent {
  stage: KnowledgeTraceStage
  clientId: string
  intent?: string
  sourceId?: string
  sqlHash?: string
  ms?: number
  repairCount?: number
  critic?: string
  ok?: boolean
  errorCode?: string
}

export function hashSql(sql: string): string {
  return createHash('sha256').update(sql).digest('hex').slice(0, 12)
}

export function logKnowledgeTrace(event: KnowledgeTraceEvent): void {
  console.info('[knowledge]', JSON.stringify({ ...event, at: new Date().toISOString() }))
}
