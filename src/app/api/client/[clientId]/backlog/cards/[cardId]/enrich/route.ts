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
import { getBacklogBoards } from '@/lib/backlog/boards'
import { getBacklogCard, upsertBacklogCard } from '@/lib/backlog/store'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { writeStoryBackToMonday } from '@/lib/monday/publish'
import { BE180_MONDAY_CLIENT_ID } from '@/lib/monday/story'

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
  if (!isBacklogEnabled(client.slug)) {
    return NextResponse.json({ ok: false, error: 'Backlog indisponível para este cliente.' }, { status: 403 })
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
  const clientContext = {
    clientId: client.slug,
    clientName: client.name,
    sector: client.sector,
  }

  try {
    if (mode === 'story') {
      const enrichment = await enrichCardToStory(clientContext, current, repos)
      let card = await upsertBacklogCard(client.slug, applyStoryEnrichment(current, enrichment))
      let mondayReturned = false
      let mondayError: string | undefined
      if (client.slug === BE180_MONDAY_CLIENT_ID && card.monday?.itemId) {
        const boardLabel =
          getBacklogBoards(client.slug).find(board => board.id === card.boardId)?.productLabel ??
          card.boardId
        try {
          card = await upsertBacklogCard(client.slug, await writeStoryBackToMonday(card, boardLabel))
          mondayReturned = true
        } catch (error) {
          console.error('[client/backlog/enrich] volta ao Monday', error)
          mondayError =
            error instanceof Error ? error.message : 'Não foi possível devolver a story ao Monday.'
        }
      }
      return NextResponse.json({
        ok: true,
        mode,
        model: codingModel(),
        card,
        mondayReturned,
        mondayError,
        githubNotes: card.githubNotes ?? [],
        generatedAt: new Date().toISOString(),
      })
    }

    const enrichment = await enrichCardToSpec(clientContext, current, repos)
    const card = await upsertBacklogCard(client.slug, applySpecEnrichment(current, enrichment))
    return NextResponse.json({
      ok: true,
      mode,
      model: codingModel(),
      card,
      githubNotes: card.githubNotes ?? [],
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
