import { be180Ooh } from '@/components/client/tenants/be180-ooh'
import type { ClientWorkspace } from '@/lib/client/types'

const CLIENTS: ClientWorkspace[] = [be180Ooh]

export function listClients(): ClientWorkspace[] {
  return CLIENTS
}

export function getClient(slug: string): ClientWorkspace | undefined {
  return CLIENTS.find(c => c.slug === slug || c.id === slug)
}

export function getClientOrThrow(slug: string): ClientWorkspace {
  const client = getClient(slug)
  if (!client) throw new Error(`Client workspace not found: ${slug}`)
  return client
}
