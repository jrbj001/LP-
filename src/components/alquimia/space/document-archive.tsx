'use client'

import { useMemo, useState } from 'react'
import {
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Presentation,
  Search,
} from 'lucide-react'
import type { ArchiveDocument, ArchiveFolder, DocumentKind } from '@/lib/alquimia/documents'
import { kindLabel } from '@/lib/alquimia/documents'
import { SectionHeader } from './space-ui'

function KindIcon({ kind }: { kind: DocumentKind }) {
  if (kind === 'spreadsheet') return <FileSpreadsheet className="h-4 w-4 text-[#00435D]" />
  if (kind === 'presentation') return <Presentation className="h-4 w-4 text-[#00435D]" />
  return <FileText className="h-4 w-4 text-[#00435D]" />
}

export function DocumentFolderGrid({
  folders,
  counts,
  baseHref,
}: {
  folders: ArchiveFolder[]
  counts: Record<string, number>
  baseHref: string
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {folders.map(folder => (
        <a
          key={folder.id}
          href={`${baseHref}/${folder.id}`}
          className="group rounded-2xl border border-black/[0.07] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#00435D]/25 hover:shadow-[0_16px_40px_rgba(0,67,93,0.08)]"
        >
          <span className="text-[10px] font-semibold text-[#E0CE7A]">
            {folder.driveFolder.slice(0, 2)}
          </span>
          <h3 className="mt-6 text-[14px] font-semibold text-[#003b52]">{folder.title}</h3>
          <p className="mt-2 min-h-10 text-[10px] leading-relaxed text-black/40">{folder.description}</p>
          <p className="mt-4 text-[10px] font-medium text-[#00435D]">
            {counts[folder.id] ?? 0} arquivo{(counts[folder.id] ?? 0) === 1 ? '' : 's'}
          </p>
        </a>
      ))}
    </div>
  )
}

export function DocumentList({
  documents,
  folder,
  baseHref,
  availability,
}: {
  documents: ArchiveDocument[]
  folder?: ArchiveFolder
  baseHref: string
  availability: Record<string, boolean>
}) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('pt-BR')
    if (!needle) return documents
    return documents.filter(item =>
      `${item.title} ${item.filename} ${item.subsection ?? ''}`.toLocaleLowerCase('pt-BR').includes(needle)
    )
  }, [documents, query])

  const groups = useMemo(() => {
    const map = new Map<string, ArchiveDocument[]>()
    for (const item of filtered) {
      const key = item.subsection || 'Geral'
      map.set(key, [...(map.get(key) ?? []), item])
    }
    return [...map.entries()]
  }, [filtered])

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4">
        <Search className="h-4 w-4 text-black/30" />
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={folder ? `Buscar em ${folder.title}` : 'Buscar no arquivo'}
          className="min-w-0 flex-1 bg-transparent py-3.5 text-[13px] outline-none placeholder:text-black/30"
        />
      </div>
      {groups.map(([group, items]) => (
        <section key={group} className="mb-8">
          {groups.length > 1 && (
            <SectionHeader title={group} detail={`${items.length}`} />
          )}
          <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
            {items.map(item => {
              const local = availability[item.id]
              return (
                <a
                  key={item.id}
                  href={`${baseHref}/${item.folderId}/${item.slug}`}
                  className="flex items-center gap-4 border-b border-black/[0.06] px-5 py-4 last:border-b-0 hover:bg-[#F7F5ED]/80"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00435D]/7">
                    <KindIcon kind={item.kind} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#003b52]">{item.title}</p>
                    <p className="mt-0.5 text-[10px] text-black/35">
                      {kindLabel(item.kind)} · {item.filename}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                      local ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {local ? 'No space' : 'Drive'}
                  </span>
                </a>
              )
            })}
          </div>
        </section>
      ))}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white/45 px-6 py-10 text-center">
          <FolderOpen className="mx-auto h-5 w-5 text-[#00435D]" />
          <p className="mt-3 text-[13px] font-medium text-[#003b52]">Nenhum documento nesta busca.</p>
        </div>
      )}
    </div>
  )
}
