import { notFound } from 'next/navigation'
import { getClient } from '@/lib/client/registry'
import { isJiraEnabled } from '@/lib/jira/access'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import { JiraEstimateWorkspace } from '@/components/client/jira/jira-estimate-workspace'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

export default async function ClientJiraPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()
  if (!isJiraEnabled(client.slug)) notFound()

  const base = `/${locale}/client/${client.slug}`

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Jira`}
        title="Estimativa do backlog"
        description="Stories do projeto APP ainda sem original estimate. O cálculo usa GitHub; a gravação no Jira só acontece depois da sua confirmação. Tickets já estimados ficam intocados."
        backHref={base}
      />
      <JiraEstimateWorkspace clientId={client.slug} accent={client.accent} />
    </div>
  )
}
