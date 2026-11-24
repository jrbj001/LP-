'use client'

import { useEffect, useId, useRef, type RefObject } from 'react'
import { MOUTH_SHAPES, visemeAt, type MouthShape, type SpeechAlignment } from '@/lib/meeting-agent/visemes'

export type FaceMode = 'idle' | 'listening' | 'thinking' | 'speaking'

/**
 * Sinais que movem o rosto, lidos a cada quadro. Quem toca o áudio ou ouve o microfone
 * escreve aqui direto, sem re-render do React.
 */
export interface FaceSignal {
  mode: FaceMode
  audio: HTMLAudioElement | null
  analyser: AnalyserNode | null
  alignment: SpeechAlignment | null
  /** Volume de quem está falando com o Cadence (0 a 1); ele acena enquanto ouve. */
  hearing: number
}

export function createFaceSignal(): FaceSignal {
  return { mode: 'idle', audio: null, analyser: null, alignment: null, hearing: 0 }
}

const MOUTH_X = 640
const MOUTH_Y = 410
const HEAD_PIVOT = '640 470'
const EYES = [
  { x: 592, y: 304 },
  { x: 688, y: 304 },
]

function mouthGeometry({ width, open, smile }: MouthShape) {
  const left = MOUTH_X - width / 2
  const right = MOUTH_X + width / 2
  const corner = MOUTH_Y - smile * 5
  const upperMid = MOUTH_Y - open * 0.25
  const lowerMid = MOUTH_Y + open * 0.75 + 0.6
  const upperCtrl = 2 * upperMid - corner
  const lowerCtrl = 2 * lowerMid - corner
  const d = `M${left} ${corner} Q${MOUTH_X} ${upperCtrl} ${right} ${corner} Q${MOUTH_X} ${lowerCtrl} ${left} ${corner} Z`
  return { d, left, upperMid, lowerMid }
}

function levelOf(analyser: AnalyserNode | null, buffer: Uint8Array<ArrayBuffer>): number {
  if (!analyser) return 0
  analyser.getByteTimeDomainData(buffer)
  let energy = 0
  for (let i = 0; i < buffer.length; i++) {
    const sample = (buffer[i] - 128) / 128
    energy += sample * sample
  }
  return Math.min(1, Math.sqrt(energy / buffer.length) * 4)
}

const lerp = (from: number, to: number, k: number) => from + (to - from) * k
const random = (min: number, max: number) => min + Math.random() * (max - min)

