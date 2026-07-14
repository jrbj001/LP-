import { NextResponse } from 'next/server'
import { jsonError, requireNotion } from '@/lib/adaptive/api'
import { listAvailableSlots, seedSessionsIfEmpty } from '@/lib/adaptive/notion'
import { CLIENT, SLOT_WINDOW } from '@/components/adaptive/data'
import { formatSlotLabel } from '@/lib/adaptive/slots'

export async function GET(req: Request) {
  const blocked = requireNotion()
  if (blocked) return blocked

  try {
    const url = new URL(req.url)
    const clientId = url.searchParams.get('clientId') || CLIENT.id
    const autoSeed = url.searchParams.get('seed') === '1'

    if (autoSeed) {
      await seedSessionsIfEmpty({ ...SLOT_WINDOW, clientId })
    }

    let slots = await listAvailableSlots(clientId)

    // If none and not already seeded this call, try once
    if (slots.length === 0 && !autoSeed) {
      await seedSessionsIfEmpty({ ...SLOT_WINDOW, clientId })
      slots = await listAvailableSlots(clientId)
    }

    return NextResponse.json({
      slots: slots.map(s => ({
        ...s,
        label: formatSlotLabel(s.start),
      })),
      host: CLIENT.meetingHost.name,
      location: 'Presencial',
    })
  } catch (e) {
    console.error('[adaptive/slots]', e)
    return jsonError(e instanceof Error ? e.message : 'Erro ao listar slots', 500)
  }
}
