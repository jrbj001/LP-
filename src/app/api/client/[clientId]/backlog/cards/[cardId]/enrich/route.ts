import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import {
  applySpecEnrichment,
  applyStoryEnrichment,
  codingModel,
  enrichCardToSpec,
  enrichCardToStory,
  type EnrichMode,
} from '@/lib/backlog/enrich'
import { getBacklogCard, upsertBacklogCard } from '@/lib/backlog/store'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string; cardId: string }> }
) {
  const { clientId, cardId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  if (client.slug !== 'be180-ooh') {
    return NextResponse.json(
      { ok: false, error: 'Backlog em piloto apenas para Be180 OOH.' },
      { status: 403 }
    )
  }

  let mode: EnrichMode = 'story'
  try {
    const body = await req.json().catch(() => ({}))
    if (body?.mode === 'spec' || body?.mode === 'story') mode = body.mode
  } catch {
    /* ignore */
  }

  const current = await getBacklogCard(client.slug, cardId)
  if (!current) {
    return NextResponse.json({ ok: false, error: 'Card não encontrado.' }, { status: 404 })
  }

  const repos = client.delivery?.repos ?? []

  try {
    if (mode === 'story') {
      const enrichment = await enrichCardToStory(current, repos)
      const card = await upsertBacklogCard(client.slug, applyStoryEnrichment(current, enrichment))
      return NextResponse.json({
        ok: true,
        mode,
        model: codingModel(),
        card,
        generatedAt: new Date().toISOString(),
      })
    }

    const enrichment = await enrichCardToSpec(current, repos)
    const card = await upsertBacklogCard(client.slug, applySpecEnrichment(current, enrichment))
    return NextResponse.json({
      ok: true,
      mode,
      model: codingModel(),
      card,
      generatedAt: new Date().toISOString(),
    })
  } catch (e) {
    console.error('[client/backlog/enrich]', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Erro ao enriquecer card.' },
      { status: 502 }
    )
  }
}
