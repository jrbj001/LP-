import { describe, expect, it } from 'vitest'
import { assertReadOnlySelect, inferChart } from './query'

describe('assertReadOnlySelect', () => {
  it('aceita SELECT nas tabelas cadence_* com client_id', () => {
    const sql = assertReadOnlySelect(
      `SELECT board_id, count(*) AS n FROM cadence_cards WHERE client_id = $1 GROUP BY board_id`
    )
    expect(sql).toMatch(/LIMIT 100$/)
  })

  it('permite leitura das cinco tabelas do workspace', () => {
    const tables = [
      'cadence_cards',
      'cadence_delivery_prs',
      'cadence_delivery_commits',
      'cadence_meetings',
      'cadence_documents',
    ]
    for (const table of tables) {
      expect(assertReadOnlySelect(`SELECT * FROM ${table} WHERE client_id = $1`)).toContain(table)
    }
  })

  it('rejeita INSERT e tabelas fora do allowlist', () => {
    expect(() =>
      assertReadOnlySelect(`INSERT INTO cadence_cards (client_id, card_id) VALUES ('x', 'y')`)
    ).toThrow(/SELECT/)
    expect(() =>
      assertReadOnlySelect(`SELECT * FROM alquimia_engagements WHERE client_id = $1`)
    ).toThrow(/não permitida/)
  })

  it('rejeita múltiplos statements e ausência de client_id', () => {
    expect(() =>
      assertReadOnlySelect(`SELECT 1 FROM cadence_cards WHERE client_id = $1; DROP TABLE cadence_cards`)
    ).toThrow(/um statement/)
    expect(() => assertReadOnlySelect(`SELECT title FROM cadence_cards`)).toThrow(/client_id/)
  })

  it('exige que client_id esteja vinculado ao parâmetro do cliente', () => {
    expect(() =>
      assertReadOnlySelect(`SELECT title FROM cadence_cards WHERE client_id IS NOT NULL`)
    ).toThrow(/client_id = \$1/)
    expect(
      assertReadOnlySelect(`SELECT c.title FROM cadence_cards c WHERE c.client_id = $1 LIMIT 25`)
    ).toContain('c.client_id = $1')
  })
})

describe('inferChart', () => {
  it('escolhe coluna de rótulo e valor numérico', () => {
    expect(
      inferChart([
        { board: 'App', n: 4 },
        { board: 'API', n: 2 },
      ])
    ).toEqual({ labelKey: 'board', valueKey: 'n' })
  })
})
