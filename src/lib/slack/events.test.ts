import { describe, expect, it } from 'vitest'
import { interpretSlackEvent } from './events'

describe('interpretSlackEvent', () => {
  it('devolve o challenge de verificação da URL', () => {
    expect(interpretSlackEvent({ type: 'url_verification', challenge: 'abc' })).toEqual({
      kind: 'challenge',
      challenge: 'abc',
    })
  })

  it('ignora mensagem do próprio bot e subtipo', () => {
    expect(
      interpretSlackEvent({
        type: 'event_callback',
        event: { type: 'app_mention', bot_id: 'B1', channel: 'C1', ts: '1', text: 'oi' },
      })
    ).toEqual({ kind: 'ignore' })
    expect(
      interpretSlackEvent({
        type: 'event_callback',
        event: { type: 'message', subtype: 'message_changed', channel: 'D1', channel_type: 'im', ts: '1', text: 'oi' },
      })
    ).toEqual({ kind: 'ignore' })
  })

  it('extrai a pergunta da menção e da DM', () => {
    expect(
      interpretSlackEvent({
        type: 'event_callback',
        event: {
          type: 'app_mention',
          channel: 'C1',
          user: 'U1',
          ts: '111.222',
          text: '<@UBOT> quantos pontos em São Paulo?',
        },
      })
    ).toEqual({
      kind: 'question',
      channel: 'C1',
      threadTs: '111.222',
      user: 'U1',
      text: 'quantos pontos em São Paulo?',
    })
    expect(
      interpretSlackEvent({
        type: 'event_callback',
        event: {
          type: 'message',
          channel_type: 'im',
          channel: 'D1',
          user: 'U1',
          ts: '2',
          thread_ts: '1',
          text: 'lista os roteiros',
        },
      })
    ).toMatchObject({ kind: 'question', channel: 'D1', threadTs: '1', text: 'lista os roteiros' })
  })

  it('pede ajuda quando a menção vem sem pergunta', () => {
    expect(
      interpretSlackEvent({
        type: 'event_callback',
        event: { type: 'app_mention', channel: 'C1', ts: '1', text: '<@UBOT>' },
      })
    ).toEqual({ kind: 'help', channel: 'C1', threadTs: '1' })
  })
})
