import { describe, expect, it } from 'vitest'
import { assertExternalReadOnlySelect, isCatalogQuestion, isCatalogRelation } from './query'

const TABLES = [
  { schema: 'public', table: 'media_points', type: 'table' as const },
  { schema: 'analytics', table: 'routes', type: 'view' as const },
]

describe('assertExternalReadOnlySelect', () => {
  it('aceita SELECT somente nas tabelas descobertas', () => {
    expect(
      assertExternalReadOnlySelect(
        'SELECT city, count(*) FROM public.media_points GROUP BY city',
        TABLES
      )
    ).toMatch(/LIMIT 100$/)
  })

  it('aceita identificadores qualificados com aspas', () => {
    expect(
      assertExternalReadOnlySelect('SELECT * FROM "analytics"."routes" LIMIT 20', TABLES)
    ).toContain('"analytics"."routes"')
  })

  it('rejeita escrita, múltiplos statements e tabelas não descobertas', () => {
    expect(() =>
      assertExternalReadOnlySelect('DELETE FROM public.media_points', TABLES)
    ).toThrow(/SELECT/)
    expect(() =>
      assertExternalReadOnlySelect(
        'SELECT * FROM public.media_points; DROP TABLE public.media_points',
        TABLES
      )
    ).toThrow(/statement/)
    expect(() =>
      assertExternalReadOnlySelect('SELECT * FROM private.users', TABLES)
    ).toThrow(/não permitida/)
  })

  it('limita o resultado a no máximo 100 linhas', () => {
    expect(
      assertExternalReadOnlySelect('SELECT * FROM public.media_points LIMIT 500', TABLES)
    ).toMatch(/LIMIT 100$/)
  })

  it('aceita information_schema.tables para listar o catálogo', () => {
    expect(
      assertExternalReadOnlySelect(
        'SELECT table_schema, table_name, table_type FROM information_schema.tables',
        TABLES,
        'sqlserver'
      )
    ).toMatch(/TOP 500/i)
  })

  it('reconhece pergunta de catálogo', () => {
    expect(
      isCatalogQuestion('me de o nome e a descricao de cada tabela que temos no banco')
    ).toBe(true)
    expect(isCatalogQuestion('qual o exibidor com mais pontos ativos?')).toBe(false)
  })

  it('reconhece information_schema com três partes', () => {
    expect(isCatalogRelation('serv_product_be180.information_schema.tables')).toBe(true)
    expect(isCatalogRelation('sys.extended_properties')).toBe(true)
    expect(isCatalogRelation('public.media_points')).toBe(false)
  })

  it('aceita information_schema qualificado com o banco', () => {
    expect(
      assertExternalReadOnlySelect(
        'SELECT table_name FROM [serv_product_be180].[information_schema].[tables]',
        TABLES,
        'sqlserver'
      )
    ).toContain('information_schema')
  })

  it('rejeita funções internas do PostgreSQL', () => {
    expect(() =>
      assertExternalReadOnlySelect(
        `SELECT pg_read_file('/etc/passwd') FROM public.media_points`,
        TABLES
      )
    ).toThrow(/Funções internas/)
  })
})
