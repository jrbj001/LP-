import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MissionsSdkRevetorizacaoView } from '@/components/client/documents/missions-sdk-revetorizacao-view'
import { getClient } from '@/lib/client/registry'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)

  return {
    title: client
      ? `SDK de Missions e revetorização | ${client.name}`
      : 'SDK de Missions e revetorização | PixelPulseLab',
    description:
      'Plano de trabalho dividido em três frentes: SDK de Missions (tipos e cliente) e revetorização de embeddings/RAG.',
    robots: { index: false, follow: false },
  }
}

export default async function MissionsSdkRevetorizacaoPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'adaptive-layer') notFound()

  return (
    <MissionsSdkRevetorizacaoView
      locale={locale}
      clientSlug={client.slug}
      accent={client.accent}
    />
  )
}
