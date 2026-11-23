import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CadenceAvatar } from '@/components/meeting-agent/cadence-avatar'
import { avatarSecret, verifyAvatarToken } from '@/lib/meeting-agent/avatar-token'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/** Página que o bot do Recall transmite como câmera. O token prende o acesso a este bot. */
export default async function MeetingAvatarPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; botRecordId: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { botRecordId } = await params
  const { t } = await searchParams

  if (!verifyAvatarToken(botRecordId, t ?? null, avatarSecret())) notFound()

  return <CadenceAvatar botRecordId={botRecordId} token={t as string} />
}
