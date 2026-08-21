import { NextResponse } from 'next/server'
import { getBacklogBoards } from '@/lib/backlog/boards'
import type { BacklogBoardId } from '@/lib/backlog/types'
import { getClient } from '@/lib/client/registry'
import type { ClientWorkspace } from '@/lib/client/types'
import { isDocumentIntelligenceEnabled } from './access'
import { BlobNotConfiguredError, hasBlobToken } from './blob'
import { getDocument } from './store'
import type { ClientDocumentRecord } from './types'

type Guard<T> = { ok: true; value: T } | { ok: false; response: NextResponse }

/** Cliente existe e tem a feature liberada. Sem isso nenhuma rota deve seguir. */
export function requireDocumentClient(clientId: string): Guard<ClientWorkspace> {
  const client = getClient(clientId)
  if (!client) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: 'Cliente não encontrado.' }, { status: 404 }),
    }
  }
  if (!isDocumentIntelligenceEnabled(client.slug)) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: 'Inteligência de documentos indisponível para este cliente.' },
        { status: 403 }
      ),
    }
  }
  return { ok: true, value: client }
}

export function requireBlobStorage(): Guard<true> {
  if (hasBlobToken()) return { ok: true, value: true }
  return {
    ok: false,
    response: NextResponse.json(
      { ok: false, error: new BlobNotConfiguredError().message },
      { status: 503 }
    ),
  }
}

export async function requireDocument(
  clientId: string,
  documentId: string
): Promise<Guard<ClientDocumentRecord>> {
  const record = await getDocument(clientId, documentId)
  if (!record) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: 'Documento não encontrado.' }, { status: 404 }),
    }
  }
  return { ok: true, value: record }
}

/** Board explícito, o do documento ou o primeiro do cliente, nessa ordem. */
export function resolveBoardId(
  clientId: string,
  requested: unknown,
  fallback?: BacklogBoardId
): BacklogBoardId | null {
  const boards = getBacklogBoards(clientId)
  if (boards.length === 0) return null
  const ids = new Set(boards.map(board => board.id))

  if (typeof requested === 'string' && ids.has(requested as BacklogBoardId)) {
    return requested as BacklogBoardId
  }
  if (fallback && ids.has(fallback)) return fallback
  return boards[0].id
}

/**
 * Falha de credencial é problema de configuração (503); o resto é falha de
 * upstream ou de conteúdo (502), no mesmo critério das rotas de backlog.
 */
export function documentErrorResponse(scope: string, error: unknown): NextResponse {
  console.error(`[documents/${scope}]`, error)
  if (error instanceof BlobNotConfiguredError) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 503 })
  }
  const message = error instanceof Error ? error.message : 'Erro ao processar o documento.'
  const status =
    message.includes('OPENAI_API_KEY') || message.includes('BLOB_READ_WRITE_TOKEN') ? 503 : 502
  return NextResponse.json({ ok: false, error: message }, { status })
}
