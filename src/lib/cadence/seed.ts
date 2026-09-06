import 'server-only'

import { mergeCards, readBacklogStore } from '@/lib/backlog/store'
import { getClient } from '@/lib/client/registry'
import { readDeliveryCache } from '@/lib/delivery/cache'
import { listDocuments } from '@/lib/documents/store'
import { hasCadenceDatabase } from './db'
import { syncCadenceCards, syncCadenceDelivery, syncCadenceDocuments, syncCadenceMeetings } from './sync'

/** Snapshot inicial a partir dos JSON/tenants — idempotente (replace por client_id). */
export async function seedCadenceClient(clientId: string): Promise<void> {
  if (!hasCadenceDatabase()) return

  const store = await readBacklogStore(clientId)
  await syncCadenceCards(clientId, mergeCards(store))

  const delivery = await readDeliveryCache(clientId)
  if (delivery) await syncCadenceDelivery(clientId, delivery)

  const client = getClient(clientId)
  if (client?.meetings?.length) await syncCadenceMeetings(clientId, client.meetings)

  try {
    const documents = await listDocuments(clientId)
    if (documents.length > 0) await syncCadenceDocuments(clientId, documents)
  } catch {
    /* Blob ausente: o índice de docs fica vazio até o primeiro upload. */
  }
}
