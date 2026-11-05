import { describe, expect, it } from 'vitest'
import type { BacklogCard } from '@/lib/backlog/types'
import {
  cadenceBoardForMonday,
  cardFromMondayItem,
  interpretMondayAgentEvent,
  interpretMondayWebhook,
  mondayAgentChat,
  mondayWebhookAuthorized,
  planMondayRoundTrip,
  readMondayItemDetails,
  runMondayRoundTrip,
} from './inbound'

function storyCard(overrides: Partial<BacklogCard> = {}): BacklogCard {
  return {
    id: 'monday-999',
    boardId: 'colmeia',
    column: 'story',
    title: 'Publicar roteiro com mídia válida',
    level: 'story',
    persona: 'planner da Be180',
    want: 'publicar o roteiro só com mídia válida',
    soThat: 'o plano não saia com ponto sem criativo',
    acceptance: ['Bloqueia publicação sem mídia'],
    source: { kind: 'monday', ref: '999' },
    monday: { itemId: '999', boardId: '123' },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    ...overrides,
  }
}

const item = { boardId: '123', itemId: '999', name: 'Roteiro indoor' }

describe('entrada do Monday', () => {
  it('responde o challenge e lê só a criação do item', () => {
    expect(interpretMondayWebhook({ challenge: 'abc' })).toEqual({
      type: 'challenge',
      challenge: 'abc',
    })
    expect(
      interpretMondayWebhook({
        event: { type: 'create_pulse', boardId: 123, pulseId: 999, pulseName: 'Roteiro indoor' },
      })
    ).toEqual({ type: 'created', item })
    expect(interpretMondayWebhook({ event: { type: 'update_column_value', pulseId: 1 } })).toEqual({
      type: 'ignore',
    })
  })

  it('lê o agente atribuído no board Colmeia', () => {
    expect(
      interpretMondayAgentEvent({
        event: 'agent_triggered',
        triggerType: 'assign',
        stream: true,
        payload: { text: 'instrução', itemId: 999, boardId: 18412647269 },
      })
    ).toMatchObject({
      trigger: 'assigned',
      stream: true,
      itemId: '999',
      boardId: '18412647269',
    })
    expect(interpretMondayAgentEvent({ event: 'agent_triggered', triggerType: 'unknown' })).toBeNull()
  })

  it('responde no chat com SSE e termina com done/success', async () => {
    const response = mondayAgentChat('oi', true)
    expect(response.headers.get('content-type')).toContain('text/event-stream')
    const text = await response.text()
    expect(text).toContain('"content":"oi"')
    expect(text).toContain('"type":"done","success":true')
  })

  it('lê o conversationId do chat e responde success/message quando não stream', () => {
    expect(
      interpretMondayAgentEvent({
        event: 'agent_triggered',
        triggerType: 'chat',
        sessionId: 'sess-1',
        payload: { text: 'oi', conversationId: 'conv-1' },
      })
    ).toMatchObject({ trigger: 'chat', conversationId: 'conv-1', sessionId: 'sess-1' })

    const response = mondayAgentChat('oi', false)
    expect(response.headers.get('content-type')).toContain('application/json')
  })

  it('autoriza o webhook nativo e exige o segredo quando ele existe', () => {
    expect(mondayWebhookAuthorized(null, undefined)).toBe(true)
    expect(mondayWebhookAuthorized('Bearer segredo', 'segredo')).toBe(true)
    expect(mondayWebhookAuthorized(null, 'segredo')).toBe(false)
  })

  it('monta o requisito cru e escolhe o board do Cadence', () => {
    expect(cadenceBoardForMonday('banco-ativos')).toBe('banco-ativos')
    expect(cadenceBoardForMonday('inexistente')).toBe('colmeia')
    const card = cardFromMondayItem({
      item,
      context: 'sem mídia no ponto',
      cadenceBoardId: 'colmeia',
      accountSlug: 'be180',
      now: '2026-11-04T00:00:00.000Z',
    })
    expect(card.id).toBe('monday-999')
    expect(card.level).toBe('raw')
    expect(card.source).toEqual({ kind: 'monday', ref: '999' })
    expect(card.monday?.url).toBe('https://be180.monday.com/boards/123/pulses/999')
    expect(card.monday?.syncedAt).toBeUndefined()
  })

  it('junta colunas e atualizações do item, sem repetir o nome', () => {
    expect(
      readMondayItemDetails({
        items: [
          {
            name: 'Roteiro indoor',
            column_values: [{ text: 'Roteiro indoor' }, { text: 'sem mídia' }],
            updates: [{ text_body: '<p>ponto &amp; criativo</p>' }],
          },
        ],
      })
    ).toEqual({ name: 'Roteiro indoor', context: 'sem mídia\n\nponto & criativo', assets: [] })
  })

  it('importa, enriquece e devolve; na repetição não grava de novo', async () => {
    const saved: BacklogCard[] = []
    const draft = cardFromMondayItem({
      item,
      cadenceBoardId: 'colmeia',
      now: '2026-11-04T00:00:00.000Z',
    })
    const enriched = storyCard()
    const first = await runMondayRoundTrip({
      existing: null,
      draft,
      enrich: async () => enriched,
      writeBack: async card => ({ ...card, monday: { ...card.monday!, syncedAt: '2026-11-04T01:00:00.000Z' } }),
      save: async card => {
        saved.push(card)
        return card
      },
    })

    expect(first.status).toBe('imported')
    expect(first.card.monday?.syncedAt).toBe('2026-11-04T01:00:00.000Z')
    expect(saved.map(card => card.level)).toEqual(['raw', 'story', 'story'])

    const again = await runMondayRoundTrip({
      existing: first.card,
      draft,
      enrich: async () => {
        throw new Error('não deveria enriquecer de novo')
      },
      writeBack: async () => {
        throw new Error('não deveria devolver de novo')
      },
      save: async card => card,
    })
    expect(again.status).toBe('already-returned')
  })

  it('só devolve quando a story já está pronta e ainda não voltou', () => {
    expect(planMondayRoundTrip(null)).toBe('import')
    expect(planMondayRoundTrip(storyCard({ level: 'raw', persona: undefined }))).toBe('enrich')
    expect(planMondayRoundTrip(storyCard())).toBe('return')
    expect(planMondayRoundTrip(storyCard({ monday: { itemId: '999', boardId: '123', syncedAt: 't' } }))).toBe(
      'done'
    )
  })
})
