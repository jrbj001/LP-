import type { Metadata } from 'next'
import { AdaptiveLayerVideoPage } from '@/components/adaptive-layer/video-page'

export const metadata: Metadata = {
  title: 'Como funciona · Adaptive Layer™ | PixelPulseLab',
  description: 'Como funciona o sistema operacional de IA da sua empresa: sistemas, agentes e governança com a Adaptive Layer™.',
}

export default function VideoRoute() {
  return <AdaptiveLayerVideoPage />
}
