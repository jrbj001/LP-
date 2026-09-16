import { describe, expect, it } from 'vitest'
import { likemeSupabasePostgresConfigFromEnv, supabaseProjectRef } from './likeme-supabase'

describe('supabaseProjectRef', () => {
  it('extrai o ref do project URL de produção', () => {
    expect(supabaseProjectRef('https://hhmxhclwtfrkngpoaiiu.supabase.co')).toBe('hhmxhclwtfrkngpoaiiu')
  })

  it('aceita host sem protocolo', () => {
    expect(supabaseProjectRef('qiwvqwidzdnizgjvudcs.supabase.co')).toBe('qiwvqwidzdnizgjvudcs')
  })

  it('rejeita URL que não é projeto Supabase', () => {
    expect(supabaseProjectRef('https://example.com')).toBeNull()
  })
})

describe('likemeSupabasePostgresConfigFromEnv', () => {
  it('monta o Postgres direto a partir do project URL e da senha', () => {
    expect(
      likemeSupabasePostgresConfigFromEnv({
        SUPABASE_PROJECT_URL: 'https://hhmxhclwtfrkngpoaiiu.supabase.co',
        SUPABASE_DB_PASSWORD: 'segredo',
      })
    ).toEqual({
      host: 'db.hhmxhclwtfrkngpoaiiu.supabase.co',
      port: 5432,
      database: 'postgres',
      username: 'postgres',
      password: 'segredo',
      sslMode: 'require',
    })
  })

  it('não usa DATABASE_URL do Cadence/Neon', () => {
    expect(
      likemeSupabasePostgresConfigFromEnv({
        DATABASE_URL: 'postgresql://neon.example/postgres',
        SUPABASE_PROJECT_URL: 'https://hhmxhclwtfrkngpoaiiu.supabase.co',
      })
    ).toBeNull()
  })
})
