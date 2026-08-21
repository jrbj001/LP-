import { createHash } from 'crypto'
import { getBacklogBoards } from '@/lib/backlog/boards'
import { asStringArray } from '@/lib/backlog/llm'
import type { BacklogBoardId, BacklogCard } from '@/lib/backlog/types'
import {
  documentSourceRef,
  normalizeDraftTitle,
  type ClientDocumentRecord,
  type DocumentBacklogDraft,
  type DocumentDraftMode,
} from './types'

const PRIORITIES = new Set(['Alta', 'Média', 'Baixa'])

function cleanString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : ''
}

/** Marca o que já virou card, comparando pelo ref determinístico do documento. */
export function markAlreadyExported(
  documentId: string,
  drafts: Omit<DocumentBacklogDraft, 'alreadyExported'>[],
  cards: BacklogCard[]
): DocumentBacklogDraft[] {
  const refs = new Set(
    cards
      .filter(
        card =>
          card.source.kind === 'document' && card.source.ref?.startsWith(`document:${documentId}:`)
      )
      .map(card => card.source.ref)
  )
  return drafts.map(draft => ({
    ...draft,
    alreadyExported: refs.has(documentSourceRef(documentId, draft.title)),
  }))
}

export interface DocumentApplyItem {
  id: string
  mode: DocumentDraftMode
  boardId: BacklogBoardId
  title: string
  priority: 'Alta' | 'Média' | 'Baixa'
  context: string
  persona?: string
  want?: string
  soThat?: string
  acceptance?: string[]
}

export function parseDocumentApplyItems(value: unknown, clientId: string): DocumentApplyItem[] {
  if (!value || typeof value !== 'object') throw new Error('Payload inválido.')
  const body = value as Record<string, unknown>
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 12) {
    throw new Error('Envie entre 1 e 12 itens.')
  }
  const boardIds = new Set(getBacklogBoards(clientId).map(board => board.id))

  return body.items.map((item, index): DocumentApplyItem => {
    if (!item || typeof item !== 'object') throw new Error(`Item ${index + 1} inválido.`)
    const raw = item as Record<string, unknown>
    const id = cleanString(raw.id, 100)
    const title = cleanString(raw.title, 180)
    const boardId = cleanString(raw.boardId, 80) as BacklogBoardId
    const priority = cleanString(raw.priority, 10)
    const mode: DocumentDraftMode = raw.mode === 'story' ? 'story' : 'requirement'

    if (!id.startsWith('document-draft-') || title.length < 4) {
      throw new Error(`Identificação ou título inválido no item ${index + 1}.`)
    }
    if (!boardIds.has(boardId)) throw new Error(`Board inválido no item ${index + 1}.`)
    if (!PRIORITIES.has(priority)) throw new Error(`Prioridade inválida no item ${index + 1}.`)

    const base: DocumentApplyItem = {
      id,
      mode,
      boardId,
      title,
      priority: priority as DocumentApplyItem['priority'],
      context: cleanString(raw.context, 500),
    }
    if (mode === 'requirement') return base

    const persona = cleanString(raw.persona, 120)
    const want = cleanString(raw.want, 300)
    const soThat = cleanString(raw.soThat, 300)
    const acceptance = asStringArray(raw.acceptance)
      .map(entry => cleanString(entry, 300))
      .filter(Boolean)
      .slice(0, 8)
    if (!persona || !want || !soThat || acceptance.length < 1) {
      throw new Error(`User story incompleta no item ${index + 1}.`)
    }
    return { ...base, persona, want, soThat, acceptance }
  })
}

export function buildDocumentCardContext(
  document: ClientDocumentRecord,
  itemContext: string
): string {
  return [
    `Origem: documento "${document.title}" (${document.fileName}).`,
    document.sourceUrl ? `Link: ${document.sourceUrl}` : '',
    itemContext ? `Trecho de referência: ${itemContext}` : '',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 1800)
}

export function documentItemsToCards(
  document: ClientDocumentRecord,
  items: DocumentApplyItem[]
): BacklogCard[] {
  const now = new Date().toISOString()
  return items.map(item => ({
    id: `document-${createHash('sha256')
      .update(`${document.id}:${normalizeDraftTitle(item.title)}`)
      .digest('hex')
      .slice(0, 20)}`,
    boardId: item.boardId,
    column: item.mode === 'story' ? 'story' : 'requirement',
    title: item.title,
    level: item.mode === 'story' ? 'story' : 'raw',
    persona: item.mode === 'story' ? item.persona : undefined,
    want: item.mode === 'story' ? item.want : undefined,
    soThat: item.mode === 'story' ? item.soThat : undefined,
    acceptance: item.mode === 'story' ? item.acceptance : undefined,
    context: buildDocumentCardContext(document, item.context),
    priority: item.priority,
    source: { kind: 'document', ref: documentSourceRef(document.id, item.title) },
    createdAt: now,
    updatedAt: now,
  }))
}
