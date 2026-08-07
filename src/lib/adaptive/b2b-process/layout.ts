import dagre from '@dagrejs/dagre'
import type { Edge, Node } from '@xyflow/react'
import type { ProcessNodeData } from './types'

const NODE_W = 240
const NODE_H = 72
const DECISION_W = 180
const DECISION_H = 100

export function layoutB2B(
  nodes: Node<ProcessNodeData>[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
): Node<ProcessNodeData>[] {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: direction,
    nodesep: 36,
    ranksep: 72,
    marginx: 24,
    marginy: 24,
  })

  for (const node of nodes) {
    const isDecision = node.data.kind === 'decision'
    g.setNode(node.id, {
      width: isDecision ? DECISION_W : NODE_W,
      height: isDecision ? DECISION_H : node.data.kind === 'root' || node.data.kind === 'stage' ? 56 : NODE_H,
    })
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  return nodes.map(node => {
    const pos = g.node(node.id)
    const isDecision = node.data.kind === 'decision'
    const w = isDecision ? DECISION_W : NODE_W
    const h = isDecision ? DECISION_H : NODE_H
    return {
      ...node,
      position: {
        x: pos.x - w / 2,
        y: pos.y - h / 2,
      },
    }
  })
}
