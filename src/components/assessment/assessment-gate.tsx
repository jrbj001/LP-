'use client'

import { useEffect, useState } from 'react'
import { Reveal } from '@/components/adaptive/ui'
import { Lock, Unlock } from 'lucide-react'

function storageKey(slug: string) {
  return `assessment.${slug}.unlocked`
}

/**
 * Gate de senha da área do cliente. A verificação é client-side, então serve
 * para evitar acesso casual ao link — não substitui autenticação.
 */
export function AssessmentGate({
  slug,
  clientName,
  password,
  children,
}: {
  slug: string
  clientName: string
  password?: string
  children: React.ReactNode
}) {
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!password) {
      setUnlocked(true)
      setReady(true)
      return
    }
    setUnlocked(sessionStorage.getItem(storageKey(slug)) === '1')
    setReady(true)
  }, [slug, password])

  if (!ready) return null
  if (unlocked) return <>{children}</>

  return (
    <PasswordGate
      clientName={clientName}
      password={password!}
      onUnlock={() => {
        sessionStorage.setItem(storageKey(slug), '1')
        setUnlocked(true)
      }}
    />
  )
}

function PasswordGate({
  clientName,
  password,
  onUnlock,
}: {
  clientName: string
  password: string
  onUnlock: () => void
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim().toLowerCase() === password.toLowerCase()) {
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#fafaf8] overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-6 py-16">
        <Reveal className="w-full max-w-sm">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              Assessment · Adaptive Enterprise™
            </p>
            <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight mt-2">
              {clientName}
            </h1>
            <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">
              Conteúdo confidencial. Digite a senha compartilhada pela PixelPulseLab.
            </p>
            <form onSubmit={submit} className="mt-6">
              <input
                type="password"
                value={value}
                onChange={e => { setValue(e.target.value); setError(false) }}
                placeholder="Senha de acesso"
                autoFocus
                className={`w-full rounded-xl border px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors ${
                  error
                    ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400'
                    : 'border-black/[0.08] bg-[#fafaf8] focus:border-neutral-900/30'
                }`}
              />
              {error && (
                <p className="text-[12px] text-rose-600 mt-2">Senha incorreta. Tente novamente.</p>
              )}
              <button
                type="submit"
                className="w-full mt-3 rounded-xl bg-neutral-900 text-white text-[14px] font-medium py-3 hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" strokeWidth={1.75} />
                Acessar assessment
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
