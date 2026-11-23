import 'server-only'

import type { ClientMeeting, ClientWorkspace } from '@/lib/client/types'
import { hasCadenceDatabase } from '@/lib/cadence/db'
import { getBotRecord, listReadyReports, listSegments } from './store'
import type { MeetingBotRecord, MeetingReport, TranscriptSegment } from './types'

const MEETING_PREFIX = 'cadence-bot-'
const TRANSCRIPT_CONTEXT_CHARS = 20_000

export function agentMeetingId(botId: string): string {
  return `${MEETING_PREFIX}${botId}`
}

export function botIdFromMeetingId(meetingId: string): string | null {
  if (!meetingId.startsWith(MEETING_PREFIX)) return null
  const id = meetingId.slice(MEETING_PREFIX.length)
  return /^[0-9a-f-]{36}$/i.test(id) ? id : null
}

export function formatTranscript(segments: TranscriptSegment[], maxChars = TRANSCRIPT_CONTEXT_CHARS): string {
  const lines = segments.map(segment => {
    const who = segment.speaker || 'Participante'
    return segment.source === 'chat' ? `[chat] ${who}: ${segment.text}` : `${who}: ${segment.text}`
  })
  const text = lines.join('\n')
  return text.length > maxChars ? `…\n${text.slice(text.length - maxChars)}` : text
}

export function formatReport(report: MeetingReport): string {
  const parts = [`Resumo: ${report.summary}`]
  if (report.decisions.length) parts.push(`Decisões:\n${report.decisions.map(item => `- ${item}`).join('\n')}`)
  if (report.risks.length) parts.push(`Riscos:\n${report.risks.map(item => `- ${item}`).join('\n')}`)
  if (report.actionItems.length) {
    parts.push(
      `Itens de ação:\n${report.actionItems
        .map(item => `- ${item.title} (responsável: ${item.owner}; prioridade: ${item.priority})`)
        .join('\n')}`
    )
  }
  if (report.stories.length) {
    parts.push(
      `User stories sugeridas:\n${report.stories
        .map(
          story =>
            `- ${story.title}: como ${story.persona}, quero ${story.want}, para ${story.soThat}. Critérios: ${story.acceptance.join('; ')}`
        )
        .join('\n')}`
    )
  }
  return parts.join('\n\n')
}

function durationOf(bot: MeetingBotRecord): string | undefined {
  if (!bot.startedAt || !bot.endedAt) return undefined
  const minutes = Math.round((Date.parse(bot.endedAt) - Date.parse(bot.startedAt)) / 60_000)
  return minutes > 0 ? `${minutes} min` : undefined
}

export function botToClientMeeting(bot: MeetingBotRecord, transcript?: string): ClientMeeting | null {
  if (!bot.report) return null
  const reportText = formatReport(bot.report)
  return {
    id: agentMeetingId(bot.id),
    title: bot.title || bot.report.title,
    date: bot.startedAt ?? bot.createdAt,
    duration: durationOf(bot),
    status: 'completed',
    attendees: bot.report.attendees,
    owner: 'Cadence',
    summary: bot.report.summary,
    aiContext: transcript ? `${reportText}\n\nTranscrição:\n${transcript}` : reportText,
  }
}

export async function listAgentMeetings(clientId: string): Promise<ClientMeeting[]> {
  if (!hasCadenceDatabase()) return []
  try {
    const bots = await listReadyReports(clientId)
    return bots.map(bot => botToClientMeeting(bot)).filter((item): item is ClientMeeting => Boolean(item))
  } catch (error) {
    console.warn('[meeting-agent/meetings]', error instanceof Error ? error.message : error)
    return []
  }
}

/** Reuniões do tenant (estáticas) ou gravadas pelo Cadence, com a transcrição como fonte. */
export async function findClientMeeting(
  client: ClientWorkspace,
  meetingId: string
): Promise<ClientMeeting | null> {
  const fixed = client.meetings?.find(item => item.id === meetingId)
  if (fixed) return fixed
  const botId = botIdFromMeetingId(meetingId)
  if (!botId || !hasCadenceDatabase()) return null
  const bot = await getBotRecord(client.slug, botId)
  if (!bot) return null
  const segments = await listSegments(bot.id, 0, 2000)
  return botToClientMeeting(bot, formatTranscript(segments))
}
