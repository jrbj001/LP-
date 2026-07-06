'use client'

import { motion } from 'framer-motion'

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[880px] mx-auto px-6 lg:px-12 py-14 lg:py-20">{children}</div>
}

export function PageHeader({
  eyebrow, title, subtitle,
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mb-12"
    >
      {eyebrow && (
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl lg:text-[42px] font-semibold tracking-[-0.03em] leading-[1.08] text-neutral-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-5 text-[17px] leading-relaxed text-neutral-500 max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.header>
  )
}

export function Reveal({
  children, delay = 0, className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'green' | 'amber' | 'muted' }) {
  const tones = {
    neutral: 'bg-neutral-900 text-white',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border border-amber-100',
    muted: 'bg-black/[0.04] text-neutral-500',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}
