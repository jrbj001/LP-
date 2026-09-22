import { describe, expect, it, vi } from 'vitest'
import { hashSql, logKnowledgeTrace } from './trace'

describe('knowledge trace', () => {
  it('hasheia SQL sem manter o texto', () => {
    const sql = 'SELECT email, phone FROM public.user WHERE email = $1'
    const hash = hashSql(sql)
    expect(hash).toHaveLength(12)
    expect(hash).not.toContain('email')
    expect(hashSql(sql)).toBe(hash)
    expect(hashSql(`${sql} `)).not.toBe(hash)
  })

  it('loga JSON sem a pergunta nem o SQL', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    logKnowledgeTrace({
      stage: 'sql',
      clientId: 'likeme',
      sourceId: 'likeme-supabase',
      sqlHash: hashSql('SELECT 1'),
      repairCount: 1,
      critic: 'ok',
      ms: 12,
      ok: true,
    })
    const payload = String(info.mock.calls[0]?.[1] ?? '')
    expect(payload).toContain('"stage":"sql"')
    expect(payload).not.toContain('SELECT')
    expect(payload).not.toContain('usuários')
    info.mockRestore()
  })
})
