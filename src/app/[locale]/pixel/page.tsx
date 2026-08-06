import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { PixelLP } from '@/components/pixel/pixel-lp'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-pixel-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-pixel-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pixel · Adaptive Layer™ SDK | PixelPulseLab',
  description:
    'Pixel é o modelo e o SDK da Adaptive Layer™ — a camada que faz seus sistemas conversarem e seu squad de agentes trabalharem sobre uma única verdade.',
  openGraph: {
    title: 'Pixel · Adaptive Layer™ SDK',
    description:
      'Camada de integração + squad de agentes. Provado no Café Orfeu. Productizado pela PixelPulseLab.',
  },
}

export default function PixelPage() {
  return (
    <div className={`${syne.variable} ${dmSans.variable}`}>
      <PixelLP />
    </div>
  )
}
