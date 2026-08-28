import type { Metadata } from 'next'
import { AdaptiveLayerLP } from '@/components/adaptive-layer/lp'

export const metadata: Metadata = {
  title: 'Adaptive Layer™ | PixelPulseLab',
  description:
    'The data and context layer that makes the enterprise AI-ready. Adaptive Layer™ — dados, contexto e ação, governados, na sua nuvem.',
  openGraph: {
    title: 'Adaptive Layer™ — enterprise AI-ready',
    description: 'A camada de dados e contexto que deixa a empresa pronta para IA.',
  },
}

export default function AdaptiveLayerPage() {
  return <AdaptiveLayerLP />
}
