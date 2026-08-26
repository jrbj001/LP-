import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export type AlquimiaRole = 'alquimia-admin' | 'consultant' | 'client'

export interface AlquimiaSession {
  sub: string
  name: string
  role: AlquimiaRole
  engagementIds: string[]
  exp: number
}

export const ALQUIMIA_SESSION_COOKIE = 'alquimia.session'
const SESSION_TTL_SECONDS = 60 * 60 * 12

function sessionSecret(): string {
  const secret = process.env.ALQUIMIA_SESSION_SECRET || process.env.ADAPTIVE_OPS_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV !== 'production') return 'alquimia-local-development-secret'
  throw new Error('ALQUIMIA_SESSION_SECRET não configurado')
}

function encode(value: string): string {
  return Buffer.from(value).toString('base64url')
}

function sign(payload: string): string {
  return createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
}

export function createAlquimiaSessionToken(
  session: Omit<AlquimiaSession, 'exp'>
): string {
  const payload = encode(
    JSON.stringify({
      ...session,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    })
  )
  return `${payload}.${sign(payload)}`
}

export function verifyAlquimiaSessionToken(token?: string): AlquimiaSession | null {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = sign(payload)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as AlquimiaSession
    if (parsed.exp <= Math.floor(Date.now() / 1000)) return null
    if (!Array.isArray(parsed.engagementIds)) return null
    return parsed
  } catch {
    return null
  }
}

export async function getAlquimiaSession(): Promise<AlquimiaSession | null> {
  const store = await cookies()
  return verifyAlquimiaSessionToken(store.get(ALQUIMIA_SESSION_COOKIE)?.value)
}

export function canAccessEngagement(
  session: AlquimiaSession,
  engagementId: string
): boolean {
  return (
    session.role === 'alquimia-admin' ||
    session.role === 'consultant' ||
    session.engagementIds.includes(engagementId)
  )
}

type Credential = Omit<AlquimiaSession, 'exp'>

function configuredClients(): Array<Credential & { password: string }> {
  const raw = process.env.ALQUIMIA_CLIENT_ACCESS
  if (!raw) {
    if (process.env.NODE_ENV === 'production') return []
    return [
      {
        sub: 'orfeu-client',
        name: 'Café Orfeu',
        role: 'client',
        engagementIds: ['orfeu'],
        password: 'cliente2026',
      },
    ]
  }

  try {
    return JSON.parse(raw) as Array<Credential & { password: string }>
  } catch {
    throw new Error('ALQUIMIA_CLIENT_ACCESS deve ser um JSON válido')
  }
}

export function authenticateAlquimia(
  accessType: 'partner' | 'client',
  password: string
): Credential | null {
  if (accessType === 'partner') {
    const expected =
      process.env.ALQUIMIA_ADMIN_PASSWORD ||
      (process.env.NODE_ENV !== 'production' ? 'alquemia2026' : '')
    if (!expected || password !== expected) return null
    return {
      sub: 'alquimia-team',
      name: 'Time Alquemia',
      role: 'alquimia-admin',
      engagementIds: [],
    }
  }

  const credential = configuredClients().find(item => item.password === password)
  if (!credential) return null
  const { password: _password, ...session } = credential
  return session
}
