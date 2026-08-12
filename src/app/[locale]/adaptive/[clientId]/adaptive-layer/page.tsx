import { notFound } from 'next/navigation'
import { getAssessment } from '@/lib/assessment/registry'
import { LayerApplicationView } from '@/components/assessment/layer-application-view'

export default async function AssessmentLayerPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const workspace = getAssessment(clientId)
  if (!workspace || !workspace.layer) notFound()
  return <LayerApplicationView layer={workspace.layer} basePath={`/adaptive/${workspace.client.slug}`} />
}
