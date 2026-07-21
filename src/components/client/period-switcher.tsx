'use client'

/**
 * Links nativos (&lt;a&gt;) forçam navegação completa — o Link do Next/next-intl
 * às vezes não reaplica searchParams nesta rota.
 */
export function PeriodSwitcher({
  base,
  days,
}: {
  base: string
  days: number
}) {
  const options = [
    { d: 30, label: '30 dias' },
    { d: 60, label: '60 dias' },
    { d: 90, label: '90 dias' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map(p => (
        <a
          key={p.d}
          href={`${base}?periodo=${p.d}`}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
            days === p.d
              ? 'bg-neutral-900 text-white border-neutral-900'
              : 'bg-white text-neutral-600 border-black/[0.08] hover:border-neutral-300'
          }`}
        >
          {p.label}
        </a>
      ))}
    </div>
  )
}

export function CacheRefreshLink({
  base,
  days,
  cacheHit,
  cacheFetchedAt,
}: {
  base: string
  days: number
  cacheHit: boolean
  cacheFetchedAt: string
}) {
  const when = new Date(cacheFetchedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <p className="text-[12px] text-neutral-400 mt-3">
      {cacheHit ? `Cache local · atualizado ${when}` : `Buscado do GitHub agora · ${when}`}
      {' · '}
      <a
        href={`${base}?periodo=${days}&refresh=1`}
        className="underline underline-offset-2 hover:text-neutral-700"
      >
        Atualizar agora
      </a>
    </p>
  )
}
