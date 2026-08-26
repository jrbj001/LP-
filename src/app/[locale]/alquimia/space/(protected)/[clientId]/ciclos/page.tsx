import { CyclesView } from '@/components/alquimia/space/engagement-views'

export default async function AlquimiaCyclesPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  return <CyclesView clientId={clientId} />
}
