import type { Metadata } from 'next'
import { DM_Sans, Sora } from 'next/font/google'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-cadence-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-cadence-body',
  display: 'swap',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ clientId: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clientId: string }>
}): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) return { title: 'Cliente | PixelPulseLab' }
  return {
    title: `${client.name} | Cadence · PixelPulseLab`,
    description: client.tagline,
  }
}

export default async function ClientRootLayout({ children, params }: Props) {
  const { clientId } = await params
  if (!getClient(clientId)) notFound()

  return <div className={`${sora.variable} ${dmSans.variable}`}>{children}</div>
}
