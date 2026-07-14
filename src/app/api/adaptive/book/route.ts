import { NextResponse } from 'next/server'
import { jsonError, requireNotion } from '@/lib/adaptive/api'
import { bookSession } from '@/lib/adaptive/notion'
import { CLIENT } from '@/components/adaptive/data'
import { formatSlotLabel } from '@/lib/adaptive/slots'

export async function POST(req: Request) {
  const blocked = requireNotion()
  if (blocked) return blocked

  try {
    const body = await req.json()
    const clientId = String(body.clientId || CLIENT.id)
    const stakeholder = String(body.stakeholder || '').trim()
    const whatsapp = String(body.whatsapp || '').trim()
    const sessionId = String(body.sessionId || '').trim()

    if (!stakeholder || !whatsapp || !sessionId) {
      return jsonError('Dados incompletos para reservar')
    }

    const slot = await bookSession(
      sessionId,
      { clientId, stakeholder, whatsapp },
      CLIENT.meetingHost.name
    )

    return NextResponse.json({
      ok: true,
      slot,
      label: formatSlotLabel(slot.start),
    })
  } catch (e) {
    console.error('[adaptive/book]', e)
    return jsonError(e instanceof Error ? e.message : 'Erro ao reservar', 409)
  }
}
