import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PixelPulseLab.dev | AI Product & Infrastructure Company',
  description:
    'We build adaptive intelligence systems and intelligence platforms for real-world operations. Software engineering, AI and operational expertise combined.',
  openGraph: {
    title: 'PixelPulseLab.dev — Adaptive cognition, delivered as code.',
    description:
      'AI Product & Infrastructure Company building adaptive intelligence systems for real-world operations.',
    url: 'https://pixelpulselab.dev',
    siteName: 'PixelPulseLab.dev',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
