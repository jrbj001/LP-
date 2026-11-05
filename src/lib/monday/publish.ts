import 'server-only'

import type { BacklogCard } from '@/lib/backlog/types'
import {
  BE180_COLMEIA_BOARD_ID,
  BE180_MONDAY_ACCOUNT_SLUG,
  formatMondayStoryHtml,
  isStoryReadyForMonday,
  mondayItemUrl,
} from './story'

const MONDAY_API = 'https://api.monday.com/v2'
const MONDAY_API_VERSION = 'dev'

export interface Be180MondayConfig {
  token: string
  boardId: string
  accountSlug?: string
}

export interface MondayPublishResult {
  itemId: string
  boardId: string
  url?: string
}

export function readBe180MondayConfig(
  env: NodeJS.ProcessEnv = process.env
): { ok: true; config: Be180MondayConfig } | { ok: false; missing: string[] } {
  const token = (env.MONDAY_AGENT_API_TOKEN || env.MONDAY_API_TOKEN)?.trim()
  if (!token) return { ok: false, missing: ['MONDAY_AGENT_API_TOKEN'] }

  const boardId = env.BE180_MONDAY_BOARD_ID?.trim() || BE180_COLMEIA_BOARD_ID
  const slug = env.BE180_MONDAY_ACCOUNT_SLUG?.trim().toLowerCase()
  return {
    ok: true,
    config: {
      token,
      boardId,
      accountSlug: slug && /^[a-z0-9-]+$/.test(slug) ? slug : BE180_MONDAY_ACCOUNT_SLUG,
    },
  }
}

export async function publishStoryToMonday(input: {
  card: BacklogCard
  boardLabel: string
  config: Be180MondayConfig
  parentId?: string
  fetchImpl?: typeof fetch
}): Promise<MondayPublishResult> {
  const itemId = input.card.monday?.itemId
  const boardId = input.card.monday?.boardId
  if (!itemId || !boardId) {
    throw new Error('Esta story não veio do Monday.')
  }
  if (!isStoryReadyForMonday(input.card)) {
    throw new Error('Enriqueça a user story antes de devolver ao Monday.')
  }

  await postMondayUpdate({
    config: input.config,
    itemId,
    body: formatMondayStoryHtml(input.card, input.boardLabel),
    parentId: input.parentId,
    fetchImpl: input.fetchImpl,
  })

  return {
    itemId,
    boardId,
    url: input.config.accountSlug
      ? mondayItemUrl(input.config.accountSlug, boardId, itemId)
      : input.card.monday?.url,
  }
}

export async function postMondayUpdate(input: {
  config: Be180MondayConfig
  itemId: string
  body: string
  parentId?: string
  fetchImpl?: typeof fetch
}): Promise<void> {
  const fetchImpl = input.fetchImpl ?? fetch
  if (input.parentId) {
    await mondayQuery(
      input.config.token,
      `mutation ($itemId: ID!, $body: String!, $parentId: ID!) {
        create_update(item_id: $itemId, body: $body, parent_id: $parentId) { id }
      }`,
      { itemId: input.itemId, body: input.body, parentId: input.parentId },
      fetchImpl
    )
    return
  }
  await mondayQuery(
    input.config.token,
    `mutation ($itemId: ID!, $body: String!) {
      create_update(item_id: $itemId, body: $body) { id }
    }`,
    { itemId: input.itemId, body: input.body },
    fetchImpl
  )
}

export async function writeStoryBackToMonday(
  card: BacklogCard,
  boardLabel: string,
  options?: { parentId?: string; fetchImpl?: typeof fetch }
): Promise<BacklogCard> {
  const configured = readBe180MondayConfig()
  if (!configured.ok) {
    throw new Error(`Monday da Be180 sem configuração: ${configured.missing.join(', ')}.`)
  }
  const published = await publishStoryToMonday({
    card,
    boardLabel,
    config: configured.config,
    parentId: options?.parentId,
    fetchImpl: options?.fetchImpl,
  })
  return {
    ...card,
    monday: {
      itemId: published.itemId,
      boardId: published.boardId,
      url: published.url,
      syncedAt: new Date().toISOString(),
    },
  }
}

export async function fetchMondayItem(
  config: Be180MondayConfig,
  itemId: string,
  fetchImpl: typeof fetch = fetch
): Promise<unknown> {
  return mondayQuery(
    config.token,
    `query ($ids: [ID!]!) {
      items(ids: $ids) {
        id
        name
        column_values { id text type }
        board { id }
        updates(limit: 5) { text_body body }
      }
    }`,
    { ids: [itemId] },
    fetchImpl
  )
}

async function mondayQuery<T>(
  token: string,
  query: string,
  variables: Record<string, unknown>,
  fetchImpl: typeof fetch
): Promise<T> {
  const response = await fetchImpl(MONDAY_API, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      'API-Version': MONDAY_API_VERSION,
    },
    body: JSON.stringify({ query, variables }),
  })
  const payload = (await response.json().catch(() => null)) as {
    data?: T
    errors?: { message?: string }[]
    error_message?: string
  } | null
  if (!payload) throw new Error('O Monday não devolveu JSON.')
  const message = payload.errors?.find(error => error.message)?.message || payload.error_message
  if (!response.ok || message) {
    throw new Error(message || `O Monday respondeu ${response.status}.`)
  }
  if (!payload.data) throw new Error('O Monday não devolveu dados.')
  return payload.data
}
