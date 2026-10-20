import { describe, expect, it } from 'vitest'
import { experiencesFor, faqAnswer, podById } from './data'
import { bookedSameDay, buildIcs, generateSlots, localDay, podDays, resolveSlot, zonedToUtc } from './slots'

const miami = podById('miami-lobby')!
const saoPaulo = podById('sp-paulista')!

describe('zonedToUtc', () => {
  it('converte hora local com horário de verão', () => {
    expect(zonedToUtc('2026-07-10', 9, 0, 'America/New_York').toISOString()).toBe('2026-07-10T13:00:00.000Z')
    expect(zonedToUtc('2026-12-10', 9, 0, 'America/New_York').toISOString()).toBe('2026-12-10T14:00:00.000Z')
    expect(zonedToUtc('2026-12-10', 9, 0, 'America/Sao_Paulo').toISOString()).toBe('2026-12-10T12:00:00.000Z')
  })
})

describe('generateSlots', () => {
  const now = new Date('2026-12-09T12:00:00Z')

  it('abre sessões de 15 min a cada 20 min dentro do horário do pod', () => {
    const slots = generateSlots(saoPaulo, '2026-12-10', now)
    expect(slots[0].time).toBe('08:00')
    expect(slots[1].time).toBe('08:20')
    expect(new Date(slots[0].end).getTime() - new Date(slots[0].start).getTime()).toBe(15 * 60_000)
    const last = slots[slots.length - 1]
    expect(last.time).toBe('18:40')
    expect(slots).toHaveLength(33)
  })

  it('marca horários passados e reservados', () => {
    const today = generateSlots(saoPaulo, '2026-12-09', now, ['2026-12-09T13:00:00.000Z'])
    expect(today.find(slot => slot.time === '08:40')?.status).toBe('past')
    expect(today.find(slot => slot.time === '09:00')?.status).toBe('past')
    expect(today.find(slot => slot.time === '10:00')?.status).toBe('taken')
    expect(today.find(slot => slot.time === '10:20')?.status).toBe('free')
  })
})

describe('resolveSlot', () => {
  const now = new Date('2026-12-09T12:00:00Z')

  it('aceita só horários da grade, futuros e dentro da janela', () => {
    expect(resolveSlot(saoPaulo, '2026-12-10T11:00:00.000Z', now)?.time).toBe('08:00')
    expect(resolveSlot(saoPaulo, '2026-12-10T11:05:00.000Z', now)).toBeNull()
    expect(resolveSlot(saoPaulo, '2026-12-09T11:00:00.000Z', now)).toBeNull()
    expect(resolveSlot(saoPaulo, '2026-12-20T11:00:00.000Z', now)).toBeNull()
    expect(resolveSlot(saoPaulo, 'nope', now)).toBeNull()
  })

  it('janela de 7 dias começa no dia local do pod', () => {
    const lateNight = new Date('2026-12-10T03:30:00Z')
    expect(podDays(miami, lateNight)[0]).toBe('2026-12-09')
    expect(podDays(saoPaulo, lateNight)[0]).toBe('2026-12-10')
    expect(podDays(saoPaulo, lateNight)).toHaveLength(7)
  })
})

describe('bookedSameDay', () => {
  it('limita uma reserva por pessoa por dia local', () => {
    const existing = [{ start: '2026-12-10T11:00:00.000Z', timeZone: saoPaulo.timeZone }]
    expect(bookedSameDay(existing, '2026-12-10T20:00:00.000Z', saoPaulo.timeZone)).toBe(true)
    expect(bookedSameDay(existing, '2026-12-11T11:00:00.000Z', saoPaulo.timeZone)).toBe(false)
    expect(localDay(new Date('2026-12-11T02:00:00Z'), saoPaulo.timeZone)).toBe('2026-12-10')
  })
})

describe('faqAnswer', () => {
  it('responde sem modelo e sugere experiência quando faz sentido', () => {
    expect(faqAnswer('Qual experiência para ansiedade?', 'pt').experience).toBe('deep-breath')
    expect(faqAnswer('Can I nap?', 'en').experience).toBe('nap')
    expect(faqAnswer('How do I cancel?', 'en').experience).toBeNull()
    expect(faqAnswer('Preciso de crédito', 'pt').experience).toBeNull()
  })

  it('só oferece experiências que o pod tem', () => {
    const ids = experiencesFor(podById('miami-3f')!).map(item => item.id)
    expect(ids).not.toContain('nap')
    expect(ids).not.toContain('red-light')
    expect(experiencesFor(miami).map(item => item.id)).toContain('red-light')
  })
})

describe('buildIcs', () => {
  it('gera evento com alarme e escapa texto', () => {
    const ics = buildIcs({
      code: 'IRIS-AB12',
      start: '2026-12-10T11:00:00.000Z',
      end: '2026-12-10T11:15:00.000Z',
      title: 'Iris, Calm',
      location: 'São Paulo; Paulista',
      description: 'Chegue 2 min antes',
    })
    expect(ics).toContain('DTSTART:20261210T110000Z')
    expect(ics).toContain('SUMMARY:Iris\\, Calm')
    expect(ics).toContain('LOCATION:São Paulo\\; Paulista')
    expect(ics).toContain('TRIGGER:-PT10M')
  })
})
