import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { ColmeiaAgentArchitectureView } from '@/components/client/documents/colmeia-agent-architecture-view'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') {
    return { title: 'Arquitetura de Agentes | PixelPulseLab' }
  }
  return {
    title: `Arquitetura de Agentes · Colmeia | ${client.name}`,
    description:
      'Roadmap integrado de infraestrutura, Adaptive Layer™ e agentes para automatizar a jornada OOH do Colmeia.',
    robots: { index: false, follow: false },
  }
}

export default async function ColmeiaAgentArchitecturePage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') notFound()

  return (
    <ColmeiaAgentArchitectureView
      locale={locale}
      clientSlug={client.slug}
      accent={client.accent}
    />
  )
}
