import { describe, expect, it } from 'vitest'
import { chunkTables, parseAiOverview, parseAiTableDescriptions } from './ai'

const known = ['public.users', 'public.orders']

describe('parseAiTableDescriptions', () => {
  it('aceita lista de tabelas e descarta chaves desconhecidas', () => {
    const parsed = parseAiTableDescriptions(
      {
        tables: [
          {
            key: 'Public.Users',
            description: '  Usuários   do produto. ',
            purpose: 'Identidade',
            keyColumns: ['id', 'email', 1],
          },
          { key: 'public.ghost', description: 'não existe' },
          { key: 'public.orders' },
        ],
      },
      known
    )
    expect(Object.keys(parsed)).toEqual(['public.users'])
    expect(parsed['public.users']).toEqual({
      description: 'Usuários do produto.',
      purpose: 'Identidade',
      keyColumns: ['id', 'email', '1'],
    })
  })

  it('aceita formato de objeto indexado por chave', () => {
    const parsed = parseAiTableDescriptions(
      { tables: { 'public.orders': { description: 'Pedidos', key_columns: ['total'] } } },
      known
    )
    expect(parsed['public.orders'].keyColumns).toEqual(['total'])
    expect(parsed['public.orders'].purpose).toBe('')
  })

  it('retorna vazio para payload inválido', () => {
    expect(parseAiTableDescriptions(null, known)).toEqual({})
    expect(parseAiTableDescriptions('texto', known)).toEqual({})
    expect(parseAiTableDescriptions({ tables: 'x' }, known)).toEqual({})
  })
})

describe('parseAiOverview', () => {
  it('normaliza domínios, riscos e perguntas', () => {
    const parsed = parseAiOverview(
      {
        overview: 'Banco de  e-commerce.',
        domains: [
          { name: 'Clientes', description: 'Quem compra', tables: ['public.users', 'public.nope'] },
          { description: 'sem nome' },
          'inválido',
        ],
        risks: ['Sem FK em orders', '', 42],
        suggested_questions: ['Quantos usuários?'],
      },
      known
    )
    expect(parsed.overview).toBe('Banco de e-commerce.')
    expect(parsed.domains).toEqual([
      { name: 'Clientes', description: 'Quem compra', tables: ['public.users'] },
    ])
    expect(parsed.risks).toEqual(['Sem FK em orders', '42'])
    expect(parsed.suggestedQuestions).toEqual(['Quantos usuários?'])
  })

  it('não quebra com payload vazio', () => {
    expect(parseAiOverview(undefined, known)).toEqual({
      overview: '',
      domains: [],
      risks: [],
      suggestedQuestions: [],
    })
  })
})

describe('chunkTables', () => {
  it('divide em lotes do tamanho pedido', () => {
    expect(chunkTables([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    expect(chunkTables([], 2)).toEqual([])
  })
})
