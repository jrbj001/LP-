import { NextResponse } from 'next/server'
import { getBacklogBoards } from '@/lib/backlog/boards'
import { getBacklogSnapshot } from '@/lib/backlog/store'
import {
  gatherDocumentGithubContext,
  generateDocumentBacklogDrafts,
} from '@/lib/documents/analyze'
import {
  documentErrorResponse,
  requireBlobStorage,
  requireDocument,
  requireDocumentClient,
  resolveBoardId,
} from '@/lib/documents/api'
import { markAlreadyExported } from '@/lib/documents/backlog-export'
import { patchDocument } from '@/lib/documents/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Devolve os drafts para revisão. Reaproveita o que a análise já produziu e só
 * chama a LLM quando não há nada salvo ou o usuário pede regeneração.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string; documentId: string }> }
) {
  const { clientId, documentId } = await params
  const guard = requireDocumentClient(clientId)
  if (!guard.ok) return guard.response
  const storage = requireBlobStorage()
  if (!storage.ok) return storage.response

  let body: { regenerate?: unknown; boardId?: unknown } = {}
  try {
    body = (await req.json()) as { regenerate?: unknown; boardId?: unknown }
  } catch {
    // Corpo opcional.
  }

  try {
    const found = await requireDocument(guard.value.slug, documentId)
    if (!found.ok) return found.response
    const record = found.value

    if (!record.extraction?.text) {
      return NextResponse.json(
        { ok: false, error: 'Extraia o conteúdo do documento antes de gerar o backlog.' },
        { status: 409 }
      )
    }

    const boardId = resolveBoardId(guard.value.slug, body.boardId, record.boardId)
    if (!boardId) {
      return NextResponse.json(
        { ok: false, error: 'Cliente sem boards de backlog configurados.' },
        { status: 409 }
      )
    }

    const saved = record.artifacts?.backlogDrafts
    let drafts = body.regenerate === true ? undefined : saved

    if (!drafts || drafts.length === 0) {
      const github = await gatherDocumentGithubContext(guard.value, record, boardId)
      drafts = await generateDocumentBacklogDrafts(guard.value, record, github)
      await patchDocument(guard.value.slug, documentId, {
        artifacts: {
          ...record.artifacts,
          backlogDrafts: drafts,
          generatedAt: new Date().toISOString(),
        },
        boardId,
      })
    }

    const snapshot = await getBacklogSnapshot(guard.value.slug)
    return NextResponse.json({
      ok: true,
      drafts: markAlreadyExported(documentId, drafts, snapshot.cards),
      boards: getBacklogBoards(guard.value.slug),
    })
  } catch (error) {
    return documentErrorResponse('backlog', error)
  }
}
