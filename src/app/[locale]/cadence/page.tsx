import type { Metadata } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import { CadenceLP } from '@/components/cadence/cadence-lp'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-cadence-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-cadence-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cadence · Agent-ready Delivery™ | PixelPulseLab',
  description:
    'Cadence é o product management que entende seu código e inclui agentes nas tasks — contexto de docs, reuniões e GitHub, com specs agent-ready.',
  openGraph: {
    title: 'Cadence by PixelPulseLab',
    description:
      'Product & project management com contexto vivo, enrichment LLM e agentes no caminho crítico.',
  },
}

export default function CadencePage() {
  return (
    <div className={`${sora.variable} ${dmSans.variable}`}>
      <CadenceLP />
    </div>
  )
}
