import { describe, expect, it } from 'vitest'
import { extractDocumentText } from './extract'

const DOCX_TEXT = 'Requisito de integração de pedidos'

async function buildDocx(): Promise<Buffer> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  )
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  )
  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body><w:p><w:r><w:t>${DOCX_TEXT}</w:t></w:r></w:p></w:body>
</w:document>`
  )
  return zip.generateAsync({ type: 'nodebuffer' })
}

function buildPdf(): Buffer {
  const objects = [
    '<</Type/Catalog/Pages 2 0 R>>',
    '<</Type/Pages/Kids[3 0 R]/Count 1>>',
    '<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>',
    null,
    '<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>',
  ]
  const stream = 'BT /F1 18 Tf 72 700 Td (Requisito de integracao) Tj ET'
  objects[3] = `<</Length ${stream.length}>>\nstream\n${stream}\nendstream`

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((body, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })

  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF\n`
  return Buffer.from(pdf, 'latin1')
}

/**
 * Cobre os dois parsers binários com arquivos reais montados na hora: são as
 * integrações mais frágeis do pipeline (dependem de zip e de pdfjs).
 */
describe('parsers binários', () => {
  it('mammoth lê docx', async () => {
    const extraction = await extractDocumentText('document', await buildDocx(), '', 'escopo.docx')
    expect(extraction.method).toBe('mammoth')
    expect(extraction.text).toContain(DOCX_TEXT)
  })

  it('unpdf lê pdf', async () => {
    const extraction = await extractDocumentText('pdf', buildPdf(), 'application/pdf', 'escopo.pdf')
    expect(extraction.method).toBe('unpdf')
    expect(extraction.pages).toBe(1)
    expect(extraction.text).toContain('Requisito de integracao')
  })
})
