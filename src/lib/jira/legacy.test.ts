import { describe, expect, it } from 'vitest'
import {
  assertCanWriteOriginalEstimate,
  hoursToJiraEstimate,
  isUnestimated,
  JiraLegacyEstimateError,
  parseJiraDurationToHours,
} from './legacy'
import { adfToPlainText } from './adf'
import { clampEstimateHours, medianHours, pickBoardsForIssue, pickSimilarPrs } from './estimate'
import type { PrRow } from '@/lib/delivery/types'

describe('legado de original estimate', () => {
  it('trata vazio, 0m e 0h como não estimado', () => {
    expect(isUnestimated({ originalEstimate: null, originalEstimateSeconds: null })).toBe(true)
    expect(isUnestimated({ originalEstimate: '', originalEstimateSeconds: 0 })).toBe(true)
    expect(isUnestimated({ originalEstimate: '0m', originalEstimateSeconds: 0 })).toBe(true)
    expect(isUnestimated({ originalEstimate: '0h', originalEstimateSeconds: 0 })).toBe(true)
    expect(isUnestimated({ originalEstimate: '0d', originalEstimateSeconds: 0 })).toBe(true)
  })

  it('protege estimativas já gravadas (incluindo APP-382 = 3d)', () => {
    expect(isUnestimated({ originalEstimate: '3d', originalEstimateSeconds: 86400 })).toBe(false)
    expect(isUnestimated({ originalEstimate: '2d 4h', originalEstimateSeconds: 72000 })).toBe(false)
    expect(isUnestimated({ originalEstimate: '30m', originalEstimateSeconds: 1800 })).toBe(false)
    expect(isUnestimated({ originalEstimate: null, originalEstimateSeconds: 3600 })).toBe(false)
  })

  it('recusa escrita quando já existe original estimate', () => {
    expect(() =>
      assertCanWriteOriginalEstimate({ key: 'APP-382', originalEstimate: '3d', originalEstimateSeconds: 86400 })
    ).toThrow(JiraLegacyEstimateError)
    expect(() =>
      assertCanWriteOriginalEstimate({ key: 'APP-1', originalEstimate: '0m', originalEstimateSeconds: 0 })
    ).not.toThrow()
  })
})

describe('conversão 8h = 1d', () => {
  it('formata horas no padrão Jira', () => {
    expect(hoursToJiraEstimate(24)).toBe('3d')
    expect(hoursToJiraEstimate(20)).toBe('2d 4h')
    expect(hoursToJiraEstimate(8)).toBe('1d')
    expect(hoursToJiraEstimate(0.5)).toBe('30m')
    expect(parseJiraDurationToHours('3d')).toBe(24)
    expect(parseJiraDurationToHours('2d 4h')).toBe(20)
  })
})

describe('ADF', () => {
  it('extrai texto de documento Atlassian', () => {
    const adf = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Como usuário' },
            { type: 'text', text: ' quero pagar com Google Pay' },
          ],
        },
      ],
    }
    expect(adfToPlainText(adf)).toBe('Como usuário quero pagar com Google Pay')
    expect(adfToPlainText('texto legado')).toBe('texto legado')
  })
})

describe('estimador heurístico', () => {
  it('escolhe boards por palavras da story', () => {
    expect(pickBoardsForIssue('Google Pay no Android e Pagar.me')).toEqual(['likeme-backend', 'likeme-app'])
    expect(pickBoardsForIssue('newsletter SendGrid na landing')).toEqual(['likeme-landing'])
  })

  it('usa mediana de PRs similares e ignora score 0', () => {
    const prs = [
      pr({ title: 'Google Pay Android', estimatedHours: 16, number: 1 }),
      pr({ title: ' unrelated chore', estimatedHours: 2, number: 2 }),
      pr({ title: 'pagar.me google pay', estimatedHours: 8, number: 3 }),
    ]
    const similar = pickSimilarPrs(prs, ['google', 'pagar'])
    expect(similar.map(item => item.number)).toEqual([3, 1])
    expect(medianHours(similar.map(item => item.hours), 8)).toBe(12)
    expect(clampEstimateHours(12.2)).toBe(12)
  })
})

function pr(partial: Partial<PrRow> & { title: string; estimatedHours: number; number: number }): PrRow {
  return {
    repo: 'PixelPulseLab/likeme-front-end',
    branch: 'feat/pay',
    type: 'feature',
    product: 'App',
    mergedAt: '2026-08-01T00:00:00Z',
    additions: 100,
    deletions: 10,
    changedFiles: 4,
    commitCount: 3,
    ...partial,
  }
}
