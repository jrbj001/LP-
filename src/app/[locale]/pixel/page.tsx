import type { Metadata } from 'next'
import { AdaptiveLayerLP } from '@/components/adaptive-layer/lp'

export const metadata: Metadata = {
  title: 'Adaptive Layer™ | PixelPulseLab',
  description:
    'The AI operating system for the enterprise. Adaptive Layer™ — agentes, fluxos e sistemas sob governança comum, agnóstico de modelo, na sua nuvem.',
  openGraph: {
    title: 'Adaptive Layer™ — the AI operating system for the enterprise',
    description: 'O sistema operacional de IA da sua empresa — agentes, fluxos e sistemas sob governança comum.',
  },
}

export default function AdaptiveLayerPage() {
  return <AdaptiveLayerLP />
}
