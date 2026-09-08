'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, LockKeyhole } from 'lucide-react'

export function ClientLoginForm({
  locale,
  slug,
  accent,
}: {
  locale: string
  slug: string
  accent: string
}) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/client/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      })
      const result = (await response.json()) as { ok: boolean; error?: string }
      if (!response.ok) {
        setError(result.error || 'Senha inválida.')
        return
      }
      router.push(`/${locale}/client/${slug}`)
      router.refresh()
    } catch {
      setError('Não foi possível conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-8">
      <label className="block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Senha
        </span>
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-black/[0.08] bg-white px-4 focus-within:border-neutral-400">
          <LockKeyhole className="h-4 w-4 text-neutral-400" />
          <input
            value={password}
            onChange={event => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            placeholder="Senha deste workspace"
            className="min-w-0 flex-1 bg-transparent py-3.5 text-[14px] text-neutral-800 outline-none placeholder:text-neutral-300"
          />
        </div>
      </label>

      {error && <p className="mt-3 text-[12px] text-rose-700">{error}</p>}

      <button
        type="submit"
        disabled={loading || !password.trim()}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[13px] font-semibold text-white transition disabled:opacity-50"
        style={{ backgroundColor: accent }}
      >
        {loading ? 'Validando…' : 'Entrar'}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  )
}
