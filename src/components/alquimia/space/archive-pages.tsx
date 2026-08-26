import { DocumentFolderGrid, DocumentList } from '@/components/alquimia/space/document-archive'
import { MarkdownDoc } from '@/components/alquimia/space/markdown-doc'
import { SpacePage, StatCard } from '@/components/alquimia/space/space-ui'
import {
  ORFEU_DRIVE_FOLDER,
  archiveFolders,
  archiveStats,
  documentsInFolder,
  searchArchive,
} from '@/lib/alquimia/documents'
import { documentAvailability, resolveArchiveFile } from '@/lib/alquimia/documents-fs'
import { getSpaceEngagement } from '@/lib/alquimia/engagements'
import { readFileSync } from 'node:fs'

export function ArchiveHome({
  locale,
  engagementId,
}: {
  locale: string
  engagementId?: string
}) {
  const stats = archiveStats()
  const availability = documentAvailability(searchArchive(''))
  const localCount = Object.values(availability).filter(Boolean).length
  const engagement = engagementId ? getSpaceEngagement(engagementId) : undefined
  const base = engagementId
    ? `/${locale}/alquimia/space/${engagementId}/documentos`
    : `/${locale}/alquimia/space/documentos`
  const indexPath = resolveArchiveFile('00_INDEX.md')
  const indexSource = indexPath ? readFileSync(indexPath, 'utf8') : null

  return (
    <SpacePage
      eyebrow={engagement ? `${engagement.name} · Arquivo` : 'Partner command center · Arquivo'}
      title="Conteúdos finais, no lugar certo."
      description="O arquivo do engagement Orfeu × Alquemia, na mesma divisão do Drive: proposta, cases, workshops, atas, comercial, EUA, trade, mix, flagship e IA."
      action={
        <a
          href={ORFEU_DRIVE_FOLDER}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-3 text-[12px] font-semibold text-[#00435D]"
        >
          Pasta original
        </a>
      }
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pastas" value={String(stats.folders).padStart(2, '0')} detail="Divisão do Drive" />
        <StatCard label="Arquivos" value={String(stats.documents)} detail={`${localCount} já no space`} tone="gold" />
        <StatCard label="Notas e atas" value={String(stats.byKind.markdown)} detail="Markdown para leitura" tone="lilac" />
        <StatCard label="Apresentações" value={String(stats.byKind.presentation)} detail="PPTX, Keynote e PDF" tone="neutral" />
      </section>
      <section className="mt-10">
        <DocumentFolderGrid
          folders={archiveFolders}
          counts={stats.byFolder}
          baseHref={base}
        />
      </section>
      {indexSource && (
        <section className="mt-10 rounded-2xl border border-black/[0.07] bg-white p-6 sm:p-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#3A5976]">
            00 · Índice da curadoria
          </p>
          <div className="mt-5">
            <MarkdownDoc source={indexSource} />
          </div>
        </section>
      )}
    </SpacePage>
  )
}

export function ArchiveFolderPage({
  locale,
  folderId,
  engagementId,
}: {
  locale: string
  folderId: string
  engagementId?: string
}) {
  const folder = archiveFolders.find(item => item.id === folderId)
  if (!folder) return null
  const documents = documentsInFolder(folderId)
  const availability = documentAvailability(documents)
  const engagement = engagementId ? getSpaceEngagement(engagementId) : undefined
  const base = engagementId
    ? `/${locale}/alquimia/space/${engagementId}/documentos`
    : `/${locale}/alquimia/space/documentos`

  return (
    <SpacePage
      eyebrow={engagement ? `${engagement.name} · ${folder.title}` : `Arquivo · ${folder.title}`}
      title={folder.title}
      description={folder.description}
    >
      <DocumentList documents={documents} folder={folder} baseHref={base} availability={availability} />
    </SpacePage>
  )
}
