/** Generate weekday 30-min slots in a date window (America/Sao_Paulo local wall time as ISO offset -03:00). */

export interface SlotWindowConfig {
  /** Inclusive start date YYYY-MM-DD */
  startDate: string
  /** Number of weekdays to open */
  weekdays: number
  /** Hour local, inclusive */
  dayStartHour: number
  /** Hour local, exclusive */
  dayEndHour: number
  host: string
  location: string
  clientId: string
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function isWeekend(isoDate: string): boolean {
  const d = new Date(`${isoDate}T12:00:00`)
  const day = d.getDay()
  return day === 0 || day === 6
}

function toSaoPauloIso(date: string, hour: number, minute: number): string {
  const hh = String(hour).padStart(2, '0')
  const mm = String(minute).padStart(2, '0')
  return `${date}T${hh}:${mm}:00-03:00`
}

export function generateSlotCandidates(config: SlotWindowConfig): { start: string; end: string; name: string }[] {
  const out: { start: string; end: string; name: string }[] = []
  let date = config.startDate
  let openDays = 0
  let guard = 0

  while (openDays < config.weekdays && guard < 60) {
    guard++
    if (!isWeekend(date)) {
      for (let h = config.dayStartHour; h < config.dayEndHour; h++) {
        for (const m of [0, 30]) {
          if (h === config.dayEndHour - 1 && m === 30) continue
          const start = toSaoPauloIso(date, h, m)
          const endMinute = m === 0 ? 30 : 0
          const endHour = m === 0 ? h : h + 1
          if (endHour > config.dayEndHour || (endHour === config.dayEndHour && endMinute > 0)) continue
          const end = toSaoPauloIso(date, endHour, endMinute)
          const label = `${date} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          out.push({ start, end, name: `${config.clientId} · ${label}` })
        }
      }
      openDays++
    }
    date = addDays(date, 1)
  }

  return out
}

export function formatSlotLabel(isoStart: string): string {
  const d = new Date(isoStart)
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
