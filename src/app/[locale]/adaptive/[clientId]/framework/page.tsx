import { notFound } from 'next/navigation'
import { getAssessment } from '@/lib/assessment/registry'
import { FrameworkView } from '@/components/assessment/framework-view'

export default async function AssessmentFrameworkPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const workspace = getAssessment(clientId)
  if (!workspace || !workspace.features.includes('framework')) notFound()
  return <FrameworkView />
}
