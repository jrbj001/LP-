import type { Metadata } from 'next'
import { Figtree, Zen_Dots } from 'next/font/google'
import { AlquimiaLP } from '@/components/alquimia/lp/alquimia-lp'

const zenDots = Zen_Dots({
  subsets: ['latin'],
  variable: '--font-alquimia-display',
  display: 'swap',
  weight: '400',
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-alquimia-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Alquemia · Transformando potenciais em capacidades',
  description:
    'Alquemia transforma potencial em capacidade ao combinar estratégia, experiência prática, inteligência artificial e desenvolvimento humano.',
  openGraph: {
    title: 'Alquemia · Transformando potenciais em capacidades',
    description:
      'Não aceleramos empresas. Transformamos potencial em capacidade com pessoas, estratégia, prática e inteligência artificial.',
    type: 'website',
    siteName: 'Alquemia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alquemia · Transformando potenciais em capacidades',
    description:
      'Estratégia, experiência prática, inteligência artificial e desenvolvimento humano em um único processo.',
  },
}

export default function AlquimiaPage() {
  return (
    <div className={`${zenDots.variable} ${figtree.variable}`}>
      <AlquimiaLP />
    </div>
  )
}
