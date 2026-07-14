'use client'

import { motion } from 'framer-motion'

/**
 * Geek mark: terminal tile + pixel waveform + blinking cursor.
 */
export function AnimatedMark({ className }: { className?: string }) {
  const bars = [
    { x: 5, base: 4 },
    { x: 8.2, base: 7 },
    { x: 11.4, base: 11 },
    { x: 14.6, base: 6 },
    { x: 17.8, base: 9 },
    { x: 21, base: 5 },
  ]

  return (
    <svg
      viewBox="0 0 28 28"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="28" height="28" rx="6" fill="#171717" />
      {/* title-bar dots */}
      <circle cx="7" cy="7" r="1.1" fill="#525252" />
      <circle cx="10.5" cy="7" r="1.1" fill="#525252" />
      <circle cx="14" cy="7" r="1.1" fill="#525252" />
      {/* content shelf */}
      <rect x="4" y="10" width="20" height="1" fill="#262626" />

      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          width={2.4}
          rx={0.5}
          fill="#f5f5f4"
          initial={{ height: b.base, y: 22 - b.base }}
          animate={{
            height: [b.base, Math.min(b.base + 4, 12), Math.max(b.base - 2, 2), b.base],
            y: [
              22 - b.base,
              22 - Math.min(b.base + 4, 12),
              22 - Math.max(b.base - 2, 2),
              22 - b.base,
            ],
          }}
          transition={{
            duration: 2.2 + i * 0.12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}

      <motion.rect
        x="22"
        y="19.2"
        width="2.2"
        height="2.8"
        rx={0.35}
        fill="#a3a3a3"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1.05, repeat: Infinity, times: [0, 0.48, 0.52, 1] }}
      />
    </svg>
  )
}
