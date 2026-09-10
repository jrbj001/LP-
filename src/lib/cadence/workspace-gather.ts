import 'server-only'

import { getClient } from '@/lib/client/registry'
import { listDocuments } from '@/lib/documents/store'
import type { ClientDocumentRecord } from '@/lib/documents/types'
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
  const meetings = client?.meetings ?? []
  const portal = client?.documents ?? []
  let uploaded: ClientDocumentRecord[] = []
  try {
    uploaded = await listDocuments(clientId)
  } catch {
    uploaded = []
  }

  return {
    meetings: selectWorkspaceMeetings(meetings, query),
    documents: [...selectPortalDocuments(portal, query), ...selectUploadedDocuments(uploaded, query)],
    catalog: {
      meetings: meetings.map(item => item.title),
      documents: [...portal.map(item => item.title), ...uploaded.map(item => item.title)],
    },
  }
}
