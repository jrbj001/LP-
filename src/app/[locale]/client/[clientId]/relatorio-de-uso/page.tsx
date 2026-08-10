import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { ColmeiaUsageView } from '@/components/client/documents/colmeia-usage-view'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') {
    return { title: 'Relatório de Uso do Produto | PixelPulseLab' }
  }
  return {
    title: `Relatório de Uso do Produto · Colmeia | ${client.name}`,
    description:
      'Adoção, engajamento, roteiros e inventário de exibidores do Colmeia, com leitura assistida por IA.',
    robots: { index: false, follow: false },
  }
}

export default async function ColmeiaUsagePage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') notFound()

  return (
    <ColmeiaUsageView
      locale={locale}
      clientSlug={client.slug}
      accent={client.accent}
    />
  )
}
