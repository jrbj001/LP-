import type { Metadata } from 'next'
import { DatacenterSidebar } from '@/components/datacenter/sidebar'
import { DatacenterGate } from '@/components/datacenter/gate'
import { META } from '@/components/datacenter/data'

export const metadata: Metadata = {
  title: `${META.title} | PixelPulseLab`,
  description: META.tagline,
  robots: { index: false, follow: false },
}

export default function DatacenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <DatacenterGate>
      <div className="min-h-screen bg-[#fbfbfa] text-neutral-900 antialiased">
        <DatacenterSidebar />
        <div className="lg:pl-64">
          <div className="pt-14 lg:pt-0">{children}</div>
        </div>
      </div>
    </DatacenterGate>
  )
}
