import { listClients } from '@/lib/client/registry'
import { ClientHub } from '@/components/client/client-hub'

export default function ClientPage() {
  const clients = listClients()
  return <ClientHub clients={clients} />
}
