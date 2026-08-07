'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Download, Filter } from 'lucide-react'
import { B2B_NODES } from '@/lib/adaptive/b2b-process/nodes'
import { B2B_EDGES } from '@/lib/adaptive/b2b-process/edges'
import { layoutB2B } from '@/lib/adaptive/b2b-process/layout'
import {
  AREA_FILTERS,
  type ProcessArea,
  type ProcessNodeData,
  type PlanBadge,
} from '@/lib/adaptive/b2b-process/types'
import { OTD_PLAN_SUMMARY, OTD_QUICK_WINS } from '@/lib/adaptive/b2b-process/quick-wins'
import { ProcessFlowNode, DecisionFlowNode } from './flow-nodes'
import { DetailsPanel } from './details-panel'

const nodeTypes = {
  process: ProcessFlowNode,
  decision: DecisionFlowNode,
}

type PlanFilter = 'all' | 'interventions' | 'quick-wins'

export function B2BProcessCanvas() {
  const laidOut = useMemo(() => layoutB2B(B2B_NODES, B2B_EDGES, 'LR'), [])
  const [nodes, setNodes, onNodesChange] = useNodesState(laidOut)
  const [edges, , onEdgesChange] = useEdgesState(B2B_EDGES)
  const [selected, setSelected] = useState<ProcessNodeData | null>(null)
  const [areaFilter, setAreaFilter] = useState<ProcessArea | 'all'>('all')
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all')

  const applyFilters = useCallback(
    (area: ProcessArea | 'all', plan: PlanFilter) => {
      setAreaFilter(area)
      setPlanFilter(plan)
      setNodes(
        laidOut.map(node => {
          const d = node.data
          const areaOk = area === 'all' || d.area === area || d.kind === 'root' || d.kind === 'stage'
          const badges = d.badges ?? []
          const planOk =
            plan === 'all' ||
            d.kind === 'root' ||
            d.kind === 'stage' ||
            (plan === 'interventions' && badges.includes('intervention')) ||
            (plan === 'quick-wins' && badges.includes('quick-win'))
          return { ...node, hidden: !(areaOk && planOk) }
        })
      )
    },
    [laidOut, setNodes]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<ProcessNodeData>) => {
    setSelected(node.data)
  }, [])

  const exportPng = useCallback(async () => {
    const el = document.querySelector('.react-flow__viewport') as HTMLElement | null
    if (!el) return
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(el, { pixelRatio: 2, backgroundColor: '#fafaf8' })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'orfeu-processo-b2b-order-to-delivery.png'
      a.click()
    } catch {
      // html-to-image pode não estar instalado — fallback print
      window.print()
    }
  }, [])

  return (
    <div className="relative h-[calc(100vh-7rem)] min-h-[560px] w-full rounded-2xl border border-black/[0.08] bg-[#fafaf8] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelected(null)}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} color="#e5e5e5" />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={n => {
            const k = (n.data as ProcessNodeData)?.kind
            if (k === 'alert' || k === 'negative') return '#F04A24'
            if (k === 'system') return '#FFD86B'
            if (k === 'stage' || k === 'root') return '#2399E5'
            return '#B9DDF5'
          }}
        />

        <Panel position="top-left" className="!m-3 max-w-xl">
          <div className="rounded-xl border border-black/[0.08] bg-white/95 backdrop-blur px-4 py-3 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              {OTD_PLAN_SUMMARY.keyword}
            </p>
            <p className="text-[14px] font-semibold text-neutral-900 mt-1 leading-snug">
              {OTD_PLAN_SUMMARY.headline}
            </p>
            <p className="text-[12px] text-neutral-500 mt-1.5 leading-relaxed">
              {OTD_QUICK_WINS.length} intervenções · {OTD_QUICK_WINS.length} quick wins · Adaptive Layer™ · LLM
            </p>
          </div>
        </Panel>

        <Panel position="top-right" className="!m-3 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={exportPng}
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white text-[12px] font-medium px-3.5 py-2 hover:bg-neutral-800"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={2} />
            Exportar PNG
          </button>
        </Panel>

        <Panel position="bottom-left" className="!m-3 max-w-3xl">
          <div className="rounded-xl border border-black/[0.08] bg-white/95 backdrop-blur px-3 py-2.5 shadow-sm flex flex-wrap items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
            <button
              type="button"
              onClick={() => applyFilters('all', planFilter)}
              className={chip(areaFilter === 'all')}
            >
              Todas áreas
            </button>
            {AREA_FILTERS.map(a => (
              <button key={a} type="button" onClick={() => applyFilters(a, planFilter)} className={chip(areaFilter === a)}>
                {a}
              </button>
            ))}
            <span className="w-px h-4 bg-neutral-200 mx-1" />
            {(
              [
                ['all', 'Tudo'],
                ['interventions', 'Só manuais'],
                ['quick-wins', 'Só QWs'],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" onClick={() => applyFilters(areaFilter, id)} className={chip(planFilter === id)}>
                {label}
              </button>
            ))}
          </div>
        </Panel>
      </ReactFlow>

      <DetailsPanel data={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function chip(active: boolean) {
  return `px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
    active
      ? 'bg-neutral-900 text-white border-neutral-900'
      : 'bg-white text-neutral-600 border-black/[0.08] hover:border-neutral-300'
  }`
}
