import { NextResponse } from 'next/server'
import { getBacklogBoards } from '@/lib/backlog/boards'
import { documentErrorResponse, requireDocumentClient } from '@/lib/documents/api'
import { listDocuments } from '@/lib/documents/store'
import { ACCEPTED_UPLOAD_EXTENSIONS, MAX_UPLOAD_BYTES } from '@/lib/documents/types'
import { hasBlobToken } from '@/lib/documents/blob'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const guard = requireDocumentClient(clientId)
  if (!guard.ok) return guard.response

  // Sem token o Blob não responde; devolvemos a lista vazia com o aviso para a
  // UI explicar a indisponibilidade em vez de estourar um erro.
  if (!hasBlobToken()) {
    return NextResponse.json({
      ok: true,
      storageReady: false,
      documents: [],
      boards: getBacklogBoards(guard.value.slug),
      limits: { maxBytes: MAX_UPLOAD_BYTES, extensions: ACCEPTED_UPLOAD_EXTENSIONS },
    })
  }

  try {
    return NextResponse.json({
      ok: true,
      storageReady: true,
      documents: await listDocuments(guard.value.slug),
      boards: getBacklogBoards(guard.value.slug),
      limits: { maxBytes: MAX_UPLOAD_BYTES, extensions: ACCEPTED_UPLOAD_EXTENSIONS },
    })
  } catch (error) {
    return documentErrorResponse('list', error)
  }
}
