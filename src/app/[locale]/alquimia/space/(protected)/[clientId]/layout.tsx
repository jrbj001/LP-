import { notFound, redirect } from 'next/navigation'
import { canAccessEngagement, getAlquimiaSession } from '@/lib/alquimia/auth'
import { KNOWN_ENGAGEMENT_IDS } from '@/lib/alquimia/engagements'

export default async function AlquimiaEngagementLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string; clientId: string }>
}) {
  const { locale, clientId } = await params
  if (!KNOWN_ENGAGEMENT_IDS.has(clientId)) notFound()
  const session = await getAlquimiaSession()
  if (!session) redirect(`/${locale}/alquimia/space/login`)
  if (!canAccessEngagement(session, clientId)) notFound()
  return children
}
