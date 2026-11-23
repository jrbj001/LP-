import 'server-only'

import { cadenceDb, hasCadenceDatabase } from '@/lib/cadence/db'
import type {
  AgentInteraction,
  AgentSource,
  MeetingBotRecord,
  MeetingBotStatus,
  MeetingReport,
  MeetingReportStatus,
  TranscriptSegment,
} from './types'

export function requireMeetingAgentDatabase(): void {
  if (!hasCadenceDatabase()) {
    throw new Error('DATABASE_URL não configurado — o agente de reuniões precisa do Neon.')
  }
}

export function meetingAgentErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && (error as { code?: string }).code === '42P01') {
    return 'Tabelas do agente de reuniões ausentes. Rode `npm run alquimia:migrate`.'
  }
  return error instanceof Error ? error.message : 'Erro no banco do agente de reuniões.'
}

type Row = Record<string, unknown>

function iso(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString()
  return typeof value === 'string' ? value : null
}

function toBot(row: Row): MeetingBotRecord {
  return {
    id: String(row.id),
    clientId: String(row.client_id),
    recallBotId: (row.recall_bot_id as string | null) ?? null,
    meetingUrl: String(row.meeting_url),
    title: (row.title as string | null) ?? null,
    status: row.status as MeetingBotStatus,
    pendingWakeSpeaker: (row.pending_wake_speaker as string | null) ?? null,
    pendingWakeAt: iso(row.pending_wake_at),
    liveListeningAt: iso(row.live_listening_at),
    report: (row.report as MeetingReport | null) ?? null,
    reportStatus: row.report_status as MeetingReportStatus,
    reportError: (row.report_error as string | null) ?? null,
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
    startedAt: iso(row.started_at),
    endedAt: iso(row.ended_at),
  }
}

function toSegment(row: Row): TranscriptSegment {
  return {
    id: Number(row.id),
    speaker: (row.speaker as string | null) ?? null,
    text: String(row.text),
    tsStart: row.ts_start == null ? null : Number(row.ts_start),
    tsEnd: row.ts_end == null ? null : Number(row.ts_end),
    source: row.source === 'chat' ? 'chat' : 'speech',
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
  }
}

function toInteraction(row: Row): AgentInteraction {
  return {
    id: String(row.id),
    speaker: (row.speaker as string | null) ?? null,
    question: String(row.question),
    answer: (row.answer as string | null) ?? null,
    tools: Array.isArray(row.tools) ? (row.tools as string[]) : [],
    sources: Array.isArray(row.sources) ? (row.sources as AgentSource[]) : [],
    latencyMs: row.latency_ms == null ? null : Number(row.latency_ms),
    error: (row.error as string | null) ?? null,
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
  }
}

export async function createBotRecord(input: {
  clientId: string
  meetingUrl: string
  title?: string
  createdBy?: string
}): Promise<MeetingBotRecord> {
  const sql = cadenceDb()
  const [row] = await sql`
    insert into cadence_meeting_bots (client_id, meeting_url, title, created_by)
    values (${input.clientId}, ${input.meetingUrl}, ${input.title ?? null}, ${input.createdBy ?? null})
    returning *
  `
  return toBot(row)
}

export async function attachRecallBot(id: string, recallBotId: string): Promise<void> {
  const sql = cadenceDb()
  await sql`
    update cadence_meeting_bots set recall_bot_id = ${recallBotId}, status = 'joining' where id = ${id}
  `
}

export async function markBotFailed(id: string, error: string): Promise<void> {
  const sql = cadenceDb()
  await sql`
    update cadence_meeting_bots
    set status = 'failed', report_error = ${error.slice(0, 500)}, ended_at = coalesce(ended_at, now())
    where id = ${id}
  `
}

export async function getBotRecord(clientId: string, id: string): Promise<MeetingBotRecord | null> {
  const sql = cadenceDb()
  const [row] = await sql`select * from cadence_meeting_bots where id = ${id} and client_id = ${clientId}`
  return row ? toBot(row) : null
}

export async function getBotByRecallId(recallBotId: string): Promise<MeetingBotRecord | null> {
  const sql = cadenceDb()
  const [row] = await sql`select * from cadence_meeting_bots where recall_bot_id = ${recallBotId}`
  return row ? toBot(row) : null
}

export async function listBotRecords(clientId: string, limit = 20): Promise<MeetingBotRecord[]> {
  const sql = cadenceDb()
  const rows = await sql`
    select * from cadence_meeting_bots
    where client_id = ${clientId}
    order by created_at desc
    limit ${limit}
  `
  return rows.map(toBot)
}

export async function updateBotStatus(id: string, status: MeetingBotStatus): Promise<void> {
  const sql = cadenceDb()
  const startsCall = status === 'in_call' || status === 'recording'
  const endsCall = status === 'ended' || status === 'done' || status === 'failed'
  await sql`
    update cadence_meeting_bots
    set status = ${status},
        started_at = case when ${startsCall} then coalesce(started_at, now()) else started_at end,
        ended_at = case when ${endsCall} then coalesce(ended_at, now()) else ended_at end
    where id = ${id} and status not in ('done', 'failed')
  `
}

export async function markLiveListening(id: string): Promise<void> {
  const sql = cadenceDb()
  await sql`update cadence_meeting_bots set live_listening_at = now() where id = ${id}`
}

export async function clearPendingWake(id: string): Promise<void> {
  const sql = cadenceDb()
  await sql`
    update cadence_meeting_bots
    set pending_wake_speaker = null, pending_wake_at = null
    where id = ${id}
  `
}

