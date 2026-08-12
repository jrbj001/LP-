import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAssessment } from '@/lib/assessment/registry'
import { AssessmentGate } from '@/components/assessment/assessment-gate'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clientId: string }>
}): Promise<Metadata> {
  const { clientId } = await params
  const workspace = getAssessment(clientId)
  if (!workspace) return {}
  return {
    title: `${workspace.client.name} · Assessment | PixelPulseLab`,
    description: workspace.client.tagline,
  }
}

export default async function AssessmentTenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  const workspace = getAssessment(clientId)
  if (!workspace) notFound()
  return (
    <AssessmentGate
      slug={workspace.client.slug}
      clientName={workspace.client.name}
      password={workspace.password}
    >
      {children}
    </AssessmentGate>
  )
}
