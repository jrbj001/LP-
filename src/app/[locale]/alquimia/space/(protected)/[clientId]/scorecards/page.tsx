import { ScorecardsView } from '@/components/alquimia/space/engagement-views'

export default async function AlquimiaScorecardsPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  return <ScorecardsView clientId={clientId} />
}
