import type { ClientDocument, ClientMeeting } from '@/lib/client/types'
import type { ClientDocumentRecord } from '@/lib/documents/types'

export interface WorkspaceMeetingHit {
  id: string
  title: string
  date: string
  summary: string
  excerpt: string
}

export interface WorkspaceDocumentHit {
  id: string
  title: string
  kind: string
  description: string
  excerpt: string
}

export interface WorkspaceContextBundle {
  meetings: WorkspaceMeetingHit[]
  documents: WorkspaceDocumentHit[]
  catalog: { meetings: string[]; documents: string[] }
}

const STOP = new Set([
  'como', 'quero', 'para', 'que', 'com', 'sem', 'uma', 'um', 'de', 'da', 'do', 'das', 'dos',
  'no', 'na', 'em', 'ao', 'e', 'o', 'a', 'os', 'as', 'por', 'via', 'the', 'and', 'for',
])

export function workspaceKeywords(text: string): string[] {
  return [
    ...new Set(
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length >= 4 && !STOP.has(token))
    ),
  ].slice(0, 10)
}

export function scoreWorkspaceText(query: string, haystack: string): number {
  const keywords = workspaceKeywords(query)
  if (keywords.length === 0) return 0
  const hay = haystack
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  return keywords.reduce((score, word) => score + (hay.includes(word) ? 1 : 0), 0)
}

function meetingHaystack(meeting: ClientMeeting): string {
  return [meeting.title, meeting.summary, meeting.aiContext, meeting.attendees.join(' ')].filter(Boolean).join('\n')
}

function portalHaystack(document: ClientDocument): string {
  return [document.title, document.category, document.description].filter(Boolean).join('\n')
}

function uploadedHaystack(document: ClientDocumentRecord): string {
  return [
    document.title,
    document.fileName,
    document.extraction?.text,
    document.artifacts?.workPlan?.summary,
    document.artifacts?.architecture?.overview,
  ]
    .filter(Boolean)
    .join('\n')
}

function clip(text: string, max: number): string {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1).trimEnd()}…`
}

function meetingBoost(query: string): number {
  return /reuni[aã]o|ata|briefing|sincroniz|kick.?off|alinhamento/i.test(query) ? 4 : 0
}

function documentBoost(query: string): number {
  return /documento|manual|arquitetura|relat[oó]rio|portal|ata|briefing/i.test(query) ? 4 : 0
}

export function selectWorkspaceMeetings(
  meetings: ClientMeeting[],
  query: string,
  limit = 6
): WorkspaceMeetingHit[] {
  const boost = meetingBoost(query)
  return meetings
    .map(meeting => ({
      meeting,
      score: scoreWorkspaceText(query, meetingHaystack(meeting)) + boost + 1,
    }))
    .sort((left, right) => right.score - left.score || right.meeting.date.localeCompare(left.meeting.date))
    .slice(0, limit)
    .map(({ meeting }) => ({
      id: meeting.id,
      title: meeting.title,
      date: meeting.date,
      summary: meeting.summary?.trim() || 'Sem resumo cadastrado.',
      excerpt: clip(meeting.aiContext || meeting.summary || '', 1600),
    }))
}

export function selectPortalDocuments(
  documents: ClientDocument[],
  query: string,
  limit = 8
): WorkspaceDocumentHit[] {
  const boost = documentBoost(query)
  return documents
    .map(document => ({
      document,
      score: scoreWorkspaceText(query, portalHaystack(document)) + boost + 1,
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ document }) => ({
      id: document.id,
      title: document.title,
      kind: document.category,
      description: document.description,
      excerpt: document.description,
    }))
}

export function selectUploadedDocuments(
  documents: ClientDocumentRecord[],
  query: string,
  limit = 4
): WorkspaceDocumentHit[] {
  const boost = documentBoost(query)
  return documents
    .map(document => ({
      document,
      score: scoreWorkspaceText(query, uploadedHaystack(document)) + boost,
    }))
    .filter(item => item.score > 0 || documents.length <= limit)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ document }) => ({
      id: document.id,
      title: document.title,
      kind: document.kind,
      description: document.fileName,
      excerpt: clip(
        document.extraction?.text ||
          document.artifacts?.workPlan?.summary ||
          document.artifacts?.architecture?.overview ||
          '',
        900
      ),
    }))
}

export function formatWorkspaceContextForPrompt(bundle: WorkspaceContextBundle): string {
  if (bundle.catalog.meetings.length === 0 && bundle.catalog.documents.length === 0) {
    return 'Workspace Cadence: nenhum documento ou reunião carregado para este cliente.'
  }

  const meetings = bundle.meetings
    .map(
      item =>
        `- ${item.title} (${item.date.slice(0, 10)}): ${item.summary}${
          item.excerpt && item.excerpt !== item.summary ? `\n  Trecho: ${item.excerpt}` : ''
        }`
    )
    .join('\n')
  const documents = bundle.documents
    .map(
      item =>
        `- ${item.title} [${item.kind}]: ${item.description}${
          item.excerpt && item.excerpt !== item.description ? `\n  Trecho: ${item.excerpt}` : ''
        }`
    )
    .join('\n')

  return [
    'Workspace Cadence (reuniões e documentos reais — use o conteúdo, cite o título em linguagem natural):',
    `Catálogo de reuniões: ${bundle.catalog.meetings.join('; ') || 'nenhuma'}`,
    `Catálogo de documentos: ${bundle.catalog.documents.join('; ') || 'nenhum'}`,
    meetings ? `Reuniões relevantes:\n${meetings}` : 'Nenhuma reunião relevante para esta pergunta.',
    documents ? `Documentos relevantes:\n${documents}` : 'Nenhum documento relevante para esta pergunta.',
  ].join('\n')
}
