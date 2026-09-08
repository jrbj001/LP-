import { describe, expect, it } from 'vitest'
import { fallbackAnswer, narrateCatalogRows } from './narrate'

describe('narrateCatalogRows', () => {
  it('resume schemas, tipos e cobertura de descrição', () => {
    const answer = narrateCatalogRows('Colmeia · SQL Server', [
      { table_schema: 'dbo', table_name: 'a', table_type: 'BASE TABLE', description: 'rota' },
      { table_schema: 'dbo', table_name: 'b', table_type: 'VIEW', description: '' },
      { table_schema: 'rawd', table_name: 'c', table_type: 'BASE TABLE', description: null },
    ])
    expect(answer).toContain('3 objetos')
    expect(answer).toContain('BASE TABLE (2)')
    expect(answer).toContain('dbo (2)')
    expect(answer).toContain('1 de 3 tabelas têm descrição')
  })

  it('trata catálogo vazio', () => {
    expect(narrateCatalogRows('Colmeia · SQL Server', [])).toContain('Não encontrei tabelas')
  })
})

describe('fallbackAnswer', () => {
  it('descreve uma única linha', () => {
    expect(
      fallbackAnswer({
        question: 'qual o total?',
        explanation: 'soma',
        columns: ['total'],
        rows: [{ total: 12 }],
      })
    ).toBe('Resultado: total: 12.')
  })
})
