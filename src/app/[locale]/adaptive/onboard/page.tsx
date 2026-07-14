'use client'

import { useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { CLIENT, CLIENT_ID, STAKEHOLDERS } from '@/components/adaptive/data'
import { writeOnboard } from '@/lib/adaptive/storage'
import { ArrowRight } from 'lucide-react'

function maskWhatsApp(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export default function OnboardPage() {
  const locale = useLocale()
  const router = useRouter()
  const base = `/${locale}/adaptive`

  const [stakeholder, setStakeholder] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const person = useMemo(
    () => STAKEHOLDERS.find(s => s.name === stakeholder),
    [stakeholder]
  )

  async function submit() {
    setError('')
    if (!stakeholder) {
      setError('Selecione seu nome na lista.')
      return
    }
    if (whatsapp.replace(/\D/g, '').length < 10) {
      setError('Informe um WhatsApp válido com DDD.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/adaptive/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: CLIENT_ID,
          stakeholder,
          whatsapp: whatsapp.replace(/\D/g, ''),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha ao identificar')

      writeOnboard({
        clientId: CLIENT_ID,
        stakeholder,
        whatsapp: whatsapp.replace(/\D/g, ''),
        areas: person?.areas.join(', '),
        role: person?.role,
      })

      router.push(`${base}/discovery/session`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Adaptive Onboard"
        title={<>Identifique-se<br />para começar</>}
        subtitle="Este convite foi enviado por Diego (Facilitador · Grupo Orfeu). Complete o assessment e escolha um horário presencial de 30 minutos com a PixelPulseLab."
      />

      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[12px] font-semibold">
              {CLIENT.facilitator.initials}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-neutral-900">Convite enviado por {CLIENT.facilitator.name}</p>
              <p className="text-[12px] text-neutral-400">{CLIENT.facilitator.role}</p>
            </div>
          </div>

          <label className="block text-[12px] font-medium text-neutral-500 mb-2">Quem é você?</label>
          <select
            value={stakeholder}
            onChange={e => setStakeholder(e.target.value)}
            className="w-full rounded-xl border border-black/[0.1] bg-neutral-50 px-4 py-3 text-[15px] text-neutral-900 outline-none focus:border-neutral-900 mb-5"
          >
            <option value="">Selecione seu nome…</option>
            {STAKEHOLDERS.map(s => (
              <option key={s.name} value={s.name}>
                {s.name}{s.sponsor ? ' · Sponsor' : ''}{s.facilitator ? ' · Facilitador' : ''}
              </option>
            ))}
          </select>

          {person && (
            <p className="text-[12px] text-neutral-400 mb-5 -mt-2">
              {person.areas.join(' · ')}{person.role ? ` · ${person.role}` : ''}
            </p>
          )}

          <label className="block text-[12px] font-medium text-neutral-500 mb-2">WhatsApp (com DDD)</label>
          <input
            type="tel"
            inputMode="numeric"
            value={whatsapp}
            onChange={e => setWhatsapp(maskWhatsApp(e.target.value))}
            placeholder="(11) 99999-9999"
            className="w-full rounded-xl border border-black/[0.1] bg-neutral-50 px-4 py-3 text-[15px] text-neutral-900 outline-none focus:border-neutral-900"
          />

          <div className="mt-6 rounded-xl bg-neutral-50 border border-neutral-100 p-4">
            <p className="text-[12px] text-neutral-500 leading-relaxed">
              Depois do assessment, você vai agendar uma sessão presencial de 30 minutos com{' '}
              <strong className="text-neutral-800">{CLIENT.meetingHost.name}</strong>
              {' '}({CLIENT.meetingHost.role}). Diego facilita o processo, mas não participa da reunião.
            </p>
          </div>

          {error && (
            <p className="mt-4 text-[13px] text-rose-600">{error}</p>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 disabled:opacity-50 transition-all"
          >
            {loading ? 'Salvando…' : 'Continuar para o Assessment'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="rounded-2xl border border-dashed border-black/[0.08] bg-white/60 p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-2">
            E-mail modelo · Diego
          </p>
          <p className="text-[13px] text-neutral-600 leading-relaxed whitespace-pre-wrap">
{`Olá,

Você foi convidado(a) a participar do Adaptive Assessment™ do ${CLIENT.name}.

1) Acesse: ${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/adaptive/onboard
2) Identifique-se e informe seu WhatsApp
3) Responda as 11 perguntas (~15–20 min)
4) Escolha um horário presencial de 30 minutos

Qualquer dúvida, responda este e-mail.

— ${CLIENT.facilitator.name}
${CLIENT.facilitator.role}`}
          </p>
        </div>
      </Reveal>
    </PageShell>
  )
}
