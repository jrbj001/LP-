import { describe, expect, it } from 'vitest'
import { spaceEngagements } from './engagements'
import {
  engines,
  getPractice,
  listPractices,
  methodologyStats,
  pillars,
  practices,
  practicesByPillar,
  validateMethodology,
} from './methodology'

describe('biblioteca metodológica Alquemia', () => {
  it('contém exatamente as 55 práticas de referência', () => {
    expect(practices).toHaveLength(55)
    expect(practices.filter(item => item.system === 'danaher')).toHaveLength(30)
    expect(practices.filter(item => item.system === 'abi')).toHaveLength(25)
  })

  it('possui números únicos e completos de 1 a 55', () => {
    const numbers = practices.map(item => item.number)
    expect(new Set(numbers).size).toBe(55)
    expect([...numbers].sort((a, b) => a - b)).toEqual(Array.from({ length: 55 }, (_, index) => index + 1))
  })

  it('possui ids estáveis únicos', () => {
    const ids = practices.map(item => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every(id => /^(danaher|abi)-[a-z0-9-]+$/.test(id))).toBe(true)
  })

  it('mantém referências válidas de pilares e motores', () => {
    const pillarIds = new Set(pillars.map(item => item.id))
    const engineIds = new Set(engines.map(item => item.id))

    for (const item of practices) {
      expect(item.pillarIds.length).toBeGreaterThan(0)
      expect(item.engineIds.length).toBeGreaterThan(0)
      expect(item.pillarIds.every(id => pillarIds.has(id))).toBe(true)
      expect(item.engineIds.every(id => engineIds.has(id))).toBe(true)
    }
    expect(() => validateMethodology()).not.toThrow()
  })
})

describe('consulta e estatísticas', () => {
  it('busca uma prática por id e retorna undefined para id desconhecido', () => {
    expect(getPractice('danaher-kaizen-events')?.number).toBe(1)
    expect(getPractice('pratica-inexistente')).toBeUndefined()
  })

  it('filtra por sistema, área, pilar, motor e texto', () => {
    expect(listPractices({ system: 'abi' })).toHaveLength(25)
    expect(listPractices({ area: 'Finanças' }).map(item => item.number)).toEqual([30, 42, 43, 44])
    expect(listPractices({ pillarId: 'innovation-growth' }).every(item => item.pillarIds.includes('innovation-growth'))).toBe(true)
    expect(listPractices({ engineId: 'continuous-improvement' }).every(item => item.engineIds.includes('continuous-improvement'))).toBe(true)
    expect(listPractices({ search: 'VOICE OF THE CUSTOMER' }).map(item => item.number)).toEqual([15])
  })

  it('lista por pilar com o mesmo resultado do filtro', () => {
    expect(practicesByPillar('people-culture')).toEqual(listPractices({ pillarId: 'people-culture' }))
  })

  it('calcula totais sem contar referências como práticas adicionais', () => {
    const stats = methodologyStats()
    expect(stats.totalPractices).toBe(55)
    expect(stats.bySystem).toEqual({ danaher: 30, abi: 25 })
    expect(Object.values(stats.byArea).reduce((total, count) => total + count, 0)).toBe(55)
    expect(stats.byPillar['management-system']).toBeGreaterThan(0)
    expect(stats.byEngine.management + stats.byEngine['continuous-improvement']).toBeGreaterThan(55)
  })

  it('calcula estatísticas sobre um subconjunto filtrado', () => {
    const stats = methodologyStats(listPractices({ system: 'danaher' }))
    expect(stats.totalPractices).toBe(30)
    expect(stats.bySystem).toEqual({ danaher: 30, abi: 0 })
  })
})

describe('engagements do space', () => {
  it('mantém apenas o Café Orfeu', () => {
    expect(spaceEngagements.map(item => item.id)).toEqual(['orfeu'])
    expect(spaceEngagements[0]?.name).toBe('Café Orfeu')
  })
})
