'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ClientWorkspace } from '@/lib/client/types'

export function Onboarding({ client }: { client: ClientWorkspace }) {
  const [active, setActive] = useState(0)
  const { steps, eyebrow, title, titleAccent } = client.onboarding
  const step = steps[active]
  const accent = client.accent

  return (
    <section id="onboarding" className="py-20 sm:py-24 border-t border-black/[0.05] scroll-mt-20">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="mb-12">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
            {eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] max-w-xl text-neutral-900">
            {title}{' '}
            <span className="text-neutral-500">{titleAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
          <div className="flex flex-col gap-1.5">
            {steps.map((s, i) => (
              <button
                key={s.number}
                type="button"
                onClick={() => setActive(i)}
                className={`group text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                  active === i
                    ? 'border-black/[0.1] bg-white shadow-sm'
                    : 'border-transparent hover:border-black/[0.06] hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[11px] font-semibold tracking-widest"
                    style={{ color: active === i ? accent : 'rgba(0,0,0,0.25)' }}
                  >
                    {s.number}
                  </span>
                  <span
                    className={`text-[13px] font-medium ${
                      active === i ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-700'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {active === i && (
                  <motion.div
                    className="mt-2.5 h-px w-full origin-left"
                    style={{ backgroundColor: accent }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="relative rounded-2xl border border-black/[0.06] bg-white overflow-hidden min-h-[280px] flex flex-col justify-between p-7 sm:p-8">
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
              style={{ backgroundColor: accent }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="relative z-10 flex flex-col gap-5 h-full"
              >
                <div>
                  <span
                    className="font-mono text-4xl font-black tracking-tighter opacity-20"
                    style={{ color: accent }}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 mt-1">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] text-neutral-500 leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {step.tools.map(tool => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 text-[11px] font-mono tracking-wide rounded-md border border-black/[0.08] text-neutral-500 bg-neutral-50"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5 mt-auto pt-4">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Etapa ${i + 1}`}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: active === i ? 22 : 6,
                        backgroundColor: active === i ? accent : 'rgba(0,0,0,0.12)',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
