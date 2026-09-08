import { redirect } from 'next/navigation'
import { ClientLoginForm } from '@/components/client/client-login-form'
import { canAccessClient, getClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export default async function ClientLoginPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) redirect(`/${locale}/client`)

  const session = await getClientSession()
  if (session && canAccessClient(session, client.slug)) {
    redirect(`/${locale}/client/${client.slug}`)
  }

  return (
    <main className="cadence-scope min-h-screen bg-[#f2f2f0] text-neutral-900 antialiased">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Área do cliente
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-cadence-display)] text-[32px] font-semibold tracking-[-0.04em]">
          {client.name}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">
          Este workspace é privado. Informe a senha deste cliente para entrar.
        </p>
        <ClientLoginForm
          locale={locale}
          slug={client.slug}
          accent={client.accent}
        />
      </div>
    </main>
  )
}
