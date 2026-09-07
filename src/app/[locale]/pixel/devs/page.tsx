import type { Metadata } from 'next'
import { DevsPage } from '@/components/adaptive-layer/devs'

export const metadata: Metadata = {
  title: 'Devs · Adaptive Layer™ | PixelPulseLab',
  description:
    'SDK, API REST e MCP para times internos e fornecedores integrarem com a Adaptive Layer™ — o sistema operacional de IA da empresa, com ACL e audit em cada chamada.',
}

export default function DevsRoute() {
  return <DevsPage />
}
