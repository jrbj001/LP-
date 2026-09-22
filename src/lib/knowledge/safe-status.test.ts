import { describe, expect, it } from 'vitest'
import { sanitizeSourceError } from './safe-status'

describe('sanitizeSourceError', () => {
  it('resume timeout, tabela e conexão sem vazar stack', () => {
    expect(sanitizeSourceError(new Error('canceling statement due to statement timeout'))).toBe(
      'timeout'
    )
    expect(sanitizeSourceError(new Error('relation "foo" does not exist'))).toBe('tabela não encontrada')
    expect(sanitizeSourceError(new Error('Não foi possível conectar ao SQL Server: ECONNREFUSED'))).toBe(
      'falha de conexão'
    )
    expect(
      sanitizeSourceError(new Error('Boom\n    at runDatabase (src/lib/knowledge/research.ts:177:13)'))
    ).toBe('falha na consulta')
  })
})