export async function setPendingWake(id: string, speaker: string | null): Promise<void> {
  const sql = cadenceDb()
  await sql`
    update cadence_meeting_bots
    set pending_wake_speaker = ${speaker ?? ''}, pending_wake_at = now()
    where id = ${id}
  `
}

/** Consome o "Cadence" solto dito há pouco pelo mesmo participante; devolve true se havia um pendente. */
export async function consumePendingWake(id: string, speaker: string | null, windowSeconds: number): Promise<boolean> {
  const sql = cadenceDb()
  const rows = await sql`
    update cadence_meeting_bots
    set pending_wake_speaker = null, pending_wake_at = null
    where id = ${id}
      and pending_wake_at is not null
      and pending_wake_at > now() - make_interval(secs => ${windowSeconds})
      and pending_wake_speaker = ${speaker ?? ''}
    returning id
  `
  return rows.length > 0
}

export async function insertSegment(input: {
  botId: string
  clientId: string
  speaker: string | null
  text: string
  tsStart: number | null
  tsEnd: number | null
  source: 'speech' | 'chat'
}): Promise<void> {
  const sql = cadenceDb()
  await sql`
    insert into cadence_transcript_segments (bot_id, client_id, speaker, text, ts_start, ts_end, source)
    values (${input.botId}, ${input.clientId}, ${input.speaker}, ${input.text}, ${input.tsStart}, ${input.tsEnd}, ${input.source})
  `
}

export async function listSegments(botId: string, afterId = 0, limit = 500): Promise<TranscriptSegment[]> {
  const sql = cadenceDb()
  const rows = await sql`
    select * from cadence_transcript_segments
    where bot_id = ${botId} and id > ${afterId}
    order by id asc
    limit ${limit}
  `
  return rows.map(toSegment)
}

export async function listRecentSegments(botId: string, minutes: number): Promise<TranscriptSegment[]> {
  const sql = cadenceDb()
  const rows = await sql`
    select * from cadence_transcript_segments
    where bot_id = ${botId} and created_at > now() - make_interval(mins => ${minutes})
    order by id asc
    limit 400
  `
  return rows.map(toSegment)
}

export async function insertInteraction(input: {
  botId: string
  clientId: string
  speaker: string | null
  question: string
  answer: string | null
  tools: string[]
  sources: AgentSource[]
  latencyMs: number
  error?: string
}): Promise<void> {
  const sql = cadenceDb()
  await sql`
    insert into cadence_agent_interactions (
      bot_id, client_id, speaker, question, answer, tools, sources, latency_ms, error
    ) values (
      ${input.botId}, ${input.clientId}, ${input.speaker}, ${input.question}, ${input.answer},
      ${sql.json(input.tools)}, ${sql.json(input.sources as unknown as Parameters<typeof sql.json>[0])},
      ${input.latencyMs}, ${input.error ?? null}
    )
  `
}

export async function listInteractions(botId: string): Promise<AgentInteraction[]> {
  const sql = cadenceDb()
  const rows = await sql`
    select * from cadence_agent_interactions where bot_id = ${botId} order by created_at asc limit 200
  `
  return rows.map(toInteraction)
}

/** Reserva a geração do relatório para um único worker (webhook e polling podem disparar juntos). */
export async function claimReport(id: string): Promise<boolean> {
  const sql = cadenceDb()
  const rows = await sql`
    update cadence_meeting_bots
    set report_status = 'running', report_error = null
    where id = ${id} and report_status in ('none', 'failed')
    returning id
  `
  return rows.length > 0
}

export async function saveReport(id: string, report: MeetingReport): Promise<void> {
  const sql = cadenceDb()
  await sql`
    update cadence_meeting_bots
    set report = ${sql.json(report as unknown as Parameters<typeof sql.json>[0])},
        report_status = 'ready', report_error = null,
        title = coalesce(title, ${report.title})
    where id = ${id}
  `
}

export async function failReport(id: string, error: string): Promise<void> {
  const sql = cadenceDb()
  await sql`
    update cadence_meeting_bots set report_status = 'failed', report_error = ${error.slice(0, 500)} where id = ${id}
  `
}

export async function getBotById(id: string): Promise<MeetingBotRecord | null> {
  const sql = cadenceDb()
  const [row] = await sql`select * from cadence_meeting_bots where id = ${id}`
  return row ? toBot(row) : null
}

/** Enfileira uma fala para a página do avatar tocar. */
export async function enqueueSpeech(botId: string, clientId: string, text: string): Promise<void> {
  const sql = cadenceDb()
  await sql`
    insert into cadence_speech_queue (bot_id, client_id, text)
    values (${botId}, ${clientId}, ${text.slice(0, 1000)})
  `
}

/** Entrega a próxima fala pendente e marca como reivindicada (evita tocar duas vezes). */
export async function claimNextSpeech(botId: string): Promise<{ id: number; text: string } | null> {
  const sql = cadenceDb()
  const [row] = await sql`
    update cadence_speech_queue
    set claimed_at = now()
    where id = (
      select id from cadence_speech_queue
      where bot_id = ${botId} and claimed_at is null
      order by id
      limit 1
      for update skip locked
    )
    returning id, text
  `
  return row ? { id: Number(row.id), text: String(row.text) } : null
}

export async function listReadyReports(clientId: string): Promise<MeetingBotRecord[]> {
  const sql = cadenceDb()
  const rows = await sql`
    select * from cadence_meeting_bots
    where client_id = ${clientId} and report_status = 'ready'
    order by created_at desc
    limit 50
  `
  return rows.map(toBot)
}
