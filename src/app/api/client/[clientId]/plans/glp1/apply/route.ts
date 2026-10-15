import { NextResponse } from 'next/server'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { createBacklogCardsBatch } from '@/lib/backlog/store'
import { getClient } from '@/lib/client/registry'
import { GLP1_PLAN_CLIENT, glp1TasksToCards, parseGlp1ApplyBody } from '@/lib/plans/likeme-glp1'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== GLP1_PLAN_CLIENT) {
    return NextResponse.json({ ok: false, error: 'Plano indisponível para este cliente.' }, { status: 404 })
  }
  if (!isBacklogEnabled(client.slug)) {
    return NextResponse.json({ ok: false, error: 'Backlog indisponível para este cliente.' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }

  try {
    const taskIds = parseGlp1ApplyBody(body)
    const result = await createBacklogCardsBatch(client.slug, glp1TasksToCards(taskIds))
    return NextResponse.json({
      ok: true,
      created: result.created.map(card => ({ id: card.id, ref: card.source.ref })),
      skipped: result.skipped.map(card => ({ id: card.id, ref: card.source.ref })),
      counts: { created: result.created.length, skipped: result.skipped.length },
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Payload inválido.' },
      { status: 400 }
    )
  }
}
