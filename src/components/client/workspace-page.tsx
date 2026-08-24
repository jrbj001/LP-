import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function WorkspacePageHeader({
  eyebrow,
  title,
  description,
  backHref,
}: {
  eyebrow: string
  title: string
  description: string
  backHref: string
}) {
  return (
    <header className="mb-8 border-b border-black/[0.06] pb-7">
      <Link
        href={backHref}
        className="mb-5 inline-flex items-center gap-1.5 text-[10px] font-medium text-neutral-400 transition-colors hover:text-neutral-800"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Visão geral
      </Link>
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-teal-700">
        {eyebrow}
      </p>
      <h1 className="font-[family-name:var(--font-cadence-display)] text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-neutral-500 sm:text-[14px]">
        {description}
      </p>
    </header>
  )
}

export function EmptyWorkspaceState({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}) {
  return (
    <div className="rounded-2xl border border-dashed border-black/[0.1] bg-white px-6 py-14 text-center">
      <div className="mx-auto w-11 h-11 rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center">
        <Icon className="w-5 h-5" strokeWidth={1.6} />
      </div>
      <h2 className="mt-4 text-[15px] font-semibold text-neutral-800">{title}</h2>
      <p className="mt-1.5 text-[13px] text-neutral-400 max-w-md mx-auto leading-relaxed">{description}</p>
    </div>
  )
}
