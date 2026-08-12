import type { RepoConfig } from '@/lib/delivery/types'
import { runCopilotTurn } from './copilot'
import { appendCopilotMessages, getBacklogCard } from './store'
import type { CopilotMessage, CopilotThread } from './types'

function messageId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Roda um turno completo: grava a pergunta do PM, chama o LLM e grava a resposta.
 * Se o LLM falhar, nada é gravado — a thread não fica com pergunta órfã.
 */
export async function runAndPersistTurn(input: {
  clientId: string
  clientName: string
  clientSector: string
  thread: CopilotThread
  message: string
  repos: RepoConfig[]
}): Promise<CopilotThread> {
  const { clientId, clientName, clientSector, thread, message, repos } = input
  const card = thread.cardId ? await getBacklogCard(clientId, thread.cardId) : null

  const turn = await runCopilotTurn({
    clientId,
    clientName,
    clientSector,
    thread,
    message,
    card,
    repos,
  })
  const now = new Date().toISOString()

  const userMessage: CopilotMessage = {
    id: messageId('msg'),
    role: 'user',
    content: message,
    createdAt: now,
  }
  const assistantMessage: CopilotMessage = {
    id: messageId('msg'),
    role: 'assistant',
    content: turn.reply,
    diagram: turn.diagram,
    storyDraft: turn.storyDraft,
    sources: turn.sources,
    followUps: turn.followUps,
    createdAt: new Date().toISOString(),
  }

  const updated = await appendCopilotMessages(clientId, thread.id, [userMessage, assistantMessage])
  return updated ?? thread
}
