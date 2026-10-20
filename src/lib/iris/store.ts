import 'server-only'

import { randomBytes, randomUUID } from 'node:crypto'
import { getDb } from '@/lib/postgres'
import { podById, type IrisLocale, type IrisPod } from './data'
import { bookedSameDay, zonedToUtc } from './slots'

export interface IrisBooking {
  id: string
  code: string
  podId: string
  start: string
  end: string
  experience: string | null
  name: string
  email: string
  whatsapp: string | null
  locale: IrisLocale
  status: 'confirmed' | 'cancelled'
}

interface BookingRow {
  id: string
  code: string
  pod_id: string
  starts_at: Date | string
  ends_at: Date | string
  experience: string | null
  name: string
  email: string
  whatsapp: string | null
  locale: string
  status: string
}

export class IrisBookingError extends Error {
  constructor(
    public reason: 'taken' | 'same-day' | 'not-found',
    message: string
  ) {
    super(message)
  }
}

let ensureTablePromise: Promise<void> | null = null

export async function ensureIrisTable(): Promise<void> {
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      const sql = getDb()
      await sql`
        create table if not exists iris_bookings (
          id text primary key,
          code text not null unique,
          pod_id text not null,
          starts_at timestamptz not null,
          ends_at timestamptz not null,
          experience text,
          name text not null,
          email text not null,
          locale text not null default 'pt',
          status text not null default 'confirmed',
          created_at timestamptz not null default now()
        )
      `
      await sql`
        create unique index if not exists iris_bookings_slot_idx
          on iris_bookings (pod_id, starts_at)
          where status = 'confirmed'
      `
      await sql`
        create index if not exists iris_bookings_email_idx
          on iris_bookings (lower(email), starts_at)
      `
      await sql`
        alter table iris_bookings
          add column if not exists whatsapp text
      `
    })().catch(error => {
      ensureTablePromise = null
      throw error
    })
  }
  return ensureTablePromise
}

function toIso(value: Date | string): string {
  return new Date(value).toISOString()
}

function fromRow(row: BookingRow): IrisBooking {
  return {
    id: row.id,
    code: row.code,
    podId: row.pod_id,
    start: toIso(row.starts_at),
    end: toIso(row.ends_at),
    experience: row.experience,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp,
    locale: row.locale === 'en' ? 'en' : 'pt',
    status: row.status === 'cancelled' ? 'cancelled' : 'confirmed',
  }
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function bookingCode(): string {
  const bytes = randomBytes(4)
  return `IRIS-${Array.from(bytes, byte => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('')}`
}

export async function listTakenStarts(pod: IrisPod, day: string): Promise<string[]> {
  await ensureIrisTable()
  const sql = getDb()
  const from = zonedToUtc(day, 0, 0, pod.timeZone)
  const to = new Date(from.getTime() + 36 * 60 * 60_000)
  const rows = await sql<{ starts_at: Date | string }[]>`
    select starts_at from iris_bookings
    where pod_id = ${pod.id}
      and status = 'confirmed'
      and starts_at >= ${from}
      and starts_at < ${to}
  `
  return rows.map(row => toIso(row.starts_at))
}

export async function createBooking(input: {
  pod: IrisPod
  start: string
  end: string
  experience: string | null
  name: string
  email: string
  whatsapp: string
  locale: IrisLocale
}): Promise<IrisBooking> {
  await ensureIrisTable()
  const sql = getDb()
  const email = input.email.trim().toLowerCase()

  const upcoming = await sql<{ pod_id: string; starts_at: Date | string }[]>`
    select pod_id, starts_at from iris_bookings
    where lower(email) = ${email}
      and status = 'confirmed'
      and starts_at > now()
  `
  const existing = upcoming.map(row => ({
    start: toIso(row.starts_at),
    timeZone: podById(row.pod_id)?.timeZone ?? input.pod.timeZone,
  }))
  if (bookedSameDay(existing, input.start, input.pod.timeZone)) {
    throw new IrisBookingError('same-day', 'Already booked that day')
  }

  for (let attempt = 0; ; attempt++) {
    try {
      const rows = await sql<BookingRow[]>`
        insert into iris_bookings (id, code, pod_id, starts_at, ends_at, experience, name, email, whatsapp, locale)
        values (
          ${randomUUID()}, ${bookingCode()}, ${input.pod.id}, ${input.start}, ${input.end},
          ${input.experience}, ${input.name.trim()}, ${email}, ${input.whatsapp}, ${input.locale}
        )
        returning *
      `
      return fromRow(rows[0])
    } catch (error) {
      const pg = (error ?? {}) as { code?: string; constraint_name?: string }
      if (pg.code !== '23505') throw error
      if (pg.constraint_name === 'iris_bookings_slot_idx') {
        throw new IrisBookingError('taken', 'Slot already taken')
      }
      if (attempt >= 2) throw error
    }
  }
}

export async function cancelBooking(code: string, email: string): Promise<IrisBooking> {
  await ensureIrisTable()
  const sql = getDb()
  const rows = await sql<BookingRow[]>`
    update iris_bookings
    set status = 'cancelled'
    where code = ${code.trim().toUpperCase()}
      and lower(email) = ${email.trim().toLowerCase()}
      and status = 'confirmed'
    returning *
  `
  if (!rows[0]) throw new IrisBookingError('not-found', 'Booking not found')
  return fromRow(rows[0])
}
