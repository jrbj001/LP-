import { describe, expect, it } from 'vitest'
import { buildTableArtifact, formatGridForChat, rowsToCsv } from './table-artifact'

const columns = ['cidade', 'total']

describe('buildTableArtifact', () => {
  it('não cria artefato sem linhas', () => {
    expect(buildTableArtifact({ sourceName: 'Ativos', columns, rows: [] })).toBeNull()
  })

  it('monta grade até 12 linhas', () => {
    const rows = [{ cidade: 'SP', total: 3 }]
    expect(buildTableArtifact({ sourceName: 'Ativos', columns, rows })).toEqual({
      kind: 'grid',
      sourceName: 'Ativos',
      columns,
      rowCount: 1,
      rows,
    })
  })

  it('passa para CSV acima de 12 linhas e escapa vírgula', () => {
    const rows = Array.from({ length: 13 }, (_, index) => ({ cidade: index === 0 ? 'São Paulo, SP' : `C${index}`, total: index }))
    const artifact = buildTableArtifact({ sourceName: 'Ativos', columns, rows })
    expect(artifact?.kind).toBe('csv')
    expect(artifact?.rowCount).toBe(13)
    expect(artifact?.csv?.split('\n')[1]).toBe('"São Paulo, SP",0')
    expect(rowsToCsv(columns, rows.slice(0, 1))).toBe('cidade,total\n"São Paulo, SP",0')
  })
})

describe('formatGridForChat', () => {
  it('escreve a grade em texto e ignora CSV', () => {
    const grid = buildTableArtifact({ sourceName: 'Ativos', columns, rows: [{ cidade: 'SP', total: 3 }] })!
    expect(formatGridForChat(grid)).toBe('Ativos\ncidade | total\nSP | 3')
    expect(formatGridForChat({ kind: 'csv', sourceName: 'Ativos', columns, rowCount: 20, csv: 'a' })).toBe('')
  })
})
