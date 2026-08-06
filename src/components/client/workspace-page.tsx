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
    <header className="mb-9">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-800 transition-colors mb-7"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Visão geral
      </Link>
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-2">
        {eyebrow}
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-neutral-900">
        {title}
      </h1>
      <p className="mt-3 text-[14px] sm:text-[15px] text-neutral-500 leading-relaxed max-w-2xl">
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
