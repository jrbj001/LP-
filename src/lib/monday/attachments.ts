import { extractDocumentText } from '@/lib/documents/extract'
import { detectDocumentKind, extensionOf } from '@/lib/documents/types'

export interface MondayAsset {
  id: string
  name: string
  url: string
}

const MAX_FILES = 8
const MAX_BYTES = 8 * 1024 * 1024
const MAX_CONTEXT_CHARS = 20_000

const KIND_ORDER = ['spreadsheet', 'document', 'pdf', 'text', 'image'] as const

export function collectMondayAssets(item: unknown): MondayAsset[] {
  if (!item || typeof item !== 'object') return []
  const record = item as {
    assets?: unknown
    updates?: { assets?: unknown }[]
  }
  const seen = new Set<string>()
  const assets: MondayAsset[] = []
  for (const raw of [...asList(record.assets), ...asList(record.updates).flatMap(update => asList(update.assets))]) {
    const asset = asAsset(raw)
    if (!asset || seen.has(asset.id)) continue
    seen.add(asset.id)
    assets.push(asset)
  }
  return assets
}

export async function readMondayAttachmentContext(
  token: string,
  assets: MondayAsset[],
  fetchImpl: typeof fetch = fetch
): Promise<string> {
  const selected = [...assets]
    .sort((left, right) => kindRank(left.name) - kindRank(right.name))
    .slice(0, MAX_FILES)
  const blocks: string[] = []

  for (const asset of selected) {
    blocks.push(await readOne(token, asset, fetchImpl))
  }

  const omitted = assets.length - selected.length
  if (omitted > 0) blocks.push(`(${omitted} anexos adicionais não lidos)`)

  return blocks
    .map(block => block.trim())
    .filter(Boolean)
    .join('\n\n')
    .slice(0, MAX_CONTEXT_CHARS)
}

async function readOne(token: string, asset: MondayAsset, fetchImpl: typeof fetch): Promise<string> {
  const extension = extensionOf(asset.name)
  if (extension === 'xls' || extension === 'xlsb') {
    return `## Anexo: ${asset.name}\nPlanilha no formato antigo. Exporte como .xlsx para a leitura entrar na user story.`
  }

  const kind = detectDocumentKind(asset.name, '')
  if (!kind) return `## Anexo: ${asset.name}\nFormato não lido.`

  try {
    const buffer = await downloadMondayAsset(token, asset, fetchImpl)
    const extraction = await extractDocumentText(kind, buffer, '', asset.name)
    const body = extraction.text.trim()
    if (!body) return `## Anexo: ${asset.name}\n(vazio)`
    return [`## Anexo: ${asset.name}`, body, extraction.truncated ? '(texto do anexo truncado)' : '']
      .filter(Boolean)
      .join('\n')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'falha ao ler'
    return `## Anexo: ${asset.name}\nNão consegui ler este arquivo (${message}).`
  }
}

async function downloadMondayAsset(
  token: string,
  asset: MondayAsset,
  fetchImpl: typeof fetch
): Promise<Buffer> {
  const response = await fetchImpl(asset.url, {
    headers: { Authorization: token },
  })
  if (!response.ok) throw new Error(`o Monday respondeu ${response.status}`)
  const declared = Number(response.headers.get('content-length') || 0)
  if (declared > MAX_BYTES) throw new Error('arquivo grande demais')
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length > MAX_BYTES) throw new Error('arquivo grande demais')
  return bytes
}

function kindRank(fileName: string): number {
  const extension = extensionOf(fileName)
  if (extension === 'xls' || extension === 'xlsb') return 0
  const kind = detectDocumentKind(fileName, '')
  const index = kind ? KIND_ORDER.indexOf(kind) : -1
  return index === -1 ? KIND_ORDER.length : index
}

function asList(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
}

function asAsset(value: Record<string, unknown>): MondayAsset | null {
  const id = asId(value.id)
  const url = firstString(value.public_url, value.url)
  if (!id || !url) return null
  return { id, name: assetName(value, id), url }
}

function assetName(value: Record<string, unknown>, id: string): string {
  const name = firstString(value.name) || `anexo-${id}`
  if (extensionOf(name)) return name
  const extension = firstString(value.file_extension)?.replace(/^\./, '').toLowerCase()
  return extension ? `${name}.${extension}` : name
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function asId(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}
