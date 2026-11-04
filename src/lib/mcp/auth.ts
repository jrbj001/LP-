import { timingSafeEqual } from 'node:crypto'

export function mcpBearerToken(): string | null {
  const token = process.env.BE180_MCP_TOKEN?.trim()
  return token || null
}

export function isAuthorizedMcpRequest(authorization: string | null | undefined): boolean {
  const expected = mcpBearerToken()
  if (!expected) return false
  const header = authorization?.trim() ?? ''
  const prefix = 'bearer '
  if (!header.toLowerCase().startsWith(prefix)) return false
  const presented = header.slice(prefix.length).trim()
  const left = Buffer.from(presented)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}
