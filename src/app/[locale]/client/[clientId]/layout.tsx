import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { ClientShell } from '@/components/client/client-shell'

type Props = {
  children: React.ReactNode
  params: Promise<{ clientId: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ clientId: string }> }): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) return { title: 'Cliente | PixelPulseLab' }
  return {
    title: `${client.name} | Área do Cliente · PixelPulseLab`,
    description: client.tagline,
  }
}

export default async function ClientWorkspaceLayout({ children, params }: Props) {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()

  return <ClientShell client={client}>{children}</ClientShell>
}
