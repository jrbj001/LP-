import { describe, expect, it } from 'vitest'
import { KNOWLEDGE_EVAL_CASES } from './fixtures'
import { evaluateKnowledgeBaseline, formatKnowledgeEvalReport } from './score'

describe('golden set de conhecimento', () => {
  it('cobre as classes combinadas no plano', () => {
    const classes = new Set(KNOWLEDGE_EVAL_CASES.map(item => item.class))
    expect(classes).toEqual(
      new Set([
        'count',
        'list',
        'rank',
        'period',
        'status',
        'catalog',
        'flow',
        'ambiguous',
        'chitchat',
      ])
    )
    expect(KNOWLEDGE_EVAL_CASES.length).toBeGreaterThanOrEqual(24)
  })

  it('marca o baseline atual e os casos que ainda falham', () => {
    const report = evaluateKnowledgeBaseline()
    expect(report.total).toBe(KNOWLEDGE_EVAL_CASES.length)
    expect(report.passed).toBeGreaterThan(15)
    expect(report.gapIds).toEqual([])
    expect(formatKnowledgeEvalReport(report)).toContain(`passed=${report.passed}/${report.total}`)
  })
})
