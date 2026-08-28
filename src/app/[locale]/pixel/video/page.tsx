import type { Metadata } from 'next'
import { AdaptiveLayerVideoPage } from '@/components/adaptive-layer/video-page'

export const metadata: Metadata = {
  title: 'Como funciona · Adaptive Layer™ | PixelPulseLab',
  description: 'Pitch: como a Adaptive Layer™ funciona — do pedido à resposta.',
}

export default function VideoRoute() {
  return <AdaptiveLayerVideoPage />
}
