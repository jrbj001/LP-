import type { QuestionIntent } from './intent'
import type { QueryCritique } from './result-critic'

export type KnowledgeSourceKind = 'github' | 'database' | 'meeting' | 'document'

export interface KnowledgeEvidence {
  id: string
  kind: KnowledgeSourceKind
  source: string
  title: string
  excerpt: string
  href?: string
}

export interface KnowledgeSourceStatus {
  id: string
  label: string
  state: 'used' | 'empty' | 'unavailable' | 'error'
  detail?: string
}

export interface KnowledgeDatabaseResult {
  sourceId: string
  sourceName: string
  question: string
  sql: string
  explanation: string
  answer: string
  suggestions: string[]
  columns: string[]
  rows: Record<string, unknown>[]
  chart: { labelKey: string; valueKey: string } | null
  critic?: QueryCritique
}

export interface KnowledgeResearch {
  question: string
  searchQuery: string
  intent: QuestionIntent
  evidence: KnowledgeEvidence[]
  databases: KnowledgeDatabaseResult[]
  statuses: KnowledgeSourceStatus[]
}

export interface KnowledgeAnswer extends KnowledgeResearch {
  answer: string
  suggestions: string[]
}
