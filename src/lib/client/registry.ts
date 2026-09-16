import { adaptiveLayer } from '@/components/client/tenants/adaptive-layer'
import { be180Ooh } from '@/components/client/tenants/be180-ooh'
import { cadence } from '@/components/client/tenants/cadence'
import { cafeOrfeu } from '@/components/client/tenants/cafe-orfeu'
import { likeMe } from '@/components/client/tenants/likeme'
import type { ClientWorkspace } from '@/lib/client/types'

const CLIENTS: ClientWorkspace[] = [be180Ooh, likeMe, cafeOrfeu, cadence, adaptiveLayer]

export function listClients(): ClientWorkspace[] {
  return CLIENTS
}

export function getClient(slug: string): ClientWorkspace | undefined {
  return CLIENTS.find(
    c => c.slug === slug || c.id === slug || c.aliases?.includes(slug)
  )
}

export function getClientEntryHref(locale: string, client: ClientWorkspace): string {
  return client.entryPath ? `/${locale}${client.entryPath}` : `/${locale}/client/${client.slug}`
}

export function getClientOrThrow(slug: string): ClientWorkspace {
  const client = getClient(slug)
  if (!client) throw new Error(`Client workspace not found: ${slug}`)
  return client
}
