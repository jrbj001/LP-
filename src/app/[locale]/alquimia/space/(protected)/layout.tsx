import { redirect } from 'next/navigation'
import { AlquimiaShell } from '@/components/alquimia/space/alquimia-shell'
import { getAlquimiaSession } from '@/lib/alquimia/auth'

export const dynamic = 'force-dynamic'

export default async function AlquimiaSpaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getAlquimiaSession()
  if (!session) redirect(`/${locale}/alquimia/space/login`)

  return (
    <AlquimiaShell locale={locale} session={session}>
      {children}
    </AlquimiaShell>
  )
}
