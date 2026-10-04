import { describe, expect, it } from 'vitest'
import { assembleTables, limitEntries, parseForeignKeyTarget } from './assemble'
import { MAX_MODEL_TABLES } from './types'

describe('parseForeignKeyTarget', () => {
  it('separa schema, tabela e coluna', () => {
    expect(parseForeignKeyTarget('public.users.id')).toEqual({
      schema: 'public',
      table: 'users',
      column: 'id',
    })
    expect(parseForeignKeyTarget('users.id')).toBeNull()
  })
})

describe('limitEntries', () => {
  it('prioriza tabelas sobre views ao truncar', () => {
    const entries = [
      ...Array.from({ length: MAX_MODEL_TABLES }, (_, index) => ({
        schema: 'public',
        table: `v${index}`,
        type: 'view' as const,
      })),
      { schema: 'public', table: 'real', type: 'table' as const },
    ]
    const limited = limitEntries(entries)
    expect(limited.truncated).toBe(true)
    expect(limited.entries).toHaveLength(MAX_MODEL_TABLES)
    expect(limited.entries[0]).toEqual({ schema: 'public', table: 'real', type: 'table' })
  })
})

describe('assembleTables', () => {
  it('agrupa colunas, aplica estatísticas e deriva relacionamentos conhecidos', () => {
    const { tables, relationships } = assembleTables(
      [
        { schema: 'public', table: 'users', type: 'table' },
        { schema: 'public', table: 'orders', type: 'table' },
        { schema: 'public', table: 'orders_view', type: 'view' },
      ],
      [
        { schema: 'public', table: 'users', column: 'id', dataType: 'uuid', nullable: false, primaryKey: true },
        {
          schema: 'public',
          table: 'orders',
          column: 'user_id',
          dataType: 'uuid',
          nullable: true,
          foreignKey: 'public.users.id',
        },
        {
          schema: 'public',
          table: 'orders',
          column: 'ext_id',
          dataType: 'uuid',
          nullable: true,
          foreignKey: 'other.external.id',
        },
      ],
      [
        {
          schema: 'public',
          table: 'users',
          estimatedRows: 42,
          sizeBytes: 1024,
          lastAnalyzedAt: '2026-10-01T00:00:00.000Z',
          description: '  pessoas  ',
        },
        {
          schema: 'public',
          table: 'orders_view',
          estimatedRows: 0,
          sizeBytes: 0,
          lastAnalyzedAt: null,
          description: null,
        },
      ]
    )

    const users = tables.find(table => table.table === 'users')!
    expect(users.hasPrimaryKey).toBe(true)
    expect(users.estimatedRows).toBe(42)
    expect(users.description).toBe('pessoas')

    const orders = tables.find(table => table.table === 'orders')!
    expect(orders.hasPrimaryKey).toBe(false)
    expect(orders.estimatedRows).toBeNull()

    const view = tables.find(table => table.table === 'orders_view')!
    expect(view.estimatedRows).toBeNull()

    expect(relationships).toEqual([
      {
        from: { schema: 'public', table: 'orders', column: 'user_id' },
        to: { schema: 'public', table: 'users', column: 'id' },
      },
    ])
  })
})
