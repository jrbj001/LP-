import { notFound } from 'next/navigation'
import { getAssessment } from '@/lib/assessment/registry'
import { DiagnosticView } from '@/components/assessment/diagnostic-view'

export default async function AssessmentDiagnosticPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const workspace = getAssessment(clientId)
  if (!workspace || !workspace.diagnostic) notFound()
  return <DiagnosticView diagnostic={workspace.diagnostic} />
}
