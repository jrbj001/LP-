import { notFound } from 'next/navigation'
import { getAssessment } from '@/lib/assessment/registry'
import { LgpdNdaView } from '@/components/assessment/lgpd-nda-view'

export default async function AssessmentLgpdNdaPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const workspace = getAssessment(clientId)
  if (!workspace?.features.includes('lgpdNda')) notFound()
  return <LgpdNdaView />
}
