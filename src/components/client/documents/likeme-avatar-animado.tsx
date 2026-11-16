'use client'

import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { AvatarState, BlobState, Pulse } from './likeme-avatar-animado-data'

const WIDTH = 240
const HEIGHT = 360
const RX = 74
const RY = 67
const POINTS = 16
const SEEDS = [0, 2.1, 4.2]

type Point = [number, number]

function squirclePoints(cx: number, cy: number, wobble: number, seed: number): Point[] {
  const amplitude = 0.012 + wobble * 0.07
  return Array.from({ length: POINTS }, (_, i) => {
    const theta = (i / POINTS) * Math.PI * 2
    const cos = Math.cos(theta)
    const sin = Math.sin(theta)
    const r = 1 + amplitude * Math.sin(3 * theta + seed) + amplitude * 0.6 * Math.sin(5 * theta + seed * 1.7)
    return [
      cx + Math.sign(cos) * Math.sqrt(Math.abs(cos)) * RX * r,
      cy + Math.sign(sin) * Math.sqrt(Math.abs(sin)) * RY * r,
    ]
  })
}

function smoothClosedPath(points: Point[]): string {
  const n = points.length
  const at = (i: number) => points[(i + n) % n]
  const f = (v: number) => v.toFixed(2)
  let d = `M ${f(points[0][0])} ${f(points[0][1])}`
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return `${d} Z`
}

const BREATH: Record<Pulse, number[]> = {
  expand: [1, 1.06, 1],
  contract: [1, 0.95, 1],
  steady: [1, 1.025, 1],
}

function Blob({ blob, cy, reduced }: { blob: BlobState; cy: number; reduced: boolean }) {
  const uid = useId().replace(/:/g, '')
  const paths = SEEDS.map(seed => smoothClosedPath(squirclePoints(WIDTH / 2, cy, blob.wobble, seed)))
  const loop = { duration: blob.breathSeconds, repeat: Infinity, ease: 'easeInOut' as const }
  const glowPeak = 0.25 + blob.saturation * 0.6

  return (
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      initial={false}
      animate={{ scale: blob.scale }}
      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
    >
      <defs>
        <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <motion.stop offset="0%" initial={false} animate={{ stopColor: blob.colors.from }} transition={{ duration: 0.8 }} />
          <motion.stop offset="100%" initial={false} animate={{ stopColor: blob.colors.to }} transition={{ duration: 0.8 }} />
        </linearGradient>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={reduced ? undefined : { scale: BREATH[blob.pulse] }}
        transition={loop}
      >
        <motion.path
          d={paths[0]}
          fill={blob.colors.glow}
          filter={`url(#glow-${uid})`}
          initial={false}
          animate={reduced ? { opacity: glowPeak } : { opacity: [glowPeak * 0.55, glowPeak, glowPeak * 0.55] }}
          transition={reduced ? { duration: 0.6 } : loop}
        />
        <motion.path
          d={paths[0]}
          fill={`url(#fill-${uid})`}
          animate={reduced ? { d: paths[0] } : { d: [...paths, paths[0]] }}
          transition={reduced ? { duration: 0.6 } : { ...loop, duration: blob.breathSeconds * 2 }}
        />
        <motion.path
          d={paths[0]}
          fill={`url(#sheen-${uid})`}
          animate={reduced ? { d: paths[0] } : { d: [...paths, paths[0]] }}
          transition={reduced ? { duration: 0.6 } : { ...loop, duration: blob.breathSeconds * 2 }}
        />
      </motion.g>
    </motion.g>
  )
}

export function LikeMeAnimatedAvatar({
  state,
  className = '',
  labelClassName = 'text-neutral-500',
}: {
  state: AvatarState
  className?: string
  labelClassName?: string
}) {
  const reduced = useReducedMotion() ?? false
  const uid = useId().replace(/:/g, '')
  const mindY = 95
  const bodyY = 265

  return (
    <div className={`flex flex-col items-center font-[family-name:var(--font-cadence-body)] ${className}`}>
      <p className={`text-[15px] tracking-[0.02em] ${labelClassName}`}>MENTE</p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full max-w-[240px] overflow-visible"
        role="img"
        aria-label={`Avatar na fase ${state.phase}: mente ${Math.round(state.mind.level)}%, corpo ${Math.round(state.body.level)}%`}
      >
        <defs>
          <filter id={`link-${uid}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
        <motion.ellipse
          cx={WIDTH / 2}
          cy={(mindY + bodyY) / 2}
          rx={46}
          ry={34}
          fill="#F1F0A8"
          filter={`url(#link-${uid})`}
          initial={false}
          animate={
            reduced
              ? { opacity: state.link * 0.8 }
              : { opacity: [state.link * 0.35, state.link * 0.85, state.link * 0.35] }
          }
          transition={reduced ? { duration: 0.6 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Blob blob={state.mind} cy={mindY} reduced={reduced} />
        <Blob blob={state.body} cy={bodyY} reduced={reduced} />
      </svg>
      <p className={`text-[15px] tracking-[0.02em] ${labelClassName}`}>CORPO</p>
    </div>
  )
}
