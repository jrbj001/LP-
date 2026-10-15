import {
  GLP1_META,
  findMissionTask,
  type Mission,
  type MissionTask,
} from '@/components/client/documents/likeme-glp1-workplan-data'
import type { BacklogCard } from '@/lib/backlog/types'
import { getBacklogBoards } from '@/lib/backlog/boards'

export const GLP1_PLAN_CLIENT = 'likeme'

/** Ref determinístico: é o que impede o mesmo card nascer duas vezes. */
export function glp1TaskSourceRef(taskId: string): string {
  return `plan:${GLP1_META.id}:${taskId}`
}

export function glp1TaskCardId(taskId: string): string {
  return `glp1-${taskId}`
}

export function parseGlp1ApplyBody(value: unknown): string[] {
  if (!value || typeof value !== 'object') throw new Error('Payload inválido.')
  const raw = (value as { taskIds?: unknown }).taskIds
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > 20) {
    throw new Error('Selecione entre 1 e 20 user stories.')
  }
  const ids = [...new Set(raw.filter((item): item is string => typeof item === 'string'))]
  for (const id of ids) {
    if (!findMissionTask(id)) throw new Error(`User story desconhecida: ${id}.`)
  }
  return ids
}

function cardContext(mission: Mission, task: MissionTask): string {
  return [
    `Origem: ${GLP1_META.title} (${GLP1_META.path}).`,
    `Missão ${mission.id} · ${mission.name} · ${mission.stages} · janela ${mission.window.label}.`,
    `Resultado esperado da missão: ${mission.outcome}`,
    `Esforço estimado: ${task.effort.days} dias (${task.effort.size}). ${task.effort.note}`,
  ]
    .join('\n')
    .slice(0, 1800)
}

export function glp1TasksToCards(taskIds: string[]): BacklogCard[] {
  const now = new Date().toISOString()
  const boards = getBacklogBoards(GLP1_PLAN_CLIENT)
  return taskIds.flatMap(taskId => {
    const found = findMissionTask(taskId)
    if (!found) return []
    const { mission, task } = found
    const repository = boards.find(board => board.id === task.board)?.repository
    const card: BacklogCard = {
      id: glp1TaskCardId(task.id),
      boardId: task.board,
      column: 'story',
      title: task.title,
      level: 'story',
      persona: task.persona,
      want: task.want,
      soThat: task.soThat,
      acceptance: [...task.acceptance],
      context: cardContext(mission, task),
      phase: mission.id,
      priority: mission.id === 'M1' ? 'Alta' : mission.id === 'M2' ? 'Média' : 'Baixa',
      githubRefs: repository ? [{ repo: repository, kind: 'git' }] : undefined,
      source: { kind: 'document', ref: glp1TaskSourceRef(task.id), entityId: GLP1_META.id },
      createdAt: now,
      updatedAt: now,
    }
    return [card]
  })
}

export interface Glp1TaskState {
  taskId: string
  cardId: string
  column: BacklogCard['column']
  level: BacklogCard['level']
}

/** Quais stories do plano já viraram card, e em que coluna estão. */
export function glp1TaskStates(cards: BacklogCard[]): Glp1TaskState[] {
  const prefix = `plan:${GLP1_META.id}:`
  return cards
    .filter(card => card.source.kind === 'document' && card.source.ref?.startsWith(prefix))
    .map(card => ({
      taskId: card.source.ref!.slice(prefix.length),
      cardId: card.id,
      column: card.column,
      level: card.level,
    }))
}
