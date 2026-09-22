import { describe, expect, it } from 'vitest'
import {
  critiqueQueryResult,
  formatCritiqueForPrompt,
  mergeConferenceSuggestions,
} from './result-critic'

describe('critiqueQueryResult', () => {
  it('marca vazio com WHERE como filtro, não como métrica zero', () => {
    const critique = critiqueQueryResult({
      question: 'quantos usuários ativos temos?',
      sql: `SELECT count(*) FROM public.user WHERE status = 'ativo'`,
      columns: ['count'],
      rows: [],
    })
    expect(critique.status).toBe('flagged')
    expect(critique.issues.some(issue => issue.code === 'empty_with_filter')).toBe(true)
    expect(critique.conferenceQuestion).toMatch(/sem aplicar esse filtro/)
  })

  it('marca COUNT sem o filtro pedido na pergunta', () => {
    const critique = critiqueQueryResult({
      question: 'quantos usuários ativos temos neste mês?',
      sql: 'SELECT count(*) AS total FROM public.user',
      columns: ['total'],
      rows: [{ total: 1200 }],
    })
    expect(critique.issues.some(issue => issue.code === 'count_without_filter')).toBe(true)
  })

  it('detecta JOIN que duplica o identificador', () => {
    const rows = Array.from({ length: 12 }, (_, index) => ({
      id: String(Math.floor(index / 3)),
      title: `item ${index}`,
    }))
    const critique = critiqueQueryResult({
      question: 'quais roteiros existem?',
      sql: 'SELECT r.id, i.title FROM dbo.roteiros r JOIN dbo.itens i ON i.roteiro_id = r.id',
      columns: ['id', 'title'],
      rows,
    })
    expect(critique.issues.some(issue => issue.code === 'join_cardinality')).toBe(true)
    expect(critique.confidence).toBe('high')
  })

  it('fica inconclusivo quando o JOIN só repete um pouco', () => {
    const rows = [
      ...Array.from({ length: 7 }, (_, index) => ({ id: String(index), name: `n${index}` })),
      { id: '0', name: 'dup' },
      { id: '1', name: 'dup' },
    ]
    const critique = critiqueQueryResult({
      question: 'liste os pontos',
      sql: 'SELECT p.id, p.name FROM dbo.pontos p JOIN dbo.midia m ON m.ponto_id = p.id',
      columns: ['id', 'name'],
      rows,
    })
    expect(critique.confidence).toBe('inconclusive')
    expect(critique.issues.some(issue => issue.code === 'join_cardinality')).toBe(true)
  })

  it('marca agregação zerada', () => {
    const critique = critiqueQueryResult({
      question: 'qual o total de vendas?',
      sql: 'SELECT sum(amount) AS total FROM public.sales',
      columns: ['total'],
      rows: [{ total: 0 }],
    })
    expect(critique.issues.some(issue => issue.code === 'null_aggregation')).toBe(true)
  })

  it('marca listagem no teto quando a pergunta pedia total', () => {
    const rows = Array.from({ length: 100 }, (_, index) => ({ id: String(index) }))
    const critique = critiqueQueryResult({
      question: 'quantos cards existem?',
      sql: 'SELECT id FROM cadence_cards WHERE client_id = $1 LIMIT 100',
      columns: ['id'],
      rows,
    })
    expect(critique.issues.some(issue => issue.code === 'limit_saturated')).toBe(true)
  })

  it('passa em um COUNT simples com linhas', () => {
    const critique = critiqueQueryResult({
      question: 'quantos usuários temos?',
      sql: 'SELECT count(*) AS total FROM public.user',
      columns: ['total'],
      rows: [{ total: 42 }],
    })
    expect(critique).toMatchObject({ status: 'ok', issues: [] })
  })

  it('formata notas e injeta pergunta de conferência nas sugestões', () => {
    const critique = critiqueQueryResult({
      question: 'quantos usuários ativos?',
      sql: `SELECT count(*) FROM public.user WHERE status = 'x'`,
      columns: [],
      rows: [],
    })
    expect(formatCritiqueForPrompt(critique)).toContain('não retornou linhas')
    expect(mergeConferenceSuggestions(['Outra pergunta?'], critique.conferenceQuestion)[0]).toBe(
      critique.conferenceQuestion
    )
  })
})
