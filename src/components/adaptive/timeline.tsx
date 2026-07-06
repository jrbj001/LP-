'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { TIMELINE } from './data'

export function Timeline() {
  return (
    <div className="relative">
      {/* Desktop: horizontal */}
      <div className="hidden md:grid grid-cols-5 gap-3">
        {TIMELINE.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            className="relative"
          >
            {/* Connector line */}
            {i < TIMELINE.length - 1 && (
              <div className="absolute top-3 left-[calc(50%+16px)] right-[-12px] h-px bg-black/[0.08]" />
            )}

            <div className="flex flex-col items-center text-center">
              <Dot status={step.status} />
              <p className={`mt-4 text-[13px] font-semibold ${step.status === 'upcoming' ? 'text-neutral-400' : 'text-neutral-900'}`}>
                {step.title}
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-400 px-1">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden flex flex-col gap-6">
        {TIMELINE.map((step, i) => (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <Dot status={step.status} />
              {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-black/[0.08] mt-1" />}
            </div>
            <div className="pb-2">
              <p className={`text-[13px] font-semibold ${step.status === 'upcoming' ? 'text-neutral-400' : 'text-neutral-900'}`}>
                {step.title}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-neutral-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Dot({ status }: { status: 'done' | 'active' | 'upcoming' }) {
  if (status === 'done') {
    return (
      <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center z-10">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
      </div>
    )
  }
  if (status === 'active') {
    return (
      <div className="relative w-6 h-6 flex items-center justify-center z-10">
        <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
        <span className="relative w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-white" />
        </span>
      </div>
    )
  }
  return (
    <div className="w-6 h-6 rounded-full border-2 border-black/[0.12] bg-white z-10 flex items-center justify-center">
      <span className="w-1.5 h-1.5 rounded-full bg-black/15" />
    </div>
  )
}
