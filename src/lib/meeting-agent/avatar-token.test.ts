import { describe, expect, it } from 'vitest'
import { signAvatarToken, verifyAvatarToken } from './avatar-token'

const secret = 'segredo-de-teste'
const botId = '6c29aa03-fbf2-41e0-8ff8-0ae679409555'

describe('avatar token', () => {
  it('aceita o token do próprio bot', () => {
    const token = signAvatarToken(botId, secret)
    expect(verifyAvatarToken(botId, token, secret)).toBe(true)
  })

  it('recusa token de outro bot', () => {
    const token = signAvatarToken(botId, secret)
    expect(verifyAvatarToken('11111111-2222-3333-4444-555555555555', token, secret)).toBe(false)
  })

  it('recusa sem token, sem segredo ou com segredo diferente', () => {
    const token = signAvatarToken(botId, secret)
    expect(verifyAvatarToken(botId, null, secret)).toBe(false)
    expect(verifyAvatarToken(botId, token, null)).toBe(false)
    expect(verifyAvatarToken(botId, token, 'outro')).toBe(false)
  })
})
