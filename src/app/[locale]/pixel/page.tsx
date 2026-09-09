import type { Metadata } from 'next'
import { AdaptiveLayerLP } from '@/components/adaptive-layer/lp'

export const metadata: Metadata = {
  title: 'Adaptive Layer™ | PixelPulseLab',
  description:
    'The AI operating system for the enterprise. Adaptive Layer™ conecta agentes de IA aos sistemas, dados e conhecimento da empresa — com contexto, identidade e governança, na sua nuvem.',
  openGraph: {
    title: 'Adaptive Layer™ — the AI operating system for the enterprise',
    description: 'O sistema operacional de IA da sua empresa — agentes conectados a sistemas, dados e conhecimento, com governança na sua nuvem.',
  },
}

export default function AdaptiveLayerPage() {
  return <AdaptiveLayerLP />
}
