import { EvidenceView } from '@/components/alquimia/space/engagement-views'

export default async function AlquimiaEvidencePage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  return <EvidenceView clientId={clientId} />
}
