import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import {
  documentErrorResponse,
  requireBlobStorage,
  requireDocumentClient,
  resolveBoardId,
} from '@/lib/documents/api'
import { putDocumentSource } from '@/lib/documents/blob'
import { upsertDocument } from '@/lib/documents/store'
import {
  ACCEPTED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_BYTES,
  detectDocumentKind,
  type ClientDocumentRecord,
} from '@/lib/documents/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function sanitizeFileName(value: string): string {
  return (
    value
      .split(/[\\/]/)
      .pop()
      ?.replace(/[^\w.\-\s]/g, '_')
      .trim()
      .slice(0, 180) || 'arquivo'
  )
}

export async function POST(req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const guard = requireDocumentClient(clientId)
  if (!guard.ok) return guard.response
  const storage = requireBlobStorage()
  if (!storage.ok) return storage.response

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Envio inválido.' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Nenhum arquivo recebido.' }, { status: 400 })
  }
  if (file.size === 0) {
    return NextResponse.json({ ok: false, error: 'O arquivo está vazio.' }, { status: 400 })
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        error: `Arquivo acima do limite de ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`,
      },
      { status: 413 }
    )
  }

  const fileName = sanitizeFileName(file.name)
  const kind = detectDocumentKind(fileName, file.type)
  if (!kind) {
    return NextResponse.json(
      { ok: false, error: `Formato não suportado. Aceitos: ${ACCEPTED_UPLOAD_EXTENSIONS.join(', ')}.` },
      { status: 415 }
    )
  }

  const rawTitle = form.get('title')
  const title =
    typeof rawTitle === 'string' && rawTitle.trim() ? rawTitle.trim().slice(0, 180) : fileName
  const boardId = resolveBoardId(guard.value.slug, form.get('boardId')) ?? undefined

  try {
    const documentId = randomUUID()
    const buffer = Buffer.from(await file.arrayBuffer())
    const stored = await putDocumentSource(
      guard.value.slug,
      documentId,
      fileName,
      buffer,
      file.type
    )

    const now = new Date().toISOString()
    const record: ClientDocumentRecord = {
      id: documentId,
      clientId: guard.value.slug,
      title,
      fileName,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      kind,
      boardId,
      pathname: stored.pathname,
      status: 'uploaded',
      createdAt: now,
      updatedAt: now,
    }

    return NextResponse.json({ ok: true, document: await upsertDocument(guard.value.slug, record) })
  } catch (error) {
    return documentErrorResponse('upload', error)
  }
}
