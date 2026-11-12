import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import type { BacklogCard } from '@/lib/backlog/types'
import { publishStoryToMonday, readBe180MondayConfig, sendCustomAgentMessage } from './publish'

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

const config = {
  token: 'monday-token',
  boardId: '123',
  accountSlug: 'be180',
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status })
}

describe('volta da user story ao Monday', () => {
  it('aponta as variáveis que faltam', () => {
    const result = readBe180MondayConfig({} as NodeJS.ProcessEnv)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.missing).toEqual(['MONDAY_AGENT_API_TOKEN'])
  })

  it('recusa story que não nasceu no Monday', async () => {
    await expect(
      publishStoryToMonday({
        card: storyCard({ monday: undefined }),
        boardLabel: 'Colmeia',
        config,
        fetchImpl: vi.fn(),
      })
    ).rejects.toThrow('Esta story não veio do Monday.')
  })

  it('atualiza o item de origem e grava a user story', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ data: { create_update: { id: '2' } } }))

    const result = await publishStoryToMonday({
      card: storyCard(),
      boardLabel: 'Colmeia · Meus Roteiros',
      config,
      fetchImpl: fetchMock,
    })

    expect(result).toEqual({
      itemId: '999',
      boardId: '123',
      url: 'https://be180.monday.com/boards/123/pulses/999',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const call = JSON.parse(String(fetchMock.mock.calls[0][1]?.body))
    expect(call.query).toContain('create_update')
    expect(call.query).not.toContain('create_item')
    expect(call.query).not.toContain('change_multiple_column_values')
    expect(call.variables.body).toContain('planner da Be180')
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: 'monday-token',
      'API-Version': 'dev',
    })
  })

  it('responde chat assíncrono com send_custom_agent_message', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse({ data: { send_custom_agent_message: { delivered: true } } }))
    await sendCustomAgentMessage(config, 'conv-1', 'Sou o Cadence.', fetchMock)
    const call = JSON.parse(String(fetchMock.mock.calls[0][1]?.body))
    expect(call.query).toContain('send_custom_agent_message')
    expect(call.variables).toEqual({ conversationId: 'conv-1', message: 'Sou o Cadence.' })
  })
})
