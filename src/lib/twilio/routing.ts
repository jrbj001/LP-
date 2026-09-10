import type { BacklogBoardId } from '@/lib/backlog/types'

export interface WhatsappRoute {
  from: string
  clientSlug: string
  boardId: BacklogBoardId
}

const DEFAULT_ROUTES: WhatsappRoute[] = [
  { from: 'whatsapp:+15553533015', clientSlug: 'pixelpulselab', boardId: 'cadence' },
  { from: 'whatsapp:+15553668393', clientSlug: 'likeme', boardId: 'likeme-app' },
  { from: 'whatsapp:+17752275705', clientSlug: 'likeme', boardId: 'likeme-app' },
]

function normalizeSender(value: string): string {
  const trimmed = value.trim().toLowerCase()
  if (trimmed.startsWith('whatsapp:')) return trimmed
  const digits = trimmed.replace(/[^\d+]/g, '')
  return digits.startsWith('+') ? `whatsapp:${digits}` : `whatsapp:+${digits}`
}

function configuredRoutes(): WhatsappRoute[] {
  const raw = process.env.TWILIO_WHATSAPP_ROUTING
  if (!raw) return DEFAULT_ROUTES
  try {
    const parsed = JSON.parse(raw) as Array<Partial<WhatsappRoute>>
    return parsed
      .filter(
        (item): item is WhatsappRoute =>
          typeof item.from === 'string' &&
          typeof item.clientSlug === 'string' &&
          typeof item.boardId === 'string'
      )
      .map(item => ({
        from: normalizeSender(item.from),
        clientSlug: item.clientSlug,
        boardId: item.boardId,
      }))
  } catch {
    throw new Error('TWILIO_WHATSAPP_ROUTING deve ser um JSON válido')
  }
}

export function routeWhatsappSender(to: string): WhatsappRoute | null {
  const sender = normalizeSender(to)
  return configuredRoutes().find(route => route.from === sender) ?? null
}

export function defaultWhatsappFrom(): string {
  return process.env.TWILIO_WHATSAPP_FROM?.trim() || 'whatsapp:+15553533015'
}
