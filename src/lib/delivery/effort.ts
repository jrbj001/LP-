import type { EffortConfig } from './config'
import type { EffortEstimate, ManualEffortItem, PeriodStats } from './types'

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

const DAY_MS = 86_400_000

/**
 * Filtra esforço manual pela interseção com o relatório e rateia as horas.
 * Ex.: uma atividade de 80h em 31 dias contribui apenas com a fração dos dias
 * que realmente caem na janela selecionada (30/60/90).
 */
export function manualItemsInPeriod(
  items: ManualEffortItem[],
  periodStart: Date,
  periodEnd: Date
): ManualEffortItem[] {
  return items.flatMap(item => {
    const from = item.from ? new Date(`${item.from}T00:00:00Z`) : null
    const to = item.to ? new Date(`${item.to}T23:59:59.999Z`) : null
    if (from && from > periodEnd) return []
    if (to && to < periodStart) return []

    // Sem os dois limites não há base confiável para rateio.
    if (!from || !to) return [item]

    const overlapStart = new Date(Math.max(from.getTime(), periodStart.getTime()))
    const overlapEnd = new Date(Math.min(to.getTime(), periodEnd.getTime()))
    const totalDays = Math.max(1, (to.getTime() - from.getTime()) / DAY_MS)
    const overlapDays = Math.max(0, (overlapEnd.getTime() - overlapStart.getTime()) / DAY_MS)
    const proratedHours = Math.round(item.hours * (overlapDays / totalDays) * 2) / 2

    if (proratedHours <= 0) return []
    return [{
      ...item,
      hours: proratedHours,
      from: overlapStart.toISOString().slice(0, 10),
      to: overlapEnd.toISOString().slice(0, 10),
    }]
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

  const weeks = Math.max(1, Number((periodDays / 7).toFixed(1)))
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
