import 'server-only'

import { cadenceDb, hasCadenceDatabase } from './db'

export interface CadenceSummary {
  available: boolean
  cardsByColumn: { column: string; n: number }[]
  prs: { total: number; last42Days: number }
  documents: { total: number; recentTitles: string[] }
  meetings: { total: number; recentTitles: string[] }
}

function emptySummary(available: boolean): CadenceSummary {
  return {
    available,
    cardsByColumn: [],
    prs: { total: 0, last42Days: 0 },
    documents: { total: 0, recentTitles: [] },
    meetings: { total: 0, recentTitles: [] },
  }
}

export async function getCadenceSummary(clientId: string): Promise<CadenceSummary> {
  if (!hasCadenceDatabase()) return emptySummary(false)
  try {
    const sql = cadenceDb()
    const [cards, prs, documents, meetings] = await Promise.all([
      sql<{ column: string; n: number }[]>`
        select column_id as column, count(*)::int as n
        from cadence_cards
        where client_id = ${clientId}
        group by column_id
        order by column_id
      `,
      sql<{ total: number; last42: number }[]>`
        select
          count(*)::int as total,
          count(*) filter (where merged_at >= now() - interval '42 days')::int as last42
        from cadence_delivery_prs
        where client_id = ${clientId}
      `,
      sql<{ title: string }[]>`
        select title from cadence_documents
        where client_id = ${clientId}
        order by updated_at desc nulls last
        limit 5
      `,
      sql<{ title: string }[]>`
        select title from cadence_meetings
        where client_id = ${clientId}
        order by occurred_at desc nulls last
        limit 5
      `,
    ])

    const docCount = await sql<{ n: number }[]>`
      select count(*)::int as n from cadence_documents where client_id = ${clientId}
    `
    const meetCount = await sql<{ n: number }[]>`
      select count(*)::int as n from cadence_meetings where client_id = ${clientId}
    `

    return {
      available: true,
      cardsByColumn: cards.map(row => ({ column: row.column, n: Number(row.n) })),
      prs: { total: Number(prs[0]?.total ?? 0), last42Days: Number(prs[0]?.last42 ?? 0) },
      documents: {
        total: Number(docCount[0]?.n ?? 0),
        recentTitles: documents.map(row => row.title),
      },
      meetings: {
        total: Number(meetCount[0]?.n ?? 0),
        recentTitles: meetings.map(row => row.title),
      },
    }
  } catch (error) {
    console.warn('[cadence/summary]', error instanceof Error ? error.message : error)
    return emptySummary(false)
  }
}

export function formatCadenceSummaryForPrompt(summary: CadenceSummary): string {
  if (!summary.available) {
    return 'Resumo Cadence (Postgres): indisponível neste ambiente. Não invente contagens.'
  }
  const columns = summary.cardsByColumn.map(row => `${row.column}=${row.n}`).join(', ') || 'nenhum card'
  return [
    'Resumo consultável (números reais do Neon — não invente outros):',
    `Cards por coluna: ${columns}`,
    `PRs mescladas: ${summary.prs.total} no cache; ${summary.prs.last42Days} nas últimas 6 semanas`,
    `Documentos: ${summary.documents.total}${
      summary.documents.recentTitles.length ? ` (recentes: ${summary.documents.recentTitles.join('; ')})` : ''
    }`,
    `Reuniões: ${summary.meetings.total}${
      summary.meetings.recentTitles.length ? ` (recentes: ${summary.meetings.recentTitles.join('; ')})` : ''
    }`,
  ].join('\n')
}
