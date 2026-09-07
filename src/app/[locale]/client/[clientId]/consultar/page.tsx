import { notFound } from 'next/navigation'
import { ConsultarWorkspace } from '@/components/client/consultar/consultar-workspace'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import { getClient } from '@/lib/client/registry'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export default async function ConsultarPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Workspace`}
        title="Consultar"
        description="Pergunte em português sobre cards, entregas, reuniões e documentos. A resposta vem de SQL somente-leitura no Neon."
        backHref={`/${locale}/client/${client.slug}`}
      />
      <ConsultarWorkspace
        clientId={client.slug}
        accent={client.accent}
        sourcesHref={`/${locale}/client/${client.slug}/fontes-de-dados`}
      />
    </div>
  )
}
