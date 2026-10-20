'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarPlus, Check, RotateCcw, X } from 'lucide-react'
import { experienceById, formatWhatsapp, type IrisCopy, type IrisLocale, type IrisPod } from '@/lib/iris/data'
import { buildIcs } from '@/lib/iris/slots'

export interface ConfirmedBooking {
  code: string
  start: string
  end: string
  time: string
  experience: string | null
  email: string
  whatsapp: string | null
}

export function Confirmation({
  booking,
  pod,
  dayLabel,
  locale,
  copy,
  onReset,
}: {
  booking: ConfirmedBooking
  pod: IrisPod
  dayLabel: string
  locale: IrisLocale
  copy: IrisCopy
  onReset: () => void
}) {
  const [cancel, setCancel] = useState<'idle' | 'working' | 'done' | 'error'>('idle')
  const experience = experienceById(booking.experience)
  const experienceName = experience ? experience.name[locale] : copy.decideInPod

  function downloadIcs() {
    const ics = buildIcs({
      code: booking.code,
      start: booking.start,
      end: booking.end,
      title: `Iris · ${experienceName}`,
      location: `${pod.name}, ${pod.place[locale]}`,
      description: `${copy.code}: ${booking.code}\n${copy.tips.join('\n')}`,
    })
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `iris-${booking.code}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function cancelBooking() {
    setCancel('working')
    try {
      const res = await fetch('/api/iris/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: booking.code, email: booking.email }),
      })
      setCancel(res.ok ? 'done' : 'error')
    } catch {
      setCancel('error')
    }
  }

  if (cancel === 'done') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
        <p className="text-lg">{copy.cancelled}</p>
        <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-full bg-[var(--iris-ink)] px-5 py-3 text-sm font-medium text-white">
          <RotateCcw className="size-4" aria-hidden />
          {copy.bookAnother}
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
      <div className="flex items-center gap-4">
        <motion.span
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--iris-accent)] text-white"
        >
          <Check className="size-6" aria-hidden />
        </motion.span>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{copy.booked}</h2>
          <p className="text-sm text-[var(--iris-muted)]">{copy.bookedBody}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--iris-line)] bg-[var(--iris-line)] text-sm">
        {[
          [copy.stepTime, `${dayLabel}, ${booking.time}`, ''],
          [copy.stepPod, pod.name, ''],
          [copy.experience, experienceName, ''],
          [copy.whatsapp, booking.whatsapp ? formatWhatsapp(booking.whatsapp) : '', ''],
          [copy.code, booking.code, 'col-span-2'],
        ]
          .filter(([, value]) => value)
          .map(([label, value, span]) => (
          <div key={label} className={`bg-white p-4 ${span}`}>
            <dt className="text-xs uppercase tracking-wide text-[var(--iris-muted)]">{label}</dt>
            <dd className={`mt-1 font-medium ${label === copy.code ? 'font-mono tracking-wider' : ''}`}>{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="space-y-2 text-sm text-[var(--iris-muted)]">
        {copy.tips.map(tip => (
          <li key={tip} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--iris-wood)]" aria-hidden />
            {tip}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={downloadIcs} className="inline-flex items-center gap-2 rounded-full bg-[var(--iris-ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black">
          <CalendarPlus className="size-4" aria-hidden />
          {copy.addCalendar}
        </button>
        <button
          type="button"
          onClick={cancelBooking}
          disabled={cancel === 'working'}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--iris-line)] px-5 py-3 text-sm font-medium text-[var(--iris-muted)] transition hover:border-red-300 hover:text-red-700 disabled:opacity-60"
        >
          <X className="size-4" aria-hidden />
          {cancel === 'working' ? copy.cancelling : copy.cancel}
        </button>
      </div>
      {cancel === 'error' && <p role="alert" className="text-sm text-red-700">{copy.genericError}</p>}
    </motion.div>
  )
}
