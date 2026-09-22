'use client'

import type { KnowledgeSourceStatus } from '@/lib/knowledge/types'

function labelFor(status: KnowledgeSourceStatus): string {
  if (status.state === 'used') return `${status.label} · consultado`
  if (status.state === 'empty') return `${status.label} · sem resultado`
  if (status.state === 'unavailable') {
    return `${status.label} · ${status.detail || 'indisponível'}`
  }
  return `${status.label} · ${status.detail || 'erro'}`
}

export function SourceStatusChips({ statuses }: { statuses: KnowledgeSourceStatus[] }) {
  if (statuses.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {statuses.map(status => (
        <span
          key={status.id}
          title={status.detail}
          className={`rounded-full border px-2.5 py-1 text-[10px] ${
            status.state === 'used'
              ? 'border-teal-200 bg-teal-50 text-teal-800'
              : status.state === 'error' || status.state === 'unavailable'
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-neutral-200 bg-neutral-50 text-neutral-500'
          }`}
        >
          {labelFor(status)}
        </span>
      ))}
    </div>
  )
}
