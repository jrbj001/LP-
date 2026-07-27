import type { Metadata } from 'next'
import { ValorHoraGuide } from '@/components/guides/valor-hora-guide'
import { GUIDE_META } from '@/components/guides/valor-hora-data'

export const metadata: Metadata = {
  title: `${GUIDE_META.title} | PixelPulseLab.dev`,
  description: GUIDE_META.description,
}

export default function ValorHoraGuidePage() {
  return <ValorHoraGuide />
}
