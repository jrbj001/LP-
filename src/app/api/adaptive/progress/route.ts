import { NextResponse } from 'next/server'
import { assertOpsSecret, jsonError, requireNotion } from '@/lib/adaptive/api'
import { listProgress } from '@/lib/adaptive/notion'
import { CLIENT, STAKEHOLDERS } from '@/components/adaptive/data'
import type { ProgressRow, ProgressStatus } from '@/lib/adaptive/types'

export async function GET(req: Request) {
  const auth = assertOpsSecret(req)
  if (auth) return auth

  const blocked = requireNotion()
  if (blocked) return blocked

  try {
    const url = new URL(req.url)
    const clientId = url.searchParams.get('clientId') || CLIENT.id
    const rows = await listProgress(clientId)

    // Merge with full stakeholder roster so dashboard shows who hasn't started
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
        role: s.role || (s.sponsor ? 'Sponsor' : s.facilitator ? 'Facilitador' : 'Stakeholder'),
        whatsapp: '',
        status: 'Not started' as ProgressStatus,
        facilitator: CLIENT.facilitator.name,
        meetingHost: CLIENT.meetingHost.name,
        slot: '',
      }
    })

    const counts = {
      total: merged.length,
      identified: merged.filter(r => r.status !== 'Not started').length,
      assessmentDone: merged.filter(r =>
        ['Assessment done', 'Session booked', 'Done'].includes(r.status)
      ).length,
      sessionBooked: merged.filter(r =>
        ['Session booked', 'Done'].includes(r.status)
      ).length,
    }

    return NextResponse.json({ rows: merged, counts, client: CLIENT.name })
  } catch (e) {
    console.error('[adaptive/progress]', e)
    return jsonError(e instanceof Error ? e.message : 'Erro ao carregar progresso', 500)
  }
}
