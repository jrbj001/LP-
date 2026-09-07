import type { Metadata } from 'next'
import { RoiPage } from '@/components/adaptive-layer/roi'

export const metadata: Metadata = {
  title: 'Calculadora de ROI · Adaptive Layer™ | PixelPulseLab',
  description:
    'Quanto vale um sistema operacional de IA na sua empresa? Calcule o ROI da Adaptive Layer™ com as premissas da sua operação — horas recuperadas, valor por ano e payback.',
}

export default function RoiRoute() {
  return <RoiPage />
}
