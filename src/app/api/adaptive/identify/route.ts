import { NextResponse } from 'next/server'
import { jsonError, requireNotion } from '@/lib/adaptive/api'
import { upsertIdentify } from '@/lib/adaptive/notion'
import { CLIENT, findStakeholder } from '@/components/adaptive/data'

export async function POST(req: Request) {
  const blocked = requireNotion()
  if (blocked) return blocked

  try {
    const body = await req.json()
    const clientId = String(body.clientId || CLIENT.id)
    const stakeholder = String(body.stakeholder || '').trim()
    const whatsapp = String(body.whatsapp || '').trim()

    if (!stakeholder) return jsonError('Selecione seu nome')
    if (!whatsapp || whatsapp.replace(/\D/g, '').length < 10) {
      return jsonError('Informe um WhatsApp válido com DDD')
    }

    const person = findStakeholder(stakeholder)
    if (!person) return jsonError('Stakeholder não encontrado')

    const pageId = await upsertIdentify(
      { clientId, stakeholder, whatsapp },
      {
        facilitator: CLIENT.facilitator.name,
        meetingHost: CLIENT.meetingHost.name,
        areas: person.areas.join(', '),
        role: person.role || (person.sponsor ? 'Sponsor' : person.facilitator ? 'Facilitador' : 'Stakeholder'),
      }
    )

    return NextResponse.json({ ok: true, pageId })
  } catch (e) {
    console.error('[adaptive/identify]', e)
    return jsonError(e instanceof Error ? e.message : 'Erro ao identificar', 500)
  }
}
