import { createHash } from 'crypto'
import type { ClientMeeting, ClientWorkspace } from '@/lib/client/types'
import { getMeetingSource } from '@/lib/meetings/source'
import { getBacklogBoards } from './boards'
import { asStringArray, callOpenAiJson } from './llm'
import type { BacklogBoardId, BacklogCard } from './types'

export type MeetingExportMode = 'requirement' | 'story'
export type BacklogPriority = 'Alta' | 'Média' | 'Baixa'

export interface MeetingBacklogDraft {
  id: string
  mode: MeetingExportMode
  boardId: BacklogBoardId
  title: string
  priority: BacklogPriority
  context: string
  persona?: string
  want?: string
  soThat?: string
  acceptance?: string[]
  alreadyExported: boolean
}

export type MeetingApplyItem = Omit<MeetingBacklogDraft, 'alreadyExported' | 'context'>

const PRIORITIES = new Set<BacklogPriority>(['Alta', 'Média', 'Baixa'])

function cleanString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : ''
}

export function normalizeMeetingItemTitle(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120)
}

export function meetingSourceRef(meetingId: string, title: string): string {
  return `meeting:${meetingId}:${normalizeMeetingItemTitle(title)}`
}

function draftId(meetingId: string, title: string): string {
  return `meeting-draft-${createHash('sha256')
    .update(`${meetingId}:${normalizeMeetingItemTitle(title)}`)
    .digest('hex')
    .slice(0, 16)}`
}

function parseGeneratedDrafts(
  value: unknown,
  clientId: string,
  meetingId: string,
  mode: MeetingExportMode
): Omit<MeetingBacklogDraft, 'alreadyExported'>[] {
  if (!value || typeof value !== 'object') throw new Error('A IA retornou um formato inválido.')
  const rawDrafts = (value as { drafts?: unknown }).drafts
  if (!Array.isArray(rawDrafts) || rawDrafts.length < 1 || rawDrafts.length > 8) {
    throw new Error('A IA deve retornar entre 1 e 8 itens.')
  }

  const boardIds = new Set(getBacklogBoards(clientId).map(board => board.id))
  const seen = new Set<string>()
  return rawDrafts.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`Item ${index + 1} inválido.`)
    const raw = item as Record<string, unknown>
    const title = cleanString(raw.title, 180)
    const context = cleanString(raw.context, 500)
    const boardId = cleanString(raw.boardId, 80) as BacklogBoardId
    const priority = cleanString(raw.priority, 10) as BacklogPriority
    const normalized = normalizeMeetingItemTitle(title)

    if (title.length < 4 || !normalized || seen.has(normalized)) {
      throw new Error(`Título inválido ou duplicado no item ${index + 1}.`)
    }
    if (!boardIds.has(boardId)) throw new Error(`Board inválido no item ${index + 1}.`)
    if (!PRIORITIES.has(priority)) throw new Error(`Prioridade inválida no item ${index + 1}.`)
    if (context.length < 4) throw new Error(`Contexto ausente no item ${index + 1}.`)
    seen.add(normalized)

    const base = {
      id: draftId(meetingId, title),
      mode,
      boardId,
      title,
      priority,
      context,
    }
    if (mode === 'requirement') return base

    const persona = cleanString(raw.persona, 120)
    const want = cleanString(raw.want, 300)
    const soThat = cleanString(raw.soThat, 300)
    const acceptance = asStringArray(raw.acceptance)
      .map(item => cleanString(item, 300))
      .filter(Boolean)
      .slice(0, 8)
    if (!persona || !want || !soThat || acceptance.length < 1) {
      throw new Error(`User story incompleta no item ${index + 1}.`)
    }
    return { ...base, persona, want, soThat, acceptance }
  })
}

export async function generateMeetingBacklogDrafts(
  client: ClientWorkspace,
  meeting: ClientMeeting,
  mode: MeetingExportMode,
  brief?: string
): Promise<Omit<MeetingBacklogDraft, 'alreadyExported'>[]> {
  const source = getMeetingSource(meeting)
  if (!source) throw new Error('Esta reunião ainda não possui conteúdo para análise.')
  const boards = getBacklogBoards(client.slug)
  const boardList = boards
    .map(board => `- ${board.id}: ${board.title} — ${board.description}`)
    .join('\n')
  const storyShape =
    mode === 'story'
      ? ', "persona": "...", "want": "...", "soThat": "...", "acceptance": ["critério testável"]'
      : ''
  const currentBrief = cleanString(brief, 6000)

  const parsed = await callOpenAiJson(
    `Você é um product manager sênior. Converta reuniões em itens de backlog revisáveis, em português do Brasil.
Use somente fatos da fonte confiável. Não invente escopo, decisões, responsáveis, métricas ou integrações.
Retorne apenas JSON no formato {"drafts":[...]}, com 1 a 8 itens úteis e sem duplicatas.`,
    `Cliente: ${client.name}
Reunião: ${meeting.title}
Data: ${meeting.date}
Participantes: ${meeting.attendees.join(', ')}
Modo obrigatório: ${mode === 'story' ? 'user stories' : 'requisitos'}

Boards válidos (use somente estes IDs):
${boardList}

Fonte confiável (${source.kind}):
${source.content}

${currentBrief ? `Brief atual (apoio secundário; em caso de conflito, prevalece a fonte confiável):\n${currentBrief}\n` : ''}
Cada item deve ter exatamente o modo solicitado e este formato:
{"boardId":"ID válido","title":"título objetivo","priority":"Alta|Média|Baixa","context":"origem/contexto curto e rastreável"${storyShape}}

Para user stories, persona, want e soThat devem ser claros e acceptance deve conter de 1 a 8 critérios observáveis e testáveis.`,
    { temperature: 0.1, maxTokens: 2600 }
  )

  return parseGeneratedDrafts(parsed, client.slug, meeting.id, mode)
}

