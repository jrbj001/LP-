import { describe, expect, it } from 'vitest'
import { journeyStages, pillars } from './methodology'
import {
  getTemplate,
  listTemplates,
  templateFamilies,
  templates,
  templateStats,
  validateTemplates,
} from './templates'

describe('templates Alquemia', () => {
  it('cataloga os 27 modelos extraídos do Keynote 2026', () => {
    expect(templates).toHaveLength(27)
    expect(templateFamilies).toHaveLength(5)
    expect(() => validateTemplates()).not.toThrow()
  })

  it('possui ids e números únicos', () => {
    expect(new Set(templates.map(item => item.id)).size).toBe(27)
    expect(new Set(templates.map(item => item.number)).size).toBe(27)
  })

  it('mantém referências válidas de jornada e pilares', () => {
    const pillarIds = new Set(pillars.map(item => item.id))
    const stageIds = new Set(journeyStages.map(item => item.id))
    for (const item of templates) {
      expect(item.pillarIds.every(id => pillarIds.has(id))).toBe(true)
      expect(item.journeyStageIds.every(id => stageIds.has(id))).toBe(true)
    }
  })

  it('filtra por família e busca', () => {
    expect(getTemplate('pdca-sdca')?.source).toMatch(/AB InBev/)
    expect(listTemplates({ family: 'fieldwork' }).map(item => item.id)).toEqual([
      'shifting-business',
      'ten-principles',
    ])
    expect(listTemplates({ search: '5W2H' })[0]?.id).toBe('five-w-two-h')
  })

  it('soma as famílias sem residual', () => {
    const stats = templateStats()
    expect(Object.values(stats.byFamily).reduce((total, count) => total + count, 0)).toBe(27)
  })
})
