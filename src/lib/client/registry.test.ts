import { describe, expect, it } from 'vitest'
import { getClient, getClientEntryHref, listClients } from './registry'
import { canAccessClient } from './session'

describe('Café Orfeu no portal', () => {
  it('aparece no hub e, após o login, leva ao assessment', () => {
    const client = getClient('orfeu')
    expect(client?.name).toBe('Café Orfeu')
    expect(client?.entryPath).toBe('/adaptive')
    expect(getClientEntryHref('pt', client!)).toBe('/pt/adaptive')
    expect(listClients().some(item => item.slug === 'orfeu')).toBe(true)
  })

  it('mantém o workspace Cadence nos demais clientes', () => {
    const be180 = getClient('be180-ooh')
    expect(getClientEntryHref('pt', be180!)).toBe('/pt/client/be180-ooh')
  })
})

describe('Cadence e Adaptive Layer™', () => {
  it('substitui o card PixelPulseLab pelos dois produtos', () => {
    const names = listClients().map(item => item.name)
    expect(names).toContain('Cadence')
    expect(names).toContain('Adaptive Layer™')
    expect(names).not.toContain('PixelPulseLab')
    expect(getClient('pixelpulselab')?.slug).toBe('cadence')
    expect(getClientEntryHref('pt', getClient('cadence')!)).toBe('/pt/client/cadence')
    expect(getClientEntryHref('pt', getClient('adaptive-layer')!)).toBe('/pt/client/adaptive-layer')
  })

  it('aceita sessão antiga de pixelpulselab no Cadence', () => {
    expect(
      canAccessClient({ slug: 'pixelpulselab', name: 'PixelPulseLab', exp: 1 }, 'cadence')
    ).toBe(true)
  })
})
