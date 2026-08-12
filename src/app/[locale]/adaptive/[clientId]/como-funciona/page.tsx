import { notFound } from 'next/navigation'
import { getAssessment } from '@/lib/assessment/registry'
import { HowItWorksView } from '@/components/assessment/how-it-works-view'

export default async function AssessmentHowItWorksPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const workspace = getAssessment(clientId)
  if (!workspace) notFound()
  return <HowItWorksView basePath={`/adaptive/${workspace.client.slug}`} />
}
