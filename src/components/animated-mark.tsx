'use client'

import { motion, useAnimation, type AnimationControls } from 'framer-motion'
import { useEffect, useState } from 'react'

// ─── Rubik's Cube Colors ──────────────────────────────────────────────────────
const C = {
  R: '#ef4444',  // red    – front
  O: '#f97316',  // orange – back
  W: '#f1f5f9',  // white  – top
  Y: '#facc15',  // yellow – bottom
  B: '#3b82f6',  // blue   – right (+x)
  G: '#16a34a',  // green  – left  (-x)
} as const

// ─── Types ────────────────────────────────────────────────────────────────────
type Ax = -1 | 0 | 1

interface Cubie {
  id:  number
  cx: Ax; cy: Ax; cz: Ax
  px?: string; nx?: string  // right / left sticker
  py?: string; ny?: string  // top   / bottom sticker
  pz?: string; nz?: string  // front / back sticker
}

type Move = { col: Ax; dir: 1 | -1 }

// ─── Cube state machine ───────────────────────────────────────────────────────
function buildSolved(): Cubie[] {
  const out: Cubie[] = []
  let id = 0
  for (const cx of [-1, 0, 1] as Ax[]) {
    for (const cy of [-1, 0, 1] as Ax[]) {
      for (const cz of [-1, 0, 1] as Ax[]) {
        out.push({
          id: id++,
          cx, cy, cz,
          px: cx ===  1 ? C.B : undefined,
          nx: cx === -1 ? C.G : undefined,
          py: cy ===  1 ? C.W : undefined,
          ny: cy === -1 ? C.Y : undefined,
          pz: cz ===  1 ? C.R : undefined,
          nz: cz === -1 ? C.O : undefined,
        })
      }
    }
  }
  return out
}

/**
 * Column move = rotateX on the slice with cx === col.
 *
 * dir = -1  →  rotateX(-90°):  (y, z) → ( z, -y)
 *              front → top, top → back, back → bottom, bottom → front
 *
 * dir = +1  →  rotateX(+90°):  (y, z) → (-z,  y)
 *              top → front, front → bottom, bottom → back, back → top
 */
function applyMove(cubies: Cubie[], col: Ax, dir: 1 | -1): Cubie[] {
  return cubies.map(c => {
    if (c.cx !== col) return c

    const { id, cx, cy, cz, px, nx, py, ny, pz, nz } = c
    const newCy = (dir === -1 ?  cz : -cz) as Ax
    const newCz = (dir === -1 ? -cy :  cy) as Ax

    return dir === -1
      ? { id, cx, cy: newCy, cz: newCz, px, nx, py: pz, nz: py, ny: nz, pz: ny }
      : { id, cx, cy: newCy, cz: newCz, px, nx, pz: py, ny: pz, nz: ny, py: nz }
  })
}

// ─── Scramble & animation sequence ───────────────────────────────────────────
// Applied once on mount to produce a visually interesting initial state
const SCRAMBLE: Move[] = [
  { col:  1, dir: -1 }, { col: -1, dir:  1 }, { col:  1, dir: -1 },
  { col:  0, dir: -1 }, { col: -1, dir:  1 }, { col:  1, dir:  1 },
  { col:  0, dir:  1 }, { col: -1, dir: -1 }, { col:  0, dir: -1 },
]

// Repeating sequence: R L' M R' L M' (and back)
const LOOP: Move[] = [
  { col:  1, dir: -1 },   // R
  { col: -1, dir:  1 },   // L'
  { col:  0, dir: -1 },   // M
  { col:  1, dir:  1 },   // R'
  { col: -1, dir: -1 },   // L
  { col:  0, dir:  1 },   // M'
]

// ─── Geometry constants ───────────────────────────────────────────────────────
const S    = 22           // overall cube side (px)
const CELL = S / 3        // one cubie side ≈ 7.33 px
const HALF = CELL / 2
const GAP  = 0.45         // sticker inset from cubie edge

// ─── Sticker face ─────────────────────────────────────────────────────────────
function StickerFace({ color, xform }: { color: string; xform: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: GAP,
        transform: xform,
        backgroundColor: color,
        borderRadius: 0.7,
        backfaceVisibility: 'hidden',
        boxShadow: 'inset 0 0 0 0.4px rgba(0,0,0,0.22)',
      }}
    />
  )
}

// ─── Single cubie (up to 6 colored sticker faces) ────────────────────────────
function CubieEl({ c }: { c: Cubie }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: CELL,
        height: CELL,
        left: '50%',
        top: '50%',
        transformStyle: 'preserve-3d',
        // cx/cy/cz → 3-D position relative to cube centre
        transform: `translate3d(${c.cx * CELL - HALF}px, ${-c.cy * CELL - HALF}px, ${c.cz * CELL}px)`,
        background: '#080808',
      }}
    >
      {c.pz && <StickerFace color={c.pz} xform={`translateZ(${HALF}px)`} />}
      {c.nz && <StickerFace color={c.nz} xform={`rotateY(180deg) translateZ(${HALF}px)`} />}
      {c.px && <StickerFace color={c.px} xform={`rotateY(90deg) translateZ(${HALF}px)`} />}
      {c.nx && <StickerFace color={c.nx} xform={`rotateY(-90deg) translateZ(${HALF}px)`} />}
      {c.py && <StickerFace color={c.py} xform={`rotateX(-90deg) translateZ(${HALF}px)`} />}
      {c.ny && <StickerFace color={c.ny} xform={`rotateX(90deg) translateZ(${HALF}px)`} />}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AnimatedMark({ className }: { className?: string }) {

  // Cube state: 27 cubies with current position + sticker colors
  const [cubies, setCubies] = useState<Cubie[]>(() => {
    let s = buildSolved()
    for (const { col, dir } of SCRAMBLE) s = applyMove(s, col, dir)
    return s
  })

  // One animation control per column slice
  const ctrlL = useAnimation()
  const ctrlM = useAnimation()
  const ctrlR = useAnimation()

  // ── Column animation loop ──────────────────────────────────────────────────
  useEffect(() => {
    let active = true
    let idx = 0
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    ;(async () => {
      await sleep(700)    // brief pause before first move

      while (active) {
        const { col, dir } = LOOP[idx++ % LOOP.length]
        const ctrl: AnimationControls = col === -1 ? ctrlL : col === 0 ? ctrlM : ctrlR

        // 1. Animate the column slice by ±90°
        await ctrl.start({
          rotateX: dir * 90,
          transition: { duration: 0.58, ease: [0.4, 0, 0.2, 1] },
        })

        if (!active) break

        // 2. Snap column back to 0° (instant), then update cubie colors/positions
        ctrl.set({ rotateX: 0 })
        setCubies(prev => applyMove(prev, col, dir))

        await sleep(1250)  // hold before next move
      }
    })()

    return () => { active = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={className}
      style={{
        perspective: '88px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Outer: fixed X-tilt for depth + slow Y drift for viewing angle */}
      <motion.div
        style={{
          width: S,
          height: S,
          transformStyle: 'preserve-3d',
          rotateX: -24,
        }}
        animate={{ rotateY: [0, 16, 0, -16, 0] }}
        transition={{
          rotateY: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* Three column slices — only one animates at a time */}
        {([-1, 0, 1] as Ax[]).map(col => {
          const ctrl = col === -1 ? ctrlL : col === 0 ? ctrlM : ctrlR
          return (
            <motion.div
              key={col}
              animate={ctrl}
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
              }}
            >
              {cubies
                .filter(c => c.cx === col)
                .map(c => <CubieEl key={c.id} c={c} />)}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
