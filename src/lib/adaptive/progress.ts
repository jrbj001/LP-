import { CLIENT, STAKEHOLDERS } from '@/components/adaptive/data'
import { isNotionConfigured, listProgress } from '@/lib/adaptive/notion'
import type { ProgressRow, ProgressStatus } from '@/lib/adaptive/types'

export type OnboardingProgress = {
  rows: ProgressRow[]
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

  const rows = await listProgress(clientId)
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
