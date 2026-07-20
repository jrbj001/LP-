import type { EffortConfig } from './config'
import type { DeliveryType, EffortBreakdown } from './types'

/**
 * Sinal 1 — Sessões de trabalho (algoritmo git-hours):
 * commits ordenados por data; gaps < sessionGapMinutes pertencem à mesma
 * sessão e contam integralmente; cada sessão iniciada soma um baseline.
 */
export function sessionHours(commitDates: Date[], cfg: EffortConfig): number {
  if (commitDates.length === 0) return 0

  const sorted = [...commitDates].sort((a, b) => a.getTime() - b.getTime())
  const gapMs = cfg.sessionGapMinutes * 60_000

  let hours = cfg.sessionBaselineHours
  for (let i = 1; i < sorted.length; i++) {
    const diff = sorted[i].getTime() - sorted[i - 1].getTime()
    if (diff <= gapMs) {
      hours += diff / 3_600_000
    } else {
      hours += cfg.sessionBaselineHours
    }
  }
  return hours
}

/**
 * Sinal 2 — Complexidade da entrega:
 * base(tipo) × fator_tamanho + rodadas_de_review × horas_por_rodada.
 */
export function complexityHours(
  type: DeliveryType,
  linesChanged: number,
  reviewRounds: number,
  cfg: EffortConfig
): { hours: number; baseHours: number; sizeFactor: number } {
  const baseHours = cfg.baseHoursByType[type]
  const raw = Math.log2(1 + linesChanged / cfg.sizeDivisor)
  const sizeFactor = Math.min(cfg.sizeFactorMax, Math.max(cfg.sizeFactorMin, raw))
  const hours = baseHours * sizeFactor + reviewRounds * cfg.reviewRoundHours
  return { hours, baseHours, sizeFactor }
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

/** Blend final: média ponderada dos dois sinais, arredondada, mínimo de 1 passo. */
export function computeEffort(args: {
  type: DeliveryType
  commitDates: Date[]
  linesChanged: number
  reviewRounds: number
  cfg: EffortConfig
}): EffortBreakdown {
  const { type, commitDates, linesChanged, reviewRounds, cfg } = args

  const sessions = sessionHours(commitDates, cfg)
  const complexity = complexityHours(type, linesChanged, reviewRounds, cfg)

  const blended =
    sessions > 0
      ? cfg.sessionWeight * sessions + (1 - cfg.sessionWeight) * complexity.hours
      : complexity.hours

  const billable = Math.max(cfg.roundingHours, roundTo(blended, cfg.roundingHours))

  return {
    sessionHours: Number(sessions.toFixed(2)),
    complexityHours: Number(complexity.hours.toFixed(2)),
    baseHours: complexity.baseHours,
    sizeFactor: Number(complexity.sizeFactor.toFixed(2)),
    reviewRounds,
    commitCount: commitDates.length,
    billableHours: billable,
  }
}
