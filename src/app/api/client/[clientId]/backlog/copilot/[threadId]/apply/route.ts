import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import {
  getCopilotThread,
  markMessageApplied,
  patchBacklogCard,
  upsertBacklogCard,
} from '@/lib/backlog/store'
import type { BacklogCard } from '@/lib/backlog/types'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string; threadId: string }> }
) {
  const { clientId, threadId } = await params
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

  let body: { messageId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }

  const messageId = body.messageId?.trim()
  if (!messageId) {
    return NextResponse.json({ ok: false, error: 'Informe a mensagem a aplicar.' }, { status: 400 })
  }

  const thread = await getCopilotThread(client.slug, threadId)
  if (!thread) {
    return NextResponse.json({ ok: false, error: 'Conversa não encontrada.' }, { status: 404 })
  }

  const message = thread.messages.find(m => m.id === messageId)
  const draft = message?.storyDraft
  if (!message || !draft) {
    return NextResponse.json(
      { ok: false, error: 'Esta mensagem não tem rascunho de user story.' },
      { status: 400 }
    )
  }

  const diagram = draft.diagram ?? message.diagram
  // Reaplicar o mesmo rascunho atualiza o card já criado em vez de duplicá-lo.
  const targetCardId = thread.cardId ?? message.appliedCardId

  let card: BacklogCard | null
  if (targetCardId) {
    card = await patchBacklogCard(client.slug, targetCardId, {
      title: draft.title,
      level: 'story',
      column: 'story',
      persona: draft.persona,
      want: draft.want,
      soThat: draft.soThat,
      acceptance: draft.acceptance,
      priority: draft.priority,
      diagram,
    })
    if (!card) {
      return NextResponse.json({ ok: false, error: 'Card vinculado não existe mais.' }, { status: 404 })
    }
  } else {
    const ts = new Date().toISOString()
    card = await upsertBacklogCard(client.slug, {
      id: `manual-${Date.now().toString(36)}`,
      boardId: draft.boardId,
      column: 'story',
      title: draft.title,
      level: 'story',
      persona: draft.persona,
      want: draft.want,
      soThat: draft.soThat,
      acceptance: draft.acceptance,
      priority: draft.priority ?? 'Média',
      diagram,
      githubRefs: message.sources,
      source: { kind: 'manual', ref: 'copilot' },
      createdAt: ts,
      updatedAt: ts,
    })
  }

  const updated = await markMessageApplied(client.slug, threadId, messageId, card.id)

  return NextResponse.json({ ok: true, card, thread: updated ?? thread })
}
