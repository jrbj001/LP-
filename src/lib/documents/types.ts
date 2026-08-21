import type { BacklogBoardId, BacklogDiagram } from '@/lib/backlog/types'

export const DOCUMENT_STORE_VERSION = 1

/** Teto por arquivo enviado. Acima disso a extração fica caro e lenta demais. */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

/** Texto máximo levado ao prompt — o excedente é truncado e sinalizado. */
export const MAX_EXTRACTED_CHARS = 120_000

export type DocumentKind = 'spreadsheet' | 'document' | 'pdf' | 'image' | 'text'

export type DocumentStatus = 'uploaded' | 'extracted' | 'ready' | 'failed'

export type ExtractionMethod = 'exceljs' | 'mammoth' | 'unpdf' | 'vision' | 'plain'

export interface DocumentExtraction {
  text: string
  charCount: number
  truncated: boolean
  method: ExtractionMethod
  /** Páginas (pdf) ou abas (planilha) lidas. */
  pages?: number
  sheets?: string[]
  extractedAt: string
}

export interface WorkPlanMilestone {
  id: string
  title: string
  objective: string
  deliverables: string[]
  acceptanceCriteria: string[]
  window?: string
}

export interface WorkPlanArtifact {
  title: string
  summary: string
  milestones: WorkPlanMilestone[]
  risks: string[]
  generatedAt: string
}

export interface ArchitectureComponent {
  name: string
  responsibility: string
  /** Repos/arquivos reais citados pelo grounding do GitHub. */
  touchpoints: string[]
}

export interface ArchitectureArtifact {
  title: string
  overview: string
  components: ArchitectureComponent[]
  integrations: string[]
  decisions: string[]
  risks: string[]
  diagram?: BacklogDiagram
  generatedAt: string
}

export type DocumentDraftMode = 'requirement' | 'story'

export interface DocumentBacklogDraft {
  id: string
  mode: DocumentDraftMode
  boardId: BacklogBoardId
  title: string
  priority: 'Alta' | 'Média' | 'Baixa'
  context: string
  persona?: string
  want?: string
  soThat?: string
  acceptance?: string[]
  alreadyExported: boolean
}

export interface DocumentArtifacts {
  workPlan?: WorkPlanArtifact
  architecture?: ArchitectureArtifact
  /** Sem `alreadyExported` — calculado contra o backlog na leitura. */
  backlogDrafts?: Omit<DocumentBacklogDraft, 'alreadyExported'>[]
  generatedAt: string
}

export interface ClientDocumentRecord {
  id: string
  clientId: string
  title: string
  fileName: string
  mimeType: string
  sizeBytes: number
  kind: DocumentKind
  /** Board usado para o grounding no GitHub e destino dos cards. */
  boardId?: BacklogBoardId
  /**
   * Caminho do arquivo no Blob. Ausente quando a fonte é texto colado ou link
   * externo. É o handle canônico: o blob é privado e não se lê pela URL.
   */
  pathname?: string
  /** Link de origem quando registrado por URL (Notion, Drive, etc). */
  sourceUrl?: string
  status: DocumentStatus
  error?: string
  extraction?: DocumentExtraction
  artifacts?: DocumentArtifacts
  createdAt: string
  updatedAt: string
}

export interface DocumentStorePayload {
  version: number
  clientId: string
  updatedAt: string
  documents: Record<string, ClientDocumentRecord>
}

const KIND_BY_EXTENSION: Record<string, DocumentKind> = {
  xlsx: 'spreadsheet',
  xlsm: 'spreadsheet',
  csv: 'spreadsheet',
  docx: 'document',
  pdf: 'pdf',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  webp: 'image',
  gif: 'image',
  txt: 'text',
  md: 'text',
  json: 'text',
}

export function extensionOf(fileName: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim())
  return match ? match[1].toLowerCase() : ''
}

/**
 * Resolve o formato pela extensão e, como reforço, pelo mime. A extensão vem
 * primeiro porque navegadores reportam mime vazio ou genérico com frequência.
 */
export function detectDocumentKind(fileName: string, mimeType: string): DocumentKind | null {
  const byExtension = KIND_BY_EXTENSION[extensionOf(fileName)]
  if (byExtension) return byExtension

  const mime = mimeType.toLowerCase()
  if (mime.startsWith('image/')) return 'image'
  if (mime === 'application/pdf') return 'pdf'
  if (mime.includes('spreadsheet') || mime === 'text/csv') return 'spreadsheet'
  if (mime.includes('wordprocessingml')) return 'document'
  if (mime.startsWith('text/')) return 'text'
  return null
}

export const ACCEPTED_UPLOAD_EXTENSIONS = Object.keys(KIND_BY_EXTENSION)

export function documentSourceRef(documentId: string, title: string): string {
  return `document:${documentId}:${normalizeDraftTitle(title)}`
}

export function normalizeDraftTitle(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120)
}
