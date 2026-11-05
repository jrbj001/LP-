import { describe, expect, it, vi } from 'vitest'
import { collectMondayAssets, readMondayAttachmentContext } from './attachments'

describe('anexos do Monday', () => {
  it('junta arquivos do item e das atualizações, sem repetir', () => {
    expect(
      collectMondayAssets({
        assets: [
          { id: 1, name: 'Roteiros', file_extension: 'xlsx', public_url: 'https://files.example/roteiros.xlsx' },
          { id: '1', name: 'Roteiros.xlsx', url: 'https://files.example/outro' },
        ],
        updates: [
          {
            assets: [{ id: '2', name: 'ata.docx', url: 'https://files.example/ata.docx' }],
          },
        ],
      })
    ).toEqual([
      { id: '1', name: 'Roteiros.xlsx', url: 'https://files.example/roteiros.xlsx' },
      { id: '2', name: 'ata.docx', url: 'https://files.example/ata.docx' },
    ])
  })

  it('lê a planilha e registra o arquivo que falhou', async () => {
    const ExcelJS = (await import('exceljs')).default
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Pontos')
    sheet.addRow(['Marca', 'Exibidor'])
    sheet.addRow(['Ambev', 'Relógio de rua'])
    const bytes = Buffer.from(await workbook.xlsx.writeBuffer())

    const fetchMock = vi.fn(async (url: string) => {
      if (String(url).includes('roteiros')) {
        return new Response(bytes, { status: 200, headers: { 'content-length': String(bytes.length) } })
      }
      return new Response('nope', { status: 500 })
    })

    const text = await readMondayAttachmentContext(
      'token',
      [
        { id: '2', name: 'falha.pdf', url: 'https://files.example/falha.pdf' },
        { id: '1', name: 'roteiros.xlsx', url: 'https://files.example/roteiros.xlsx' },
      ],
      fetchMock as unknown as typeof fetch
    )

    expect(text.indexOf('roteiros.xlsx')).toBeLessThan(text.indexOf('falha.pdf'))
    expect(text).toContain('Ambev')
    expect(text).toContain('Relógio de rua')
    expect(text).toContain('Não consegui ler este arquivo')
  })
})