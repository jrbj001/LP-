'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { COPY, PODS, experiencesFor, normalizeWhatsapp, podById, type IrisLocale } from '@/lib/iris/data'
import type { IrisSlot } from '@/lib/iris/slots'
import { Confirmation, type ConfirmedBooking } from './confirmation'
import { ExperienceCards } from './experience-cards'
import { IrisAgent } from './iris-agent'
import { SlotGrid } from './slot-grid'
import { Storyboard } from './storyboard'

const MEMBER_KEY = 'iris.member'

type ErrorKey = 'taken' | 'sameDay' | 'invalid' | 'unavailable' | 'genericError'

function errorKey(reason: unknown): ErrorKey {
  if (reason === 'taken' || reason === 'slot') return 'taken'
  if (reason === 'same-day') return 'sameDay'
  if (reason === 'invalid') return 'invalid'
  if (reason === 'database') return 'unavailable'
  return 'genericError'
}

export function BookingFlow({ locale }: { locale: IrisLocale }) {
  const copy = COPY[locale]
  const pathname = usePathname()
  const [podId, setPodId] = useState(PODS[0].id)
  const [day, setDay] = useState<string | null>(null)
  const [days, setDays] = useState<string[]>([])
  const [slots, setSlots] = useState<IrisSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const [slot, setSlot] = useState<IrisSlot | null>(null)
  const [experience, setExperience] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<ErrorKey | null>(null)
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null)

  const pod = podById(podId) ?? PODS[0]
  const experiences = useMemo(() => experiencesFor(pod), [pod])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MEMBER_KEY) || 'null') as { name?: string; email?: string; whatsapp?: string } | null
      if (saved?.name) setName(saved.name)
      if (saved?.email) setEmail(saved.email)
      if (saved?.whatsapp) setWhatsapp(saved.whatsapp)
    } catch {}
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const query = new URLSearchParams({ pod: podId, ...(day ? { day } : {}) })
    fetch(`/api/iris/slots?${query}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (!data.ok) {
          setSlots([])
          setError(errorKey(data.reason))
          return
        }
        setDays(data.days)
        setSlots(data.slots)
        if (!day) setDay(data.day)
      })
      .catch(err => {
        if ((err as Error).name !== 'AbortError') setError('genericError')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [podId, day, reload])

  const formatDay = useCallback(
    (value: string, style: 'short' | 'long' = 'short') => {
      const index = days.indexOf(value)
      if (style === 'short' && index === 0) return copy.today
      if (style === 'short' && index === 1) return copy.tomorrow
      const date = new Date(`${value}T12:00:00Z`)
      const intl = locale === 'pt' ? 'pt-BR' : 'en-US'
      const label = (
        style === 'long'
          ? new Intl.DateTimeFormat(intl, { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(date)
          : `${new Intl.DateTimeFormat(intl, { weekday: 'short', timeZone: 'UTC' }).format(date)} ${date.getUTCDate()}`
      ).replace(/\./g, '')
      return label.charAt(0).toUpperCase() + label.slice(1)
    },
    [copy.today, copy.tomorrow, days, locale]
  )

  function choosePod(id: string) {
    if (id === podId) return
    setPodId(id)
    setDay(null)
    setSlot(null)
    setError(null)
    const next = podById(id)
    if (next && experience && !experiencesFor(next).some(item => item.id === experience)) setExperience(null)
  }

  function chooseDay(value: string) {
    setDay(value)
    setSlot(null)
    setError(null)
  }

  function applyExperience(id: string) {
    if (experiences.some(item => item.id === id)) setExperience(id)
  }

  async function confirm(event: React.FormEvent) {
    event.preventDefault()
    if (!slot || submitting) return
    if (!normalizeWhatsapp(whatsapp)) {
      setError('invalid')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/iris/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ podId, start: slot.start, experience, name, email, whatsapp, locale }),
      })
      const data = await res.json()
      if (!data.ok) {
        const key = errorKey(data.reason)
        setError(key)
        if (key === 'taken') {
          setSlot(null)
          setReload(value => value + 1)
        }
        return
      }
      localStorage.setItem(MEMBER_KEY, JSON.stringify({ name, email, whatsapp }))
      setBooking(data.booking)
    } catch {
      setError('genericError')
    } finally {
      setSubmitting(false)
    }
  }

  function localeHref(next: IrisLocale) {
    const rest = pathname.replace(/^\/(pt|en|zh)(?=\/|$)/, '') || '/iris'
    return `/${next}${rest.startsWith('/') ? rest : `/${rest}`}`
  }

  function reset() {
    setBooking(null)
    setSlot(null)
    setExperience(null)
    setError(null)
    setReload(value => value + 1)
  }

  return (
    <div className="iris-scope min-h-screen">
      <main className="mx-auto flex max-w-3xl flex-col px-5 pb-28 pt-8 sm:pt-12">
        <header className="max-w-xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--iris-wood)]">OpenSeed · Iris 2027</p>
            <div role="group" aria-label={copy.language} className="flex overflow-hidden rounded-full border border-[var(--iris-line)] bg-white text-[11px] font-medium">
              {(['pt', 'en'] as const).map(code => (
                <a
                  key={code}
                  href={localeHref(code)}
                  hrefLang={code}
                  aria-current={locale === code ? 'true' : undefined}
                  className={`px-2.5 py-1 uppercase tracking-wide transition ${locale === code ? 'bg-[var(--iris-ink)] text-white' : 'text-[var(--iris-muted)] hover:text-[var(--iris-ink)]'}`}
                >
                  {code}
                </a>
              ))}
            </div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{copy.tagline}</h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-[var(--iris-ink)]">{copy.concept}</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--iris-muted)]">{copy.materials}</p>
          <a
            href="#booking"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--iris-ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            {copy.bookCta}
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </header>

        <Storyboard locale={locale} label={copy.story} />

        <section id="booking" className="mt-14 scroll-mt-8">
          <h2 className="text-2xl font-semibold tracking-tight">{copy.title}</h2>
          <p className="mt-2 max-w-lg text-[var(--iris-muted)]">{copy.subtitle}</p>
        <div className="mt-6 rounded-[28px] border border-[var(--iris-line)] bg-[var(--iris-card)] p-5 shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_40px_-24px_rgba(29,36,33,0.25)] sm:p-7">
          <AnimatePresence mode="wait" initial={false}>
            {booking ? (
              <Confirmation
                key="done"
                booking={booking}
                pod={pod}
                dayLabel={formatDay(day ?? days[0], 'long')}
                locale={locale}
                copy={copy}
                onReset={reset}
              />
            ) : (
              <motion.div key="flow" exit={{ opacity: 0, y: -8 }} className="space-y-8">
                <Step index={1} label={copy.stepPod}>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {PODS.map(item => {
                      const active = item.id === podId
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => choosePod(item.id)}
                          className={[
                            'rounded-2xl p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iris-accent)]',
                            active
                              ? 'bg-[var(--iris-ink)] text-white'
                              : 'border border-[var(--iris-line)] bg-white hover:border-[var(--iris-ink)]',
                          ].join(' ')}
                        >
                          <span className="block text-sm font-semibold">{item.name}</span>
                          <span className={`mt-1 flex items-center gap-1 text-xs ${active ? 'text-white/70' : 'text-[var(--iris-muted)]'}`}>
                            <MapPin className="size-3" aria-hidden />
                            {item.place[locale]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="tablist">
                    {days.map(value => {
                      const active = value === day
                      return (
                        <button
                          key={value}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => chooseDay(value)}
                          className={[
                            'shrink-0 rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iris-accent)]',
                            active ? 'bg-[var(--iris-accent-soft)] font-semibold text-[var(--iris-accent)]' : 'text-[var(--iris-muted)] hover:text-[var(--iris-ink)]',
                          ].join(' ')}
                        >
                          {formatDay(value)}
                        </button>
                      )
                    })}
                  </div>
                </Step>

                <Step index={2} label={copy.stepTime} hint={`${copy.podTime} · ${copy.sessionLength}`}>
                  <SlotGrid
                    slots={slots}
                    selected={slot?.start ?? null}
                    loading={loading}
                    copy={copy}
                    onSelect={value => {
                      setSlot(value)
                      setError(null)
                    }}
                  />
                </Step>

                <AnimatePresence initial={false}>
                  {slot && (
                    <motion.form
                      key="you"
                      onSubmit={confirm}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Step index={3} label={copy.stepYou}>
                        <div className="space-y-5">
                          <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--iris-muted)]">{copy.experience}</p>
                            <ExperienceCards experiences={experiences} value={experience} locale={locale} copy={copy} onChange={setExperience} />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Field label={copy.name} value={name} onChange={setName} autoComplete="name" className="sm:col-span-2" />
                            <Field label={copy.email} value={email} onChange={setEmail} autoComplete="email" type="email" />
                            <Field
                              label={copy.whatsapp}
                              value={whatsapp}
                              onChange={setWhatsapp}
                              autoComplete="tel"
                              type="tel"
                              inputMode="tel"
                              placeholder={copy.whatsappPlaceholder}
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={submitting || !name.trim() || !email.trim() || !normalizeWhatsapp(whatsapp)}
                            className="group flex w-full items-center justify-between rounded-2xl bg-[var(--iris-accent)] px-5 py-4 text-left text-white transition hover:brightness-110 disabled:opacity-50"
                          >
                            <span>
                              <span className="block text-base font-semibold">{submitting ? copy.confirming : copy.confirm}</span>
                              <span className="block text-sm text-white/75">
                                {day ? formatDay(day, 'long') : ''}, {slot.time} · {pod.name}
                              </span>
                            </span>
                            <ArrowRight className="size-5 transition group-hover:translate-x-0.5" aria-hidden />
                          </button>
                        </div>
                      </Step>
                    </motion.form>
                  )}
                </AnimatePresence>

                {error && (
                  <p role="alert" className="rounded-xl bg-[var(--iris-accent-soft)] px-4 py-3 text-sm text-[var(--iris-ink)]">
                    {copy[error]}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </section>

        <p className="mt-6 text-center text-xs text-[var(--iris-muted)]">{copy.footer}</p>
      </main>

      <IrisAgent locale={locale} podId={podId} copy={copy} onUseExperience={booking ? undefined : applyExperience} />
    </div>
  )
}

function Step({ index, label, hint, children }: { index: number; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-5 place-items-center rounded-full bg-[var(--iris-ink)] text-[10px] text-white">{index}</span>
          {label}
        </h2>
        {hint && <span className="text-xs text-[var(--iris-muted)]">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  placeholder,
  inputMode,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
  placeholder?: string
  inputMode?: 'tel' | 'email' | 'text'
  className?: string
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--iris-muted)]">{label}</span>
      <input
        type={type}
        value={value}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={event => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-[var(--iris-line)] bg-white px-4 text-base outline-none transition focus:border-[var(--iris-accent)] focus:ring-2 focus:ring-[var(--iris-accent-soft)]"
      />
    </label>
  )
}
