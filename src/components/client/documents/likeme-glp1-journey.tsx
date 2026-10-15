import { JOURNEY, PHASES, type JourneyPhase, type JourneyStage } from './likeme-glp1-workplan-data'

const PHASE_FILL: Record<JourneyPhase, string> = {
  fora: '#f4f4f5',
  entrada: '#fff1f2',
  pre: '#fffbeb',
  programa: '#f0fdf4',
}

const PHASE_STROKE: Record<JourneyPhase, string> = {
  fora: '#a1a1aa',
  entrada: '#be123c',
  pre: '#b45309',
  programa: '#047857',
}

const BOX_W = 108
const BOX_H = 92
const GAP = 16
const PAD_X = 28
const ROW_Y = [78, 248]

function rowOf(index: number): number {
  return index < 8 ? 0 : 1
}

function colOf(index: number): number {
  return index < 8 ? index : index - 8
}

function boxX(index: number): number {
  return PAD_X + colOf(index) * (BOX_W + GAP)
}

function phaseBands(): { phase: JourneyPhase; first: number; last: number; label: string }[] {
  const bands: { phase: JourneyPhase; first: number; last: number; label: string }[] = []
  JOURNEY.forEach((stage, index) => {
    const previous = bands[bands.length - 1]
    if (previous && previous.phase === stage.phase && rowOf(previous.last) === rowOf(index)) {
      previous.last = index
      return
    }
    const meta = PHASES.find(phase => phase.id === stage.phase)
    bands.push({
      phase: stage.phase,
      first: index,
      last: index,
      label: meta?.label ?? stage.phase,
    })
  })
  return bands
}

function wrapTitle(title: string): string[] {
  const words = title.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > 14 && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

export function Glp1JourneyDiagram() {
  const width = PAD_X * 2 + 8 * BOX_W + 7 * GAP
  const height = 430

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white">
      <svg
        role="img"
        aria-label="Jornada vetorial do Programa GLP-1, da consulta inicial à evolução nas 12 semanas"
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto min-w-[920px] w-full"
      >
        <title>Jornada GLP-1 · Dr. Matheus</title>
        <rect width={width} height={height} fill="#fafafa" />
        <text x={PAD_X} y={28} fill="#18181b" fontSize={13} fontWeight={650}>
          Flagship GLP-1 · Dr. Matheus · Clínica Volpi
        </text>
        <text x={PAD_X} y={46} fill="#71717a" fontSize={10}>
          Vetor da jornada de 15 etapas. App Like:Me conduz a ferramenta. Tabia conduz o WhatsApp.
        </text>

        {phaseBands().map(band => {
          const x = boxX(band.first) - 8
          const y = ROW_Y[rowOf(band.first)] - 28
          const w = boxX(band.last) + BOX_W - x + 8
          return (
            <g key={`${band.phase}-${band.first}`}>
              <rect x={x} y={y} width={w} height={18} rx={9} fill={PHASE_FILL[band.phase]} />
              <text x={x + 8} y={y + 12} fill={PHASE_STROKE[band.phase]} fontSize={9} fontWeight={650}>
                {band.label}
              </text>
            </g>
          )
        })}

        {JOURNEY.map((stage, index) => {
          const next = JOURNEY[index + 1]
          if (!next || rowOf(index) !== rowOf(index + 1)) return null
          const x1 = boxX(index) + BOX_W
          const x2 = boxX(index + 1)
          const y = ROW_Y[rowOf(index)] + BOX_H / 2
          return (
            <line
              key={`arrow-${stage.id}`}
              x1={x1 + 2}
              y1={y}
              x2={x2 - 2}
              y2={y}
              stroke="#d4d4d8"
              strokeWidth={1.5}
            />
          )
        })}

        <path
          d={`M ${boxX(7) + BOX_W / 2} ${ROW_Y[0] + BOX_H + 4} V ${ROW_Y[0] + BOX_H + 36} H ${boxX(8) + BOX_W / 2} V ${ROW_Y[1] - 4}`}
          stroke="#d4d4d8"
          strokeWidth={1.5}
          fill="none"
        />

        {JOURNEY.map((stage, index) => (
          <StageBox key={stage.id} stage={stage} index={index} />
        ))}

        <g transform={`translate(${PAD_X} ${height - 28})`}>
          <Legend swatch={PHASE_STROKE.fora} label="Fora do app" x={0} />
          <Legend swatch={PHASE_STROKE.entrada} label="Like:Me · entrada" x={110} />
          <Legend swatch={PHASE_STROKE.pre} label="Pré-programa" x={250} />
          <Legend swatch={PHASE_STROKE.programa} label="Programa de 12 semanas" x={360} />
        </g>
      </svg>
    </div>
  )
}

function StageBox({ stage, index }: { stage: JourneyStage; index: number }) {
  const x = boxX(index)
  const y = ROW_Y[rowOf(index)]
  const lines = wrapTitle(stage.title)
  const stroke = PHASE_STROKE[stage.phase]

  return (
    <g>
      <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={8} fill="#ffffff" stroke={stroke} strokeWidth={1.4} />
      <text x={x + 8} y={y + 16} fill={stroke} fontSize={9} fontWeight={700}>
        {stage.id.padStart(2, '0')}
      </text>
      {lines.map((line, lineIndex) => (
        <text key={line} x={x + 8} y={y + 34 + lineIndex * 13} fill="#18181b" fontSize={11} fontWeight={600}>
          {line}
        </text>
      ))}
      <text x={x + 8} y={y + BOX_H - 10} fill="#71717a" fontSize={8}>
        {stage.owner}
      </text>
    </g>
  )
}

function Legend({ swatch, label, x }: { swatch: string; label: string; x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect width={8} height={8} rx={2} fill={swatch} />
      <text x={12} y={8} fill="#52525b" fontSize={9}>
        {label}
      </text>
    </g>
  )
}
