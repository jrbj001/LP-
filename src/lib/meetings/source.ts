import type { ClientMeeting } from '@/lib/client/types'

export interface MeetingSource {
  content: string
  kind: 'aiContext' | 'summary'
}

export function getMeetingSource(meeting: ClientMeeting): MeetingSource | null {
  const aiContext = meeting.aiContext?.trim()
  if (aiContext) return { content: aiContext, kind: 'aiContext' }

  const summary = meeting.summary?.trim()
  if (summary) return { content: summary, kind: 'summary' }

  return null
}
