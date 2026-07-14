import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Exclude API routes — next-intl must not rewrite /api/* into /{locale}/api/*
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
