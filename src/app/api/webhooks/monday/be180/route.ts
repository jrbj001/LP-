import { after } from 'next/server'
import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { applyStoryEnrichment, enrichCardToStory } from '@/lib/backlog/enrich'
import { getBacklogBoards } from '@/lib/backlog/boards'
import { findBacklogCardByMondayItem, upsertBacklogCard } from '@/lib/backlog/store'
import {
  cadenceBoardForMonday,
  cardFromMondayItem,
  COLMEIA_AGENT_CHAT,
  interpretMondayAgentEvent,
  interpretMondayWebhook,
  mondayAgentAck,
  mondayAgentChat,
  mondayWebhookAuthorized,
  readMondayItemDetails,
  runMondayRoundTrip,
  type MondayAgentEvent,
  type MondayCreatedItem,
} from '@/lib/monday/inbound'
import {
  fetchMondayItem,
  postMondayUpdate,
  readBe180MondayConfig,
  writeStoryBackToMonday,
  type Be180MondayConfig,
} from '@/lib/monday/publish'
import { verifyMondayAgentSignature } from '@/lib/monday/signature'
import { BE180_MONDAY_CLIENT_ID } from '@/lib/monday/story'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const rawBody = await request.text()
  let body: unknown
  try {
    body = JSON.parse(rawBody) as unknown
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }

  const agent = interpretMondayAgentEvent(body)
  if (agent) return handleAgent(request, rawBody, agent)

  const event = interpretMondayWebhook(body)
  if (event.type === 'challenge') {
    return NextResponse.json({ challenge: event.challenge })
  }
  if (event.type === 'ignore') {
    return NextResponse.json({ ok: true, ignored: true })
  }
  if (!mondayWebhookAuthorized(request.headers.get('authorization'), process.env.BE180_MONDAY_WEBHOOK_SECRET)) {
    return NextResponse.json({ ok: false, error: 'Webhook do Monday não autorizado.' }, { status: 401 })
  }

  const configured = readBe180MondayConfig()
  if (!configured.ok) {
    return NextResponse.json(
      { ok: false, error: `Monday da Be180 sem configuração: ${configured.missing.join(', ')}.` },
      { status: 503 }
    )
  }
  if (event.item.boardId !== configured.config.boardId) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  try {
    const result = await enrichMondayItem({
      config: configured.config,
      item: event.item,
      force: false,
    })
    if (!result) return NextResponse.json({ ok: true, ignored: true })
    return NextResponse.json({ ok: true, status: result.status, cardId: result.card.id })
  } catch (error) {
    console.error('[monday/be180]', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Erro ao receber o item do Monday.' },
      { status: 502 }
    )
  }
}

function handleAgent(request: Request, rawBody: string, agent: MondayAgentEvent) {
  const secret = process.env.MONDAY_AGENT_SIGNING_SECRET?.trim()
  if (
    secret &&
    !verifyMondayAgentSignature({
      secret,
      rawBody,
      timestamp: request.headers.get('x-monday-timestamp'),
      signature: request.headers.get('x-monday-signature'),
    })
  ) {
    return NextResponse.json({ ok: false, error: 'Assinatura do agente Monday inválida.' }, { status: 401 })
  }

  if (agent.trigger === 'chat' || !agent.itemId) {
    return mondayAgentChat(COLMEIA_AGENT_CHAT, agent.stream)
  }

  const configured = readBe180MondayConfig()
  if (!configured.ok) {
    return NextResponse.json(
      { ok: false, error: `Monday da Be180 sem configuração: ${configured.missing.join(', ')}.` },
      { status: 503 }
    )
  }
  if (agent.boardId && agent.boardId !== configured.config.boardId) {
    return mondayAgentAck(agent.stream)
  }

  const itemId = agent.itemId
  after(async () => {
    try {
      await enrichMondayItem({
        config: configured.config,
        item: {
          boardId: agent.boardId || configured.config.boardId,
          itemId,
          name: `Item ${itemId}`,
        },
        context: agent.updateBody,
        parentId: agent.trigger === 'mention' ? agent.updateId : undefined,
        force: true,
      })
    } catch (error) {
      console.error('[monday/be180] agente', error)
      const message = error instanceof Error ? error.message : 'Não consegui enriquecer esta tarefa.'
      await postMondayUpdate({
        config: configured.config,
        itemId,
        parentId: agent.trigger === 'mention' ? agent.updateId : undefined,
        body: `<p>${escapeHtml(message)}</p>`,
      }).catch(postError => console.error('[monday/be180] aviso de falha', postError))
    }
  })

  return mondayAgentAck(agent.stream)
}

async function enrichMondayItem(input: {
  config: Be180MondayConfig
  item: MondayCreatedItem
  context?: string
  parentId?: string
  force: boolean
}) {
  const client = getClient(BE180_MONDAY_CLIENT_ID)
  if (!client) throw new Error('Cliente Be180 não encontrado.')

  let name = input.item.name
  let context = input.context?.trim() || ''
  try {
    const details = readMondayItemDetails(await fetchMondayItem(input.config, input.item.itemId))
    if (details?.boardId && details.boardId !== input.config.boardId) return null
    if (details?.name) name = details.name
    if (details?.context) context = [details.context, context].filter(Boolean).join('\n\n')
  } catch (error) {
    console.error('[monday/be180] leitura do item', error)
  }

  const cadenceBoardId = cadenceBoardForMonday(process.env.BE180_MONDAY_CADENCE_BOARD)
  const boardLabel =
    getBacklogBoards(client.slug).find(board => board.id === cadenceBoardId)?.productLabel ?? cadenceBoardId
  const existing = await findBacklogCardByMondayItem(client.slug, input.item.itemId)

  return runMondayRoundTrip({
    existing,
    force: input.force,
    draft: cardFromMondayItem({
      item: { ...input.item, name },
      context,
      cadenceBoardId,
      accountSlug: input.config.accountSlug,
      now: new Date().toISOString(),
    }),
    enrich: async card => {
      const enrichment = await enrichCardToStory(
        { clientId: client.slug, clientName: client.name, sector: client.sector },
        card,
        client.delivery?.repos ?? []
      )
      return applyStoryEnrichment(card, enrichment)
    },
    writeBack: card => writeStoryBackToMonday(card, boardLabel, { parentId: input.parentId }),
    save: card => upsertBacklogCard(client.slug, card),
  })
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
