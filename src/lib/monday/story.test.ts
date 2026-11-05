import { describe, expect, it } from 'vitest'
import type { BacklogCard } from '@/lib/backlog/types'
import {
  formatMondayItemName,
  formatMondayStoryHtml,
  isStoryReadyForMonday,
  mondayItemUrl,
} from './story'

function storyCard(overrides: Partial<BacklogCard> = {}): BacklogCard {
  return {
    id: 'card-1',
    boardId: 'colmeia',
    column: 'story',
    title: 'Publicar roteiro com mídia válida',
    level: 'story',
    persona: 'planner da Be180',
    want: 'publicar o roteiro só com mídia válida',
    soThat: 'o plano não saia com ponto sem criativo',
    acceptance: ['Bloqueia publicação sem mídia', 'Mostra o ponto inválido'],
    priority: 'Alta',
    source: { kind: 'manual' },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    ...overrides,
  }
}

describe('user story para o Monday', () => {
  it('exige persona, quero, para que e aceite', () => {
    expect(isStoryReadyForMonday(storyCard())).toBe(true)
    expect(isStoryReadyForMonday(storyCard({ level: 'raw' }))).toBe(false)
    expect(isStoryReadyForMonday(storyCard({ acceptance: ['  '] }))).toBe(false)
  })

  it('limita o nome do item e escapa o HTML da atualização', () => {
    expect(formatMondayItemName(`  ${'a'.repeat(300)}  `)).toHaveLength(255)
    expect(formatMondayItemName('  roteiro\n\nindoor  ')).toBe('roteiro indoor')

    const html = formatMondayStoryHtml(
      storyCard({ persona: 'planner <script>' }),
      'Colmeia · Meus Roteiros'
    )
    expect(html).toContain('planner &lt;script&gt;')
    expect(html).toContain('<li>Bloqueia publicação sem mídia</li>')
    expect(html).toContain('Prioridade:</strong> Alta')
    expect(html).toContain('Cadence · Colmeia · Meus Roteiros · card-1')
    expect(html).not.toContain('<script>')
  })

  it('monta o link do item na conta da Be180', () => {
    expect(mondayItemUrl('be180', '123', '999')).toBe(
      'https://be180.monday.com/boards/123/pulses/999'
    )
  })
})
