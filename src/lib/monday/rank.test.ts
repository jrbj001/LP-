import { describe, expect, it } from 'vitest'
import { rankMondayItems } from './rank'

const items = [
  { name: 'Promoção do inventário', excerpt: 'aguardando revisão' },
  { name: 'Ajuste de roteiro', excerpt: 'campanha de maio' },
  { name: 'Outro item', excerpt: 'sem relação' },
]

describe('rankMondayItems', () => {
  it('filtra pelos termos da pergunta', () => {
    expect(rankMondayItems('o que tem no monday sobre o inventário', items).map(item => item.name)).toEqual([
      'Promoção do inventário',
    ])
  })

  it('sem palavra útil, devolve os primeiros itens', () => {
    expect(rankMondayItems('monday', items)).toHaveLength(3)
  })
})