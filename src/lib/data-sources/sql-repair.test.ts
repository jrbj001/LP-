import { describe, expect, it, vi } from 'vitest'
import {
  executeSqlWithRepair,
  isSqlRepairableError,
  sqlRepairContext,
} from './sql-repair'

describe('sql repair', () => {
  it('não tenta reparar erro de conexão', () => {
    expect(isSqlRepairableError(new Error('Não foi possível conectar ao SQL Server: timeout'))).toBe(
      false
    )
    expect(isSqlRepairableError(new Error('column "foo" does not exist'))).toBe(true)
  })

  it('inclui o SQL anterior e o erro no contexto de reparo', () => {
    expect(sqlRepairContext('SELECT * FROM public.missing', 'relation "missing" does not exist')).toContain(
      'SQL anterior'
    )
  })

  it('reexecuta até 2 vezes depois da falha do banco', async () => {
    const generate = vi
      .fn()
      .mockResolvedValueOnce({ sql: 'select bad' })
      .mockResolvedValueOnce({ sql: 'select still_bad' })
      .mockResolvedValueOnce({ sql: 'select ok' })
    const validateAndExecute = vi
      .fn()
      .mockRejectedValueOnce(new Error('syntax error'))
      .mockRejectedValueOnce(new Error('undefined column'))
      .mockResolvedValueOnce({ sql: 'SELECT ok LIMIT 100', result: [{ n: 1 }] })

    const executed = await executeSqlWithRepair({
      generate,
      validateAndExecute,
    })

    expect(executed.attempts).toBe(3)
    expect(executed.sql).toBe('SELECT ok LIMIT 100')
    expect(generate).toHaveBeenNthCalledWith(2, { sql: 'select bad', error: 'syntax error' })
    expect(generate).toHaveBeenNthCalledWith(3, {
      sql: 'select still_bad',
      error: 'undefined column',
    })
  })

  it('propaga o erro depois de esgotar as tentativas', async () => {
    await expect(
      executeSqlWithRepair({
        generate: async () => ({ sql: 'select bad' }),
        validateAndExecute: async () => {
          throw new Error('syntax error at or near "bad"')
        },
      })
    ).rejects.toThrow(/syntax error/)
  })
})
