import { NextResponse } from 'next/server'
import { assertOpsSecret, jsonError, requireNotion } from '@/lib/adaptive/api'
import { seedSessionsIfEmpty } from '@/lib/adaptive/notion'
import { CLIENT, SLOT_WINDOW } from '@/components/adaptive/data'

/** POST /api/adaptive/seed — seed available 30min slots (ops only) */
export async function POST(req: Request) {
  const auth = assertOpsSecret(req)
  if (auth) return auth

  const blocked = requireNotion()
  if (blocked) return blocked

  try {
    const body = await req.json().catch(() => ({}))
    const clientId = String(body.clientId || CLIENT.id)
    const created = await seedSessionsIfEmpty({ ...SLOT_WINDOW, clientId })
    return NextResponse.json({ ok: true, created })
  } catch (e) {
    console.error('[adaptive/seed]', e)
    return jsonError(e instanceof Error ? e.message : 'Erro ao seedar slots', 500)
  }
}
