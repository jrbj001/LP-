import { describe, expect, it } from 'vitest'
import { getClient } from '@/lib/client/registry'
import type { ClientDocument, ClientMeeting } from '@/lib/client/types'
import {
  formatWorkspaceContextForPrompt,
  scoreWorkspaceText,
  selectPortalDocuments,
  selectWorkspaceMeetings,
} from './workspace-context'

const meetings: ClientMeeting[] = [
  {
    id: 'inv',
    title: 'Integração de Inventário & Bug de Mídia',
    date: '2026-08-06T16:34:00-03:00',
    status: 'completed',
    attendees: ['Fabrício'],
    summary: 'Task force de inventário e bug de formato na exportação.',
    aiContext: '191 pontos vs 200 esperados. Promover inventários.',
  },
  {
    id: 'road',
    title: 'Roadmap Colmeia',
    date: '2026-08-04T10:00:00-03:00',
    status: 'completed',
    attendees: ['Marco'],
    summary: 'Priorização do planner e agentes.',
  },
]

const documents: ClientDocument[] = [
  {
    id: 'manual',
    title: 'Manual do Produto · Colmeia',
    category: 'Documentação · Produto',
    description: 'Manual web: personas, fluxos e Banco de Ativos.',
    status: 'available',
  },
  {
    id: 'promo',
    title: 'Promoção de inventários ao Banco de Ativos',
    category: 'Engenharia',
    description: '19 lotes promovidos e 4.881 pontos inseridos.',
    status: 'available',
  },
]

describe('workspace context Be180', () => {
  it('pontua pergunta de inventário na reunião e no documento certos', () => {
    expect(scoreWorkspaceText('inventário Colmeia', meetings[0].summary ?? '')).toBeGreaterThan(0)
    const pickedMeetings = selectWorkspaceMeetings(meetings, 'o que falamos do inventário?')
    expect(pickedMeetings[0].id).toBe('inv')
    const pickedDocs = selectPortalDocuments(documents, 'quantos pontos foram promovidos?')
    expect(pickedDocs[0].id).toBe('promo')
  })

  it('mantém o catálogo inteiro no prompt', () => {
    const text = formatWorkspaceContextForPrompt({
      meetings: selectWorkspaceMeetings(meetings, 'reuniões'),
      documents: selectPortalDocuments(documents, 'documentos'),
      catalog: {
        meetings: meetings.map(item => item.title),
        documents: documents.map(item => item.title),
      },
    })
    expect(text).toContain('Integração de Inventário')
    expect(text).toContain('Manual do Produto')
    expect(text).toContain('Catálogo de reuniões')
    expect(text).toContain('Catálogo de documentos')
  })

  it('lê o workspace real da Be180', () => {
    const client = getClient('be180-ooh')
    expect(client?.meetings?.length).toBeGreaterThan(0)
    expect(client?.documents?.length).toBeGreaterThan(0)
    const meeting = selectWorkspaceMeetings(client!.meetings!, 'inventário e promoção')
    expect(meeting[0].title.toLowerCase()).toMatch(/invent[aá]rio/)
    const docs = selectPortalDocuments(client!.documents!, 'manual do colmeia')
    expect(docs.some(item => /manual/i.test(item.title))).toBe(true)
  })
})