export function markAlreadyExported(
  meetingId: string,
  drafts: Omit<MeetingBacklogDraft, 'alreadyExported'>[],
  cards: BacklogCard[]
): MeetingBacklogDraft[] {
  const refs = new Set(
    cards
      .filter(card => card.source.kind === 'meeting' && card.source.ref?.startsWith(`meeting:${meetingId}:`))
      .map(card => card.source.ref)
  )
  return drafts.map(draft => ({
    ...draft,
    alreadyExported: refs.has(meetingSourceRef(meetingId, draft.title)),
  }))
}

export function parseMeetingApplyItems(
  value: unknown,
  clientId: string
): { mode: MeetingExportMode; items: MeetingApplyItem[] } {
  if (!value || typeof value !== 'object') throw new Error('Payload inválido.')
  const body = value as Record<string, unknown>
  const mode = body.mode === 'requirement' || body.mode === 'story' ? body.mode : null
  if (!mode || !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 8) {
    throw new Error('Envie entre 1 e 8 itens de um modo válido.')
  }
  const boardIds = new Set(getBacklogBoards(clientId).map(board => board.id))

  const items = body.items.map((item, index): MeetingApplyItem => {
    if (!item || typeof item !== 'object') throw new Error(`Item ${index + 1} inválido.`)
    const raw = item as Record<string, unknown>
    const id = cleanString(raw.id, 100)
    const title = cleanString(raw.title, 180)
    const boardId = cleanString(raw.boardId, 80) as BacklogBoardId
    const priority = cleanString(raw.priority, 10) as BacklogPriority
    if (!id.startsWith('meeting-draft-') || title.length < 4) {
      throw new Error(`Identificação ou título inválido no item ${index + 1}.`)
    }
    if (!boardIds.has(boardId)) throw new Error(`Board inválido no item ${index + 1}.`)
    if (!PRIORITIES.has(priority)) throw new Error(`Prioridade inválida no item ${index + 1}.`)
    const base: MeetingApplyItem = { id, mode, boardId, title, priority }
    if (mode === 'requirement') return base

    const persona = cleanString(raw.persona, 120)
    const want = cleanString(raw.want, 300)
    const soThat = cleanString(raw.soThat, 300)
    const acceptance = asStringArray(raw.acceptance)
      .map(item => cleanString(item, 300))
      .filter(Boolean)
      .slice(0, 8)
    if (!persona || !want || !soThat || acceptance.length < 1) {
      throw new Error(`User story incompleta no item ${index + 1}.`)
    }
    return { ...base, persona, want, soThat, acceptance }
  })

  return { mode, items }
}

export function buildMeetingCardContext(meeting: ClientMeeting): string {
  const trustedSummary = meeting.summary?.trim() || getMeetingSource(meeting)?.content.slice(0, 900).trim()
  const owner = meeting.owner?.trim()
  return [
    `Origem: reunião "${meeting.title}" (${meeting.date}).`,
    `Participantes: ${meeting.attendees.join(', ') || 'Não informados'}.`,
    owner ? `Owner: ${owner}.` : '',
    trustedSummary ? `Resumo IA: ${trustedSummary}` : '',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 1800)
}

export function meetingItemsToCards(meeting: ClientMeeting, items: MeetingApplyItem[]): BacklogCard[] {
  const now = new Date().toISOString()
  const context = buildMeetingCardContext(meeting)
  return items.map(item => ({
    id: `meeting-${createHash('sha256')
      .update(`${meeting.id}:${normalizeMeetingItemTitle(item.title)}`)
      .digest('hex')
      .slice(0, 20)}`,
    boardId: item.boardId,
    column: item.mode === 'story' ? 'story' : 'requirement',
    title: item.title,
    level: item.mode === 'story' ? 'story' : 'raw',
    persona: item.mode === 'story' ? item.persona : undefined,
    want: item.mode === 'story' ? item.want : undefined,
    soThat: item.mode === 'story' ? item.soThat : undefined,
    acceptance: item.mode === 'story' ? item.acceptance : undefined,
    context,
    priority: item.priority,
    source: { kind: 'meeting', ref: meetingSourceRef(meeting.id, item.title) },
    createdAt: now,
    updatedAt: now,
  }))
}
