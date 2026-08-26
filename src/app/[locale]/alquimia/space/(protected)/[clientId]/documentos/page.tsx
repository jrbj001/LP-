import { notFound } from 'next/navigation'
import { ArchiveHome } from '@/components/alquimia/space/archive-pages'
import { canOpenArchive } from '@/lib/alquimia/documents'
import { getSpaceEngagement } from '@/lib/alquimia/engagements'

export default async function EngagementArchivePage({
  params,
}: {
  params: Promise<{ locale: string; clientId: string }>
}) {
  const { locale, clientId } = await params
  if (!getSpaceEngagement(clientId) || !canOpenArchive(clientId)) notFound()
  return <ArchiveHome locale={locale} engagementId={clientId} />
}