/** Rosto 2D do Cadence: boca guiada pelo alinhamento do ElevenLabs, piscadas, olhar e cabeça vivos. */
export function CadenceFace({ signal, className }: { signal: RefObject<FaceSignal>; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const bodyRef = useRef<SVGGElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const browsRef = useRef<SVGGElement>(null)
  const eyeRefs = useRef<(SVGGElement | null)[]>([])
  const irisRefs = useRef<(SVGGElement | null)[]>([])
  const mouthFillRef = useRef<SVGPathElement>(null)
  const mouthLineRef = useRef<SVGPathElement>(null)
  const mouthClipRef = useRef<SVGPathElement>(null)
  const teethRef = useRef<SVGRectElement>(null)
  const tongueRef = useRef<SVGEllipseElement>(null)

  useEffect(() => {
    const buffer = new Uint8Array(new ArrayBuffer(256))
    const mouth: MouthShape = { ...MOUTH_SHAPES.rest }
    const gaze = { x: 0, y: 0, tx: 0, ty: 0, next: 0 }
    const blink = { next: performance.now() + random(1500, 4000), start: -1, twice: false }
    let energy = 0
    let hearing = 0
    let brow = 0
    let tilt = 0
    let last = performance.now()
    let frame = 0

    const draw = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const t = now / 1000
      const s = signal.current
      const speaking = s.mode === 'speaking' && s.audio !== null && !s.audio.paused

      // Boca: formato do caractere falado agora, com a abertura modulada pelo volume real.
      const level = speaking ? levelOf(s.analyser, buffer) : 0
      energy = lerp(energy, level, 1 - Math.exp(-dt * 10))
      let target: MouthShape = MOUTH_SHAPES.rest
      if (speaking && s.audio) {
        if (s.alignment) {
          const shape = MOUTH_SHAPES[visemeAt(s.alignment, s.audio.currentTime)]
          target = { ...shape, open: shape.open * (0.7 + 0.6 * level) }
        } else {
          target = { width: 46 + level * 8, open: level * 26, smile: 0.3 }
        }
      } else if (s.mode === 'listening') {
        target = { ...MOUTH_SHAPES.rest, smile: 0.7 }
      } else if (s.mode === 'thinking') {
        target = { width: 38, open: 0, smile: 0.15 }
      }
      const k = 1 - Math.exp(-dt * 28)
      mouth.width = lerp(mouth.width, target.width, k)
      mouth.open = lerp(mouth.open, target.open, k)
      mouth.smile = lerp(mouth.smile, target.smile, k)
      const geometry = mouthGeometry(mouth)
      mouthFillRef.current?.setAttribute('d', geometry.d)
      mouthLineRef.current?.setAttribute('d', geometry.d)
      mouthClipRef.current?.setAttribute('d', geometry.d)
      teethRef.current?.setAttribute('x', String(geometry.left + mouth.width * 0.16))
      teethRef.current?.setAttribute('y', String(geometry.upperMid - 2))
      teethRef.current?.setAttribute('width', String(mouth.width * 0.68))
      teethRef.current?.setAttribute('height', String(Math.min(mouth.open * 0.3, 7)))
      tongueRef.current?.setAttribute('cy', String(geometry.lowerMid - mouth.open * 0.12))
      tongueRef.current?.setAttribute('rx', String(mouth.width * 0.26))
      tongueRef.current?.setAttribute('ry', String(Math.max(0.1, mouth.open * 0.2)))

      // Piscadas a cada poucos segundos, às vezes duplas.
      let lid = 1
      if (blink.start < 0 && now >= blink.next) blink.start = now
      if (blink.start >= 0) {
        const progress = (now - blink.start) / 140
        if (progress >= 1) {
          blink.start = blink.twice ? now + 90 : -1
          blink.twice = !blink.twice && Math.random() < 0.15
          if (blink.start < 0) blink.next = now + random(2200, 5500)
        } else if (progress >= 0) {
          lid = 1 - Math.sin(progress * Math.PI) * 0.92
        }
      }
      if (s.mode === 'thinking') lid = Math.min(lid, 0.82)

      // Olhar: quase sempre para a câmera, com pequenas fugas; pensando, olha para cima.
      if (now >= gaze.next) {
        const atCamera = Math.random() < (speaking ? 0.7 : 0.55)
        gaze.tx = atCamera ? 0 : random(-4, 4)
        gaze.ty = atCamera ? 0 : random(-2.5, 2)
        gaze.next = now + random(800, 3000)
      }
      const gazeX = s.mode === 'thinking' ? -5 : gaze.tx
      const gazeY = s.mode === 'thinking' ? -5 : gaze.ty
      gaze.x = lerp(gaze.x, gazeX, 1 - Math.exp(-dt * 18))
      gaze.y = lerp(gaze.y, gazeY, 1 - Math.exp(-dt * 18))

      EYES.forEach((eye, index) => {
        eyeRefs.current[index]?.setAttribute(
          'transform',
          `translate(${eye.x} ${eye.y}) scale(1 ${lid.toFixed(3)}) translate(${-eye.x} ${-eye.y})`
        )
        irisRefs.current[index]?.setAttribute('transform', `translate(${gaze.x.toFixed(2)} ${gaze.y.toFixed(2)})`)
      })

      // Sobrancelhas e cabeça: ênfase ao falar, inclinação e acenos ao ouvir.
      hearing = lerp(hearing, s.mode === 'listening' ? s.hearing : 0, 1 - Math.exp(-dt * 6))
      const browTarget =
        (speaking ? -energy * 5 : 0) + (s.mode === 'listening' ? -2 : 0) + (s.mode === 'thinking' ? -3 : 0)
      brow = lerp(brow, browTarget, 1 - Math.exp(-dt * 8))
      browsRef.current?.setAttribute('transform', `translate(0 ${brow.toFixed(2)})`)

      const tiltTarget = s.mode === 'listening' ? 3.5 : s.mode === 'thinking' ? -2.5 : 0
      tilt = lerp(tilt, tiltTarget, 1 - Math.exp(-dt * 3))
      const roll = Math.sin(t * 0.6) * 1.2 + Math.sin(t * 1.7) * 0.3 + Math.sin(t * 2.3) * energy * 2.5 + tilt
      const dx = Math.sin(t * 0.45) * 4
      const dy = Math.sin(t * 0.9) * 2 + energy * 5 + Math.sin(t * 3.1) * hearing * 3
      headRef.current?.setAttribute(
        'transform',
        `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) rotate(${roll.toFixed(2)} ${HEAD_PIVOT})`
      )
      bodyRef.current?.setAttribute('transform', `translate(${(dx * 0.4).toFixed(2)} ${(Math.sin(t * 1.4) * 2).toFixed(2)})`)

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [signal])

  const rest = mouthGeometry(MOUTH_SHAPES.rest)

  return (
    <svg
      viewBox="0 0 1280 720"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Cadence"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1a2b" />
          <stop offset="1" stopColor="#0c0b12" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor="#7c6cf0" stopOpacity="0.28" />
          <stop offset="1" stopColor="#7c6cf0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-skin`} cx="0.42" cy="0.36" r="0.75">
          <stop offset="0" stopColor="#eab894" />
          <stop offset="1" stopColor="#c98a66" />
        </radialGradient>
        <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f2b45" />
          <stop offset="1" stopColor="#1c1a2a" />
        </linearGradient>
        <clipPath id={`${uid}-mouth`}>
          <path ref={mouthClipRef} d={rest.d} />
        </clipPath>
        {EYES.map((eye, index) => (
          <clipPath key={index} id={`${uid}-eye${index}`}>
            <ellipse cx={eye.x} cy={eye.y} rx="18" ry="11.5" />
          </clipPath>
        ))}
      </defs>

      <rect width="1280" height="720" fill={`url(#${uid}-bg)`} />
      <circle cx="640" cy="330" r="380" fill={`url(#${uid}-glow)`} />
      <g opacity="0.12" stroke="#c4b5fd" strokeWidth="3" fill="none" transform="translate(1168 628) scale(0.55)">
        <path d="M0 -60 L52 -30 L52 30 L0 60 L-52 30 L-52 -30 Z" />
        <path d="M0 -22 L19 -11 L19 11 L0 22 L-19 11 L-19 -11 Z" />
        <path d="M0 -60 L0 -22 M52 -30 L19 -11 M52 30 L19 11 M0 60 L0 22 M-52 30 L-19 11 M-52 -30 L-19 -11" />
      </g>

      <g ref={bodyRef}>
        <path
          d="M292 720 C298 628 378 584 500 560 C540 552 572 544 592 534 C612 562 668 562 688 534 C708 544 740 552 780 560 C902 584 982 628 988 720 Z"
          fill={`url(#${uid}-top)`}
        />
        <path d="M592 420 L592 540 C612 566 668 566 688 540 L688 420 Z" fill="#b97c5b" />
        <path d="M584 532 C604 578 676 578 696 532" stroke="#3d3858" strokeWidth="14" fill="none" strokeLinecap="round" />
        <circle cx="822" cy="628" r="9" fill="#a78bfa" opacity="0.9" />
      </g>

      <g ref={headRef}>
        <path
          d="M500 330 C480 210 540 116 646 114 C752 112 806 204 782 330 C774 280 760 250 742 236 C700 252 600 254 548 232 C524 250 508 286 500 330 Z"
          fill="#2b211c"
        />
        <ellipse cx="521" cy="320" rx="17" ry="30" fill="#c98a66" />
        <ellipse cx="759" cy="320" rx="17" ry="30" fill="#c98a66" />
        <path
          d="M640 168 C708 168 760 214 760 296 C760 382 716 452 640 470 C564 452 520 382 520 296 C520 214 572 168 640 168 Z"
          fill={`url(#${uid}-skin)`}
        />
        <ellipse cx="574" cy="372" rx="22" ry="12" fill="#e58a7a" opacity="0.18" />
        <ellipse cx="706" cy="372" rx="22" ry="12" fill="#e58a7a" opacity="0.18" />
        <path
          d="M640 320 C637 342 630 356 634 364 C639 369 647 369 652 364"
          stroke="#a96b4c"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        <path ref={mouthFillRef} d={rest.d} fill="#4a1c24" />
        <g clipPath={`url(#${uid}-mouth)`}>
          <rect ref={teethRef} x="0" y="0" width="0" height="0" rx="2" fill="#fbf8f4" />
          <ellipse ref={tongueRef} cx={MOUTH_X} cy={MOUTH_Y} rx="0" ry="0.1" fill="#c25f68" />
        </g>
        <path ref={mouthLineRef} d={rest.d} fill="none" stroke="#9a4d47" strokeWidth="4.5" strokeLinejoin="round" />

        {EYES.map((eye, index) => (
          <g
            key={index}
            ref={(element) => {
              eyeRefs.current[index] = element
            }}
          >
            <ellipse cx={eye.x} cy={eye.y} rx="18" ry="11.5" fill="#fbf7f3" />
            <g clipPath={`url(#${uid}-eye${index})`}>
              <g
                ref={(element) => {
                  irisRefs.current[index] = element
                }}
              >
                <circle cx={eye.x} cy={eye.y + 1} r="8.5" fill="#4a3426" />
                <circle cx={eye.x} cy={eye.y + 1} r="4" fill="#15100d" />
                <circle cx={eye.x + 2.6} cy={eye.y - 1.6} r="2.2" fill="#ffffff" />
              </g>
            </g>
            <path
              d={`M${eye.x - 19} ${eye.y - 2} Q${eye.x} ${eye.y - 15} ${eye.x + 19} ${eye.y - 2}`}
              stroke="#3b2a22"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}

        <g ref={browsRef} stroke="#2b211c" strokeWidth="7" fill="none" strokeLinecap="round">
          <path d="M566 268 Q592 254 618 263" />
          <path d="M662 263 Q688 254 714 268" />
        </g>

        <g stroke="#17151f" strokeWidth="5" fill="#ffffff" fillOpacity="0.05">
          <rect x="555" y="280" width="75" height="52" rx="17" />
          <rect x="650" y="280" width="75" height="52" rx="17" />
          <path d="M630 300 Q640 291 650 300 M555 298 L523 290 M725 298 L757 290" fill="none" />
        </g>

        <path
          d="M526 270 C520 194 568 146 640 144 C716 142 766 194 756 262 C740 230 714 212 678 206 C642 222 590 224 560 214 C542 228 530 246 526 270 Z"
          fill="#2b211c"
        />
      </g>
    </svg>
  )
}
