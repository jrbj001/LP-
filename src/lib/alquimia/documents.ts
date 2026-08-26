import catalog from './orfeu-documents.json'
import { engagementHasArchive } from './engagements'

export type DocumentKind = 'markdown' | 'pdf' | 'presentation' | 'spreadsheet' | 'document' | 'other'

export interface ArchiveFolder {
  id: string
  driveFolder: string
  title: string
  description: string
}

export interface ArchiveDocument {
  id: string
  slug: string
  folderId: string
  path: string
  title: string
  filename: string
  kind: DocumentKind
  extension: string
  driveUrl: string
  subsection?: string
}

export const ORFEU_ARCHIVE_ROOT = 'docs/alquimia/conteudos-finais'
export const ORFEU_DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1uXaauZnVFZYksgGMuZRSSlCy-5jo4D65'

export const archiveFolders: ArchiveFolder[] = [
  {
    id: 'proposta',
    driveFolder: '01_Proposta',
    title: 'Proposta',
    description: 'Proposta comercial Alquemia × Orfeu e versões de fechamento.',
  },
  {
    id: 'cases',
    driveFolder: '02_Cases_e_Benchmarks',
    title: 'Cases e benchmarks',
    description: 'Marcas de referência, métodos Orfeu e o framework DTC / marketplaces.',
  },
  {
    id: 'workshops',
    driveFolder: '03_Workshops',
    title: 'Workshops',
    description: 'Abertura, convites, plano comercial em sala e sínteses pós-workshop.',
  },
  {
    id: 'atas',
    driveFolder: '04_Atas_de_Reuniao',
    title: 'Atas de reunião',
    description: 'Memória das conversas com liderança, trade, omnichannel e financeiro.',
  },
  {
    id: 'comercial',
    driveFolder: '05_Comercial_e_Organograma',
    title: 'Comercial e organograma',
    description: 'Simulador, plano de ação, organograma 2026–2030 e competências de liderança.',
  },
  {
    id: 'expansao-eua',
    driveFolder: '06_Expansao_EUA',
    title: 'Expansão EUA',
    description: 'Pesquisa, GTM, cadeia, preços, tarifas e outreach de distribuidores.',
  },
  {
    id: 'trade',
    driveFolder: '07_Trade_Marketing_e_Categoria',
    title: 'Trade marketing e categoria',
    description: 'Jornada B2B, RACI, calendário omnichannel e gestão de categoria.',
  },
  {
    id: 'analytics',
    driveFolder: '08_Analytics_e_Mix',
    title: 'Analytics e mix',
    description: 'Indicadores de varejo, tendências de mercado e oportunidade de mix.',
  },
  {
    id: 'flagship',
    driveFolder: '09_Flagship_Loja_Conceito',
    title: 'Flagship e loja conceito',
    description: 'Estratégia da loja conceito e o resumo executivo de três páginas.',
  },
  {
    id: 'ia',
    driveFolder: '10_IA_PixelPulseLab',
    title: 'IA · PixelPulseLab',
    description: 'Priorização, rates, proposta completa e briefing de order-to-cash com IA.',
  },
]

const KIND_BY_EXTENSION: Record<string, DocumentKind> = {
  md: 'markdown',
  pdf: 'pdf',
  pptx: 'presentation',
  ppt: 'presentation',
  key: 'presentation',
  xlsx: 'spreadsheet',
  xls: 'spreadsheet',
  csv: 'spreadsheet',
  docx: 'document',
  doc: 'document',
}

function extensionOf(filename: string): string {
  const match = filename.match(/\.([a-z0-9]+)$/i)
  return match ? match[1].toLowerCase() : ''
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function fileKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]/g, '')
}

