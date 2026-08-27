'use client'

import { useEffect, useState } from 'react'
import { Reveal } from '@/components/adaptive/ui'
import { Lock, Unlock } from 'lucide-react'
import { META, SPACE_PASSWORD } from './data'

const STORAGE_KEY = 'datacenter.edge-dc-br.unlocked'

export function DatacenterGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(STORAGE_KEY) === '1')
    setReady(true)
  }, [])

  if (!ready) return null
  if (unlocked) return <>{children}</>

  return (
    <PasswordGate
      onUnlock={() => {
        sessionStorage.setItem(STORAGE_KEY, '1')
        setUnlocked(true)
      }}
    />
  )
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim().toLowerCase() === SPACE_PASSWORD.toLowerCase()) onUnlock()
    else setError(true)
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
              {META.passwordHint}
            </p>
            <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight mt-2">
              {META.title}
            </h1>
            <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">
              Blueprint confidencial. Digite a senha compartilhada pela PixelPulseLab.
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
              {error && <p className="text-[12px] text-rose-600 mt-2">Senha incorreta. Tente novamente.</p>}
              <button
                type="submit"
                className="w-full mt-3 rounded-xl bg-neutral-900 text-white text-[14px] font-medium py-3 hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" strokeWidth={1.75} />
                Acessar blueprint
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
