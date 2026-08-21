import { del, get, put } from '@vercel/blob'
import { extensionOf } from './types'

/**
 * Documentos de cliente são gravados com acesso privado: a URL do blob não é
 * suficiente para lê-los, toda leitura passa pelo token no servidor.
 */
const ACCESS = 'private' as const

export class BlobNotConfiguredError extends Error {
  constructor() {
    super('BLOB_READ_WRITE_TOKEN não configurado — o upload de documentos está indisponível.')
    this.name = 'BlobNotConfiguredError'
  }
}

export function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function assertBlobToken(): void {
  if (!hasBlobToken()) throw new BlobNotConfiguredError()
}

export function documentSourcePath(
  clientId: string,
  documentId: string,
  fileName: string
): string {
  const extension = extensionOf(fileName)
  return `clients/${clientId}/documents/${documentId}/source${extension ? `.${extension}` : ''}`
}

function indexPath(clientId: string): string {
  return `clients/${clientId}/documents/index.json`
}

async function readBlob(pathname: string): Promise<Buffer | null> {
  assertBlobToken()
  // useCache: false — o índice muda a cada ação e leitura obsoleta perderia dados.
  const result = await get(pathname, { access: ACCESS, useCache: false })
  if (!result || result.statusCode !== 200) return null
  return Buffer.from(await new Response(result.stream).arrayBuffer())
}

export async function putDocumentSource(
  clientId: string,
  documentId: string,
  fileName: string,
  body: Buffer,
  contentType: string
): Promise<{ pathname: string }> {
  assertBlobToken()
  const result = await put(documentSourcePath(clientId, documentId, fileName), body, {
    access: ACCESS,
    contentType: contentType || 'application/octet-stream',
    // O caminho já é único por documento; sem isso o Blob acrescenta sufixo aleatório.
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  return { pathname: result.pathname }
}

export async function putDocumentIndex(clientId: string, payload: unknown): Promise<void> {
  assertBlobToken()
  await put(indexPath(clientId), JSON.stringify(payload, null, 2), {
    access: ACCESS,
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

/** Retorna null no primeiro uso do cliente, quando o índice ainda não existe. */
export async function fetchDocumentIndex(clientId: string): Promise<unknown | null> {
  const buffer = await readBlob(indexPath(clientId))
  if (!buffer) return null
  try {
    return JSON.parse(buffer.toString('utf8'))
  } catch {
    // Índice corrompido não deve travar a aba; recomeçamos vazio.
    console.warn('[documents/blob] índice ilegível, reiniciando o store do cliente', clientId)
    return null
  }
}

export async function deleteDocumentBlob(pathname: string): Promise<void> {
  assertBlobToken()
  await del(pathname)
}

export async function fetchDocumentSource(pathname: string): Promise<Buffer> {
  const buffer = await readBlob(pathname)
  if (!buffer) throw new Error('O arquivo original não foi encontrado no armazenamento.')
  return buffer
}
