import type { Metadata } from 'next'
import { AdaptiveLayerVideoPage } from '@/components/adaptive-layer/video-page'
import { FILME2 } from '@/components/adaptive-layer/lp-data'

export const metadata: Metadata = {
  title: 'A empresa a uma pergunta de distância · Adaptive Layer™ | PixelPulseLab',
  description:
    'O briefing matinal de um executivo pelo smartphone: pergunta em linguagem natural, entende a causa com fonte e executa com governança — Adaptive Layer™, por PixelPulseLab.',
  robots: { index: false },
}

export default function VideoMobileRoute() {
  return <AdaptiveLayerVideoPage film={FILME2} />
}
