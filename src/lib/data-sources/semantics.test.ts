import { describe, expect, it } from 'vitest'
import { applySourceTableSemantics, sourceSemanticHint } from './semantics'

const catalog = [
  { schema: 'auth', table: 'users', type: 'table' as const },
  { schema: 'public', table: 'user', type: 'table' as const },
  { schema: 'public', table: 'community_member', type: 'table' as const },
]

describe('semântica das fontes de dados', () => {
  it('usa public.user como cadastro canônico do produto Like:Me', () => {
    const selected = applySourceTableSemantics(
      'Like:Me · Supabase',
      'Quantos usuários temos hoje na base do Like:Me?',
      catalog,
      [catalog[0]]
    )
    expect(selected).toEqual([catalog[1]])
    expect(sourceSemanticHint('Like:Me · Supabase')).toContain('public.user')
  })

  it('não altera outras perguntas', () => {
    expect(
      applySourceTableSemantics(
        'Like:Me · Supabase',
        'Quantas comunidades existem?',
        catalog,
        [catalog[2]]
      )
    ).toEqual([catalog[2]])
  })
})
