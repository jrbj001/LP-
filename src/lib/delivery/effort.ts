import type { EffortConfig } from './config'
import type { EffortEstimate, ManualEffortItem, PeriodStats } from './types'

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

/** Filtra itens manuais cujo intervalo intersecta o período do relatório. */
export function manualItemsInPeriod(
  items: ManualEffortItem[],
  periodStart: Date,
  periodEnd: Date
): ManualEffortItem[] {
  return items.filter(item => {
    const from = item.from ? new Date(`${item.from}T00:00:00Z`) : null
    const to = item.to ? new Date(`${item.to}T23:59:59Z`) : null
    if (from && from > periodEnd) return false
    if (to && to < periodStart) return false
    return true
  })
}

/**
 * Estimativa de esforço do período:
 * horas de produto (git) = linhas brutas inseridas / fator efetivo LOC/h,
 * somadas ao esforço manual declarado (infra sem commits visíveis).
 */
export function computeEstimate(
  stats: PeriodStats,
  manualItems: ManualEffortItem[],
  periodDays: number,
  cfg: EffortConfig
): EffortEstimate {
  const gitHours = roundTo(stats.linesAdded / cfg.effectiveLocPerHour, cfg.roundingHours)
  const manualHours = manualItems.reduce((acc, i) => acc + i.hours, 0)
  const totalHours = gitHours + manualHours

  const weeks = Math.max(1, Math.round(periodDays / 7))
  const classified = stats.featureCommits + stats.fixCommits

  return {
    gitHours,
    manualHours,
    totalHours,
    totalHoursMin: roundTo(totalHours * (1 - cfg.variancePct / 100), cfg.roundingHours),
    totalHoursMax: roundTo(totalHours * (1 + cfg.variancePct / 100), cfg.roundingHours),
    weeks,
    hoursPerWeek: roundTo(totalHours / weeks, 5),
    // Equivalente ao relatório Colmeia: horas / 160 (não dilui pelo tamanho do período)
    personMonths: Number((totalHours / cfg.hoursPerPersonMonth).toFixed(1)),
    featPct: classified ? Math.round((stats.featureCommits / classified) * 100) : 0,
    fixPct: classified ? Math.round((stats.fixCommits / classified) * 100) : 0,
    bugPct: classified ? Math.round((stats.bugFixCommits / classified) * 100) : 0,
    evolutionPct: classified ? Math.round((stats.evolutionFixCommits / classified) * 100) : 0,
  }
}
