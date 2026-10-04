import { notFound } from 'next/navigation'
import { ConsultarTabs } from '@/components/client/consultar/consultar-tabs'
import { ModelagemWorkspace } from '@/components/client/consultar/modelagem/modelagem-workspace'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import { getClient } from '@/lib/client/registry'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
  searchParams: Promise<{ source?: string }>
}

export default async function ModelagemPage({ params, searchParams }: Props) {
  const { locale, clientId } = await params
  const { source } = await searchParams
  const client = getClient(clientId)
  if (!client) notFound()
  const base = `/${locale}/client/${client.slug}`

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Workspace`}
        title="Modelagem de dados"
        description="Estrutura completa das fontes cadastradas: tabelas, campos, relacionamentos, saúde dos dados e uma leitura de IA sobre o modelo."
        backHref={base}
      />
      <ConsultarTabs base={base} active="modelagem" />
      <ModelagemWorkspace
        clientId={client.slug}
        accent={client.accent}
        initialSourceId={typeof source === 'string' ? source : null}
        consultarHref={`${base}/consultar`}
        sourcesHref={`${base}/fontes-de-dados`}
      />
    </div>
  )
}
