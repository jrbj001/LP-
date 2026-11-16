import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LikeMeAvatarAnimadoView } from '@/components/client/documents/likeme-avatar-animado-view'
import { getClient } from '@/lib/client/registry'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)

  if (!client || client.slug !== 'likeme') {
    return { title: 'Documento não encontrado | PixelPulseLab' }
  }

  return {
    title: `Avatar animado | ${client.name}`,
    description:
      'Estudo e protótipo do avatar MENTE/CORPO animado do Like:Me: mapa de dados, regras de animação e card compartilhável Wrapped.',
    robots: { index: false, follow: false },
  }
}

export default async function LikeMeAvatarAnimadoPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)

  if (!client || client.slug !== 'likeme') notFound()

  return <LikeMeAvatarAnimadoView locale={locale} clientSlug={client.slug} accent={client.accent} />
}
