import { notFound } from 'next/navigation'
import { DocumentViewer } from '@/components/alquimia/space/document-viewer'
import { SpacePage } from '@/components/alquimia/space/space-ui'
import { getArchiveDocument, getArchiveFolder } from '@/lib/alquimia/documents'

export default async function AlquimiaArchiveDocumentRoute({
  params,
}: {
  params: Promise<{ locale: string; folder: string; slug: string }>
}) {
  const { locale, folder, slug } = await params
  const archiveFolder = getArchiveFolder(folder)
  const document = getArchiveDocument(folder, slug)
  if (!archiveFolder || !document) notFound()
  const backHref = `/${locale}/alquimia/space/documentos/${folder}`
  return (
    <SpacePage
      eyebrow={`Arquivo · ${archiveFolder.title}`}
      title={document.title}
      description="Leitura no space, download autenticado e o original no Drive."
    >
      <DocumentViewer document={document} folder={archiveFolder} backHref={backHref} />
    </SpacePage>
  )
}
