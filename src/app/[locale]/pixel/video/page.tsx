import type { Metadata } from 'next'
import { AdaptiveLayerVideoPage } from '@/components/adaptive-layer/video-page'

export const metadata: Metadata = {
  title: 'Como funciona · Adaptive Layer™ | PixelPulseLab',
  description: 'Como a Adaptive Layer™ deixa a empresa pronta para IA: sistemas, agentes e governança.',
}

export default function VideoRoute() {
  return <AdaptiveLayerVideoPage />
}
