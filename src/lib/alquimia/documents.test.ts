import { describe, expect, it } from 'vitest'
import {
  archiveDocuments,
  archiveFolders,
  archiveStats,
  documentsInFolder,
  fileKey,
  getArchiveDocument,
  getArchiveFolder,
  kindLabel,
  searchArchive,
  validateArchive,
} from './documents'
import { KNOWN_ENGAGEMENT_IDS, getSpaceEngagement, spaceEngagements } from './engagements'

describe('arquivo Orfeu × Alquemia', () => {
  it('organiza os conteúdos nas 10 pastas do Drive', () => {
    expect(archiveFolders).toHaveLength(10)
    expect(archiveFolders.map(item => item.driveFolder)).toEqual([
      '01_Proposta',
      '02_Cases_e_Benchmarks',
      '03_Workshops',
      '04_Atas_de_Reuniao',
      '05_Comercial_e_Organograma',
      '06_Expansao_EUA',
      '07_Trade_Marketing_e_Categoria',
      '08_Analytics_e_Mix',
      '09_Flagship_Loja_Conceito',
      '10_IA_PixelPulseLab',
    ])
    expect(() => validateArchive()).not.toThrow()
  })

  it('cataloga todos os arquivos do Drive, sem o índice', () => {
    const stats = archiveStats()
    expect(stats.documents).toBe(104)
    expect(stats.folders).toBe(10)
    expect(Object.values(stats.byFolder).reduce((total, count) => total + count, 0)).toBe(104)
    expect(stats.byKind.markdown).toBeGreaterThan(20)
    expect(stats.byKind.presentation).toBeGreaterThan(30)
  })

  it('resolve pasta, documento e busca sem colidir slugs', () => {
    expect(getArchiveFolder('ia')?.title).toMatch(/PixelPulseLab/)
    expect(documentsInFolder('proposta')).toHaveLength(2)
    const pdf = documentsInFolder('proposta').find(item => item.extension === 'pdf')
    expect(pdf?.kind).toBe('pdf')
    expect(getArchiveDocument('proposta', pdf!.slug)?.id).toBe(pdf?.id)
    expect(searchArchive('Nespresso').map(item => item.filename).join()).toMatch(/Nespresso/)
    expect(kindLabel('spreadsheet')).toBe('Planilha')
  })

  it('normaliza nomes originais do Drive para localizar o arquivo local', () => {
    expect(fileKey('Acompanhamento Omnichannel - Liderança Orfeu 137.md'))
      .toBe(fileKey('Acompanhamento-Omnichannel-Lideranca-Orfeu-137.md'))
  })
})

describe('engagements do space', () => {
  it('expõe apenas o Café Orfeu', () => {
    expect([...KNOWN_ENGAGEMENT_IDS]).toEqual(['orfeu'])
    expect(spaceEngagements).toHaveLength(1)
    expect(getSpaceEngagement('orfeu')?.name).toBe('Café Orfeu')
    expect(getSpaceEngagement('aurora-industrial')).toBeUndefined()
    expect(getSpaceEngagement('nexo-servicos')).toBeUndefined()
  })
})
