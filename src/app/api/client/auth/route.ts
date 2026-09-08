import { NextResponse } from 'next/server'
import {
  authenticateClient,
  CLIENT_SESSION_COOKIE,
  CLIENT_SESSION_TTL_SECONDS,
  createClientSessionToken,
} from '@/lib/client/auth'

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { slug?: string; password?: string }
    const slug = String(body.slug || '').trim()
    const password = String(body.password || '')
    const credential = authenticateClient(slug, password)

    if (!credential) {
      return NextResponse.json({ ok: false, error: 'Senha inválida.' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true, slug: credential.slug })
    response.cookies.set(
      CLIENT_SESSION_COOKIE,
      await createClientSessionToken({ slug: credential.slug, name: credential.name }),
      cookieOptions(CLIENT_SESSION_TTL_SECONDS)
    )
    return response
  } catch (error) {
    console.error('[client/auth]', error)
    return NextResponse.json(
      { ok: false, error: 'Não foi possível iniciar a sessão.' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(CLIENT_SESSION_COOKIE, '', cookieOptions(0))
  return response
}
