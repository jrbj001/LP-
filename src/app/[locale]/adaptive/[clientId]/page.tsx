import { notFound } from 'next/navigation'
import { getAssessment } from '@/lib/assessment/registry'
import { HomeView } from '@/components/assessment/home-view'

export default async function AssessmentHomePage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const workspace = getAssessment(clientId)
  if (!workspace) notFound()
  return <HomeView workspace={workspace} />
}
