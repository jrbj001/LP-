import { deleteDocumentBlob, fetchDocumentIndex, putDocumentIndex } from './blob'
import {
  DOCUMENT_STORE_VERSION,
  type ClientDocumentRecord,
  type DocumentStorePayload,
} from './types'

/**
 * Cache por cliente. Evita reler o índice no Blob a cada request e garante
 * leitura consistente logo após uma escrita na mesma instância.
 */
const memory = new Map<string, DocumentStorePayload>()

function emptyStore(clientId: string): DocumentStorePayload {
  return {
    version: DOCUMENT_STORE_VERSION,
    clientId,
    updatedAt: new Date().toISOString(),
    documents: {},
  }
}

function isStorePayload(value: unknown): value is DocumentStorePayload {
  if (!value || typeof value !== 'object') return false
  const raw = value as Record<string, unknown>
  return raw.version === DOCUMENT_STORE_VERSION && typeof raw.documents === 'object'
}

export async function readDocumentStore(clientId: string): Promise<DocumentStorePayload> {
  const cached = memory.get(clientId)
  if (cached) return cached

  const raw = await fetchDocumentIndex(clientId)
  const payload = isStorePayload(raw) ? raw : emptyStore(clientId)
  payload.documents ??= {}
  memory.set(clientId, payload)
  return payload
}

export async function writeDocumentStore(
  clientId: string,
  payload: DocumentStorePayload
): Promise<DocumentStorePayload> {
  const next: DocumentStorePayload = {
    ...payload,
    version: DOCUMENT_STORE_VERSION,
    clientId,
    updatedAt: new Date().toISOString(),
  }
  await putDocumentIndex(clientId, next)
  memory.set(clientId, next)
  return next
}

export async function listDocuments(clientId: string): Promise<ClientDocumentRecord[]> {
  const store = await readDocumentStore(clientId)
  return Object.values(store.documents).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
}

export async function getDocument(
  clientId: string,
  documentId: string
): Promise<ClientDocumentRecord | null> {
  const store = await readDocumentStore(clientId)
  return store.documents[documentId] ?? null
}

export async function upsertDocument(
  clientId: string,
  record: ClientDocumentRecord
): Promise<ClientDocumentRecord> {
  const store = await readDocumentStore(clientId)
  const next: ClientDocumentRecord = { ...record, updatedAt: new Date().toISOString() }
  await writeDocumentStore(clientId, {
    ...store,
    documents: { ...store.documents, [record.id]: next },
  })
  return next
}

export async function patchDocument(
  clientId: string,
  documentId: string,
  patch: Partial<Omit<ClientDocumentRecord, 'id' | 'clientId' | 'createdAt'>>
): Promise<ClientDocumentRecord | null> {
  const current = await getDocument(clientId, documentId)
  if (!current) return null
  return upsertDocument(clientId, { ...current, ...patch, id: current.id })
}

/** Remove o registro e, quando houver, o arquivo original no Blob. */
export async function deleteDocument(clientId: string, documentId: string): Promise<boolean> {
  const store = await readDocumentStore(clientId)
  const record = store.documents[documentId]
  if (!record) return false

  if (record.pathname) {
    try {
      await deleteDocumentBlob(record.pathname)
    } catch (error) {
      // Órfão no storage é preferível a travar a remoção para o usuário.
      console.warn('[documents/store] falha ao remover o arquivo no Blob:', error)
    }
  }

  const documents = { ...store.documents }
  delete documents[documentId]
  await writeDocumentStore(clientId, { ...store, documents })
  return true
}

/** Usado nos testes para isolar o cache entre casos. */
export function resetDocumentStoreCache(): void {
  memory.clear()
}
