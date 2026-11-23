import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O projeto vive dentro de outro repositório; fixa a raiz para o Next não herdar o lockfile do pai.
  outputFileTracingRoot: __dirname,
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/cesium/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ]
  },
}

export default nextConfig
