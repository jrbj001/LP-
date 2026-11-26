import 'server-only'

import { getClient } from '@/lib/client/registry'
import type { ClientDocument, ClientMeeting } from '@/lib/client/types'
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

interface WorkspaceSources {
  meetings: ClientMeeting[]
  portal: ClientDocument[]
  uploaded: ClientDocumentRecord[]
}

async function loadWorkspaceSources(
  clientId: string,
  wantMeetings: boolean,
  wantDocuments: boolean,
  prefix: string
): Promise<WorkspaceSources> {
  const client = getClient(clientId)
  const [uploaded, agentMeetings] = await Promise.all([
    wantDocuments
      ? listDocuments(clientId).catch((): ClientDocumentRecord[] => [])
      : Promise.resolve([] as ClientDocumentRecord[]),
    // Reuniões gravadas pelo agente de reunião (com decisões e itens de ação do relatório).
    wantMeetings ? listAgentMeetings(clientId) : Promise.resolve([]),
  ])
  const meetings = wantMeetings ? [...(client?.meetings ?? []), ...agentMeetings] : []
  const portal = wantDocuments ? (client?.documents ?? []) : []
  return {
    meetings: meetings.map(item => ({ ...item, title: `${prefix}${item.title}` })),
    portal: portal.map(item => ({ ...item, title: `${prefix}${item.title}` })),
    uploaded: uploaded.map(item => ({ ...item, title: `${prefix}${item.title}` })),
  }
}

/**
 * Só busca as fontes pedidas: reuniões e documentos não rodam quando o orquestrador não os escolheu.
 * Com vários workspaces (portfólio), o título leva o nome do cliente para a resposta não misturar projetos.
 */
export async function gatherWorkspaceContext(
  clientIds: string | string[],
  query: string,
  options: WorkspaceGatherOptions = {}
): Promise<WorkspaceContextBundle> {
  const wantMeetings = options.meetings !== false
  const wantDocuments = options.documents !== false
  const ids = Array.isArray(clientIds) ? clientIds : [clientIds]
  const labelled = ids.length > 1
  const loaded = await Promise.all(
    ids.map(id =>
      loadWorkspaceSources(
        id,
        wantMeetings,
        wantDocuments,
        labelled ? `${getClient(id)?.name ?? id} · ` : ''
      )
    )
  )
  const meetings = loaded.flatMap(item => item.meetings)
  const portal = loaded.flatMap(item => item.portal)
  const uploaded = loaded.flatMap(item => item.uploaded)

  return {
    meetings: selectWorkspaceMeetings(meetings, query),
    documents: [...selectPortalDocuments(portal, query), ...selectUploadedDocuments(uploaded, query)],
    catalog: {
      meetings: meetings.map(item => item.title),
      documents: [...portal.map(item => item.title), ...uploaded.map(item => item.title)],
    },
  }
}
