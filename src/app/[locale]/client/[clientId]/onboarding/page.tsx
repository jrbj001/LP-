import { redirect } from 'next/navigation'
import { getClient } from '@/lib/client/registry'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

/** Onboarding legado — clientes maduros usam /projetos. */
export default async function ClientOnboardingPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) redirect(`/${locale}/client`)
  redirect(`/${locale}/client/${client.slug}/projetos`)
}
