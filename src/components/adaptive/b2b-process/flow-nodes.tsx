'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ProcessNodeData, PlanBadge } from '@/lib/adaptive/b2b-process/types'
import { KIND_STYLES } from '@/lib/adaptive/b2b-process/types'

const BADGE_LABEL: Record<PlanBadge, string> = {
  intervention: 'Manual',
  'quick-win': 'QW',
  layer: 'Layer',
  llm: 'LLM',
}

const BADGE_CLASS: Record<PlanBadge, string> = {
  intervention: 'bg-rose-100 text-rose-800',
  'quick-win': 'bg-emerald-100 text-emerald-800',
  layer: 'bg-sky-100 text-sky-800',
  llm: 'bg-amber-100 text-amber-900',
}

function BadgeRow({ badges }: { badges?: PlanBadge[] }) {
  if (!badges?.length) return null
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {badges.map(b => (
        <span
          key={b}
          className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${BADGE_CLASS[b]}`}
        >
          {BADGE_LABEL[b]}
        </span>
      ))}
    </div>
  )
}

export const ProcessFlowNode = memo(function ProcessFlowNode({
  data,
  selected,
}: NodeProps & { data: ProcessNodeData }) {
  const kind = data.kind === 'group' ? 'process' : data.kind
  const style = KIND_STYLES[kind] ?? KIND_STYLES.process
  const isDiamond = false

  return (
    <div
      className={`rounded-xl border-2 px-3 py-2.5 shadow-sm transition-shadow max-w-[240px] ${
        selected ? 'ring-2 ring-neutral-900 ring-offset-2' : ''
      }`}
      style={{
        background: style.bg,
        color: style.text,
        borderColor: style.border,
        width: data.width ?? 240,
      }}
    >
      <Handle type="target" position={Position.Left} className="!bg-neutral-400 !w-2 !h-2 !border-0" />
      <p
        className={`text-[12px] leading-snug font-medium whitespace-pre-wrap ${
          kind === 'root' || kind === 'stage' ? 'font-semibold text-[13px]' : ''
        }`}
      >
        {data.label}
      </p>
      {data.area && (
        <p className="text-[10px] opacity-70 mt-1">{data.area}</p>
      )}
      <BadgeRow badges={data.badges} />
      <Handle type="source" position={Position.Right} className="!bg-neutral-400 !w-2 !h-2 !border-0" />
      {isDiamond ? null : null}
    </div>
  )
})

export const DecisionFlowNode = memo(function DecisionFlowNode({
  data,
  selected,
}: NodeProps & { data: ProcessNodeData }) {
  const style = KIND_STYLES.decision

  return (
    <div className={`relative flex items-center justify-center ${selected ? 'z-10' : ''}`} style={{ width: 160, height: 160 }}>
      <Handle type="target" position={Position.Left} className="!bg-neutral-500 !w-2 !h-2 !border-0" />
      <div
        className={`flex items-center justify-center text-center px-3 ${selected ? 'ring-2 ring-neutral-900' : ''}`}
        style={{
          width: 112,
          height: 112,
          background: style.bg,
          color: style.text,
          border: `2px solid ${style.border}`,
          transform: 'rotate(45deg)',
          borderRadius: 8,
        }}
      >
        <p
          className="text-[11px] font-semibold leading-snug"
          style={{ transform: 'rotate(-45deg)', maxWidth: 88 }}
        >
          {data.label}
        </p>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-neutral-500 !w-2 !h-2 !border-0" />
    </div>
  )
})
