import { NextResponse } from 'next/server'
import { hasDatabase } from '@/lib/postgres'
import { experiencesFor, irisLocale, normalizeWhatsapp, podById } from '@/lib/iris/data'
import { resolveSlot } from '@/lib/iris/slots'
import { cancelBooking, createBooking, IrisBookingError } from '@/lib/iris/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function fail(reason: string, status: number) {
  return NextResponse.json({ ok: false, reason }, { status })
}

async function readBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json()
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function POST(req: Request) {
  if (!hasDatabase()) return fail('database', 503)
  const body = await readBody(req)
  if (!body) return fail('invalid', 400)

  const pod = podById(text(body.podId, 64))
  const name = text(body.name, 80)
  const email = text(body.email, 160)
  const whatsapp = normalizeWhatsapp(text(body.whatsapp, 32))
  if (!pod || !name || !EMAIL.test(email) || !whatsapp) return fail('invalid', 400)

  const slot = resolveSlot(pod, text(body.start, 40), new Date())
  if (!slot) return fail('slot', 409)

  const experienceId = text(body.experience, 40)
  const experience = experiencesFor(pod).find(item => item.id === experienceId)?.id ?? null

  try {
    const booking = await createBooking({
      pod,
      start: slot.start,
      end: slot.end,
      experience,
      name,
      email,
      whatsapp,
      locale: irisLocale(text(body.locale, 4)),
    })
    return NextResponse.json({
      ok: true,
      booking: {
        code: booking.code,
        podId: booking.podId,
        start: booking.start,
        end: booking.end,
        time: slot.time,
        experience: booking.experience,
        email: booking.email,
        whatsapp: booking.whatsapp,
      },
    })
  } catch (error) {
    if (error instanceof IrisBookingError) return fail(error.reason, 409)
    console.error('[iris/bookings]', error)
    return fail('server', 500)
  }
}

export async function DELETE(req: Request) {
  if (!hasDatabase()) return fail('database', 503)
  const body = await readBody(req)
  const code = text(body?.code, 16)
  const email = text(body?.email, 160)
  if (!code || !email) return fail('invalid', 400)

  try {
    await cancelBooking(code, email)
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof IrisBookingError) return fail(error.reason, 404)
    console.error('[iris/bookings]', error)
    return fail('server', 500)
  }
}
