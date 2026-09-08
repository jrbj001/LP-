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
})

describe('client session token', () => {
  it('assina e verifica o cookie do workspace', async () => {
    const token = await createClientSessionToken({ slug: 'likeme', name: 'Like:Me' })
    const session = await verifyClientSessionToken(token)
    expect(session?.slug).toBe('likeme')
    expect(await verifyClientSessionToken(`${token}x`)).toBeNull()
  })
})
