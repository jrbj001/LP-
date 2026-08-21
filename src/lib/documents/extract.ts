import { describeImage } from '@/lib/ai/vision'
import {
  MAX_EXTRACTED_CHARS,
  type DocumentExtraction,
  type DocumentKind,
} from './types'

/** Linhas por aba levadas ao texto — planilhas longas viram custo de prompt. */
const MAX_ROWS_PER_SHEET = 400

export function truncateForPrompt(text: string): { text: string; truncated: boolean } {
  const clean = text.replace(/\u0000/g, '').trim()
  if (clean.length <= MAX_EXTRACTED_CHARS) return { text: clean, truncated: false }
  return { text: clean.slice(0, MAX_EXTRACTED_CHARS), truncated: true }
}

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'object') {
    const raw = value as Record<string, unknown>
    // Fórmulas trazem o resultado em `result`; rich text vem em fragmentos.
    if ('result' in raw) return cellToString(raw.result)
    if ('text' in raw) return cellToString(raw.text)
    if (Array.isArray(raw.richText)) {
      return raw.richText.map(part => cellToString((part as { text?: unknown }).text)).join('')
    }
    if ('hyperlink' in raw) return cellToString(raw.hyperlink)
    return ''
  }
  return String(value)
}

async function extractSpreadsheet(buffer: Buffer): Promise<{ text: string; sheets: string[] }> {
  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  // A tipagem do exceljs declara o parâmetro como ArrayBuffer, não como Buffer
  // do Node; o unzip por baixo aceita ambos, então passamos o ArrayBuffer.
  await workbook.xlsx.load(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
  )

  const sheets: string[] = []
  const blocks: string[] = []

  workbook.eachSheet(worksheet => {
    sheets.push(worksheet.name)
    const rows: string[] = []
    let rowCount = 0

    worksheet.eachRow({ includeEmpty: false }, row => {
      if (rowCount >= MAX_ROWS_PER_SHEET) return
      const values = Array.isArray(row.values) ? row.values.slice(1) : []
      const cells = values.map(cellToString).map(cell => cell.replace(/\s+/g, ' ').trim())
      if (cells.some(Boolean)) {
        rows.push(cells.join(' | '))
        rowCount += 1
      }
    })

    const omitted = worksheet.actualRowCount > rowCount ? worksheet.actualRowCount - rowCount : 0
    blocks.push(
      [
        `## Aba: ${worksheet.name}`,
        rows.join('\n') || '(vazia)',
        omitted > 0 ? `(${omitted} linhas adicionais omitidas)` : '',
      ]
        .filter(Boolean)
        .join('\n')
    )
  })

  return { text: blocks.join('\n\n'), sheets }
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

async function extractPdf(buffer: Buffer): Promise<{ text: string; pages: number }> {
  const { extractText, getDocumentProxy } = await import('unpdf')
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text, totalPages } = await extractText(pdf, { mergePages: true })
  return { text: Array.isArray(text) ? text.join('\n\n') : text, pages: totalPages }
}

export async function extractDocumentText(
  kind: DocumentKind,
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<DocumentExtraction> {
  const extractedAt = new Date().toISOString()

  if (kind === 'spreadsheet') {
    // CSV é texto puro; só xlsx/xlsm precisam do parser de planilha.
    if (/\.csv$/i.test(fileName) || mimeType === 'text/csv') {
      const { text, truncated } = truncateForPrompt(buffer.toString('utf8'))
      return { text, truncated, charCount: text.length, method: 'plain', extractedAt }
    }
    const { text: raw, sheets } = await extractSpreadsheet(buffer)
    const { text, truncated } = truncateForPrompt(raw)
    return { text, truncated, charCount: text.length, method: 'exceljs', sheets, extractedAt }
  }

  if (kind === 'document') {
    const { text, truncated } = truncateForPrompt(await extractDocx(buffer))
    return { text, truncated, charCount: text.length, method: 'mammoth', extractedAt }
  }

  if (kind === 'pdf') {
    const { text: raw, pages } = await extractPdf(buffer)
    const { text, truncated } = truncateForPrompt(raw)
    if (!text) {
      throw new Error(
        'Não foi possível extrair texto deste PDF. Se ele for digitalizado, envie as páginas como imagem para leitura por visão.'
      )
    }
    return { text, truncated, charCount: text.length, method: 'unpdf', pages, extractedAt }
  }

  if (kind === 'image') {
    const { text, truncated } = truncateForPrompt(await describeImage(buffer, mimeType))
    return { text, truncated, charCount: text.length, method: 'vision', extractedAt }
  }

  const { text, truncated } = truncateForPrompt(buffer.toString('utf8'))
  return { text, truncated, charCount: text.length, method: 'plain', extractedAt }
}
