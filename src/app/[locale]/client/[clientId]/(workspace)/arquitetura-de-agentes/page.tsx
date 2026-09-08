import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { ColmeiaAgentArchitectureView } from '@/components/client/documents/colmeia-agent-architecture-view'
import { LikeMeAdaptiveArchitectureView } from '@/components/client/documents/likeme-adaptive-architecture-view'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) {
    return { title: 'Arquitetura de Agentes | PixelPulseLab' }
  }
  if (client.slug === 'likeme') {
    return {
      title: `Arquitetura do Produto · Adaptive Layer & Agentes | ${client.name}`,
      description:
        'Estudo técnico-executivo da arquitetura atual do Like:Me e sua evolução com Adaptive Layer e agentes especializados.',
      robots: { index: false, follow: false },
    }
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
  if (!client || !['be180-ooh', 'likeme'].includes(client.slug)) notFound()

  if (client.slug === 'likeme') {
    return (
      <LikeMeAdaptiveArchitectureView
        locale={locale}
        clientSlug={client.slug}
        accent={client.accent}
      />
    )
  }

  return (
    <ColmeiaAgentArchitectureView
      locale={locale}
      clientSlug={client.slug}
      accent={client.accent}
    />
  )
}
