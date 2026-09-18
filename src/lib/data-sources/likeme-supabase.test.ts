import { describe, expect, it } from 'vitest'
import {
  likemeSupabasePostgresConfigFromEnv,
  supabasePoolerTarget,
  supabaseProjectRef,
} from './likeme-supabase'

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

  it('prefere o pooler e o usuário por tenant quando configurado', () => {
    expect(
      likemeSupabasePostgresConfigFromEnv({
        SUPABASE_PROJECT_URL: 'https://hhmxhclwtfrkngpoaiiu.supabase.co',
        SUPABASE_DB_PASSWORD: 'segredo',
        SUPABASE_POOLER_URL:
          'postgresql://postgres.hhmxhclwtfrkngpoaiiu:segredo@aws-1-us-east-1.pooler.supabase.com:5432/postgres',
      })
    ).toEqual({
      host: 'aws-1-us-east-1.pooler.supabase.com',
      port: 5432,
      database: 'postgres',
      username: 'postgres.hhmxhclwtfrkngpoaiiu',
      password: 'segredo',
      sslMode: 'require',
    })
  })
})

describe('supabasePoolerTarget', () => {
  it('aceita apenas host e porta', () => {
    expect(supabasePoolerTarget('aws-1-sa-east-1.pooler.supabase.com:6543')).toEqual({
      host: 'aws-1-sa-east-1.pooler.supabase.com',
      port: 6543,
    })
  })

  it('usa 5432 quando a porta não vem na string', () => {
    expect(supabasePoolerTarget('aws-1-sa-east-1.pooler.supabase.com')).toEqual({
      host: 'aws-1-sa-east-1.pooler.supabase.com',
      port: 5432,
    })
  })

  it('ignora hosts que não são do pooler', () => {
    expect(supabasePoolerTarget('db.hhmxhclwtfrkngpoaiiu.supabase.co')).toBeNull()
    expect(supabasePoolerTarget('')).toBeNull()
    expect(supabasePoolerTarget(undefined)).toBeNull()
  })
})
