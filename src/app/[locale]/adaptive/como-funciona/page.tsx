import type { Metadata } from 'next'
import { HowItWorksView } from '@/components/assessment/how-it-works-view'

export const metadata: Metadata = {
  title: 'Como funciona a Adaptive Layer™ | PixelPulseLab',
  description: 'Guia visual da Adaptive Layer™: como conectamos os sistemas que a empresa já tem, criamos uma verdade operacional única e colocamos agentes de IA para trabalhar.',
}

export default function ComoFuncionaPage() {
  return <HowItWorksView />
}
