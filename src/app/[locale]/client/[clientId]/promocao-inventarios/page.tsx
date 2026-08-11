import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { ColmeiaPromocaoInventariosView } from '@/components/client/documents/colmeia-promocao-inventarios-view'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') {
    return { title: 'Promoção de inventários | PixelPulseLab' }
  }
  return {
    title: `Promoção de inventários ao Banco de Ativos | ${client.name}`,
    description:
      'Relatório operacional: 19 lotes promovidos, 4.881 pontos inseridos e integração do inventário de exibidores ao bancoAtivosJoin_ft.',
    robots: { index: false, follow: false },
  }
}

export default async function ColmeiaPromocaoInventariosPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client || client.slug !== 'be180-ooh') notFound()

  return (
    <ColmeiaPromocaoInventariosView
      locale={locale}
      clientSlug={client.slug}
      accent={client.accent}
    />
  )
}
