'use client'

import { motion, useAnimation, type AnimationControls } from 'framer-motion'
import { useEffect, useState } from 'react'

// ─── Rubik's Cube Colors ──────────────────────────────────────────────────────
const C = {
  R: '#ef4444',
  O: '#f97316',
  W: '#f1f5f9',
  Y: '#facc15',
  B: '#3b82f6',
  G: '#16a34a',
} as const

type Ax = -1 | 0 | 1

interface Cubie {
  id: number
  cx: Ax; cy: Ax; cz: Ax
  px?: string; nx?: string
  py?: string; ny?: string
  pz?: string; nz?: string
}

type Move = { col: Ax; dir: 1 | -1 }

function buildSolved(): Cubie[] {
  const out: Cubie[] = []
  let id = 0
  for (const cx of [-1, 0, 1] as Ax[]) {
    for (const cy of [-1, 0, 1] as Ax[]) {
      for (const cz of [-1, 0, 1] as Ax[]) {
        out.push({
          id: id++, cx, cy, cz,
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

const SCRAMBLE: Move[] = [
  { col:  1, dir: -1 }, { col: -1, dir:  1 }, { col:  1, dir: -1 },
  { col:  0, dir: -1 }, { col: -1, dir:  1 }, { col:  1, dir:  1 },
  { col:  0, dir:  1 }, { col: -1, dir: -1 }, { col:  0, dir: -1 },
]

const LOOP: Move[] = [
  { col:  1, dir: -1 },
  { col: -1, dir:  1 },
  { col:  0, dir: -1 },
  { col:  1, dir:  1 },
  { col: -1, dir: -1 },
  { col:  0, dir:  1 },
]

// Watermark cube is much larger — S drives all geometry
const S    = 280
const CELL = S / 3
const HALF = CELL / 2
const GAP  = 5

function StickerFace({ color, xform }: { color: string; xform: string }) {
  return (
    <div style={{
      position: 'absolute',
      inset: GAP,
      transform: xform,
      backgroundColor: color,
      borderRadius: 8,
      backfaceVisibility: 'hidden',
      boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.18)',
    }} />
  )
}

function CubieEl({ c }: { c: Cubie }) {
  return (
    <div style={{
      position: 'absolute',
      width: CELL,
      height: CELL,
      left: '50%',
      top: '50%',
      transformStyle: 'preserve-3d',
      transform: `translate3d(${c.cx * CELL - HALF}px, ${-c.cy * CELL - HALF}px, ${c.cz * CELL}px)`,
      background: '#050505',
      borderRadius: 4,
    }}>
      {c.pz && <StickerFace color={c.pz} xform={`translateZ(${HALF}px)`} />}
      {c.nz && <StickerFace color={c.nz} xform={`rotateY(180deg) translateZ(${HALF}px)`} />}
      {c.px && <StickerFace color={c.px} xform={`rotateY(90deg) translateZ(${HALF}px)`} />}
      {c.nx && <StickerFace color={c.nx} xform={`rotateY(-90deg) translateZ(${HALF}px)`} />}
      {c.py && <StickerFace color={c.py} xform={`rotateX(-90deg) translateZ(${HALF}px)`} />}
      {c.ny && <StickerFace color={c.ny} xform={`rotateX(90deg) translateZ(${HALF}px)`} />}
    </div>
  )
}

export function RubikWatermark() {
  const [cubies, setCubies] = useState<Cubie[]>(() => {
    let s = buildSolved()
    for (const { col, dir } of SCRAMBLE) s = applyMove(s, col, dir)
    return s
  })

  const ctrlL = useAnimation()
  const ctrlM = useAnimation()
  const ctrlR = useAnimation()

  // Column move loop
  useEffect(() => {
    let active = true
    let idx = 0
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    ;(async () => {
      await sleep(300)
      while (active) {
        const { col, dir } = LOOP[idx++ % LOOP.length]
        const ctrl: AnimationControls = col === -1 ? ctrlL : col === 0 ? ctrlM : ctrlR

        await ctrl.start({
          rotateX: dir * 90,
          transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
        })

        if (!active) break
        ctrl.set({ rotateX: 0 })
        setCubies(prev => applyMove(prev, col, dir))
        await sleep(1400)
      }
    })()

    return () => { active = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // Wrapper: full-screen fixed overlay, pointer-events-none
    <motion.div
      className="fixed inset-0 z-[5] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.22, 0.22, 0] }}
      transition={{
        duration: 5,
        times: [0, 0.12, 0.55, 1],
        ease: 'easeInOut',
      }}
    >
      <div style={{ perspective: '1100px' }}>
        <motion.div
          style={{
            width: S,
            height: S,
            transformStyle: 'preserve-3d',
            rotateX: -24,
          }}
          animate={{ rotateY: [0, 18, 0, -18, 0] }}
          transition={{
            rotateY: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {([-1, 0, 1] as Ax[]).map(col => {
            const ctrl = col === -1 ? ctrlL : col === 0 ? ctrlM : ctrlR
            return (
              <motion.div
                key={col}
                animate={ctrl}
                style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
              >
                {cubies
                  .filter(c => c.cx === col)
                  .map(c => <CubieEl key={c.id} c={c} />)}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
