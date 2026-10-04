'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import { KeyRound, Link2 } from 'lucide-react'
import { TABLE_NODE_MAX_ROWS, TABLE_NODE_WIDTH } from '@/lib/data-sources/model/layout'
import type { DataModelTable } from '@/lib/data-sources/model/types'

export interface TableNodeData extends Record<string, unknown> {
  table: DataModelTable
  aiDescription?: string
  dimmed: boolean
  relatedCount: number
}

export type TableFlowNode = Node<TableNodeData, 'table'>

export const TableNode = memo(function TableNode({ data, selected }: NodeProps<TableFlowNode>) {
  const { table, dimmed } = data
  const shown = table.columns.slice(0, TABLE_NODE_MAX_ROWS)
  const hidden = table.columns.length - shown.length
  const isView = table.type !== 'table'

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-opacity ${
        selected ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2' : 'border-black/[0.1]'
      } ${dimmed ? 'opacity-25' : ''}`}
      style={{ width: TABLE_NODE_WIDTH }}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-0 !bg-neutral-400" />
      <div
        className={`flex items-center justify-between gap-2 px-3 py-2 ${
          isView ? 'bg-indigo-50 text-indigo-900' : 'bg-neutral-900 text-white'
        }`}
      >
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] font-semibold leading-tight">{table.table}</p>
          <p className={`truncate text-[9px] ${isView ? 'text-indigo-500' : 'text-neutral-400'}`}>{table.schema}</p>
        </div>
        <span className={`shrink-0 text-[9px] ${isView ? 'text-indigo-500' : 'text-neutral-400'}`}>
          {table.columns.length} col
        </span>
      </div>
      <ul className="px-2 py-1.5">
        {shown.map(column => (
          <li key={column.column} className="flex h-5 items-center gap-1.5 text-[10px] leading-none">
            <span className="flex w-3 shrink-0 items-center justify-center">
              {column.primaryKey ? (
                <KeyRound className="h-2.5 w-2.5 text-amber-500" />
              ) : column.foreignKey ? (
                <Link2 className="h-2.5 w-2.5 text-sky-500" />
              ) : null}
            </span>
            <span className={`truncate font-mono ${column.primaryKey ? 'font-semibold text-neutral-900' : 'text-neutral-700'}`}>
              {column.column}
            </span>
            <span className="ml-auto shrink-0 truncate font-mono text-[9px] text-neutral-400">{column.dataType}</span>
          </li>
        ))}
        {hidden > 0 && (
          <li className="flex h-5 items-center text-[9px] text-neutral-400">+{hidden} campos</li>
        )}
      </ul>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-0 !bg-neutral-400" />
    </div>
  )
})
