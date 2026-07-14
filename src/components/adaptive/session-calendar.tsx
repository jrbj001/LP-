'use client'

import { useEffect, useMemo, useState } from 'react'
import { CLIENT, CLIENT_ID } from './data'
import type { StoredOnboard } from './data'
import { Check } from 'lucide-react'

interface SlotOption {
  id: string
  start: string
  end: string
  label: string
}

export function SessionCalendar({
  identity,
  onBooked,
}: {
  identity: StoredOnboard
  onBooked: (label: string) => void
}) {
  const [slots, setSlots] = useState<SlotOption[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [selected, setSelected] = useState<string>('')
  const [error, setError] = useState('')
  const [doneLabel, setDoneLabel] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/adaptive/slots?clientId=${CLIENT_ID}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Falha ao carregar horários')
        if (!cancelled) setSlots(data.slots || [])
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erro ao carregar agenda')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const byDay = useMemo(() => {
    const map = new Map<string, SlotOption[]>()
    for (const s of slots) {
      const day = s.start.slice(0, 10)
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(s)
    }
    return [...map.entries()]
  }, [slots])

  async function book() {
    if (!selected) {
      setError('Selecione um horário')
      return
    }
    setBooking(true)
    setError('')
    try {
      const res = await fetch('/api/adaptive/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: CLIENT_ID,
          stakeholder: identity.stakeholder,
          whatsapp: identity.whatsapp,
          sessionId: selected,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Não foi possível reservar')
      setDoneLabel(data.label)
      onBooked(data.label)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao reservar')
    } finally {
      setBooking(false)
    }
  }

  if (doneLabel) {
    return (
      <div className="text-center max-w-md mx-auto py-16 px-6">
        <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6">
          <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-[24px] font-semibold text-neutral-900">Sessão reservada</h2>
        <p className="mt-3 text-[15px] text-neutral-500 leading-relaxed">
          {doneLabel}<br />
          Presencial · com {CLIENT.meetingHost.name}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[720px] mx-auto px-6 py-12">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">
        Agenda · 30 minutos presenciais
      </p>
      <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-neutral-900 mb-2">
        Escolha data e horário
      </h2>
      <p className="text-[14px] text-neutral-500 mb-8 leading-relaxed">
        Sessão presencial com <strong className="text-neutral-800">{CLIENT.meetingHost.name}</strong>
        {' '}({CLIENT.meetingHost.role}). Diego facilita o onboarding, mas não participa desta reunião.
      </p>

      {loading && <p className="text-[13px] text-neutral-400">Carregando horários disponíveis…</p>}

      {!loading && byDay.length === 0 && (
        <p className="text-[13px] text-neutral-500">
          Nenhum horário disponível no momento. Avise Diego ou a PixelPulseLab para abrir novas datas.
        </p>
      )}

      <div className="flex flex-col gap-6 mb-8">
        {byDay.map(([day, daySlots]) => (
          <div key={day}>
            <p className="text-[13px] font-semibold text-neutral-900 mb-3">
              {new Date(`${day}T12:00:00`).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              {daySlots.map(s => {
                const time = new Date(s.start).toLocaleTimeString('pt-BR', {
                  timeZone: 'America/Sao_Paulo',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                const active = selected === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${
                      active
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-black/[0.1] hover:border-neutral-400'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-[13px] text-rose-600 mb-4">{error}</p>}

      <button
        onClick={book}
        disabled={booking || !selected}
        className="px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 disabled:opacity-40 transition-all"
      >
        {booking ? 'Reservando…' : 'Confirmar horário'}
      </button>
    </div>
  )
}
