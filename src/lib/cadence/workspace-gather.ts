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

export interface WorkspaceGatherOptions {
  meetings?: boolean
  documents?: boolean
}

/** Só busca as fontes pedidas: reuniões e documentos não rodam quando o orquestrador não os escolheu. */
export async function gatherWorkspaceContext(
  clientId: string,
  query: string,
  options: WorkspaceGatherOptions = {}
): Promise<WorkspaceContextBundle> {
  const wantMeetings = options.meetings !== false
  const wantDocuments = options.documents !== false
  const client = getClient(clientId)
  const portal = wantDocuments ? (client?.documents ?? []) : []
  const [uploaded, agentMeetings] = await Promise.all([
    wantDocuments
      ? listDocuments(clientId).catch((): ClientDocumentRecord[] => [])
      : Promise.resolve([] as ClientDocumentRecord[]),
    // Reuniões gravadas pelo agente de reunião (com decisões e itens de ação do relatório).
    wantMeetings ? listAgentMeetings(clientId) : Promise.resolve([]),
  ])
  const meetings = wantMeetings ? [...(client?.meetings ?? []), ...agentMeetings] : []

  return {
    meetings: selectWorkspaceMeetings(meetings, query),
    documents: [...selectPortalDocuments(portal, query), ...selectUploadedDocuments(uploaded, query)],
    catalog: {
      meetings: meetings.map(item => item.title),
      documents: [...portal.map(item => item.title), ...uploaded.map(item => item.title)],
    },
  }
}
