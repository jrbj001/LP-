import type { Metadata } from 'next'
import { AdaptiveLayerDocView } from '@/components/adaptive/adaptive-layer-doc-view'

export const metadata: Metadata = {
  title: 'Adaptive Layer™ | Adaptive Enterprise™',
  robots: { index: false, follow: false },
}

export default function AdaptiveLayerDocPage() {
  return <AdaptiveLayerDocView />
}
