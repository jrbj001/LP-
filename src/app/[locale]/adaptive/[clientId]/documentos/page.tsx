import { notFound } from 'next/navigation'
import { getAssessment } from '@/lib/assessment/registry'
import { DocumentsView } from '@/components/assessment/documents-view'

export default async function AssessmentDocumentsPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const workspace = getAssessment(clientId)
  if (!workspace || !workspace.documents) notFound()
  return <DocumentsView documents={workspace.documents} />
}
