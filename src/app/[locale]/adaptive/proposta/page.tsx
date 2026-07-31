import type { Metadata } from 'next'
import { ProposalView } from '@/components/adaptive/proposal-view'

export const metadata: Metadata = {
  title: 'Proposta de Trabalho | Adaptive Enterprise™',
  robots: { index: false, follow: false },
}

export default function ProposalPage() {
  return <ProposalView />
}
