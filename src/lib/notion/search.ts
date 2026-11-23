import 'server-only'

import { Client } from '@notionhq/client'

const MAX_PAGES = 4
const PAGE_TEXT_CHARS = 3500

let client: Client | null = null

function notionToken(): string | undefined {
  return process.env.NOTION_TOKEN_CADENCE?.trim() || process.env.NOTION_TOKEN?.trim() || undefined
}

export function hasNotionAccess(): boolean {
  return Boolean(notionToken())
}

function notion(): Client {
  const token = notionToken()
  if (!token) throw new Error('NOTION_TOKEN_CADENCE não configurado.')
  if (!client) client = new Client({ auth: token })
  return client
}

export interface NotionPageHit {
  id: string
  title: string
  url: string
  lastEditedAt: string
  text: string
}

type RichText = { plain_text: string }[]

function richText(value: unknown): string {
  return Array.isArray(value) ? (value as RichText).map(part => part.plain_text).join('') : ''
}

function pageTitle(page: { properties?: Record<string, unknown> }): string {
  for (const property of Object.values(page.properties ?? {})) {
    const record = property as { type?: string; title?: unknown }
    if (record.type === 'title') return richText(record.title).trim() || 'Sem título'
  }
  return 'Sem título'
}

const PREFIX: Record<string, string> = {
  heading_1: '# ',
  heading_2: '## ',
  heading_3: '### ',
  bulleted_list_item: '- ',
  numbered_list_item: '1. ',
  to_do: '- [ ] ',
  quote: '> ',
  callout: '> ',
  toggle: '',
  paragraph: '',
  code: '',
}

async function pageText(pageId: string): Promise<string> {
  const lines: string[] = []
  let cursor: string | undefined
  let length = 0
  do {
    const res = await notion().blocks.children.list({ block_id: pageId, start_cursor: cursor, page_size: 100 })
    for (const block of res.results) {
      if (!('type' in block)) continue
      const type = block.type as string
      if (!(type in PREFIX)) continue
      const content = (block as unknown as Record<string, { rich_text?: unknown }>)[type]
      const text = richText(content?.rich_text).trim()
      if (!text) continue
      const line = type === 'code' ? `\`\`\`\n${text}\n\`\`\`` : `${PREFIX[type]}${text}`
      lines.push(line)
      length += line.length
      if (length >= PAGE_TEXT_CHARS) break
    }
    cursor = res.has_more && length < PAGE_TEXT_CHARS ? res.next_cursor ?? undefined : undefined
  } while (cursor)
  const text = lines.join('\n')
  return text.length > PAGE_TEXT_CHARS ? `${text.slice(0, PAGE_TEXT_CHARS)}…` : text
}

/** Busca por título nas páginas compartilhadas com a integration e devolve o texto das mais relevantes. */
export async function searchNotionPages(query: string, limit = MAX_PAGES): Promise<NotionPageHit[]> {
  const res = await notion().search({
    query,
    filter: { property: 'object', value: 'page' },
    sort: { property: 'relevance' },
    page_size: Math.min(limit, MAX_PAGES),
  })
  const pages = res.results.filter(
    (item): item is Extract<(typeof res.results)[number], { object: 'page'; url: string }> =>
      item.object === 'page' && 'url' in item
  )
  return Promise.all(
    pages.slice(0, limit).map(async page => ({
      id: page.id,
      title: pageTitle(page as { properties?: Record<string, unknown> }),
      url: page.url,
      lastEditedAt: page.last_edited_time,
      text: await pageText(page.id).catch(() => ''),
    }))
  )
}
