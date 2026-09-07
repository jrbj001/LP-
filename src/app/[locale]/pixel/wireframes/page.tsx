import type { Metadata } from 'next'
import { WireframesPage } from '@/components/adaptive-layer/wireframes'

export const metadata: Metadata = {
  title: 'Wireframes · Adaptive Layer™ | PixelPulseLab',
  description:
    'A interface do sistema operacional de IA: console, knowledge graph, agentes, conectores e auditoria — os dados da sua empresa, na sua mão.',
  robots: { index: false },
}

export default function WireframesRoute() {
  return <WireframesPage />
}
