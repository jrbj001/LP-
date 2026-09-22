import { describe, expect, it } from 'vitest'
import { formatColumnForPrompt, schemaForPrompt } from './schema-prompt'

describe('schemaForPrompt', () => {
  it('inclui pk, fk, not null e comentário da coluna', () => {
    expect(
      schemaForPrompt(
        [{ schema: 'public', table: 'communities' }],
        [
          {
            schema: 'public',
            table: 'communities',
            column: 'id',
            dataType: 'uuid',
            nullable: false,
            primaryKey: true,
            comment: 'identificador da comunidade',
          },
          {
            schema: 'public',
            table: 'communities',
            column: 'org_id',
            dataType: 'uuid',
            nullable: true,
            foreignKey: 'public.organizations.id',
          },
        ]
      )
    ).toBe(
      [
        'public.communities(',
        '  id uuid not null pk -- identificador da comunidade,',
        '  org_id uuid fk public.organizations.id',
        ')',
      ].join('\n')
    )
  })

  it('formata coluna simples sem metadados extras', () => {
    expect(
      formatColumnForPrompt({
        schema: 'dbo',
        table: 'cards',
        column: 'title',
        dataType: 'nvarchar',
        nullable: true,
      })
    ).toBe('title nvarchar')
  })
})
