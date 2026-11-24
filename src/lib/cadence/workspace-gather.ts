import 'server-only'

import { getClient } from '@/lib/client/registry'
import { listDocuments } from '@/lib/documents/store'
import type { ClientDocumentRecord } from '@/lib/documents/types'
import { listAgentMeetings } from '@/lib/meeting-agent/meetings'
import {
  selectPortalDocuments,
  selectUploadedDocuments,
  selectWorkspaceMeetings,
  type WorkspaceContextBundle,
} from './workspace-context'

export async function gatherWorkspaceContext(
  clientId: string,
  query: string
): Promise<WorkspaceContextBundle> {
  const client = getClient(clientId)
  const portal = client?.documents ?? []
  const [uploaded, agentMeetings] = await Promise.all([
    listDocuments(clientId).catch((): ClientDocumentRecord[] => []),
    // Reuniões gravadas pelo agente de reunião (com decisões e itens de ação do relatório).
    listAgentMeetings(clientId),
  ])
  const meetings = [...(client?.meetings ?? []), ...agentMeetings]

  return {
    meetings: selectWorkspaceMeetings(meetings, query),
    documents: [...selectPortalDocuments(portal, query), ...selectUploadedDocuments(uploaded, query)],
    catalog: {
      meetings: meetings.map(item => item.title),
      documents: [...portal.map(item => item.title), ...uploaded.map(item => item.title)],
    },
  }
}
