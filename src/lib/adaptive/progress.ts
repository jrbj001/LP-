import { CLIENT, DISCOVERY_QUESTIONS, STAKEHOLDERS } from '@/components/adaptive/data'
import {
  backfillAssessmentAnswers,
  isNotionConfigured,
  listAssessments,
  listProgress,
} from '@/lib/adaptive/notion'
import type { AssessmentRow, ProgressRow, ProgressStatus } from '@/lib/adaptive/types'

export type OnboardingProgress = {
  rows: ProgressRow[]
  assessments: AssessmentRow[]
  counts: {
    total: number
    identified: number
    assessmentDone: number
    sessionBooked: number
  }
  client: string
}

export async function getOnboardingProgress(clientId = CLIENT.id): Promise<OnboardingProgress> {
  if (!isNotionConfigured()) {
    throw new Error(
      'Notion não configurado. Defina NOTION_TOKEN e os DB IDs no ambiente (veja .env.example).'
    )
  }

  try {
    await backfillAssessmentAnswers(clientId)
  } catch (e) {
    console.warn('[getOnboardingProgress] backfill assessments:', e)
  }

  const [rows, assessments] = await Promise.all([
    listProgress(clientId),
    listAssessments(clientId),
  ])

  const byName = new Map(rows.map(r => [r.stakeholder, r]))
  const merged: ProgressRow[] = STAKEHOLDERS.map(s => {
    const existing = byName.get(s.name)
    if (existing) return existing
    return {
      id: `pending:${s.name}`,
      name: `${clientId} · ${s.name}`,
      client: clientId,
      stakeholder: s.name,
      areas: s.areas.join(', '),
      role: s.role || (s.sponsor ? 'Sponsor' : s.facilitator ? 'Facilitador' : s.consultant ? 'Consultor' : 'Stakeholder'),
      whatsapp: '',
      status: 'Not started' as ProgressStatus,
      facilitator: CLIENT.facilitator.name,
      meetingHost: CLIENT.meetingHost.name,
      slot: '',
    }
  })

  return {
    rows: merged,
    assessments,
    counts: {
      total: merged.length,
      identified: merged.filter(r => r.status !== 'Not started').length,
      assessmentDone: merged.filter(r =>
        ['Assessment done', 'Session booked', 'Done'].includes(r.status)
      ).length,
      sessionBooked: merged.filter(r =>
        ['Session booked', 'Done'].includes(r.status)
      ).length,
    },
    client: CLIENT.name,
  }
}

export { DISCOVERY_QUESTIONS }
