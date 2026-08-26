import { readFileSync } from 'node:fs'
import { NextResponse } from 'next/server'
import { canAccessEngagement, getAlquimiaSession } from '@/lib/alquimia/auth'
import { archiveDocuments } from '@/lib/alquimia/documents'
import { resolveArchiveFile } from '@/lib/alquimia/documents-fs'

const MIME: Record<string, string> = {
  md: 'text/markdown; charset=utf-8',
  pdf: 'application/pdf',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ppt: 'application/vnd.ms-powerpoint',
  key: 'application/x-iwork-keynote-sffkey',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await getAlquimiaSession()
  if (!session || !canAccessEngagement(session, 'orfeu')) {
    return NextResponse.json({ ok: false, error: 'Não autorizado.' }, { status: 401 })
  }

  const { path: segments } = await params
  const relative = decodeURIComponent(segments.join('/'))
  const doc = archiveDocuments.find(item => item.path === relative)
  if (!doc) {
    return NextResponse.json({ ok: false, error: 'Documento não encontrado.' }, { status: 404 })
  }

  const file = resolveArchiveFile(doc.path)
  if (!file) {
    return NextResponse.json({ ok: false, error: 'Arquivo ainda não disponível no space.' }, { status: 404 })
  }

  const body = new Uint8Array(readFileSync(file))
  const inline = new URL(request.url).searchParams.get('inline') === '1'
  const mime = MIME[doc.extension] || 'application/octet-stream'
  return new NextResponse(body, {
    headers: {
      'Content-Type': mime,
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(doc.filename)}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
