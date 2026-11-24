export type MeetingBotStatus =
  | 'created'
  | 'joining'
  | 'in_call'
  | 'recording'
  | 'ended'
  | 'done'
  | 'failed'

export type MeetingReportStatus = 'none' | 'running' | 'ready' | 'failed'

export interface MeetingReportItem {
  title: string
  owner: string
  priority: 'Alta' | 'Média' | 'Baixa'
}

export interface MeetingReportStory {
  title: string
  persona: string
  want: string
  soThat: string
  acceptance: string[]
}

export interface MeetingReport {
  title: string
  summary: string
  decisions: string[]
  risks: string[]
  actionItems: MeetingReportItem[]
  stories: MeetingReportStory[]
  attendees: string[]
  model: string
  generatedAt: string
}

export interface MeetingBotRecord {
  id: string
  clientId: string
  recallBotId: string | null
  meetingUrl: string
  /** Reunião simulada no sandbox: sem Recall, a resposta aparece só na tela de teste. */
  sandbox: boolean
  title: string | null
  status: MeetingBotStatus
  pendingWakeSpeaker: string | null
  pendingWakeAt: string | null
  liveListeningAt: string | null
  report: MeetingReport | null
  reportStatus: MeetingReportStatus
  reportError: string | null
  createdAt: string
  startedAt: string | null
  endedAt: string | null
}

export interface TranscriptSegment {
  id: number
  speaker: string | null
  text: string
  tsStart: number | null
  tsEnd: number | null
  source: 'speech' | 'chat'
  createdAt: string
}

export interface AgentSource {
  kind: 'github' | 'notion' | 'cadence' | 'transcript' | 'database'
  label: string
  url?: string
}

export interface MeetingTableArtifact {
  kind: 'grid' | 'csv'
  sourceName: string
  columns: string[]
  rowCount: number
  /** Linhas da grade. Só existe quando kind é grid (até 12). */
  rows?: Record<string, unknown>[]
  /** CSV completo. Só existe quando kind é csv; o chat leva o link, não o arquivo. */
  csv?: string
}

export interface AgentInteraction {
  id: string
  speaker: string | null
  question: string
  answer: string | null
  tools: string[]
  sources: AgentSource[]
  latencyMs: number | null
  error: string | null
  artifact: MeetingTableArtifact | null
  /** Link da planilha, preenchido na API. Não fica gravado. */
  artifactHref?: string | null
  createdAt: string
}
