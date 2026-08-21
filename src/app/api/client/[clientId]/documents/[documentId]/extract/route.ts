import { NextResponse } from 'next/server'
import {
  documentErrorResponse,
  requireBlobStorage,
  requireDocument,
  requireDocumentClient,
} from '@/lib/documents/api'
import { fetchDocumentSource } from '@/lib/documents/blob'
import { extractDocumentText } from '@/lib/documents/extract'
import { patchDocument } from '@/lib/documents/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ clientId: string; documentId: string }> }
) {
  const { clientId, documentId } = await params
  const guard = requireDocumentClient(clientId)
  if (!guard.ok) return guard.response
  const storage = requireBlobStorage()
  if (!storage.ok) return storage.response

  try {
    const found = await requireDocument(guard.value.slug, documentId)
    if (!found.ok) return found.response
    const record = found.value

    if (!record.pathname) {
      return NextResponse.json(
        { ok: false, error: 'Este documento não tem arquivo para extrair.' },
        { status: 400 }
      )
    }

    try {
      const buffer = await fetchDocumentSource(record.pathname)
      const extraction = await extractDocumentText(
        record.kind,
        buffer,
        record.mimeType,
        record.fileName
      )
      const updated = await patchDocument(guard.value.slug, documentId, {
        extraction,
        status: 'extracted',
        error: undefined,
      })
      return NextResponse.json({ ok: true, document: updated })
    } catch (error) {
      // Marca o documento como falho para a UI mostrar a etapa que quebrou.
      const message = error instanceof Error ? error.message : 'Falha na extração.'
      await patchDocument(guard.value.slug, documentId, { status: 'failed', error: message })
      throw error
    }
  } catch (error) {
    return documentErrorResponse('extract', error)
  }
}
