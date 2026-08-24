import { notFound, redirect } from 'next/navigation'
import { canAccessEngagement, getAlquimiaSession } from '@/lib/alquimia/auth'

const KNOWN_ENGAGEMENTS = new Set(['aurora-industrial', 'nexo-servicos'])

export default async function AlquimiaEngagementLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string; clientId: string }>
}) {
  const { locale, clientId } = await params
  if (!KNOWN_ENGAGEMENTS.has(clientId)) notFound()
  const session = await getAlquimiaSession()
  if (!session) redirect(`/${locale}/alquimia/space/login`)
  if (!canAccessEngagement(session, clientId)) notFound()
  return children
}
