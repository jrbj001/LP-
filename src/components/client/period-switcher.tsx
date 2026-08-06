'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const OPTIONS = [30, 60, 90]

function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block w-3 h-3 border-[1.5px] border-current border-t-transparent rounded-full animate-spin ${className}`}
      aria-hidden
    />
  )
}

export function PeriodSwitcher({ base, days }: { base: string; days: number }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [target, setTarget] = useState<number | null>(null)

  function select(next: number) {
    if (next === days || pending) return
    setTarget(next)
    startTransition(() => {
      router.push(`${base}?periodo=${next}`)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-busy={pending}>
      {OPTIONS.map(d => {
        const active = days === d
        const loading = pending && target === d
        return (
          <button
            key={d}
            type="button"
            onClick={() => select(d)}
            disabled={pending}
            aria-current={active ? 'page' : undefined}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors inline-flex items-center gap-1.5 disabled:cursor-progress ${
              active
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-600 border-black/[0.08] hover:border-neutral-300'
            } ${pending && !loading ? 'opacity-50' : ''}`}
          >
            {loading && <Spinner />}
            {d} dias
          </button>
        )
      })}
    </div>
  )
}

export function CacheRefreshLink({
  base,
  days,
  cacheHit,
  cacheStale,
  cacheFetchedAt,
}: {
  base: string
  days: number
  cacheHit: boolean
  cacheStale?: boolean
  cacheFetchedAt: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const when = new Date(cacheFetchedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  const origin = cacheHit
    ? cacheStale
      ? `Cache local de ${when} · buscando merges novos em segundo plano`
      : `Cache local · atualizado ${when}`
    : `Buscado do GitHub agora · ${when}`

  function refresh() {
    startTransition(() => {
      router.push(`${base}?periodo=${days}&refresh=1`)
      router.refresh()
    })
  }

  return (
    <p className="text-[12px] text-neutral-400 mt-3 flex flex-wrap items-center gap-1.5">
      <span>{origin}</span>
      <span aria-hidden>·</span>
      <button
        type="button"
        onClick={refresh}
        disabled={pending}
        className="underline underline-offset-2 hover:text-neutral-700 inline-flex items-center gap-1.5 disabled:cursor-progress"
      >
        {pending && <Spinner />}
        {pending ? 'Consultando GitHub…' : 'Atualizar agora'}
      </button>
    </p>
  )
}
