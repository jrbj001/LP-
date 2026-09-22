import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { columnKey, toDataSourceColumns } from './catalog-columns'

describe('toDataSourceColumns', () => {
  it('anexa pk, fk e comentário pela chave schema.tabela.coluna', () => {
    const key = columnKey('Public', 'Communities', 'Id')
    const [column] = toDataSourceColumns(
      [
        {
          schema: 'public',
          table: 'communities',
          column: 'id',
          dataType: 'uuid',
          nullable: false,
        },
      ],
      {
        primaryKeys: [key],
        foreignKeys: [[key, 'auth.users.id']],
        comments: [[key, '  chave da comunidade  ']],
      }
    )

    expect(column.primaryKey).toBe(true)
    expect(column.foreignKey).toBe('auth.users.id')
    expect(column.comment).toBe('chave da comunidade')
  })
})
