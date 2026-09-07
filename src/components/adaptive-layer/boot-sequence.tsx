'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BOOT } from './lp-data'

const LINE_MS = 900
const HOLD_MS = 5200

/**
 * Terminal window that "boots" the OS — same chrome as the AnimatedMark
 * (dark tile, title-bar dots), JetBrains Mono lines revealed in sequence.
 */
export function BootSequence() {
  const reduce = useReducedMotion()
  // steps: 0 = prompt only; 1..lines.length = lines; +1 = ready badge
  const total = BOOT.lines.length + 2
  const [step, setStep] = useState(reduce ? total - 1 : 0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(
      () => setStep(s => (s + 1 > total - 1 ? 0 : s + 1)),
      LINE_MS,
    )
    return () => window.clearInterval(id)
  }, [reduce, total])

  // pause on the final frame: when complete, stretch by skipping ticks
  const [holding, setHolding] = useState(false)
  useEffect(() => {
    if (reduce) return
    if (step === total - 1) {
      setHolding(true)
      const id = window.setTimeout(() => setHolding(false), HOLD_MS)
      return () => window.clearTimeout(id)
    }
  }, [step, total, reduce])

  const effectiveStep = holding ? total - 1 : step
  const done = effectiveStep >= total - 1

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-[#171717] font-mono text-[12.5px] leading-relaxed shadow-[0_24px_64px_-32px_rgba(0,0,0,0.45)]">
      {/* title bar — same language as the AnimatedMark */}
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="h-[7px] w-[7px] rounded-full bg-neutral-600" />
        <span className="h-[7px] w-[7px] rounded-full bg-neutral-600" />
        <span className="h-[7px] w-[7px] rounded-full bg-neutral-600" />
        <span className="ml-2 text-[11px] text-white/30">{BOOT.title}</span>
        {done && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-emerald-400/80">
            <motion.span
              className="h-[6px] w-[6px] rounded-full bg-emerald-400"
              animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {BOOT.ready}
          </span>
        )}
      </div>

      <div className="min-h-[176px] px-4 py-4">
        <p className="text-white/85">{BOOT.prompt}</p>
        {BOOT.lines.map((line, i) => {
          const visible = effectiveStep >= i + 1
          return (
            <motion.p
              key={line}
              initial={false}
              animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 4 }}
              transition={{ duration: 0.25 }}
              className="mt-1.5 text-white/45"
            >
              <span className="text-emerald-400/80">{line.slice(0, 1)}</span>
              {line.slice(1)}
            </motion.p>
          )
        })}
        <p className="mt-1.5 text-white/85">
          {done ? '$ ' : ''}
          <motion.span
            className="inline-block h-[13px] w-[7px] translate-y-[2px] bg-neutral-400"
            animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.05, repeat: Infinity, times: [0, 0.48, 0.52, 1] }}
          />
        </p>
      </div>
    </div>
  )
}
