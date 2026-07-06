import type { Metadata } from 'next'
import { Sidebar } from '@/components/adaptive/sidebar'

export const metadata: Metadata = {
  title: 'Adaptive Enterprise™ | PixelPulseLab',
  description: 'Aligning Business, Technology & Artificial Intelligence. The proprietary technology assessment methodology by PixelPulseLab.',
}

export default function AdaptiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adaptive-scope min-h-screen bg-[#fbfbfa] text-neutral-900 antialiased">
      <Sidebar />
      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">{children}</div>
      </div>
    </div>
  )
}
