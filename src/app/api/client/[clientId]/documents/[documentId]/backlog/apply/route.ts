import { NextResponse } from 'next/server'
import { createBacklogCardsBatch } from '@/lib/backlog/store'
import {
  documentErrorResponse,
  requireBlobStorage,
  requireDocument,
  requireDocumentClient,
} from '@/lib/documents/api'
import {
  documentItemsToCards,
  parseDocumentApplyItems,
} from '@/lib/documents/backlog-export'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string; documentId: string }> }
) {
  const { clientId, documentId } = await params
  const guard = requireDocumentClient(clientId)
  if (!guard.ok) return guard.response
  const storage = requireBlobStorage()
  if (!storage.ok) return storage.response

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }

  let document
  try {
    const found = await requireDocument(guard.value.slug, documentId)
    if (!found.ok) return found.response
    document = found.value
  } catch (error) {
    return documentErrorResponse('backlog-apply', error)
  }

  try {
    const items = parseDocumentApplyItems(body, guard.value.slug)
    const cards = documentItemsToCards(document, items)
    const result = await createBacklogCardsBatch(guard.value.slug, cards)
    return NextResponse.json({
      ok: true,
      created: result.created,
      skipped: result.skipped,
      counts: { created: result.created.length, skipped: result.skipped.length },
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Payload inválido.' },
      { status: 400 }
    )
  }
}
