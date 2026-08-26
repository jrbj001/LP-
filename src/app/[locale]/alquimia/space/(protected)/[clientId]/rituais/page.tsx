import { RitualsView } from '@/components/alquimia/space/engagement-views'

export default async function AlquimiaRitualsPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  return <RitualsView clientId={clientId} />
}
