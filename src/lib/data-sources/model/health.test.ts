import { describe, expect, it } from 'vitest'
import { computeModelHealth, healthScoreLabel } from './health'
import type { DataModelRelationship, DataModelTable } from './types'

function table(overrides: Partial<DataModelTable> & Pick<DataModelTable, 'table'>): DataModelTable {
  return {
    schema: 'public',
    type: 'table',
    description: 'tabela documentada',
    columns: [
      {
        schema: 'public',
        table: overrides.table,
        column: 'id',
        dataType: 'uuid',
        nullable: false,
        primaryKey: true,
        foreignKey: null,
        comment: 'identificador',
      },
    ],
    estimatedRows: 100,
    sizeBytes: 8192,
    lastAnalyzedAt: '2026-10-01T00:00:00.000Z',
    hasPrimaryKey: true,
    ...overrides,
  }
}

const relationship: DataModelRelationship = {
  from: { schema: 'public', table: 'orders', column: 'user_id' },
  to: { schema: 'public', table: 'users', column: 'id' },
}

describe('computeModelHealth', () => {
  it('dá score 100 para um modelo totalmente saudável', () => {
    const health = computeModelHealth(
      [table({ table: 'users' }), table({ table: 'orders' })],
      [relationship],
      new Date('2026-10-04T12:00:00Z')
    )
    expect(health.score).toBe(100)
    expect(health.checks.every(check => check.severity === 'ok')).toBe(true)
    expect(health.computedAt).toBe('2026-10-04T12:00:00.000Z')
  })

  it('penaliza tabelas sem pk, isoladas, sem descrição e vazias', () => {
    const health = computeModelHealth(
      [
        table({ table: 'users' }),
        table({ table: 'orders' }),
        table({
          table: 'logs',
          hasPrimaryKey: false,
          description: null,
          estimatedRows: 0,
          lastAnalyzedAt: null,
          columns: [
            {
              schema: 'public',
              table: 'logs',
              column: 'payload',
              dataType: 'jsonb',
              nullable: true,
              primaryKey: false,
              foreignKey: null,
              comment: null,
            },
          ],
        }),
      ],
      [relationship]
    )

    const byId = Object.fromEntries(health.checks.map(check => [check.id, check]))
    expect(byId['tables-without-pk'].affected).toEqual(['public.logs'])
    expect(byId['isolated-tables'].affected).toEqual(['public.logs'])
    expect(byId['tables-without-description'].affectedCount).toBe(1)
    expect(byId['columns-without-description'].affectedCount).toBe(1)
    expect(byId['columns-without-description'].affected).toEqual(['public.logs'])
    expect(byId['never-analyzed'].affected).toEqual(['public.logs'])
    expect(byId['empty-tables'].affected).toEqual(['public.logs'])
    expect(health.score).toBeLessThan(100)
    expect(health.score).toBeGreaterThan(50)
  })

  it('ignora views nos checks de pk e estatísticas e não avalia isolamento com uma só tabela', () => {
    const health = computeModelHealth(
      [
        table({ table: 'users' }),
        table({ table: 'users_view', type: 'view', hasPrimaryKey: false, lastAnalyzedAt: null }),
      ],
      []
    )
    const byId = Object.fromEntries(health.checks.map(check => [check.id, check]))
    expect(byId['tables-without-pk'].affectedCount).toBe(0)
    expect(byId['never-analyzed'].affectedCount).toBe(0)
    expect(byId['isolated-tables']).toBeUndefined()
  })

  it('classifica severidade pelo percentual afetado', () => {
    const health = computeModelHealth(
      Array.from({ length: 10 }, (_, index) => table({ table: `t${index}`, hasPrimaryKey: false })),
      []
    )
    const pk = health.checks.find(check => check.id === 'tables-without-pk')!
    expect(pk.severity).toBe('high')
    expect(pk.ratio).toBe(1)
  })
})

describe('healthScoreLabel', () => {
  it('mapeia faixas de score', () => {
    expect(healthScoreLabel(95)).toBe('Saudável')
    expect(healthScoreLabel(70)).toBe('Atenção')
    expect(healthScoreLabel(45)).toBe('Frágil')
    expect(healthScoreLabel(10)).toBe('Crítico')
  })
})
