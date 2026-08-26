import { Download, ExternalLink } from 'lucide-react'
import mammoth from 'mammoth'
import type { ArchiveDocument, ArchiveFolder } from '@/lib/alquimia/documents'
import { kindLabel } from '@/lib/alquimia/documents'
import { readArchiveBuffer, readArchiveText, resolveArchiveFile } from '@/lib/alquimia/documents-fs'
import { MarkdownDoc } from './markdown-doc'
import { TextLink } from './space-ui'

function fileApiPath(doc: ArchiveDocument, inline = false): string {
  const encoded = doc.path.split('/').map(encodeURIComponent).join('/')
  return `/api/alquimia/documents/${encoded}${inline ? '?inline=1' : ''}`
}

export async function DocumentViewer({
  document,
  folder,
  backHref,
}: {
  document: ArchiveDocument
  folder: ArchiveFolder
  backHref: string
}) {
  const localPath = resolveArchiveFile(document.path)
  const available = Boolean(localPath)
  let markdown: string | null = null
  let docxHtml: string | null = null

  if (available && document.kind === 'markdown') {
    markdown = readArchiveText(document)
  }
  if (available && document.extension === 'docx') {
    const buffer = readArchiveBuffer(document)
    if (buffer) {
      try {
        const result = await mammoth.convertToHtml({ buffer })
        docxHtml = result.value
      } catch {
        docxHtml = null
      }
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <article className="rounded-2xl border border-black/[0.07] bg-white p-6 sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3A5976]">
          {folder.title}
          {document.subsection ? ` · ${document.subsection}` : ''}
        </p>
        <h2 className="mt-2 text-[26px] font-medium tracking-[-0.03em] text-[#003b52]">{document.title}</h2>
        <p className="mt-2 text-[12px] text-black/40">
          {kindLabel(document.kind)} · {document.filename}
        </p>

        <div className="mt-8">
          {!available && (
            <p className="text-[13px] leading-relaxed text-black/55">
              Este arquivo ainda não foi copiado para o space. Abra o original no Drive enquanto o
              arquivo local não estiver disponível.
            </p>
          )}
          {markdown && <MarkdownDoc source={markdown} />}
          {docxHtml && (
            <div
              className="prose-alquimia space-y-3 text-[13.5px] leading-relaxed text-black/70 [&_h1]:text-[22px] [&_h1]:font-medium [&_h1]:text-[#003b52] [&_h2]:text-[16px] [&_h2]:font-semibold [&_h2]:text-[#003b52] [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: docxHtml }}
            />
          )}
          {available && document.kind === 'pdf' && (
            <iframe
              title={document.title}
              src={fileApiPath(document, true)}
              className="h-[min(80vh,920px)] w-full rounded-xl border border-black/10 bg-[#F7F5ED]"
            />
          )}
          {available && !markdown && !docxHtml && document.kind !== 'pdf' && (
            <p className="text-[13px] leading-relaxed text-black/55">
              Pré-visualização nativa ainda não está disponível para este formato. Baixe o arquivo
              ou abra no Drive.
            </p>
          )}
        </div>
      </article>

      <aside className="h-fit rounded-2xl border border-black/[0.07] bg-white p-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#3A5976]">Arquivo</p>
        <p className="mt-2 text-[13px] font-semibold text-[#003b52]">{document.filename}</p>
        <p className="mt-1 text-[11px] text-black/40">{available ? 'Disponível no space' : 'Somente no Drive'}</p>
        <div className="mt-5 space-y-2">
          {available && (
            <a
              href={fileApiPath(document)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#00435D] px-4 py-3 text-[12px] font-semibold text-white"
            >
              <Download className="h-3.5 w-3.5" />
              Baixar
            </a>
          )}
          <a
            href={document.driveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-[12px] font-semibold text-[#00435D]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Abrir no Drive
          </a>
          <TextLink href={backHref}>Voltar à pasta</TextLink>
        </div>
      </aside>
    </div>
  )
}
