import { BOOKING_HORIZON_DAYS, SESSION_MINUTES, STEP_MINUTES, type IrisPod } from './data'

const MINUTE = 60_000
const LEAD_MINUTES = 2

export type SlotStatus = 'free' | 'taken' | 'past'

export interface IrisSlot {
  start: string
  end: string
  time: string
  status: SlotStatus
}

function wallClock(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find(part => part.type === type)?.value)
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  }
}

function offsetMs(date: Date, timeZone: string): number {
  const wall = wallClock(date, timeZone)
  const asUtc = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second)
  return asUtc - Math.floor(date.getTime() / 1000) * 1000
}

export function zonedToUtc(day: string, hour: number, minute: number, timeZone: string): Date {
  const [year, month, date] = day.split('-').map(Number)
  const guess = Date.UTC(year, month - 1, date, hour, minute)
  const first = guess - offsetMs(new Date(guess), timeZone)
  return new Date(guess - offsetMs(new Date(first), timeZone))
}

export function localDay(date: Date, timeZone: string): string {
  const wall = wallClock(date, timeZone)
  return `${wall.year}-${String(wall.month).padStart(2, '0')}-${String(wall.day).padStart(2, '0')}`
}

export function localTime(date: Date, timeZone: string): string {
  const wall = wallClock(date, timeZone)
  return `${String(wall.hour).padStart(2, '0')}:${String(wall.minute).padStart(2, '0')}`
}

function addDays(day: string, days: number): string {
  const [year, month, date] = day.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, date + days)).toISOString().slice(0, 10)
}

export function podDays(pod: IrisPod, now: Date): string[] {
  const today = localDay(now, pod.timeZone)
  return Array.from({ length: BOOKING_HORIZON_DAYS }, (_, index) => addDays(today, index))
}

export function generateSlots(pod: IrisPod, day: string, now: Date, taken: Iterable<string> = []): IrisSlot[] {
  const takenSet = new Set(Array.from(taken, iso => new Date(iso).toISOString()))
  const cutoff = now.getTime() + LEAD_MINUTES * MINUTE
  const slots: IrisSlot[] = []
  const lastStart = pod.closeHour * 60 - SESSION_MINUTES

  for (let minutes = pod.openHour * 60; minutes <= lastStart; minutes += STEP_MINUTES) {
    const start = zonedToUtc(day, Math.floor(minutes / 60), minutes % 60, pod.timeZone)
    const end = new Date(start.getTime() + SESSION_MINUTES * MINUTE)
    const iso = start.toISOString()
    slots.push({
      start: iso,
      end: end.toISOString(),
      time: localTime(start, pod.timeZone),
      status: start.getTime() < cutoff ? 'past' : takenSet.has(iso) ? 'taken' : 'free',
    })
  }
  return slots
}

export function resolveSlot(pod: IrisPod, startIso: string, now: Date): IrisSlot | null {
  const start = new Date(startIso)
  if (Number.isNaN(start.getTime())) return null
  const day = localDay(start, pod.timeZone)
  if (!podDays(pod, now).includes(day)) return null
  const slot = generateSlots(pod, day, now).find(item => item.start === start.toISOString())
  return slot && slot.status === 'free' ? slot : null
}

export function bookedSameDay(
  existing: Array<{ start: string; timeZone: string }>,
  startIso: string,
  timeZone: string
): boolean {
  const day = localDay(new Date(startIso), timeZone)
  return existing.some(item => localDay(new Date(item.start), item.timeZone) === day)
}

function icsStamp(iso: string): string {
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function icsText(value: string): string {
  return value.replace(/[\\;,]/g, match => `\\${match}`).replace(/\n/g, '\\n')
}

export function buildIcs(input: {
  code: string
  start: string
  end: string
  title: string
  location: string
  description: string
}): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenSeed//Iris Booking//EN',
    'BEGIN:VEVENT',
    `UID:${input.code}@iris.openseed`,
    `DTSTAMP:${icsStamp(new Date().toISOString())}`,
    `DTSTART:${icsStamp(input.start)}`,
    `DTEND:${icsStamp(input.end)}`,
    `SUMMARY:${icsText(input.title)}`,
    `LOCATION:${icsText(input.location)}`,
    `DESCRIPTION:${icsText(input.description)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT10M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsText(input.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
