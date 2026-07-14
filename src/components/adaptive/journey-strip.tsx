'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { readOnboard } from '@/lib/adaptive/storage'
import type { StoredOnboard } from '@/components/adaptive/data'

export type JourneyStepId = 'identify' | 'projects' | 'assessment' | 'schedule'

const STEPS: { id: JourneyStepId; label: string; href: string }[] = [
  { id: 'identify',   label: '1 · Identificar',   href: '/onboard' },
  { id: 'projects',   label: '2 · Meus projetos', href: '/my-area' },
  { id: 'assessment', label: '3 · Assessment',    href: '/discovery/session' },
  { id: 'schedule',   label: '4 · Agendar 30min', href: '/discovery/session' },
]

export function JourneyStrip({ current }: { current: JourneyStepId }) {
  const locale = useLocale()
  const base = `/${locale}/adaptive`
  const [onboard, setOnboard] = useState<StoredOnboard | null>(null)

  useEffect(() => {
    setOnboard(readOnboard())
  }, [])

  const identified = Boolean(onboard?.stakeholder && onboard?.whatsapp)
  const currentIdx = STEPS.findIndex(s => s.id === current)

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 mb-10">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
          Seu percurso no Adaptive
        </p>
        {identified && (
          <p className="text-[11px] text-neutral-500">
            Como <span className="font-medium text-neutral-800">{onboard!.stakeholder}</span>
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {STEPS.map((step, i) => {
          const done = i < currentIdx
          const active = i === currentIdx
          const locked = !identified && step.id !== 'identify'

          const href = locked
            ? `${base}/onboard`
            : step.id === 'assessment' || step.id === 'schedule'
              ? `${base}/discovery/session`
              : `${base}${step.href}`

          return (
            <a
              key={step.id}
              href={href}
              className={`rounded-xl px-3 py-3 text-[12px] font-medium border transition-all ${
                active
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : done
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                    : locked
                      ? 'bg-neutral-50 text-neutral-400 border-neutral-100'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-100 hover:border-neutral-300'
              }`}
            >
              {step.label}
            </a>
          )
        })}
      </div>
      <p className="mt-3 text-[12px] text-neutral-400 leading-relaxed">
        Os projetos do Comitê de TI já estão mapeados. Você se identifica, revisa os seus,
        responde o assessment sobre eles e agenda a sessão presencial.
      </p>
    </div>
  )
}
