import 'server-only'

import type { BacklogCard } from '@/lib/backlog/types'
import type { ClientDocumentRecord } from '@/lib/documents/types'
import type { ClientMeeting } from '@/lib/client/types'
import type { DeliveryCachePayload } from '@/lib/delivery/cache'
import { cadenceDb, hasCadenceDatabase } from './db'

function warn(scope: string, error: unknown): void {
  console.warn(`[cadence/sync] ${scope}:`, error instanceof Error ? error.message : error)
}

export async function syncCadenceCards(clientId: string, cards: BacklogCard[]): Promise<void> {
  if (!hasCadenceDatabase()) return
  try {
    const sql = cadenceDb()
    await sql.begin(async tx => {
      await tx`delete from cadence_cards where client_id = ${clientId}`
      for (const card of cards) {
        await tx`
          insert into cadence_cards (
            client_id, card_id, board_id, project_id, column_id, title, level,
            persona, want, so_that, acceptance, context, priority, source_kind, source_ref,
            created_at, updated_at
          ) values (
            ${clientId},
            ${card.id},
            ${card.boardId},
            ${card.projectId ?? null},
            ${card.column},
            ${card.title},
            ${card.level},
            ${card.persona ?? null},
            ${card.want ?? null},
            ${card.soThat ?? null},
            ${tx.json(card.acceptance ?? [])},
            ${card.context ?? null},
            ${card.priority ?? null},
            ${card.source.kind},
            ${card.source.ref ?? null},
            ${card.createdAt},
            ${card.updatedAt}
          )
        `
      }
    })
  } catch (error) {
    warn('cards', error)
  }
}

export async function syncCadenceDelivery(
  clientId: string,
  cache: DeliveryCachePayload
): Promise<void> {
  if (!hasCadenceDatabase()) return
  try {
    const sql = cadenceDb()
    await sql.begin(async tx => {
      await tx`delete from cadence_delivery_prs where client_id = ${clientId}`
      await tx`delete from cadence_delivery_commits where client_id = ${clientId}`
      for (const pr of cache.prs) {
        await tx`
          insert into cadence_delivery_prs (
            client_id, repo, number, title, branch, type, fix_kind, product,
            merged_at, additions, deletions, changed_files, commit_count
          ) values (
            ${clientId},
            ${pr.repo},
            ${pr.number},
            ${pr.title},
            ${pr.branch},
            ${pr.type},
            ${pr.fixKind ?? null},
            ${pr.product},
            ${pr.mergedAt},
            ${pr.additions},
            ${pr.deletions},
            ${pr.changedFiles},
            ${pr.commitCount}
          )
        `
      }
      for (const commit of cache.commits) {
        await tx`
          insert into cadence_delivery_commits (client_id, committed_at, type, fix_kind)
          values (${clientId}, ${commit.date.slice(0, 10)}, ${commit.type}, ${commit.fixKind ?? null})
        `
      }
    })
  } catch (error) {
    warn('delivery', error)
  }
}

export async function syncCadenceMeetings(
  clientId: string,
  meetings: ClientMeeting[]
): Promise<void> {
  if (!hasCadenceDatabase()) return
  try {
    const sql = cadenceDb()
    await sql.begin(async tx => {
      await tx`delete from cadence_meetings where client_id = ${clientId}`
      for (const meeting of meetings) {
        await tx`
          insert into cadence_meetings (
            client_id, meeting_id, title, occurred_at, duration, status, attendees, owner, summary
          ) values (
            ${clientId},
            ${meeting.id},
            ${meeting.title},
            ${meeting.date},
            ${meeting.duration ?? null},
            ${meeting.status},
            ${tx.json(meeting.attendees)},
            ${meeting.owner ?? null},
            ${meeting.summary ?? null}
          )
        `
      }
    })
  } catch (error) {
    warn('meetings', error)
  }
}

export async function syncCadenceDocuments(
  clientId: string,
  documents: ClientDocumentRecord[]
): Promise<void> {
  if (!hasCadenceDatabase()) return
  try {
    const sql = cadenceDb()
    await sql.begin(async tx => {
      await tx`delete from cadence_documents where client_id = ${clientId}`
      for (const document of documents) {
        await tx`
          insert into cadence_documents (
            client_id, document_id, title, kind, file_name, status, board_id, source_url,
            updated_at, created_at
          ) values (
            ${clientId},
            ${document.id},
            ${document.title},
            ${document.kind},
            ${document.fileName},
            ${document.status},
            ${document.boardId ?? null},
            ${document.sourceUrl ?? null},
            ${document.updatedAt},
            ${document.createdAt}
          )
        `
      }
    })
  } catch (error) {
    warn('documents', error)
  }
}
