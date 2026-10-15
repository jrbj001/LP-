import { MISSIONS, ROADMAP, missionEffortDays, type RoadmapMilestone } from './likeme-glp1-workplan-data'

const DAY_MS = 24 * 60 * 60 * 1000
const LEFT = 196
const RIGHT = 24
const TOP = 64
const ROW_H = 44
const BAR_H = 22

const MISSION_COLOR = ['#be123c', '#b45309', '#047857', '#1d4ed8']

const MILESTONE_COLOR: Record<RoadmapMilestone['kind'], string> = {
  start: '#18181b',
  release: '#be123c',
  pause: '#a1a1aa',
  pilot: '#047857',
}

function toDate(value: string): Date {
  return new Date(`${value}T12:00:00-03:00`)
}

function shortDate(value: string): string {
  const date = toDate(value)
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '')
}

export function Glp1RoadmapDiagram() {
  const start = toDate(ROADMAP.start)
  const end = toDate(ROADMAP.end)
  const totalDays = Math.round((end.getTime() - start.getTime()) / DAY_MS)
  const width = 1000
  const plotW = width - LEFT - RIGHT
  const x = (value: string) =>
    LEFT + ((toDate(value).getTime() - start.getTime()) / DAY_MS / totalDays) * plotW
  const rowsBottom = TOP + MISSIONS.length * ROW_H
  const height = rowsBottom + 118

  const months: { x: number; label: string }[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth() + 1, 1, 12)
  while (cursor <= end) {
    months.push({
      x: LEFT + ((cursor.getTime() - start.getTime()) / DAY_MS / totalDays) * plotW,
      label: monthLabel(cursor),
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  const sprints: number[] = []
  for (let day = 0; day <= totalDays; day += ROADMAP.sprintDays) {
    sprints.push(LEFT + (day / totalDays) * plotW)
  }

  const pause = ROADMAP.milestones.find(milestone => milestone.kind === 'pause')
  const pauseEnd = '2027-01-03'

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white">
      <svg
        role="img"
        aria-label="Roadmap do flagship GLP-1 com início em 2 de novembro de 2026 e piloto em 17 de dezembro"
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto min-w-[920px] w-full"
      >
        <title>Roadmap GLP-1 · Dr. Matheus</title>
        <rect width={width} height={height} fill="#fafafa" />
        <text x={LEFT} y={24} fill="#18181b" fontSize={13} fontWeight={650}>
          Roadmap · {shortDate(ROADMAP.start)} → {shortDate(ROADMAP.end)} · 2026
        </text>
        <text x={LEFT} y={40} fill="#71717a" fontSize={10}>
          Barras são janelas de calendário. O número é o esforço em dias de desenvolvimento.
        </text>

        {pause && (
          <rect
            x={x(pause.date)}
            y={TOP - 6}
            width={x(pauseEnd) - x(pause.date)}
            height={rowsBottom - TOP + 6}
            fill="#f4f4f5"
            opacity={0.9}
          />
        )}

        {sprints.map((sx, index) => (
          <line key={`sprint-${index}`} x1={sx} y1={TOP - 6} x2={sx} y2={rowsBottom} stroke="#ececef" strokeWidth={1} />
        ))}

        {months.map(month => (
          <g key={month.label}>
            <line x1={month.x} y1={TOP - 14} x2={month.x} y2={rowsBottom} stroke="#d4d4d8" strokeWidth={1} />
            <text x={month.x + 4} y={TOP - 4} fill="#71717a" fontSize={9} fontWeight={600}>
              {month.label}
            </text>
          </g>
        ))}

        {MISSIONS.map((mission, index) => {
          const y = TOP + index * ROW_H
          const x1 = x(mission.window.start)
          const x2 = x(mission.window.end)
          const color = MISSION_COLOR[index % MISSION_COLOR.length]
          return (
            <g key={mission.id}>
              <text x={16} y={y + BAR_H / 2 + 4} fill="#18181b" fontSize={11} fontWeight={650}>
                {mission.id}
              </text>
              <text x={40} y={y + BAR_H / 2 + 4} fill="#52525b" fontSize={10}>
                {mission.name}
              </text>
              <rect x={x1} y={y} width={Math.max(x2 - x1, 6)} height={BAR_H} rx={6} fill={color} opacity={0.14} />
              <rect x={x1} y={y} width={Math.max(x2 - x1, 6)} height={BAR_H} rx={6} fill="none" stroke={color} strokeWidth={1.2} />
              <text x={x1 + 8} y={y + BAR_H / 2 + 4} fill={color} fontSize={10} fontWeight={650}>
                {missionEffortDays(mission)} dias
              </text>
              <text x={x2 + 8} y={y + BAR_H / 2 + 4} fill="#71717a" fontSize={9}>
                {mission.window.label.split(' · ')[0]}
              </text>
            </g>
          )
        })}

        <line x1={LEFT} y1={rowsBottom + 10} x2={width - RIGHT} y2={rowsBottom + 10} stroke="#d4d4d8" strokeWidth={1} />

        {ROADMAP.milestones.map((milestone, index) => {
          const mx = x(milestone.date)
          const color = MILESTONE_COLOR[milestone.kind]
          const lane = index % 2
          const labelY = rowsBottom + 34 + lane * 30
          return (
            <g key={milestone.label}>
              <line x1={mx} y1={rowsBottom + 10} x2={mx} y2={labelY - 10} stroke={color} strokeWidth={1} />
              <circle cx={mx} cy={rowsBottom + 10} r={4} fill={color} />
              <text x={mx} y={labelY} fill={color} fontSize={9} fontWeight={650} textAnchor="middle">
                {shortDate(milestone.date)}
              </text>
              <text x={mx} y={labelY + 11} fill="#52525b" fontSize={8.5} textAnchor="middle">
                {milestone.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
