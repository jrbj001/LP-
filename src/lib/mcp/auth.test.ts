import { afterEach, describe, expect, it } from 'vitest'
import { isAuthorizedMcpRequest } from './auth'

describe('isAuthorizedMcpRequest', () => {
  const previous = process.env.BE180_MCP_TOKEN

  afterEach(() => {
    if (previous === undefined) delete process.env.BE180_MCP_TOKEN
    else process.env.BE180_MCP_TOKEN = previous
  })

  it('recusa quando o token do ambiente não existe', () => {
    delete process.env.BE180_MCP_TOKEN
    expect(isAuthorizedMcpRequest('Bearer segredo')).toBe(false)
  })

  it('aceita o bearer exato e recusa o resto', () => {
    process.env.BE180_MCP_TOKEN = 'segredo-longo'
    expect(isAuthorizedMcpRequest('Bearer segredo-longo')).toBe(true)
    expect(isAuthorizedMcpRequest('bearer segredo-longo')).toBe(true)
    expect(isAuthorizedMcpRequest('Bearer outro')).toBe(false)
    expect(isAuthorizedMcpRequest('segredo-longo')).toBe(false)
    expect(isAuthorizedMcpRequest(null)).toBe(false)
  })
})
