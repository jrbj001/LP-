import { NextResponse } from 'next/server'
import { analyzeDocument } from '@/lib/documents/analyze'
import {
  documentErrorResponse,
  requireBlobStorage,
  requireDocument,
  requireDocumentClient,
  resolveBoardId,
} from '@/lib/documents/api'
import { patchDocument } from '@/lib/documents/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string; documentId: string }> }
) {
  const { clientId, documentId } = await params
  const guard = requireDocumentClient(clientId)
  if (!guard.ok) return guard.response
  const storage = requireBlobStorage()
  if (!storage.ok) return storage.response

  let body: { boardId?: unknown } = {}
  try {
    body = (await req.json()) as { boardId?: unknown }
  } catch {
    // Corpo é opcional: sem boardId caímos no board do documento.
  }

  try {
    const found = await requireDocument(guard.value.slug, documentId)
    if (!found.ok) return found.response
    const record = found.value

    if (!record.extraction?.text) {
      return NextResponse.json(
        { ok: false, error: 'Extraia o conteúdo do documento antes de gerar os artefatos.' },
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

    try {
      const result = await analyzeDocument(guard.value, record, boardId)
      const updated = await patchDocument(guard.value.slug, documentId, {
        artifacts: result.artifacts,
        boardId,
        status: 'ready',
        error: result.failures.length > 0 ? result.failures.join(' · ') : undefined,
      })
      return NextResponse.json({
        ok: true,
        document: updated,
        failures: result.failures,
        githubRepos: result.githubRepos,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha na análise.'
      await patchDocument(guard.value.slug, documentId, { status: 'failed', error: message })
      throw error
    }
  } catch (error) {
    return documentErrorResponse('spec', error)
  }
}
