'use client'

import { motion } from 'framer-motion'

// 6 pixel squares: 3 top row, 3 bottom row
// Middle row is replaced by the animated pulse line
const SQUARES = [
  [0, 0],  [9, 0],  [18, 0],   // top
  [0, 21], [9, 21], [18, 21],  // bottom
] as const

// ECG-style pulse path through the middle row
const PULSE_PATH = 'M -6 13 L 5 13 L 8 5 L 12 21 L 15 13 L 31 13'

export function AnimatedMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-6 -1 37 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Pixel squares — staggered fade in, then subtle breathe */}
      {SQUARES.map(([x, y], i) => (
        <motion.rect
          key={i}
          x={x}
          y={y}
          width={6}
          height={6}
          rx={0.75}
          fill="white"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 1, 0.85, 1],
            scale: [0.6, 1, 1, 1],
          }}
          transition={{
            duration: 0.5,
            delay: 0.1 + i * 0.07,
            times: [0, 0.5, 0.75, 1],
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Squares breathe continuously after mount */}
      {SQUARES.map(([x, y], i) => (
        <motion.rect
          key={`b-${i}`}
          x={x}
          y={y}
          width={6}
          height={6}
          rx={0.75}
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{
            duration: 3.5,
            delay: 0.8 + i * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Base guide line — very dim */}
      <line
        x1="-6" y1="13" x2="31" y2="13"
        stroke="white"
        strokeWidth="0.6"
        opacity={0.1}
      />

      {/* Animated pulse — draws in, holds, fades, repeats */}
      <motion.path
        d={PULSE_PATH}
        stroke="#6366f1"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animate={{
          pathLength: [0, 1, 1, 1, 0],
          opacity:    [0, 1, 1, 0.7, 0],
        }}
        transition={{
          duration: 3,
          times: [0, 0.38, 0.62, 0.82, 1],
          repeat: Infinity,
          repeatDelay: 1.8,
          ease: 'easeInOut',
        }}
      />

      {/* Traveling bright highlight on top of pulse */}
      <motion.path
        d={PULSE_PATH}
        stroke="white"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        animate={{
          pathLength: [0.12, 0.12, 0.12, 0.12, 0],
          pathOffset: [0, 0, 0.88, 1, 1],
          opacity:    [0, 0.6, 0.4, 0, 0],
        }}
        transition={{
          duration: 3,
          times: [0, 0.38, 0.80, 0.95, 1],
          repeat: Infinity,
          repeatDelay: 1.8,
          ease: 'easeOut',
        }}
      />
    </svg>
  )
}
