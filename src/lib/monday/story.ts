import type { BacklogCard } from '@/lib/backlog/types'

export const BE180_MONDAY_CLIENT_ID = 'be180-ooh'

/** Quadro padrão do webhook genérico de itens criados. O agente atende qualquer quadro. */
export const BE180_MONDAY_PILOT_BOARD_ID = '18413193469'

/** Conta em be180-force.monday.com. */
export const BE180_MONDAY_ACCOUNT_SLUG = 'be180-force'

export const COLMEIA_AGENT_CHAT =
  'Sou o Cadence. Em qualquer quadro em que eu tenha acesso, atribua uma tarefa a mim, ou me mencione nela, que eu trago o item, escrevo a user story e devolvo no mesmo item.'

const ITEM_NAME_LIMIT = 255

export function isStoryReadyForMonday(card: BacklogCard): boolean {
  return (
    card.level !== 'raw' &&
    Boolean(card.persona?.trim()) &&
    Boolean(card.want?.trim()) &&
    Boolean(card.soThat?.trim()) &&
    (card.acceptance ?? []).some(item => item.trim())
  )
}

export function formatMondayItemName(title: string): string {
  const compact = title.replace(/\s+/g, ' ').trim() || 'User story'
  if (compact.length <= ITEM_NAME_LIMIT) return compact
  return `${compact.slice(0, ITEM_NAME_LIMIT - 1).trimEnd()}…`
}

export function formatMondayStoryHtml(card: BacklogCard, boardLabel: string): string {
  const acceptance = (card.acceptance ?? []).map(item => item.trim()).filter(Boolean)
  const parts = [
    '<p><strong>User story</strong></p>',
    `<p><strong>Como</strong> ${escapeHtml(card.persona ?? '')}<br><strong>quero</strong> ${escapeHtml(card.want ?? '')}<br><strong>para</strong> ${escapeHtml(card.soThat ?? '')}</p>`,
    '<p><strong>Critérios de aceite</strong></p>',
    `<ul>${acceptance.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`,
  ]
  if (card.priority) parts.push(`<p><strong>Prioridade:</strong> ${escapeHtml(card.priority)}</p>`)
  parts.push(
    `<p>Cadence · ${escapeHtml(boardLabel)} · ${escapeHtml(card.id)}</p>`
  )
  return parts.join('')
}

export function mondayItemUrl(accountSlug: string, boardId: string, itemId: string): string {
  return `https://${accountSlug}.monday.com/boards/${encodeURIComponent(boardId)}/pulses/${encodeURIComponent(itemId)}`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
