export type MondayTrigger = 'chat' | 'mention' | 'assigned'

export interface MondayAgentEvent {
  trigger: MondayTrigger
  stream: boolean
  question: string
  itemId?: string
  updateId?: string
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function asId(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'string' && value.trim()) return value.trim()
  return undefined
}

export function normalizeMondayTrigger(value: unknown): MondayTrigger | null {
  if (value === 'chat') return 'chat'
  if (value === 'mention' || value === 'mentioned') return 'mention'
  if (value === 'assigned' || value === 'assign') return 'assigned'
  return null
}

export function interpretMondayAgentEvent(body: unknown): MondayAgentEvent | null {
  const raw = asRecord(body)
  if (!raw || raw.event !== 'agent_triggered') return null
  const trigger = normalizeMondayTrigger(raw.triggerType)
  if (!trigger) return null
  const payload = asRecord(raw.payload) ?? {}
  const updateBody = typeof payload.updateBody === 'string' ? payload.updateBody.trim() : ''
  const text = typeof payload.text === 'string' ? payload.text.trim() : ''
  const question = trigger === 'mention' && updateBody ? updateBody : text
  return {
    trigger,
    stream: raw.stream !== false,
    question,
    itemId: asId(payload.itemId),
    updateId: asId(payload.updateId),
  }
}
