import { describe, expect, it } from 'vitest'
import {
  TABLE_NODE_FOOTER,
  TABLE_NODE_HEADER,
  TABLE_NODE_MAX_ROWS,
  TABLE_NODE_ROW,
  TABLE_NODE_WIDTH,
  layoutDataModel,
  tableNodeHeight,
} from './layout'

describe('tableNodeHeight', () => {
  it('cresce com as colunas até o máximo e adiciona linha de overflow', () => {
    expect(tableNodeHeight(3)).toBe(TABLE_NODE_HEADER + 3 * TABLE_NODE_ROW + TABLE_NODE_FOOTER)
    expect(tableNodeHeight(TABLE_NODE_MAX_ROWS + 5)).toBe(
      TABLE_NODE_HEADER + (TABLE_NODE_MAX_ROWS + 1) * TABLE_NODE_ROW + TABLE_NODE_FOOTER
    )
  })
})

describe('layoutDataModel', () => {
  it('posiciona nós sem sobreposição seguindo a direção do grafo', () => {
    const positions = layoutDataModel(
      [
        { id: 'public.users', columnCount: 4 },
        { id: 'public.orders', columnCount: 6 },
        { id: 'public.items', columnCount: 3 },
      ],
      [
        { source: 'public.orders', target: 'public.users' },
        { source: 'public.items', target: 'public.orders' },
        { source: 'public.items', target: 'public.items' },
        { source: 'public.items', target: 'public.unknown' },
      ],
      'LR'
    )
    expect(positions.size).toBe(3)
    const users = positions.get('public.users')!
    const orders = positions.get('public.orders')!
    const items = positions.get('public.items')!
    expect(users.width).toBe(TABLE_NODE_WIDTH)
    expect(orders.height).toBe(tableNodeHeight(6))
    expect(items.x).toBeLessThan(orders.x)
    expect(orders.x).toBeLessThan(users.x)
    expect(orders.x - items.x).toBeGreaterThanOrEqual(TABLE_NODE_WIDTH)
  })

  it('funciona sem arestas', () => {
    const positions = layoutDataModel([{ id: 'a', columnCount: 1 }, { id: 'b', columnCount: 1 }], [])
    expect(positions.get('a')).toBeDefined()
    expect(positions.get('b')).toBeDefined()
    expect(positions.get('a')!.y).not.toBe(positions.get('b')!.y)
  })
})
