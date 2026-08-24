'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, LockKeyhole } from 'lucide-react'

export function AlquimiaLoginForm({ locale }: { locale: string }) {
  const router = useRouter()
  const [accessType, setAccessType] = useState<'partner' | 'client'>('partner')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/alquimia/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessType, password }),
      })
      const result = (await response.json()) as { ok: boolean; error?: string }
      if (!response.ok) {
        setError(result.error || 'Código de acesso inválido.')
        return
      }
      router.push(`/${locale}/alquimia/space`)
      router.refresh()
    } catch {
      setError('Não foi possível conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-8">
      <div className="grid grid-cols-2 rounded-xl bg-black/[0.04] p-1">
        {(
          [
            ['partner', 'Time Alquemia'],
            ['client', 'Cliente'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setAccessType(value)
              setError('')
            }}
            className={`rounded-lg px-3 py-2.5 text-[12px] font-semibold transition ${
              accessType === value
                ? 'bg-white text-[#00435D] shadow-sm'
                : 'text-black/45 hover:text-black/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="mt-6 block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
          Código de acesso
        </span>
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 focus-within:border-[#00435D]/40">
          <LockKeyhole className="h-4 w-4 text-[#00435D]/55" />
          <input
            value={password}
            onChange={event => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            placeholder={accessType === 'partner' ? 'Código do time' : 'Código do seu workspace'}
            className="min-w-0 flex-1 bg-transparent py-3.5 text-[14px] text-black outline-none placeholder:text-black/25"
          />
        </div>
      </label>

      {error && <p className="mt-3 text-[12px] text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00435D] px-5 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#003449] disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? 'Validando…' : 'Entrar no space'}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  )
}
