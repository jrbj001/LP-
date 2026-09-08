import 'server-only'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getClient } from './registry'
import {
  canAccessClient,
  CLIENT_SESSION_COOKIE,
  type ClientSession,
  verifyClientSessionToken,
} from './session'

export { authenticateClient } from './credentials'
export {
  canAccessClient,
  CLIENT_SESSION_COOKIE,
  CLIENT_SESSION_TTL_SECONDS,
  createClientSessionToken,
  verifyClientSessionToken,
  type ClientSession,
} from './session'

export async function getClientSession(): Promise<ClientSession | null> {
  const store = await cookies()
  return verifyClientSessionToken(store.get(CLIENT_SESSION_COOKIE)?.value)
}

export async function requireClientSession(slug: string): Promise<ClientSession | NextResponse> {
  const client = getClient(slug)
  const session = await getClientSession()
  if (!client || !session || !canAccessClient(session, client.slug)) {
    return NextResponse.json({ ok: false, error: 'Faça login para continuar.' }, { status: 401 })
  }
  return session
}
