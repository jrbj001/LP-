import { describe, expect, it } from 'vitest'
import { getClient, getClientEntryHref, listClients } from './registry'

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
