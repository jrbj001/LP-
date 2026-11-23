import { afterEach, describe, expect, it } from 'vitest'
import { toAiError } from './ai-error'
import { chatModel, codingModel, gatewayModelId, hasAiCredentials, isMissingAiCredential, MISSING_AI_CREDENTIAL } from './gateway'

const KEYS = [
  'AI_GATEWAY_API_KEY',
  'VERCEL_OIDC_TOKEN',
  'VERCEL',
  'AI_MODEL',
  'AI_CODING_MODEL',
  'OPENAI_MODEL',
  'OPENAI_CODING_MODEL',
] as const
const saved = Object.fromEntries(KEYS.map(key => [key, process.env[key]]))

function clearEnv() {
  for (const key of KEYS) delete process.env[key]
}

afterEach(() => {
  for (const key of KEYS) {
    if (saved[key] === undefined) delete process.env[key]
    else process.env[key] = saved[key]
  }
})

describe('gatewayModelId', () => {
  it('prefixa ids legados com openai/ e preserva provedor/modelo', () => {
    expect(gatewayModelId('gpt-4.1')).toBe('openai/gpt-4.1')
    expect(gatewayModelId(' anthropic/claude-sonnet-4 ')).toBe('anthropic/claude-sonnet-4')
  })
})

describe('modelos padrão', () => {
  it('usa AI_* antes de OPENAI_* e cai nos defaults', () => {
    clearEnv()
    expect(chatModel()).toBe('openai/gpt-4o-mini')
    expect(codingModel()).toBe('openai/gpt-4.1')
    process.env.OPENAI_MODEL = 'gpt-4o'
    expect(chatModel()).toBe('openai/gpt-4o')
    process.env.AI_MODEL = 'google/gemini-2.5-flash'
    expect(chatModel()).toBe('google/gemini-2.5-flash')
    expect(codingModel()).toBe('google/gemini-2.5-flash')
  })
})

describe('hasAiCredentials', () => {
  it('aceita chave do gateway, token OIDC ou runtime da Vercel', () => {
    clearEnv()
    expect(hasAiCredentials()).toBe(false)
    process.env.VERCEL_OIDC_TOKEN = 'token'
    expect(hasAiCredentials()).toBe(true)
    clearEnv()
    process.env.VERCEL = '1'
    expect(hasAiCredentials()).toBe(true)
  })

  it('a mensagem de credencial ausente é reconhecida pelas rotas', () => {
    expect(isMissingAiCredential(MISSING_AI_CREDENTIAL)).toBe(true)
  })
})

describe('toAiError', () => {
  it('traduz erros do gateway por status e tipo', () => {
    expect(toAiError({ statusCode: 401, message: 'bad', type: 'authentication_error' }).message).toContain(
      'AI_GATEWAY_API_KEY'
    )
    expect(toAiError({ statusCode: 402, message: 'no funds' }).message).toContain('sem créditos')
    expect(toAiError({ statusCode: 400, message: 'payload inválido' }).message).toContain('payload inválido')
  })
})
