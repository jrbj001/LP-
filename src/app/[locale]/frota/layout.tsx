import type { Metadata } from 'next'
import { FrotaSidebar } from '@/components/frota/sidebar'

export const metadata: Metadata = {
  title: 'Projeto Frota | PixelPulseLab',
  description: 'SF Network Intelligence — A inteligência de rede que transforma 2.410 contatos na pessoa certa, na hora certa.',
}

export default function FrotaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900 antialiased">
      <FrotaSidebar />
      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">{children}</div>
      </div>
    </div>
  )
}
