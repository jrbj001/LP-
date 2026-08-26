import { notFound } from 'next/navigation'
import { ArchiveFolderPage } from '@/components/alquimia/space/archive-pages'
import { getArchiveFolder } from '@/lib/alquimia/documents'

export default async function AlquimiaArchiveFolderRoute({
  params,
}: {
  params: Promise<{ locale: string; folder: string }>
}) {
  const { locale, folder } = await params
  if (!getArchiveFolder(folder)) notFound()
  return <ArchiveFolderPage locale={locale} folderId={folder} />
}
