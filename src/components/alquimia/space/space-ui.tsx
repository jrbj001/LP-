import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'

export function SpacePage({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9 xl:px-10">
      <header className="flex flex-col gap-5 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3A5976]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.045em] text-[#003b52]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-black/50 sm:text-[14px]">
            {description}
          </p>
        </div>
        {action}
      </header>
      <div className="pt-7">{children}</div>
    </div>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  detail,
}: {
  eyebrow?: string
  title: string
  detail?: string
}) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#3A5976]">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.02em] text-[#003b52]">
          {title}
        </h2>
      </div>
      {detail && <p className="text-[11px] text-black/35">{detail}</p>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  detail,
  tone = 'blue',
}: {
  label: string
  value: string
  detail?: string
  tone?: 'blue' | 'gold' | 'lilac' | 'neutral'
}) {
  const tones = {
    blue: 'bg-[#00435D] text-white',
    gold: 'bg-[#E0CE7A] text-[#002f42]',
    lilac: 'bg-[#AEADCC] text-[#1d2940]',
    neutral: 'border border-black/[0.07] bg-white text-[#003b52]',
  }
  return (
    <article className={`min-h-32 rounded-2xl p-5 ${tones[tone]}`}>
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] opacity-55">{label}</p>
      <p className="mt-4 text-[31px] font-medium leading-none tracking-[-0.04em]">{value}</p>
      {detail && <p className="mt-3 text-[11px] leading-relaxed opacity-60">{detail}</p>}
    </article>
  )
}

export function EmptyAction({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-black/15 bg-white/45 px-6 py-10 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#00435D]/8">
        <Icon className="h-4 w-4 text-[#00435D]" />
      </div>
      <h3 className="mt-4 text-[14px] font-semibold text-[#003b52]">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[12px] leading-relaxed text-black/40">{description}</p>
    </div>
  )
}

export function ProgressBar({
  value,
  className = '',
}: {
  value: number
  className?: string
}) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-black/[0.07] ${className}`}>
      <div
        className="h-full rounded-full bg-[#00435D]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function TextLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#00435D] hover:underline"
    >
      {children}
      <ArrowUpRight className="h-3 w-3" />
    </a>
  )
}
