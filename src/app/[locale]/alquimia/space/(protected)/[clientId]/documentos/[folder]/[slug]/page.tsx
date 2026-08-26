import { notFound } from 'next/navigation'
import { DocumentViewer } from '@/components/alquimia/space/document-viewer'
import { SpacePage } from '@/components/alquimia/space/space-ui'
import { canOpenArchive, getArchiveDocument, getArchiveFolder } from '@/lib/alquimia/documents'
import { getSpaceEngagement } from '@/lib/alquimia/engagements'

export default async function EngagementArchiveDocumentRoute({
  params,
}: {
  params: Promise<{ locale: string; clientId: string; folder: string; slug: string }>
}) {
  const { locale, clientId, folder, slug } = await params
  const archiveFolder = getArchiveFolder(folder)
  const document = getArchiveDocument(folder, slug)
  const engagement = getSpaceEngagement(clientId)
  if (!canOpenArchive(clientId) || !archiveFolder || !document || !engagement) notFound()
  const backHref = `/${locale}/alquimia/space/${clientId}/documentos/${folder}`
  return (
    <SpacePage
      eyebrow={`${engagement.name} · ${archiveFolder.title}`}
      title={document.title}
      description="Leitura no space, download autenticado e o original no Drive."
    >
      <DocumentViewer document={document} folder={archiveFolder} backHref={backHref} />
    </SpacePage>
  )
}
