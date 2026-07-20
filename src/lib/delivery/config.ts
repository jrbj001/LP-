import type { DeliveryType } from './types'

/**
 * Coeficientes do PulseEffort — calibráveis por cliente.
 * Revisar mensalmente comparando com horas reais percebidas.
 */
export interface EffortConfig {
  /** Gap máximo (min) entre commits para pertencerem à mesma sessão. */
  sessionGapMinutes: number
  /** Horas de baseline somadas por sessão iniciada (aquecimento/contexto). */
  sessionBaselineHours: number
  baseHoursByType: Record<DeliveryType, number>
  /** Divisor de linhas alteradas no fator de tamanho. */
  sizeDivisor: number
  sizeFactorMin: number
  sizeFactorMax: number
  /** Horas somadas por rodada de review na PR. */
  reviewRoundHours: number
  /** Peso do sinal de sessões no blend (o restante vai para complexidade). */
  sessionWeight: number
  /** Arredondamento final (ex.: 0.5h). */
  roundingHours: number
}

export const DEFAULT_EFFORT_CONFIG: EffortConfig = {
  sessionGapMinutes: 120,
  sessionBaselineHours: 0.5,
  baseHoursByType: {
    feature: 3.0,
    fix: 1.5,
    improvement: 2.0,
    maintenance: 0.5,
  },
  sizeDivisor: 200,
  sizeFactorMin: 0.5,
  sizeFactorMax: 3.0,
  reviewRoundHours: 0.5,
  sessionWeight: 0.6,
  roundingHours: 0.5,
}
