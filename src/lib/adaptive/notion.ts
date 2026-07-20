import { Client } from '@notionhq/client'
import type {
  PageObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { generateSlotCandidates, formatSlotLabel, type SlotWindowConfig } from './slots'
import type { AssessmentPayload, AssessmentRow, OnboardIdentity, ProgressRow, ProgressStatus, SessionSlot } from './types'

function env(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env ${name}`)
  return v
}

export function isNotionConfigured(): boolean {
  return Boolean(
    process.env.NOTION_TOKEN &&
    process.env.NOTION_PROGRESS_DB_ID &&
    process.env.NOTION_ASSESSMENTS_DB_ID &&
    process.env.NOTION_SESSIONS_DB_ID
  )
}

function notion(): Client {
  return new Client({ auth: env('NOTION_TOKEN') })
}

function textProp(page: PageObjectResponse, name: string): string {
  const p = page.properties[name]
  if (!p) return ''
  if (p.type === 'title') return p.title.map(t => t.plain_text).join('')
  if (p.type === 'rich_text') return p.rich_text.map(t => t.plain_text).join('')
  if (p.type === 'phone_number') return p.phone_number ?? ''
  if (p.type === 'select') return p.select?.name ?? ''
  if (p.type === 'date') return p.date?.start ?? ''
  return ''
}

function asPage(page: PageObjectResponse | PartialPageObjectResponse | Record<string, unknown>): PageObjectResponse | null {
  if (page && typeof page === 'object' && 'properties' in page) return page as PageObjectResponse
  return null
}

async function queryDataSource(
  dataSourceId: string,
  args: {
    filter?: Parameters<Client['dataSources']['query']>[0]['filter']
    sorts?: Parameters<Client['dataSources']['query']>[0]['sorts']
    page_size?: number
    start_cursor?: string
  }
) {
  return notion().dataSources.query({
    data_source_id: dataSourceId,
    ...args,
  })
}

// ─── Progress ────────────────────────────────────────────────────────────────

export async function findProgressPage(clientId: string, stakeholder: string): Promise<PageObjectResponse | null> {
  const res = await queryDataSource(env('NOTION_PROGRESS_DB_ID'), {
    filter: {
      and: [
        { property: 'Client', select: { equals: clientId } },
        { property: 'Stakeholder', rich_text: { equals: stakeholder } },
      ],
    },
    page_size: 1,
  })
  return asPage(res.results[0] ?? null)
}

export async function upsertIdentify(
  identity: OnboardIdentity,
  meta: { facilitator: string; meetingHost: string; areas: string; role: string }
): Promise<string> {
  const n = notion()
  const existing = await findProgressPage(identity.clientId, identity.stakeholder)
  const props = {
    Name: { title: [{ text: { content: `${identity.clientId} · ${identity.stakeholder}` } }] },
    Client: { select: { name: identity.clientId } },
    Stakeholder: { rich_text: [{ text: { content: identity.stakeholder } }] },
    Areas: { rich_text: [{ text: { content: meta.areas || '—' } }] },
    Role: { rich_text: [{ text: { content: meta.role || '—' } }] },
    WhatsApp: { phone_number: identity.whatsapp },
    Status: { select: { name: 'Identified' as ProgressStatus } },
    Facilitator: { rich_text: [{ text: { content: meta.facilitator } }] },
    'Meeting host': { rich_text: [{ text: { content: meta.meetingHost } }] },
  }

  if (existing) {
    await n.pages.update({ page_id: existing.id, properties: props })
    return existing.id
  }

  const created = await n.pages.create({
    parent: { data_source_id: env('NOTION_PROGRESS_DB_ID') },
    properties: props,
  })
  return created.id
}

export async function updateProgressStatus(
  clientId: string,
  stakeholder: string,
  status: ProgressStatus,
  extra?: { slot?: string; whatsapp?: string }
): Promise<void> {
  const page = await findProgressPage(clientId, stakeholder)
  if (!page) return
  await notion().pages.update({
    page_id: page.id,
    properties: {
      Status: { select: { name: status } },
      ...(extra?.slot
        ? { Slot: { rich_text: [{ text: { content: extra.slot } }] } }
        : {}),
      ...(extra?.whatsapp
        ? { WhatsApp: { phone_number: extra.whatsapp } }
        : {}),
    },
  })
}

export async function listProgress(clientId: string): Promise<ProgressRow[]> {
  const res = await queryDataSource(env('NOTION_PROGRESS_DB_ID'), {
    filter: { property: 'Client', select: { equals: clientId } },
    sorts: [{ property: 'Name', direction: 'ascending' }],
    page_size: 100,
  })

  return res.results
    .map(r => asPage(r))
    .filter((p): p is PageObjectResponse => Boolean(p))
    .map((page): ProgressRow => ({
      id: page.id,
      name: textProp(page, 'Name'),
      client: textProp(page, 'Client'),
      stakeholder: textProp(page, 'Stakeholder'),
      areas: textProp(page, 'Areas'),
      role: textProp(page, 'Role'),
      whatsapp: textProp(page, 'WhatsApp'),
      status: (textProp(page, 'Status') || 'Not started') as ProgressStatus,
      facilitator: textProp(page, 'Facilitator'),
      meetingHost: textProp(page, 'Meeting host'),
      slot: textProp(page, 'Slot'),
    }))
}

// ─── Assessments ─────────────────────────────────────────────────────────────

const ANSWER_PROP_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const

function answerPropName(id: number): string {
  return `Q${id}`
}

function richTextProp(content: string) {
  return { rich_text: [{ text: { content: content.slice(0, 2000) || '—' } }] }
}

function answerProperties(answers: Record<number, string>): Record<string, ReturnType<typeof richTextProp>> {
  const props: Record<string, ReturnType<typeof richTextProp>> = {}
  for (const id of ANSWER_PROP_IDS) {
    props[answerPropName(id)] = richTextProp(answers[id]?.trim() || '—')
  }
  return props
}

function isMeaningfulAnswer(value: string): boolean {
  const v = value.trim()
  return Boolean(v) && v !== '—'
}

function mapAssessment(page: PageObjectResponse): AssessmentRow {
  const answers: Record<number, string> = {}
  for (const id of ANSWER_PROP_IDS) {
    const value = textProp(page, answerPropName(id)).trim()
    if (isMeaningfulAnswer(value)) answers[id] = value
  }
  return {
    id: page.id,
    url: page.url,
    name: textProp(page, 'Name'),
    client: textProp(page, 'Client'),
    stakeholder: textProp(page, 'Stakeholder'),
    whatsapp: textProp(page, 'WhatsApp'),
    status: textProp(page, 'Status') || 'Submitted',
    completedAt: textProp(page, 'CompletedAt'),
    answers,
  }
}

export async function createAssessment(payload: AssessmentPayload): Promise<string> {
  const n = notion()
  const now = new Date().toISOString()
  const title = `${payload.clientId} · ${payload.stakeholder} · ${now.slice(0, 10)}`

  const answerBlocks = payload.questions.flatMap(q => {
    const answer = (payload.answers[q.id]?.trim() || '—').slice(0, 2000)
    const qLine = `Q${q.id}. ${q.question}`.slice(0, 2000)
    return [
      {
        object: 'block' as const,
        type: 'heading_3' as const,
        heading_3: {
          rich_text: [{ type: 'text' as const, text: { content: qLine } }],
        },
      },
      {
        object: 'block' as const,
        type: 'paragraph' as const,
        paragraph: {
          rich_text: [{ type: 'text' as const, text: { content: answer } }],
        },
      },
    ]
  })

  const page = await n.pages.create({
    parent: { data_source_id: env('NOTION_ASSESSMENTS_DB_ID') },
    properties: {
      Name: { title: [{ text: { content: title } }] },
      Client: { select: { name: payload.clientId } },
      Stakeholder: { rich_text: [{ text: { content: payload.stakeholder } }] },
      WhatsApp: { phone_number: payload.whatsapp },
      Status: { select: { name: 'Submitted' } },
      CompletedAt: { date: { start: now } },
      ...answerProperties(payload.answers),
    },
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Respostas do Assessment' } }],
        },
      },
      ...answerBlocks,
    ],
  })

  await updateProgressStatus(payload.clientId, payload.stakeholder, 'Assessment done', {
    whatsapp: payload.whatsapp,
  })

  return page.id
}

export async function listAssessments(clientId: string): Promise<AssessmentRow[]> {
  const res = await queryDataSource(env('NOTION_ASSESSMENTS_DB_ID'), {
    filter: { property: 'Client', select: { equals: clientId } },
    sorts: [{ property: 'CompletedAt', direction: 'descending' }],
    page_size: 100,
  })

  return res.results
    .map(r => asPage(r))
    .filter((p): p is PageObjectResponse => Boolean(p))
    .map(mapAssessment)
}

/** Backfill: copia respostas do body da página para as propriedades Q1–Q11. */
export async function syncAssessmentAnswersFromBody(pageId: string): Promise<AssessmentRow | null> {
  const n = notion()
  const pageRes = await n.pages.retrieve({ page_id: pageId })
  const page = asPage(pageRes)
  if (!page) return null

  const existing = mapAssessment(page)
  const hasAll = ANSWER_PROP_IDS.every(id => isMeaningfulAnswer(existing.answers[id] || ''))
  if (hasAll) return existing

  const answers: Record<number, string> = { ...existing.answers }
  let cursor: string | undefined
  let currentQ: number | null = null

  do {
    const blocks = await n.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })

    for (const block of blocks.results) {
      if (!('type' in block)) continue
      if (block.type === 'heading_3' && 'heading_3' in block) {
        const text = block.heading_3.rich_text.map(t => t.plain_text).join('')
        const match = text.match(/^Q(\d+)\./)
        currentQ = match ? Number(match[1]) : null
      } else if (block.type === 'paragraph' && 'paragraph' in block && currentQ) {
        const text = block.paragraph.rich_text.map(t => t.plain_text).join('').trim()
        if (isMeaningfulAnswer(text) && !isMeaningfulAnswer(answers[currentQ] || '')) {
          answers[currentQ] = text
        }
        currentQ = null
      }
    }

    cursor = blocks.has_more ? blocks.next_cursor ?? undefined : undefined
  } while (cursor)

  await n.pages.update({
    page_id: pageId,
    properties: answerProperties(answers),
  })

  const updated = asPage(await n.pages.retrieve({ page_id: pageId }))
  return updated ? mapAssessment(updated) : null
}

export async function backfillAssessmentAnswers(clientId: string): Promise<number> {
  const rows = await listAssessments(clientId)
  let synced = 0
  for (const row of rows) {
    const missing = ANSWER_PROP_IDS.some(id => !isMeaningfulAnswer(row.answers[id] || ''))
    if (!missing) continue
    await syncAssessmentAnswersFromBody(row.id)
    synced++
    await new Promise(r => setTimeout(r, 250))
  }
  return synced
}

// ─── Sessions / slots ────────────────────────────────────────────────────────

function mapSession(page: PageObjectResponse): SessionSlot {
  return {
    id: page.id,
    start: textProp(page, 'SlotStart'),
    end: textProp(page, 'SlotEnd'),
    status: (textProp(page, 'Status') || 'Available') as SessionSlot['status'],
    stakeholder: textProp(page, 'Stakeholder') || undefined,
    host: textProp(page, 'Host'),
    location: textProp(page, 'Location'),
  }
}

export async function listAvailableSlots(clientId: string): Promise<SessionSlot[]> {
  const res = await queryDataSource(env('NOTION_SESSIONS_DB_ID'), {
    filter: {
      and: [
        { property: 'Client', select: { equals: clientId } },
        { property: 'Status', select: { equals: 'Available' } },
      ],
    },
    sorts: [{ property: 'SlotStart', direction: 'ascending' }],
    page_size: 100,
  })

  return res.results
    .map(r => asPage(r))
    .filter((p): p is PageObjectResponse => Boolean(p))
    .map(mapSession)
    .filter(s => s.start && new Date(s.start) > new Date())
}

export async function countSessions(clientId: string): Promise<number> {
  let count = 0
  let cursor: string | undefined

  do {
    const res = await queryDataSource(env('NOTION_SESSIONS_DB_ID'), {
      filter: { property: 'Client', select: { equals: clientId } },
      page_size: 100,
      start_cursor: cursor,
    })
    count += res.results.length
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined
  } while (cursor)

  return count
}

export async function seedSessionsIfEmpty(config: SlotWindowConfig): Promise<number> {
  const existing = await countSessions(config.clientId)
  if (existing > 0) return 0

  const n = notion()
  const slots = generateSlotCandidates(config)
  let created = 0

  for (const slot of slots) {
    await n.pages.create({
      parent: { data_source_id: env('NOTION_SESSIONS_DB_ID') },
      properties: {
        Name: { title: [{ text: { content: slot.name } }] },
        Client: { select: { name: config.clientId } },
        SlotStart: { date: { start: slot.start } },
        SlotEnd: { date: { start: slot.end } },
        Host: { rich_text: [{ text: { content: config.host } }] },
        Location: { select: { name: config.location } },
        Status: { select: { name: 'Available' } },
      },
    })
    created++
    if (created % 5 === 0) await new Promise(r => setTimeout(r, 350))
  }

  return created
}

export async function bookSession(
  sessionId: string,
  identity: OnboardIdentity,
  host: string
): Promise<SessionSlot> {
  const n = notion()
  const pageRes = await n.pages.retrieve({ page_id: sessionId })
  const page = asPage(pageRes)
  if (!page) throw new Error('Slot não encontrado')

  const status = textProp(page, 'Status')
  if (status !== 'Available') throw new Error('Este horário acabou de ser reservado. Escolha outro.')

  const client = textProp(page, 'Client')
  if (client !== identity.clientId) throw new Error('Slot inválido para este cliente')

  await n.pages.update({
    page_id: sessionId,
    properties: {
      Status: { select: { name: 'Booked' } },
      Stakeholder: { rich_text: [{ text: { content: identity.stakeholder } }] },
      WhatsApp: { phone_number: identity.whatsapp },
      Host: { rich_text: [{ text: { content: host } }] },
    },
  })

  const start = textProp(page, 'SlotStart')
  const label = formatSlotLabel(start)

  await updateProgressStatus(identity.clientId, identity.stakeholder, 'Session booked', {
    slot: label,
    whatsapp: identity.whatsapp,
  })

  const updated = asPage(await n.pages.retrieve({ page_id: sessionId }))
  if (!updated) throw new Error('Falha ao confirmar reserva')
  return mapSession(updated)
}
