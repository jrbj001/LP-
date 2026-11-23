import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import './globals.css'

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] })
const body = Manrope({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'Atlas de Viagem — descubra o mundo de cima',
  description: 'Explore destinos e atrações turísticas em um globo 3D com imagens de satélite.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0E1A24',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="stylesheet" href="/cesium/Widgets/widgets.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
