import { describe, expect, it } from 'vitest'
import {
  PERSONAS,
  deriveAvatarState,
  headlineFor,
  mixHex,
  phaseFor,
  type AvatarInput,
} from './likeme-avatar-animado-data'

const base: AvatarInput = PERSONAS.find(p => p.id === 'evolucao')!.input

describe('deriveAvatarState', () => {
  it('mantém o avatar dormente sem anamnese completa', () => {
    const state = deriveAvatarState({ ...base, anamnesisCompleted: false })
    expect(state.phase).toBe('dormente')
    expect(state.mind.saturation).toBe(0)
    expect(state.link).toBe(0)
    expect(state.mind.breathSeconds).toBe(8)
  })

  it('troca de fase nos limiares 35 e 70', () => {
    expect(phaseFor({ mind: 34, body: 34, anamnesisCompleted: true })).toBe('despertando')
    expect(phaseFor({ mind: 35, body: 35, anamnesisCompleted: true })).toBe('vivo')
    expect(phaseFor({ mind: 70, body: 70, anamnesisCompleted: true })).toBe('radiante')
  })

  it('limita escala e saturação entre 0 e 100', () => {
    const low = deriveAvatarState({ ...base, mind: -20, body: 0 })
    const high = deriveAvatarState({ ...base, mind: 140, body: 100 })
    expect(low.mind.scale).toBe(0.55)
    expect(high.mind.scale).toBe(1.15)
    expect(high.mind.saturation).toBe(1)
    expect(low.body.level).toBe(0)
  })

  it('ondula mais a mente quando os marcadores mentais são baixos', () => {
    const calm = deriveAvatarState({
      ...base,
      markers: { ...base.markers, stress: 100, 'self-esteem': 100, 'purpose-vision': 100, spirituality: 100 },
    })
    const tense = deriveAvatarState({
      ...base,
      markers: { ...base.markers, stress: 0, 'self-esteem': 0, 'purpose-vision': 0, spirituality: 0 },
    })
    expect(calm.mind.wobble).toBe(0)
    expect(tense.mind.wobble).toBe(1)
    expect(calm.mind.breathSeconds).toBeGreaterThan(tense.mind.breathSeconds)
  })

  it('define o pulso pelo delta do período', () => {
    expect(deriveAvatarState({ ...base, mindDelta: 5 }).mind.pulse).toBe('expand')
    expect(deriveAvatarState({ ...base, mindDelta: -5 }).mind.pulse).toBe('contract')
    expect(deriveAvatarState({ ...base, mindDelta: 1 }).mind.pulse).toBe('steady')
  })
})

describe('headlineFor', () => {
  it('destaca a dimensão que mais evoluiu sem expor números negativos', () => {
    expect(headlineFor({ mindDelta: 23, bodyDelta: 11, anamnesisCompleted: true })).toBe(
      'Sua mente acordou 23% este mês',
    )
    expect(headlineFor({ mindDelta: 2, bodyDelta: 14, anamnesisCompleted: true })).toContain('corpo')
    expect(headlineFor({ mindDelta: -8, bodyDelta: 0, anamnesisCompleted: true })).not.toMatch(/\d/)
  })
})

describe('mixHex', () => {
  it('interpola cores e satura nos extremos', () => {
    expect(mixHex('#000000', '#FFFFFF', 0)).toBe('#000000')
    expect(mixHex('#000000', '#FFFFFF', 1)).toBe('#FFFFFF')
    expect(mixHex('#000000', '#FFFFFF', 2)).toBe('#FFFFFF')
  })
})
