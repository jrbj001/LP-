import { describe, expect, it } from 'vitest'
import {
  isDataSourceRemovable,
  seededDataSourceEnabled,
} from './lifecycle'

describe('ciclo de vida das fontes de dados', () => {
  it('cria fontes automáticas habilitadas e preserva uma desativação existente', () => {
    expect(seededDataSourceEnabled()).toBe(true)
    expect(seededDataSourceEnabled({ enabled: true })).toBe(true)
    expect(seededDataSourceEnabled({ enabled: false })).toBe(false)
  })

  it('permite remover somente fontes manuais', () => {
    expect(isDataSourceRemovable({ managed: false })).toBe(true)
    expect(isDataSourceRemovable({ managed: true })).toBe(false)
  })
})
