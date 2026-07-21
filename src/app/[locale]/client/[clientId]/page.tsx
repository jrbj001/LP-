import { notFound } from 'next/navigation'
import { getClient, listClients } from '@/lib/client/registry'
import { getDeliveryTeaser } from '@/lib/delivery/teaser'
import { ClientHome } from '@/components/client/client-home'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export function generateStaticParams() {
  return listClients().map(c => ({ clientId: c.slug }))
}

export default async function ClientWorkspacePage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()

  const deliveryTeaser = client.delivery?.repos.length
    ? await getDeliveryTeaser(client.slug)
    : null

  return <ClientHome client={client} locale={locale} deliveryTeaser={deliveryTeaser} />
}
