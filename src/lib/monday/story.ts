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
  const parts = [
    '<p><strong>User story</strong></p>',
    `<p><strong>Como</strong> ${escapeHtml(card.persona ?? '')}<br><strong>quero</strong> ${escapeHtml(card.want ?? '')}<br><strong>para</strong> ${escapeHtml(card.soThat ?? '')}</p>`,
  ]
  if (card.context?.trim()) parts.push('<p><strong>Contexto</strong></p>', paragraphs(card.context))
  parts.push('<p><strong>Critérios de aceite</strong></p>', bulletList(card.acceptance))
  if (hasItems(card.testPlan)) parts.push('<p><strong>Como testar</strong></p>', orderedList(card.testPlan))
  if (card.implementationNotes?.trim()) {
    parts.push('<p><strong>Notas de implementação</strong></p>', paragraphs(card.implementationNotes))
  }
  if (hasItems(card.filesLikely)) parts.push('<p><strong>Onde mexer</strong></p>', bulletList(card.filesLikely))
  if (hasItems(card.risks)) parts.push('<p><strong>Riscos</strong></p>', bulletList(card.risks))
  if (card.priority) parts.push(`<p><strong>Prioridade:</strong> ${escapeHtml(card.priority)}</p>`)
  parts.push(
    `<p>Cadence · ${escapeHtml(boardLabel)} · ${escapeHtml(card.id)}</p>`
  )
  return parts.join('')
}

export function mondayItemUrl(accountSlug: string, boardId: string, itemId: string): string {
  return `https://${accountSlug}.monday.com/boards/${encodeURIComponent(boardId)}/pulses/${encodeURIComponent(itemId)}`
}

function cleanItems(items: string[] | undefined): string[] {
  return (items ?? []).map(item => item.trim()).filter(Boolean)
}

function hasItems(items: string[] | undefined): boolean {
  return cleanItems(items).length > 0
}

function bulletList(items: string[] | undefined): string {
  return `<ul>${cleanItems(items).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
}

function orderedList(items: string[] | undefined): string {
  return `<ol>${cleanItems(items).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`
}

function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
