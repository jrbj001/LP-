import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CadenceSandbox } from '@/components/meeting-agent/cadence-sandbox'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { getClient } from '@/lib/client/registry'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export const metadata: Metadata = {
  title: 'Sandbox do Cadence | PixelPulseLab',
  robots: { index: false, follow: false },
}

export default async function CadenceSandboxPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client || !isBacklogEnabled(client.slug)) notFound()

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10 2xl:px-14">
      <CadenceSandbox clientId={client.slug} backHref={`/${locale}/client/${client.slug}/reunioes`} />
    </div>
  )
}
