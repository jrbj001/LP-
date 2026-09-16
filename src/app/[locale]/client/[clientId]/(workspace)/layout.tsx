import { notFound, redirect } from 'next/navigation'
import { ClientShell } from '@/components/client/client-shell'
import { canAccessClient, getClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string; clientId: string }>
}

export default async function ClientWorkspaceLayout({ children, params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()
  if (clientId !== client.slug) redirect(`/${locale}/client/${client.slug}`)

  const session = await getClientSession()
  if (!session || !canAccessClient(session, client.slug)) {
    redirect(`/${locale}/client/${client.slug}/login`)
  }
  if (client.entryPath) redirect(`/${locale}${client.entryPath}`)

  return <ClientShell client={client}>{children}</ClientShell>
}
