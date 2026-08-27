'use client'

import { useEffect, useState } from 'react'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import {
  ACCEPTANCE_CHECKS,
  BANANA_BRASIL_LGPD_NDA,
  LGPD_SECTIONS,
  NDA_SECTIONS,
} from '@/components/assessment/tenants/banana-brasil/lgpd-nda'
import { CheckCircle2, ShieldCheck } from 'lucide-react'

const STORAGE_KEY = `assessment.${BANANA_BRASIL_LGPD_NDA.id}.accepted`

interface AcceptanceRecord {
  name: string
  role: string
  email: string
  acceptedAt: string
}

function readRecord(): AcceptanceRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AcceptanceRecord
    if (!parsed.name || !parsed.acceptedAt) return null
    return parsed
  } catch {
    return null
  }
}

export function LgpdNdaView() {
  const [record, setRecord] = useState<AcceptanceRecord | null>(null)
  const [ready, setReady] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    setRecord(readRecord())
    setReady(true)
  }, [])

  const canSubmit =
    name.trim().length > 1 &&
    role.trim().length > 1 &&
    ACCEPTANCE_CHECKS.every(item => checks[item.id])

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) {
      setError('Preencha nome, cargo e os dois aceites para dar ok.')
      return
    }
    const next: AcceptanceRecord = {
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      acceptedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setRecord(next)
    setError('')
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow={`${BANANA_BRASIL_LGPD_NDA.client} × ${BANANA_BRASIL_LGPD_NDA.consultant}`}
        title={BANANA_BRASIL_LGPD_NDA.title}
        subtitle={BANANA_BRASIL_LGPD_NDA.subtitle}
      />

      <Reveal className="mb-8 flex flex-wrap items-center gap-2">
        <Badge tone="muted">Versão {BANANA_BRASIL_LGPD_NDA.version}</Badge>
        <Badge tone="muted">{BANANA_BRASIL_LGPD_NDA.date}</Badge>
        {record && <Badge tone="green">Ok registrado neste navegador</Badge>}
      </Reveal>

      <Reveal className="mb-10 rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
        <p className="text-[13px] leading-relaxed text-amber-900/80">
          Instrumento de trabalho para o assessment. Não substitui contrato-mestre nem parecer jurídico
          interno. O ok fica gravado neste navegador; a PixelPulseLab pode pedir confirmação por e-mail.
        </p>
      </Reveal>

      <section className="space-y-10">
        <Article title="Acordo de confidencialidade (NDA)" sections={NDA_SECTIONS} />
        <Article title="Autorização LGPD" sections={LGPD_SECTIONS} />
      </section>

      {ready && (
        <Reveal className="mt-12">
          {record ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" strokeWidth={1.75} />
                <div>
                  <p className="text-[15px] font-semibold text-emerald-900">Ok registrado</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-emerald-900/75">
                    {record.name}, {record.role}
                    {record.email ? ` · ${record.email}` : ''}.{' '}
                    {new Date(record.acceptedAt).toLocaleString('pt-BR', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900">
                  <ShieldCheck className="h-5 w-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                    Aceite
                  </p>
                  <h2 className="text-[18px] font-semibold tracking-tight text-neutral-900">
                    Dar ok
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Nome" value={name} onChange={setName} required />
                <Field label="Cargo" value={role} onChange={setRole} required />
                <div className="sm:col-span-2">
                  <Field
                    label="E-mail (opcional)"
                    value={email}
                    onChange={setEmail}
                    type="email"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {ACCEPTANCE_CHECKS.map(item => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.06] bg-[#fafaf8] px-4 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(checks[item.id])}
                      onChange={event =>
                        setChecks(current => ({ ...current, [item.id]: event.target.checked }))
                      }
                      className="mt-1 h-4 w-4 accent-neutral-900"
                    />
                    <span className="text-[13px] leading-relaxed text-neutral-700">{item.label}</span>
                  </label>
                ))}
              </div>

              {error && <p className="mt-4 text-[12px] text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-3 text-[14px] font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                Dar ok
              </button>
            </form>
          )}
        </Reveal>
      )}
    </PageShell>
  )
}

function Article({
  title,
  sections,
}: {
  title: string
  sections: Array<{ title: string; body: string[] }>
}) {
  return (
    <article>
      <h2 className="text-[20px] font-semibold tracking-tight text-neutral-900">{title}</h2>
      <div className="mt-5 space-y-5">
        {sections.map(section => (
          <div key={section.title} className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <h3 className="text-[13px] font-semibold text-neutral-900">{section.title}</h3>
            <div className="mt-3 space-y-3">
              {section.body.map(paragraph => (
                <p key={paragraph.slice(0, 48)} className="text-[13px] leading-relaxed text-neutral-500">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={event => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-[#fafaf8] px-4 py-3 text-[14px] text-neutral-900 outline-none transition focus:border-neutral-900/30"
      />
    </label>
  )
}
