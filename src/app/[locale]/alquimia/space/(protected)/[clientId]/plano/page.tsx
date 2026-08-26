import { PlanView } from '@/components/alquimia/space/engagement-views'

export default async function AlquimiaPlanPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  return <PlanView clientId={clientId} />
}
