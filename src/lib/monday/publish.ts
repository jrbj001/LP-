import 'server-only'

import type { BacklogCard } from '@/lib/backlog/types'
import {
  BE180_MONDAY_PILOT_BOARD_ID,
  BE180_MONDAY_ACCOUNT_SLUG,
  formatMondayItemName,
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

  const boardId = env.BE180_MONDAY_BOARD_ID?.trim() || BE180_MONDAY_PILOT_BOARD_ID
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

/** Resposta assíncrona de chat (até 7 dias), usando o conversationId do payload. */
export async function sendCustomAgentMessage(
  config: Be180MondayConfig,
  conversationId: string,
  message: string,
  fetchImpl: typeof fetch = fetch
): Promise<void> {
  await mondayQuery(
    config.token,
    `mutation ($conversationId: String!, $message: String!) {
      send_custom_agent_message(input: { conversation_id: $conversationId, message: $message }) { delivered }
    }`,
    { conversationId, message },
    fetchImpl
  )
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
        assets { id name public_url url file_extension }
        updates(limit: 8) {
          text_body
          body
          assets { id name public_url url file_extension }
        }
      }
    }`,
    { ids: [itemId] },
    fetchImpl
  )
}

export async function createMondayItem(input: {
  config: Be180MondayConfig
  boardId: string
  groupId: string
  name: string
  fetchImpl?: typeof fetch
}): Promise<string> {
  const data = await mondayQuery<{ create_item: { id: string } }>(
    input.config.token,
    `mutation ($boardId: ID!, $groupId: String!, $name: String!) {
      create_item(board_id: $boardId, group_id: $groupId, item_name: $name) { id }
    }`,
    { boardId: input.boardId, groupId: input.groupId, name: formatMondayItemName(input.name) },
    input.fetchImpl ?? fetch
  )
  return data.create_item.id
}

export async function createMondaySubitem(input: {
  config: Be180MondayConfig
  parentItemId: string
  name: string
  fetchImpl?: typeof fetch
}): Promise<{ id: string; boardId: string }> {
  const data = await mondayQuery<{ create_subitem: { id: string; board: { id: string } } }>(
    input.config.token,
    `mutation ($parentId: ID!, $name: String!) {
      create_subitem(parent_item_id: $parentId, item_name: $name) { id board { id } }
    }`,
    { parentId: input.parentItemId, name: formatMondayItemName(input.name) },
    input.fetchImpl ?? fetch
  )
  return { id: data.create_subitem.id, boardId: data.create_subitem.board.id }
}

/** Itens já existentes no grupo, por nome, com os subitens de cada um. */
export async function listMondayGroupItems(input: {
  config: Be180MondayConfig
  boardId: string
  groupId: string
  fetchImpl?: typeof fetch
}): Promise<{ id: string; name: string; subitems: { id: string; name: string }[] }[]> {
  const data = await mondayQuery<{
    boards: { groups: { items_page: { items: { id: string; name: string; subitems?: { id: string; name: string }[] }[] } }[] }[]
  }>(
    input.config.token,
    `query ($boardId: ID!, $groupId: String!) {
      boards(ids: [$boardId]) {
        groups(ids: [$groupId]) {
          items_page(limit: 200) { items { id name subitems { id name } } }
        }
      }
    }`,
    { boardId: input.boardId, groupId: input.groupId },
    input.fetchImpl ?? fetch
  )
  const items = data.boards[0]?.groups[0]?.items_page.items ?? []
  return items.map(item => ({ id: item.id, name: item.name, subitems: item.subitems ?? [] }))
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
