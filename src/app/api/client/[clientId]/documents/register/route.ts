import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import {
  documentErrorResponse,
  requireBlobStorage,
  requireDocumentClient,
  resolveBoardId,
} from '@/lib/documents/api'
import { upsertDocument } from '@/lib/documents/store'
import { MAX_EXTRACTED_CHARS, type ClientDocumentRecord } from '@/lib/documents/types'
import { truncateForPrompt } from '@/lib/documents/extract'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Registra uma fonte sem binário: texto colado (Notion, ata, e-mail) com link
 * opcional de origem. Já entra como extraída, pronta para a análise.
 */
export async function POST(req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const guard = requireDocumentClient(clientId)
  if (!guard.ok) return guard.response
  const storage = requireBlobStorage()
  if (!storage.ok) return storage.response

  let body: { title?: unknown; content?: unknown; sourceUrl?: unknown; boardId?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }

  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 180) : ''
  const content = typeof body.content === 'string' ? body.content : ''
  if (title.length < 3) {
    return NextResponse.json({ ok: false, error: 'Informe um título com ao menos 3 caracteres.' }, { status: 400 })
  }
  if (content.trim().length < 40) {
    return NextResponse.json(
      { ok: false, error: 'Cole ao menos 40 caracteres de conteúdo para a análise ter base.' },
      { status: 400 }
    )
  }
  if (content.length > MAX_EXTRACTED_CHARS * 2) {
    return NextResponse.json({ ok: false, error: 'Conteúdo muito extenso. Envie como arquivo.' }, { status: 413 })
  }

  let sourceUrl: string | undefined
  if (typeof body.sourceUrl === 'string' && body.sourceUrl.trim()) {
    try {
      const parsed = new URL(body.sourceUrl.trim())
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('protocolo')
      sourceUrl = parsed.toString()
    } catch {
      return NextResponse.json({ ok: false, error: 'Link de origem inválido.' }, { status: 400 })
    }
  }

  try {
    const now = new Date().toISOString()
    const { text, truncated } = truncateForPrompt(content)
    const record: ClientDocumentRecord = {
      id: randomUUID(),
      clientId: guard.value.slug,
      title,
      fileName: `${title}.txt`,
      mimeType: 'text/plain',
      sizeBytes: Buffer.byteLength(content, 'utf8'),
      kind: 'text',
      boardId: resolveBoardId(guard.value.slug, body.boardId) ?? undefined,
      sourceUrl,
      status: 'extracted',
      extraction: {
        text,
        charCount: text.length,
        truncated,
        method: 'plain',
        extractedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    }

    return NextResponse.json({ ok: true, document: await upsertDocument(guard.value.slug, record) })
  } catch (error) {
    return documentErrorResponse('register', error)
  }
}
