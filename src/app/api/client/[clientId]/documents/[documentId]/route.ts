import { NextResponse } from 'next/server'
import {
  documentErrorResponse,
  requireBlobStorage,
  requireDocument,
  requireDocumentClient,
} from '@/lib/documents/api'
import { deleteDocument } from '@/lib/documents/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ clientId: string; documentId: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { clientId, documentId } = await params
  const guard = requireDocumentClient(clientId)
  if (!guard.ok) return guard.response
  const storage = requireBlobStorage()
  if (!storage.ok) return storage.response

  try {
    const found = await requireDocument(guard.value.slug, documentId)
    if (!found.ok) return found.response
    return NextResponse.json({ ok: true, document: found.value })
  } catch (error) {
    return documentErrorResponse('detail', error)
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { clientId, documentId } = await params
  const guard = requireDocumentClient(clientId)
  if (!guard.ok) return guard.response
  const storage = requireBlobStorage()
  if (!storage.ok) return storage.response

  try {
    const removed = await deleteDocument(guard.value.slug, documentId)
    if (!removed) {
      return NextResponse.json({ ok: false, error: 'Documento não encontrado.' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, id: documentId })
  } catch (error) {
    return documentErrorResponse('delete', error)
  }
}
