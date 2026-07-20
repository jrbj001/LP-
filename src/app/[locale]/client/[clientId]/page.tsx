import { notFound } from 'next/navigation'
import { getClient, listClients } from '@/lib/client/registry'
import { ClientHome } from '@/components/client/client-home'

type Props = {
  params: Promise<{ clientId: string }>
}

export function generateStaticParams() {
  return listClients().map(c => ({ clientId: c.slug }))
}

export default async function ClientWorkspacePage({ params }: Props) {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()

  return <ClientHome client={client} />
}
