import { afterEach, describe, expect, it } from 'vitest'
import { authenticateClient } from './credentials'
import { createClientSessionToken, verifyClientSessionToken } from './session'

const originalAccess = process.env.CLIENT_ACCESS

afterEach(() => {
  if (originalAccess === undefined) delete process.env.CLIENT_ACCESS
  else process.env.CLIENT_ACCESS = originalAccess
})

describe('authenticateClient', () => {
  it('aceita senha distinta por workspace', () => {
    process.env.CLIENT_ACCESS = JSON.stringify([
      { slug: 'likeme', password: 'segredo-like' },
      { slug: 'be180-ooh', password: 'segredo-be180' },
    ])
    expect(authenticateClient('likeme', 'segredo-like')?.name).toBe('Like:Me')
    expect(authenticateClient('be180-ooh', 'segredo-be180')?.slug).toBe('be180-ooh')
    expect(authenticateClient('likeme', 'segredo-be180')).toBeNull()
    expect(authenticateClient('be180-ooh', 'errada')).toBeNull()
  })

  it('autentica Café Orfeu com a senha do workspace', () => {
    process.env.CLIENT_ACCESS = JSON.stringify([{ slug: 'orfeu', password: 'segredo-orfeu' }])
    expect(authenticateClient('orfeu', 'segredo-orfeu')?.name).toBe('Café Orfeu')
    expect(authenticateClient('orfeu', 'errada')).toBeNull()
  })

  it('completa slugs ausentes do CLIENT_ACCESS em desenvolvimento', () => {
    process.env.CLIENT_ACCESS = JSON.stringify([{ slug: 'likeme', password: 'segredo-like' }])
    expect(authenticateClient('orfeu', 'orfeu2026')?.slug).toBe('orfeu')
    expect(authenticateClient('likeme', 'likeme2026')).toBeNull()
    expect(authenticateClient('likeme', 'segredo-like')?.slug).toBe('likeme')
  })
})

describe('client session token', () => {
  it('assina e verifica o cookie do workspace', async () => {
    const token = await createClientSessionToken({ slug: 'likeme', name: 'Like:Me' })
    const session = await verifyClientSessionToken(token)
    expect(session?.slug).toBe('likeme')
    expect(await verifyClientSessionToken(`${token}x`)).toBeNull()
  })
})
