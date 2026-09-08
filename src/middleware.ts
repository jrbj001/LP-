import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { CLIENT_SESSION_COOKIE, verifyClientSessionToken } from './lib/client/session'

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/client/') && pathname !== '/api/client/auth') {
      const clientId = pathname.split('/')[3]
      if (clientId) {
        const session = await verifyClientSessionToken(
          request.cookies.get(CLIENT_SESSION_COOKIE)?.value
        )
        if (!session || session.slug !== clientId) {
          return NextResponse.json(
            { ok: false, error: 'Faça login para continuar.' },
            { status: 401 }
          )
        }
      }
    }
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
