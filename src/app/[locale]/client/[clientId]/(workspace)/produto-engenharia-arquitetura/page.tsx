import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Be180ProductArchitectureView } from '@/components/client/documents/be180-product-architecture-view'
import { getClient } from '@/lib/client/registry'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)

  return {
    title: client
      ? `Produto, Engenharia & Arquitetura | ${client.name}`
      : 'Produto, Engenharia & Arquitetura | PixelPulseLab',
    description:
      'Mapa integrado de produto, features, engenharia, arquitetura e roadmap M0–M4 do ecossistema Be180.',
    robots: { index: false, follow: false },
  }
}

export default async function Be180ProductArchitecturePage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') notFound()

  return (
    <Be180ProductArchitectureView
      locale={locale}
      clientSlug={client.slug}
      accent={client.accent}
    />
  )
}
