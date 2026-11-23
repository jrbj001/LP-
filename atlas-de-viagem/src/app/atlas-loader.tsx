'use client'

import dynamic from 'next/dynamic'
import { Logo } from '@/components/logo'

const AtlasApp = dynamic(() => import('@/components/atlas-app').then(mod => mod.AtlasApp), {
  ssr: false,
  loading: () => (
    <div className="splash">
      <Logo size={56} />
      <p>Preparando o globo…</p>
    </div>
  ),
})

export function AtlasLoader() {
  return <AtlasApp />
}
