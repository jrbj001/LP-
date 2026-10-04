import dagre from '@dagrejs/dagre'

export const TABLE_NODE_WIDTH = 240
export const TABLE_NODE_HEADER = 44
export const TABLE_NODE_ROW = 20
export const TABLE_NODE_FOOTER = 12
export const TABLE_NODE_MAX_ROWS = 12

export interface LayoutNodeInput {
  id: string
  columnCount: number
}

export interface LayoutEdgeInput {
  source: string
  target: string
}

export interface LayoutPosition {
  x: number
  y: number
  width: number
  height: number
}

export function tableNodeHeight(columnCount: number): number {
  const rows = Math.min(columnCount, TABLE_NODE_MAX_ROWS)
  const overflow = columnCount > TABLE_NODE_MAX_ROWS ? TABLE_NODE_ROW : 0
  return TABLE_NODE_HEADER + rows * TABLE_NODE_ROW + overflow + TABLE_NODE_FOOTER
}

export function layoutDataModel(
  nodes: LayoutNodeInput[],
  edges: LayoutEdgeInput[],
  direction: 'LR' | 'TB' = 'LR'
): Map<string, LayoutPosition> {
  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  graph.setGraph({
    rankdir: direction,
    nodesep: 40,
    ranksep: 90,
    marginx: 24,
    marginy: 24,
  })

  const ids = new Set(nodes.map(node => node.id))
  for (const node of nodes) {
    graph.setNode(node.id, {
      width: TABLE_NODE_WIDTH,
      height: tableNodeHeight(node.columnCount),
    })
  }
  for (const edge of edges) {
    if (edge.source === edge.target) continue
    if (!ids.has(edge.source) || !ids.has(edge.target)) continue
    graph.setEdge(edge.source, edge.target)
  }

  dagre.layout(graph)

  const positions = new Map<string, LayoutPosition>()
  for (const node of nodes) {
    const laidOut = graph.node(node.id)
    const height = tableNodeHeight(node.columnCount)
    positions.set(node.id, {
      x: laidOut.x - TABLE_NODE_WIDTH / 2,
      y: laidOut.y - height / 2,
      width: TABLE_NODE_WIDTH,
      height,
    })
  }
  return positions
}
