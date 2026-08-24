import { Figtree, Zen_Dots } from 'next/font/google'
import type { Metadata } from 'next'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-alquimia-body',
  display: 'swap',
})

const zenDots = Zen_Dots({
  subsets: ['latin'],
  variable: '--font-alquimia-display',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Transformation Space · Alquemia',
  description: 'Ambiente operacional da metodologia Alquemia.',
  robots: { index: false, follow: false },
}

export default function AlquimiaSpaceRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={`${figtree.variable} ${zenDots.variable}`}>{children}</div>
}
