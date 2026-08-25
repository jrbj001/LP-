/**
 * Regras de legado para original estimate do Jira.
 *
 * Só gravamos em issues sem estimativa. 0m / 0h / 0d / vazio entram na fila.
 * Qualquer valor positivo (3d, 2d 4h, 30m, …) é legado e é imutável.
 */

export const DEFAULT_HOURS_PER_DAY = 8

const ZERO_ESTIMATE = /^(0+|0m|0h|0d|0w|0d\s*0h|0h\s*0m)$/i

export class JiraLegacyEstimateError extends Error {
  constructor(
    public readonly issueKey: string,
    public readonly existingEstimate: string
  ) {
    super(
      `A issue ${issueKey} já tem original estimate (${existingEstimate}). Estimativas de legado não são sobrescritas.`
    )
    this.name = 'JiraLegacyEstimateError'
  }
}

export function parseJiraDurationToHours(
  raw: string | null | undefined,
  hoursPerDay = DEFAULT_HOURS_PER_DAY
): number {
  if (!raw) return 0
  const text = raw.trim().toLowerCase()
  if (!text || ZERO_ESTIMATE.test(text.replace(/\s+/g, ''))) return 0

  let hours = 0
  const token = /(-?\d+(?:[.,]\d+)?)\s*([wdhm])/g
  let match: RegExpExecArray | null
  let matched = false
  while ((match = token.exec(text))) {
    matched = true
    const value = Number(match[1].replace(',', '.'))
    if (!Number.isFinite(value)) continue
    switch (match[2]) {
      case 'w':
        hours += value * hoursPerDay * 5
        break
      case 'd':
        hours += value * hoursPerDay
        break
      case 'h':
        hours += value
        break
      case 'm':
        hours += value / 60
        break
    }
  }
  if (!matched && /^\d+(?:[.,]\d+)?$/.test(text)) {
    hours = Number(text.replace(',', '.'))
  }
  return hours > 0 ? hours : 0
}

export function secondsToHours(seconds: number | null | undefined): number {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return 0
  return seconds / 3600
}

export function isUnestimated(input: {
  originalEstimate?: string | null
  originalEstimateSeconds?: number | null
  hoursPerDay?: number
}): boolean {
  const fromSeconds = secondsToHours(input.originalEstimateSeconds)
  if (fromSeconds > 0) return false
  const fromLabel = parseJiraDurationToHours(input.originalEstimate, input.hoursPerDay)
  return fromLabel <= 0
}

export function hoursToJiraEstimate(
  hours: number,
  hoursPerDay = DEFAULT_HOURS_PER_DAY
): string {
  const clamped = Math.max(0.5, Math.round(hours * 2) / 2)
  const days = Math.floor(clamped / hoursPerDay)
  const remainder = Number((clamped - days * hoursPerDay).toFixed(2))
  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (remainder >= 1) {
    const wholeHours = Math.floor(remainder)
    const minutes = Math.round((remainder - wholeHours) * 60)
    parts.push(`${wholeHours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
  } else if (remainder > 0) {
    parts.push(`${Math.round(remainder * 60)}m`)
  }
  return parts.join(' ') || '30m'
}

export function assertCanWriteOriginalEstimate(input: {
  key: string
  originalEstimate?: string | null
  originalEstimateSeconds?: number | null
  hoursPerDay?: number
}): void {
  if (isUnestimated(input)) return
  const label =
    input.originalEstimate?.trim() ||
    `${Math.round(secondsToHours(input.originalEstimateSeconds) * 10) / 10}h`
  throw new JiraLegacyEstimateError(input.key, label)
}
