import type { Edge } from '@xyflow/react'

const base = {
  type: 'smoothstep' as const,
  animated: false,
  style: { stroke: '#94a3b8', strokeWidth: 1.5 },
  markerEnd: { type: 'arrowclosed' as const, color: '#64748b', width: 16, height: 16 },
}

function e(id: string, source: string, target: string, label?: string, style?: Partial<Edge>): Edge {
  return {
    id,
    source,
    target,
    label,
    ...base,
    ...style,
    labelStyle: label ? { fill: '#64748b', fontSize: 11, fontWeight: 500 } : undefined,
    labelBgStyle: label ? { fill: '#fafaf8', fillOpacity: 0.9 } : undefined,
    labelBgPadding: [4, 6] as [number, number],
  }
}

export const B2B_EDGES: Edge[] = [
  e('e-root-lead', 'root', 'lead'),
  e('e-root-neg', 'root', 'neg'),
  e('e-root-cad', 'root', 'cad'),
  e('e-root-ct', 'root', 'contrato'),
  e('e-root-in', 'root', 'input'),
  e('e-root-proc', 'root', 'proc'),
  e('e-root-fin', 'root', 'fin'),
  e('e-root-tr', 'root', 'track'),
  e('e-root-pos', 'root', 'pos'),

  // Stage sequence
  e('e-s1-s2', 'lead', 'neg'),
  e('e-s2-s3', 'neg', 'cad'),
  e('e-s3-s4', 'cad', 'contrato'),
  e('e-s4-s5', 'contrato', 'input'),
  e('e-s5-s6', 'input', 'proc'),
  e('e-s6-s7', 'proc', 'fin'),
  e('e-s7-s8', 'fin', 'track'),
  e('e-s8-s9', 'track', 'pos'),

  // 1 Lead
  e('e-lead-l1', 'lead', 'l1'),
  e('e-l1-l6', 'l1', 'l6'),
  e('e-l2-l5', 'l2', 'l5'),
  e('e-l3-l5', 'l3', 'l5'),
  e('e-l4-l6', 'l4', 'l6'),
  e('e-l5-l6', 'l5', 'l6'),
  e('e-l2', 'lead', 'l2'),
  e('e-l3', 'lead', 'l3'),
  e('e-l4', 'lead', 'l4'),
  e('e-l6-neg', 'l6', 'neg'),

  // 2 Neg
  e('e-neg-n1', 'neg', 'n1'),
  e('e-n1-n2', 'n1', 'n2'),
  e('e-n2-d1', 'n2', 'd1'),
  e('e-d1-neg', 'd1', 'nneg', 'Não', {
    style: { stroke: '#F04A24', strokeWidth: 1.5 },
    markerEnd: { type: 'arrowclosed', color: '#F04A24', width: 16, height: 16 },
  }),
  e('e-d1-pos', 'd1', 'npos', 'Sim', {
    style: { stroke: '#7DBA36', strokeWidth: 1.5 },
    markerEnd: { type: 'arrowclosed', color: '#7DBA36', width: 16, height: 16 },
  }),
  e('e-npos-n3', 'npos', 'n3'),
  e('e-n3-n4', 'n3', 'n4'),
  e('e-n4-n5', 'n4', 'n5'),
  e('e-n5-n6', 'n5', 'n6'),
  e('e-n6-n7', 'n6', 'n7'),
  e('e-n7-cad', 'n7', 'cad'),

  // 3–4
  e('e-cad-c1', 'cad', 'c1'),
  e('e-c1-ct', 'c1', 'contrato'),
  e('e-ct-ct1', 'contrato', 'ct1'),
  e('e-ct1-d2', 'ct1', 'd2'),
  e('e-d2-sim', 'd2', 'ct2', 'Sim', {
    style: { stroke: '#7DBA36', strokeWidth: 1.5 },
    markerEnd: { type: 'arrowclosed', color: '#7DBA36', width: 16, height: 16 },
  }),
  e('e-d2-nao', 'd2', 'input', 'Não'),
  e('e-ct2-in', 'ct2', 'input'),
  e('e-ct1-ct3', 'ct1', 'ct3'),

  // 5 Input
  e('e-in-i1', 'input', 'i1'),
  e('e-i1-i2', 'i1', 'i2'),
  e('e-i2-i3', 'i2', 'i3'),
  e('e-i3-i4', 'i3', 'i4'),
  e('e-i4-i5', 'i4', 'i5'),
  e('e-i5-d3', 'i5', 'd3'),
  e('e-d3-nao', 'd3', 'i8', 'Não', {
    style: { stroke: '#7DBA36', strokeWidth: 1.5 },
    markerEnd: { type: 'arrowclosed', color: '#7DBA36', width: 16, height: 16 },
  }),
  e('e-d3-sim', 'd3', 'i6', 'Sim', {
    style: { stroke: '#F04A24', strokeWidth: 1.5 },
    markerEnd: { type: 'arrowclosed', color: '#F04A24', width: 16, height: 16 },
  }),
  e('e-i6-i7', 'i6', 'i7'),
  e('e-i7-i8', 'i7', 'i8'),
  e('e-i8-proc', 'i8', 'proc'),

  // 6 Proc
  e('e-proc-p1', 'proc', 'p1'),
  e('e-p1-p2', 'p1', 'p2'),
  e('e-p2-p3', 'p2', 'p3'),
  e('e-p3-p4', 'p3', 'p4'),
  e('e-p4-p5', 'p4', 'p5'),
  e('e-p5-p6', 'p5', 'p6'),
  e('e-p6-p7', 'p6', 'p7'),
  e('e-p7-fin', 'p7', 'fin'),

  // 7 Fin
  e('e-fin-f1', 'fin', 'f1'),
  e('e-fin-f2', 'fin', 'f2'),
  e('e-fin-f3', 'fin', 'f3'),
  e('e-f1-f4', 'f1', 'f4'),
  e('e-f2-f4', 'f2', 'f4'),
  e('e-f3-f5', 'f3', 'f5'),
  e('e-f5-f6', 'f5', 'f6'),
  e('e-f4-track', 'f4', 'track'),
  e('e-f6-track', 'f6', 'track'),

  // 8 Track
  e('e-tr-t1', 'track', 't1'),
  e('e-t1-t2', 't1', 't2'),
  e('e-t2-t3', 't2', 't3'),
  e('e-t3-t4', 't3', 't4', 'melhoria', {
    style: { stroke: '#E5BC46', strokeWidth: 1.5, strokeDasharray: '6 4' },
    markerEnd: { type: 'arrowclosed', color: '#E5BC46', width: 16, height: 16 },
  }),
  e('e-t3-pos', 't3', 'pos'),

  // 9 Pos
  e('e-pos-r1', 'pos', 'r1'),
  e('e-r1-r2', 'r1', 'r2'),
  e('e-r2-r3', 'r2', 'r3'),
  e('e-r3-r4', 'r3', 'r4', 'futuro', {
    style: { stroke: '#E5BC46', strokeWidth: 1.5, strokeDasharray: '6 4' },
    markerEnd: { type: 'arrowclosed', color: '#E5BC46', width: 16, height: 16 },
  }),
  e('e-r3-r5', 'r3', 'r5', 'futuro', {
    style: { stroke: '#E5BC46', strokeWidth: 1.5, strokeDasharray: '6 4' },
    markerEnd: { type: 'arrowclosed', color: '#E5BC46', width: 16, height: 16 },
  }),
  e('e-r3-r6', 'r3', 'r6', 'futuro', {
    style: { stroke: '#E5BC46', strokeWidth: 1.5, strokeDasharray: '6 4' },
    markerEnd: { type: 'arrowclosed', color: '#E5BC46', width: 16, height: 16 },
  }),
  e('e-r3-input', 'r3', 'input', 'recompra'),
]
