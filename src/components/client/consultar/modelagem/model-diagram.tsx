'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Download, Search } from 'lucide-react'
import { layoutDataModel } from '@/lib/data-sources/model/layout'
import {
  modelTableKey,
  type DataModelAi,
  type DataModelSnapshot,
} from '@/lib/data-sources/model/types'
import { TableDetails } from './table-details'
import { TableNode, type TableFlowNode } from './table-node'

const nodeTypes = { table: TableNode }

const MAX_DIAGRAM_NODES = 150

export function ModelDiagram({
  snapshot,
  ai,
  selectedKey,
  onSelect,
}: {
  snapshot: DataModelSnapshot
  ai: DataModelAi | null
  selectedKey: string | null
  onSelect: (key: string | null) => void
}) {
  const [schema, setSchema] = useState<string>('all')
  const [relatedOnly, setRelatedOnly] = useState(snapshot.relationships.length > 0)
  const [query, setQuery] = useState('')

  const related = useMemo(() => {
    const set = new Set<string>()
    for (const rel of snapshot.relationships) {
      set.add(modelTableKey(rel.from))
      set.add(modelTableKey(rel.to))
    }
    return set
  }, [snapshot.relationships])

  const degree = useMemo(() => {
    const map = new Map<string, number>()
    for (const rel of snapshot.relationships) {
      for (const key of [modelTableKey(rel.from), modelTableKey(rel.to)]) {
        map.set(key, (map.get(key) ?? 0) + 1)
      }
    }
    return map
  }, [snapshot.relationships])

  const { visibleTables, truncated } = useMemo(() => {
    let tables = snapshot.tables.filter(table => schema === 'all' || table.schema === schema)
    if (relatedOnly) tables = tables.filter(table => related.has(modelTableKey(table)))
    if (tables.length > MAX_DIAGRAM_NODES) {
      tables = [...tables]
        .sort((a, b) => (degree.get(modelTableKey(b)) ?? 0) - (degree.get(modelTableKey(a)) ?? 0))
        .slice(0, MAX_DIAGRAM_NODES)
      return { visibleTables: tables, truncated: true }
    }
    return { visibleTables: tables, truncated: false }
  }, [snapshot.tables, schema, relatedOnly, related, degree])

  const { initialNodes, initialEdges } = useMemo(() => {
    const visible = new Set(visibleTables.map(modelTableKey))
    const edges: Edge[] = []
    const seen = new Set<string>()
    for (const rel of snapshot.relationships) {
      const source = modelTableKey(rel.from)
      const target = modelTableKey(rel.to)
      if (!visible.has(source) || !visible.has(target) || source === target) continue
      const id = `${source}.${rel.from.column}->${target}.${rel.to.column}`
      if (seen.has(id)) continue
      seen.add(id)
      edges.push({
        id,
        source,
        target,
        type: 'smoothstep',
        label: rel.from.column,
        labelStyle: { fontSize: 9, fill: '#737373' },
        labelBgStyle: { fill: '#fafaf8' },
        labelBgPadding: [3, 2],
        style: { stroke: '#a3a3a3', strokeWidth: 1.2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#a3a3a3', width: 14, height: 14 },
      })
    }
    const positions = layoutDataModel(
      visibleTables.map(table => ({ id: modelTableKey(table), columnCount: table.columns.length })),
      edges.map(edge => ({ source: edge.source, target: edge.target })),
      'LR'
    )
    const nodes: TableFlowNode[] = visibleTables.map(table => {
      const key = modelTableKey(table)
      const position = positions.get(key)
      return {
        id: key,
        type: 'table',
        position: { x: position?.x ?? 0, y: position?.y ?? 0 },
        data: {
          table,
          aiDescription: ai?.tables[key]?.description,
          dimmed: false,
          relatedCount: degree.get(key) ?? 0,
        },
      }
    })
    return { initialNodes: nodes, initialEdges: edges }
  }, [visibleTables, snapshot.relationships, ai, degree])

  const [nodes, setNodes, onNodesChange] = useNodesState<TableFlowNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  useEffect(() => {
    const needle = query.trim().toLowerCase()
    setNodes(current =>
      current.map(node => {
        const matches =
          !needle ||
          node.id.toLowerCase().includes(needle) ||
          node.data.table.columns.some(column => column.column.toLowerCase().includes(needle))
        const dimmed = !matches
        return {
          ...node,
          selected: node.id === selectedKey,
          data: node.data.dimmed === dimmed ? node.data : { ...node.data, dimmed },
        }
      })
    )
  }, [query, selectedKey, setNodes])

  const onNodeClick: NodeMouseHandler<TableFlowNode> = useCallback(
    (_, node) => onSelect(node.id === selectedKey ? null : node.id),
    [onSelect, selectedKey]
  )

  const exportPng = useCallback(async () => {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement | null
    if (!element) return
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(element, { pixelRatio: 2, backgroundColor: '#fafaf8' })
      const anchor = document.createElement('a')
      anchor.href = dataUrl
      anchor.download = `${snapshot.sourceName.replace(/[^\w-]+/g, '-').toLowerCase()}-modelagem.png`
      anchor.click()
    } catch {
      window.print()
    }
  }, [snapshot.sourceName])

  const selectedTable = selectedKey
    ? snapshot.tables.find(table => modelTableKey(table) === selectedKey) ?? null
    : null

  const layoutKey = `${schema}|${relatedOnly}|${visibleTables.length}`

  return (
    <div className="relative h-[calc(100vh-13rem)] min-h-[560px] w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-[#fafaf8]">
      <ReactFlow<TableFlowNode, Edge>
        key={layoutKey}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={() => onSelect(null)}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
        minZoom={0.05}
        maxZoom={1.75}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} color="#e5e5e5" />
        <Controls showInteractive={false} />
        {nodes.length > 8 && (
          <MiniMap
            pannable
            zoomable
            nodeColor={node => ((node as TableFlowNode).data?.table.type === 'table' ? '#171717' : '#c7d2fe')}
          />
        )}

        <Panel position="top-left" className="!m-3">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/[0.08] bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Destacar tabela ou coluna"
                className="h-8 w-52 rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-8 pr-2 text-[11px] text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
              />
            </label>
            {snapshot.schemas.length > 1 && (
              <select
                value={schema}
                onChange={event => setSchema(event.target.value)}
                className="h-8 rounded-lg border border-black/[0.08] bg-white px-2 text-[11px] text-neutral-700 outline-none"
              >
                <option value="all">Todos os schemas</option>
                {snapshot.schemas.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-neutral-600">
              <input
                type="checkbox"
                checked={relatedOnly}
                onChange={event => setRelatedOnly(event.target.checked)}
                className="h-3.5 w-3.5 accent-neutral-900"
              />
              Só tabelas relacionadas
            </label>
            <span className="text-[10px] text-neutral-400">
              {nodes.length} tabelas · {edges.length} relações
              {truncated ? ` · mostrando as ${MAX_DIAGRAM_NODES} mais conectadas` : ''}
            </span>
          </div>
        </Panel>

        <Panel position="top-right" className="!m-3">
          <button
            type="button"
            onClick={() => void exportPng()}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white/95 px-3 text-[11px] font-medium text-neutral-700 shadow-sm backdrop-blur hover:border-neutral-300"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar PNG
          </button>
        </Panel>
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="rounded-xl bg-white/90 px-4 py-3 text-[12px] text-neutral-500 shadow-sm">
            {relatedOnly
              ? 'Nenhuma tabela com relacionamentos neste filtro. Desmarque "Só tabelas relacionadas".'
              : 'Nenhuma tabela neste filtro.'}
          </p>
        </div>
      )}

      {selectedTable && (
        <aside className="absolute inset-y-3 right-3 z-10 w-[min(440px,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xl">
          <TableDetails
            table={selectedTable}
            ai={ai?.tables[modelTableKey(selectedTable)]}
            relationships={snapshot.relationships}
            onClose={() => onSelect(null)}
            onNavigate={onSelect}
          />
        </aside>
      )}
    </div>
  )
}
