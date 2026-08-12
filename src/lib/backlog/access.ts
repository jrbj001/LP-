const BACKLOG_ENABLED_CLIENTS = new Set(['be180-ooh', 'likeme'])

export function isBacklogEnabled(clientId: string): boolean {
  return BACKLOG_ENABLED_CLIENTS.has(clientId)
}
