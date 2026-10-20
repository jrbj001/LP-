'use client'

import type { IrisCopy, IrisExperience, IrisLocale } from '@/lib/iris/data'

export function ExperienceCards({
  experiences,
  value,
  locale,
  copy,
  onChange,
}: {
  experiences: IrisExperience[]
  value: string | null
  locale: IrisLocale
  copy: IrisCopy
  onChange: (id: string | null) => void
}) {
  const options = [{ id: null, name: copy.decideInPod, benefit: '' }, ...experiences.map(item => ({
    id: item.id,
    name: item.name[locale],
    benefit: item.benefit[locale],
  }))]

  return (
    <div role="radiogroup" aria-label={copy.experience} className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
      {options.map(option => {
        const checked = option.id === value
        return (
          <button
            key={option.id ?? 'pod'}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(option.id)}
            className={[
              'flex min-h-[76px] w-40 shrink-0 snap-start flex-col justify-between rounded-2xl p-3 text-left transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iris-accent)]',
              checked
                ? 'bg-[var(--iris-accent)] text-white'
                : 'border border-[var(--iris-line)] bg-white hover:border-[var(--iris-accent)]',
            ].join(' ')}
          >
            <span className="text-sm font-semibold">{option.name}</span>
            {option.benefit && (
              <span className={`text-xs leading-snug ${checked ? 'text-white/80' : 'text-[var(--iris-muted)]'}`}>
                {option.benefit}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
