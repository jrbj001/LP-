import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LikeMeGamaFundView } from '@/components/client/documents/likeme-gama-fund-view'
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
    title: `Like:Me × Gama Fund | ${client.name}`,
    description:
      'Estratégia de evolução do Like:Me para uma tese AI-native aderente ao Gama Fund, com GLP-1, Gemini e roadmap de 90 dias.',
    robots: { index: false, follow: false },
  }
}

export default async function LikeMeGamaFundPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)

  if (!client || client.slug !== 'likeme') notFound()

  return <LikeMeGamaFundView locale={locale} clientSlug={client.slug} accent={client.accent} />
}
