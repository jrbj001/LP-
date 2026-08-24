import { ExecutiveView } from '@/components/alquimia/space/engagement-views'

export default async function AlquimiaEngagementPage({
  params,
}: {
  params: Promise<{ locale: string; clientId: string }>
}) {
  const { locale, clientId } = await params
  return <ExecutiveView locale={locale} clientId={clientId} />
}
