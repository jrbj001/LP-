import { notFound } from 'next/navigation'
import { ArchiveFolderPage } from '@/components/alquimia/space/archive-pages'
import { canOpenArchive, getArchiveFolder } from '@/lib/alquimia/documents'

export default async function EngagementArchiveFolderRoute({
  params,
}: {
  params: Promise<{ locale: string; clientId: string; folder: string }>
}) {
  const { locale, clientId, folder } = await params
  if (!canOpenArchive(clientId) || !getArchiveFolder(folder)) notFound()
  return <ArchiveFolderPage locale={locale} folderId={folder} engagementId={clientId} />
}
