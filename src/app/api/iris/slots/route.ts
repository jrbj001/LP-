import { NextResponse } from 'next/server'
import { hasDatabase } from '@/lib/postgres'
import { podById } from '@/lib/iris/data'
import { generateSlots, podDays } from '@/lib/iris/slots'
import { listTakenStarts } from '@/lib/iris/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const pod = podById(url.searchParams.get('pod'))
  if (!pod) return NextResponse.json({ ok: false, reason: 'pod' }, { status: 404 })
  if (!hasDatabase()) return NextResponse.json({ ok: false, reason: 'database' }, { status: 503 })

  const now = new Date()
  const days = podDays(pod, now)
  const requested = url.searchParams.get('day')
  const day = requested && days.includes(requested) ? requested : days[0]

  try {
    const taken = await listTakenStarts(pod, day)
    return NextResponse.json({ ok: true, pod: pod.id, day, days, slots: generateSlots(pod, day, now, taken) })
  } catch (error) {
    console.error('[iris/slots]', error)
    return NextResponse.json({ ok: false, reason: 'server' }, { status: 500 })
  }
}
