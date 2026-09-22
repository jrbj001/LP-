import { describe, expect, it } from 'vitest'
import { applySourceTableSemantics, sourceSemanticHint } from './semantics'

const likemeCatalog = [
  { schema: 'auth', table: 'users', type: 'table' as const },
  { schema: 'public', table: 'user', type: 'table' as const },
  { schema: 'public', table: 'community_member', type: 'table' as const },
]

const colmeiaCatalog = [
  { schema: 'dbo', table: 'usuario_dm', type: 'table' as const },
  { schema: 'dbo', table: 'roteiros', type: 'table' as const },
  { schema: 'dbo', table: 'exibidor_inventario_item_dm', type: 'table' as const },
]

const ativosCatalog = [
  { schema: 'public', table: 'bancoAtivosJoin_ft', type: 'table' as const },
  { schema: 'public', table: 'exibidor', type: 'table' as const },
  { schema: 'public', table: 'roteiros', type: 'table' as const },
]

describe('semântica das fontes de dados', () => {
  it('usa public.user como cadastro canônico do produto Like:Me', () => {
    const selected = applySourceTableSemantics(
      'Like:Me · Supabase',
      'Quantos usuários temos hoje na base do Like:Me?',
      likemeCatalog,
      [likemeCatalog[0]]
    )
    expect(selected[0]).toEqual(likemeCatalog[1])
    expect(selected.some(item => item.schema === 'auth')).toBe(false)
    expect(sourceSemanticHint('Like:Me · Supabase', 'Quantos usuários temos?')).toContain(
      'public.user'
    )
  })

  it('só usa auth.users quando a pergunta é de identidade de login', () => {
    const selected = applySourceTableSemantics(
      'Like:Me · Supabase',
      'Quantas identidades de login existem no Supabase Auth?',
      likemeCatalog,
      [likemeCatalog[1]]
    )
    expect(selected[0]).toEqual(likemeCatalog[0])
  })

  it('prioriza community na pergunta de comunidades', () => {
    expect(
      applySourceTableSemantics(
        'Like:Me · Supabase',
        'Quantas comunidades existem?',
        likemeCatalog,
        [likemeCatalog[1]]
      )[0]
    ).toEqual(likemeCatalog[2])
  })

  it('prioriza roteiros no Colmeia e ignora inventário', () => {
    const selected = applySourceTableSemantics(
      'Colmeia · SQL Server',
      'Quantos roteiros existem no Colmeia?',
      colmeiaCatalog,
      [colmeiaCatalog[0], colmeiaCatalog[2]]
    )
    expect(selected[0]).toEqual(colmeiaCatalog[1])
    expect(sourceSemanticHint('Colmeia · SQL Server', 'Quantos roteiros existem?')).toContain(
      'Colmeia'
    )
  })

  it('prioriza inventário/exibidor no Banco de Ativos e recusa roteiro', () => {
    const selected = applySourceTableSemantics(
      'Banco de Ativos · PostgreSQL',
      'Quantos pontos de inventário estão no Banco de Ativos?',
      ativosCatalog,
      [ativosCatalog[2]]
    )
    expect(selected.map(item => item.table)).toContain('bancoAtivosJoin_ft')
    expect(selected.map(item => item.table)).not.toContain('roteiros')
  })
})
