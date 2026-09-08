import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { ColmeiaManualView } from '@/components/client/documents/colmeia-manual-view'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') {
    return { title: 'Manual do Produto | PixelPulseLab' }
  }
  return {
    title: `Manual do Produto · Colmeia | ${client.name}`,
    description:
      'Visão, arquitetura, personas, fluxos, Banco de Ativos, módulos e métricas OOH do Colmeia — em formato web ilustrado.',
    robots: { index: false, follow: false },
  }
}

export default async function ColmeiaManualPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') notFound()

  return (
    <ColmeiaManualView
      locale={locale}
      clientSlug={client.slug}
      accent={client.accent}
    />
  )
}
