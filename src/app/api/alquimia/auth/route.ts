import { NextResponse } from 'next/server'
import {
  ALQUIMIA_SESSION_COOKIE,
  authenticateAlquimia,
  createAlquimiaSessionToken,
} from '@/lib/alquimia/auth'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      accessType?: 'partner' | 'client'
      password?: string
    }
    const accessType = body.accessType === 'client' ? 'client' : 'partner'
    const password = String(body.password || '')
    const credential = authenticateAlquimia(accessType, password)

    if (!credential) {
      return NextResponse.json(
        { ok: false, error: 'Código de acesso inválido.' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(
      ALQUIMIA_SESSION_COOKIE,
      createAlquimiaSessionToken(credential),
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 12,
      }
    )
    return response
  } catch (error) {
    console.error('[alquimia/auth]', error)
    return NextResponse.json(
      { ok: false, error: 'Não foi possível iniciar a sessão.' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ALQUIMIA_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