function titleFromFilename(filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, '')
  return stem
    .replace(/^\d{4}-\d{2}-\d{2}_/, '')
    .replace(/^Orfeu[-_]/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function folderForPath(relativePath: string): ArchiveFolder | undefined {
  if (relativePath === '00_INDEX.md') return undefined
  const top = relativePath.split('/')[0]
  return archiveFolders.find(folder => folder.driveFolder === top)
}

function buildDocuments(): ArchiveDocument[] {
  const usedSlugs = new Map<string, number>()
  return (catalog as Array<{ id: string; path: string; driveUrl: string }>).flatMap(entry => {
    if (entry.path === '00_INDEX.md') return []
    const folder = folderForPath(entry.path)
    if (!folder) return []
    const parts = entry.path.split('/')
    const filename = parts[parts.length - 1]
    const subsection = parts.length > 2 ? parts.slice(1, -1).join(' / ') : undefined
    const extension = extensionOf(filename)
    const baseSlug = slugify(filename.replace(/\.[^.]+$/, '')) || entry.id.slice(0, 8)
    const seen = usedSlugs.get(baseSlug) ?? 0
    usedSlugs.set(baseSlug, seen + 1)
    const slug = seen === 0 ? baseSlug : `${baseSlug}-${seen + 1}`
    return [{
      id: entry.id,
      slug,
      folderId: folder.id,
      path: entry.path,
      title: titleFromFilename(filename),
      filename,
      kind: KIND_BY_EXTENSION[extension] ?? 'other',
      extension,
      driveUrl: entry.driveUrl,
      subsection,
    }]
  })
}

export const archiveDocuments: ArchiveDocument[] = buildDocuments()

export function getArchiveFolder(id: string): ArchiveFolder | undefined {
  return archiveFolders.find(folder => folder.id === id)
}

export function documentsInFolder(folderId: string): ArchiveDocument[] {
  return archiveDocuments.filter(item => item.folderId === folderId)
}

export function getArchiveDocument(folderId: string, slug: string): ArchiveDocument | undefined {
  return archiveDocuments.find(item => item.folderId === folderId && item.slug === slug)
}

export function archiveStats() {
  const byFolder = Object.fromEntries(archiveFolders.map(folder => [folder.id, documentsInFolder(folder.id).length]))
  const byKind = archiveDocuments.reduce<Record<DocumentKind, number>>((acc, item) => {
    acc[item.kind] = (acc[item.kind] ?? 0) + 1
    return acc
  }, { markdown: 0, pdf: 0, presentation: 0, spreadsheet: 0, document: 0, other: 0 })
  return {
    folders: archiveFolders.length,
    documents: archiveDocuments.length,
    byFolder,
    byKind,
  }
}

export function searchArchive(query: string): ArchiveDocument[] {
  const needle = query.trim().toLocaleLowerCase('pt-BR')
  if (!needle) return archiveDocuments
  return archiveDocuments.filter(item =>
    `${item.title} ${item.filename} ${item.subsection ?? ''} ${item.folderId}`
      .toLocaleLowerCase('pt-BR')
      .includes(needle)
  )
}

export function kindLabel(kind: DocumentKind): string {
  switch (kind) {
    case 'markdown': return 'Nota'
    case 'pdf': return 'PDF'
    case 'presentation': return 'Apresentação'
    case 'spreadsheet': return 'Planilha'
    case 'document': return 'Documento'
    default: return 'Arquivo'
  }
}

export function validateArchive(): void {
  const folderIds = new Set(archiveFolders.map(item => item.id))
  const slugs = new Set<string>()
  const ids = new Set<string>()
  if (folderIds.size !== archiveFolders.length) throw new Error('Alquemia: pasta de arquivo duplicada')
  for (const item of archiveDocuments) {
    if (!folderIds.has(item.folderId)) throw new Error(`Alquemia: documento sem pasta: ${item.path}`)
    if (ids.has(item.id)) throw new Error(`Alquemia: id de documento duplicado: ${item.id}`)
    const key = `${item.folderId}/${item.slug}`
    if (slugs.has(key)) throw new Error(`Alquemia: slug duplicado: ${key}`)
    ids.add(item.id)
    slugs.add(key)
  }
}

export function canOpenArchive(engagementId: string): boolean {
  return engagementHasArchive(engagementId)
}

validateArchive()
