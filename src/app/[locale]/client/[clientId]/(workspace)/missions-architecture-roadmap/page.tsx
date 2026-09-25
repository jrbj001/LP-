import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PixelMissionsRoadmapView } from '@/components/client/documents/pixel-missions-roadmap-view'
import { getClient } from '@/lib/client/registry'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)

  return {
    title: client
      ? `Missions Architecture & Execution Roadmap | ${client.name}`
      : 'Missions Architecture & Execution Roadmap | PixelPulseLab',
    description:
      'Roadmap de Product e Engineering para a primeira Mission end-to-end do Pixel Runtime.',
    robots: { index: false, follow: false },
  }
}

export default async function MissionsArchitectureRoadmapPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'adaptive-layer') notFound()

  return (
    <PixelMissionsRoadmapView
      locale={locale}
      clientSlug={client.slug}
      accent={client.accent}
    />
  )
}
