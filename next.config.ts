import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/api/alquimia/documents/**': ['./docs/alquimia/conteudos-finais/**'],
    '/src/app/**/alquimia/space/**': ['./docs/alquimia/conteudos-finais/**'],
  },
}

export default withNextIntl(nextConfig)
