import { notFound } from 'next/navigation'
import { DataSourcesWorkspace } from '@/components/client/data-sources/data-sources-workspace'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import { getClient } from '@/lib/client/registry'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export default async function DataSourcesPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()

  return (
    <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10 2xl:px-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Workspace`}
        title="Fontes de dados"
        description="Cadastre conexões PostgreSQL somente-leitura para consultar dados reais em linguagem natural."
        backHref={`/${locale}/client/${client.slug}`}
      />
      <DataSourcesWorkspace clientId={client.slug} accent={client.accent} />
    </div>
  )
}
