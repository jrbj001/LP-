'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, CornerDownLeft } from 'lucide-react'
import { CLIENT, CLIENT_ID, DISCOVERY_QUESTIONS } from './data'
import type { StoredOnboard } from './data'
import { readOnboard } from '@/lib/adaptive/storage'
import { SessionCalendar } from './session-calendar'

type Phase = 'loading' | 'questions' | 'saving' | 'calendar' | 'done'

export function DiscoveryFlow() {
  const locale = useLocale()
  const router = useRouter()
  const base = `/${locale}/adaptive`
  const total = DISCOVERY_QUESTIONS.length

  const [identity, setIdentity] = useState<StoredOnboard | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [slotLabel, setSlotLabel] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const data = readOnboard()
    if (!data?.stakeholder || !data?.whatsapp) {
      router.replace(`${base}/onboard`)
      return
    }
    setIdentity(data)
    setPhase('questions')
  }, [base, router])

  const current = DISCOVERY_QUESTIONS[index]
  const value = answers[current?.id] ?? ''
  const progress =
    phase === 'done' || phase === 'calendar'
      ? 100
      : Math.round((index / total) * 100)

  const submitAssessment = useCallback(async () => {
    if (!identity) return
    setPhase('saving')
    setError('')
    try {
      const res = await fetch('/api/adaptive/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: CLIENT_ID,
          stakeholder: identity.stakeholder,
          whatsapp: identity.whatsapp,
          answers,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha ao salvar respostas')
      setPhase('calendar')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
      setPhase('questions')
    }
  }, [answers, identity])

  const goNext = useCallback(() => {
    if (index < total - 1) setIndex(i => i + 1)
    else void submitAssessment()
  }, [index, total, submitAssessment])

  const goPrev = useCallback(() => {
    if (index > 0) setIndex(i => i - 1)
  }, [index])

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      goNext()
    }
  }, [goNext])

  if (phase === 'loading') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[13px] text-neutral-400">
        Carregando sessão…
      </div>
    )
  }

  if (phase === 'calendar' && identity) {
    return (
      <SessionCalendar
        identity={identity}
        onBooked={(label) => {
          setSlotLabel(label)
          setPhase('done')
        }}
      />
    )
  }

  if (phase === 'done') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center max-w-md"
        >
          <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-6">
            <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-neutral-900">
            Tudo certo, {identity?.stakeholder?.split(' ')[0]}
          </h2>
          <p className="mt-3 text-[15px] text-neutral-500 leading-relaxed">
            Assessment registrado e sessão presencial confirmada
            {slotLabel ? ` em ${slotLabel}` : ''}.
            Host: {CLIENT.meetingHost.name}. Diego acompanha o processo como facilitador.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href={`${base}/onboarding`} className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 transition-colors">
              Ver Onboarding
            </a>
            <a href={base} className="px-5 py-2.5 rounded-full border border-black/[0.1] text-neutral-700 text-[13px] font-medium hover:bg-black/[0.02] transition-colors">
              Voltar à Home
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  if (phase === 'saving') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[13px] text-neutral-400">
        Salvando respostas no Adaptive Workspace…
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 lg:left-64 h-1 bg-black/[0.05] z-30">
        <motion.div
          className="h-full bg-neutral-900"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between px-6 lg:px-12 pt-8">
        <div>
          <a href={`${base}/onboard`} className="text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors">
            ← Trocar identidade
          </a>
          {identity && (
            <p className="text-[12px] text-neutral-500 mt-1">
              Respondendo como <span className="font-medium text-neutral-800">{identity.stakeholder}</span>
            </p>
          )}
        </div>
        <span className="text-[12px] font-mono text-neutral-400">
          {index + 1} / {total}
        </span>
      </div>

      <div className="flex-1 flex items-center px-6 lg:px-12">
        <div className="max-w-[640px] mx-auto w-full">
          {error && (
            <p className="mb-4 text-[13px] text-rose-600">{error}</p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[13px] font-mono font-medium text-neutral-900">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-300" strokeWidth={2} />
              </div>

              <h2 className="text-[26px] lg:text-[32px] font-semibold tracking-[-0.02em] leading-[1.15] text-neutral-900">
                {current.question}
              </h2>
              <p className="mt-3 text-[14px] text-neutral-400">{current.helper}</p>

              <textarea
                autoFocus
                rows={current.type === 'longtext' ? 3 : 1}
                value={value}
                onChange={e => setAnswers(a => ({ ...a, [current.id]: e.target.value }))}
                onKeyDown={onKey}
                placeholder="Digite sua resposta…"
                className="mt-8 w-full resize-none bg-transparent border-b-2 border-black/[0.1] focus:border-neutral-900 outline-none text-[20px] lg:text-[22px] text-neutral-900 placeholder:text-neutral-300 pb-3 transition-colors"
              />

              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={goNext}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 transition-all"
                >
                  {index === total - 1 ? 'Salvar e agendar' : 'OK'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                </button>
                <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400">
                  pressione <kbd className="px-1.5 py-0.5 rounded border border-black/[0.1] font-mono">⌘</kbd>
                  <CornerDownLeft className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 px-6 lg:px-12 pb-8">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="w-9 h-9 rounded-lg border border-black/[0.1] flex items-center justify-center text-neutral-600 hover:bg-black/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        </button>
        <button
          onClick={goNext}
          className="w-9 h-9 rounded-lg border border-black/[0.1] flex items-center justify-center text-neutral-600 hover:bg-black/[0.03] transition-colors"
        >
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
