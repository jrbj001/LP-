import { ArrowRight } from 'lucide-react'
import type { BacklogDiagram, BacklogDiagramNode } from '@/lib/backlog/types'

const NODE_TONE: Record<NonNullable<BacklogDiagramNode['kind']>, string> = {
  actor: 'border-violet-200 bg-violet-50 text-violet-950',
  input: 'border-sky-200 bg-sky-50 text-sky-950',
  process: 'border-black/[0.08] bg-white text-neutral-900',
  system: 'border-teal-200 bg-teal-50 text-teal-950',
  output: 'border-neutral-800 bg-neutral-900 text-white',
}

export function BacklogDiagramView({
  diagram,
  compact,
}: {
  diagram: BacklogDiagram
  compact?: boolean
}) {
  const edgeByPair = new Map(diagram.edges.map(edge => [`${edge.from}:${edge.to}`, edge.label]))
  const isSequential = (edge: BacklogDiagram['edges'][number]) =>
    diagram.nodes.some(
      (node, index) => node.id === edge.from && diagram.nodes[index + 1]?.id === edge.to
    )
  const extraEdges = diagram.edges.filter(edge => !isSequential(edge))

  return (
    <div
      className={`rounded-2xl border border-black/[0.07] bg-[#fafaf8] overflow-hidden ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      }`}
    >
      <p className={`text-[12px] font-semibold text-neutral-800 ${compact ? 'mb-4' : 'mb-5'}`}>
        {diagram.title}
      </p>
      <div className="overflow-x-auto pb-2">
        <div className="flex items-stretch min-w-max">
          {diagram.nodes.map((node, index) => {
            const next = diagram.nodes[index + 1]
            const edgeLabel = next ? edgeByPair.get(`${node.id}:${next.id}`) : undefined
            const tone = NODE_TONE[node.kind ?? 'process']
            return (
              <div key={node.id} className="flex items-center">
                <div
                  className={`rounded-2xl border ${tone} ${
                    compact ? 'w-36 min-h-24 p-3' : 'w-44 min-h-28 p-4'
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase tracking-[0.1em] opacity-50">
                    {node.kind ?? 'process'}
                  </span>
                  <p
                    className={`font-semibold leading-snug mt-2 ${
                      compact ? 'text-[12px]' : 'text-[13px]'
                    }`}
                  >
                    {node.label}
                  </p>
                  {node.detail && (
                    <p className="text-[10px] leading-relaxed mt-1.5 opacity-60">{node.detail}</p>
                  )}
                </div>
                {next && (
                  <div
                    className={`flex flex-col items-center justify-center px-2 ${
                      compact ? 'w-14' : 'w-20'
                    }`}
                  >
                    <span className="text-[9px] text-neutral-400 text-center mb-1 min-h-3">
                      {edgeLabel}
                    </span>
                    <div className="flex items-center w-full">
                      <span className="h-px bg-neutral-300 flex-1" />
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 -ml-px" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {extraEdges.length > 0 && (
        <div className="mt-4 pt-3 border-t border-black/[0.05] flex flex-wrap gap-2">
          {extraEdges.map((edge, index) => (
            <span
              key={`${edge.from}-${edge.to}-${index}`}
              className="rounded-full border border-black/[0.07] bg-white px-2.5 py-1 text-[10px] text-neutral-500"
            >
              {edge.from} → {edge.to}
              {edge.label ? ` · ${edge.label}` : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
