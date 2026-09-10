import { describe, expect, it } from 'vitest'
import { resolveReposForBoard } from './github-context'
import type { RepoConfig } from '@/lib/delivery/types'

const repos: RepoConfig[] = [
  { owner: 'jrbj001', repo: 'LP-LikeMe', label: 'Landing' },
  { owner: 'PixelPulseLab', repo: 'likeme-front-end', label: 'App' },
  { owner: 'PixelPulseLab', repo: 'likeme-back-end', label: 'API' },
]

describe('resolveReposForBoard', () => {
  it('usa BacklogBoard.repository como fonte canônica', () => {
    expect(resolveReposForBoard('likeme', 'likeme-app', repos)).toEqual([
      { owner: 'PixelPulseLab', repo: 'likeme-front-end', label: 'App' },
    ])
    expect(resolveReposForBoard('likeme', 'likeme-backend', repos)).toEqual([
      { owner: 'PixelPulseLab', repo: 'likeme-back-end', label: 'API' },
    ])
  })

  it('sintetiza o repo do board quando ele não está no delivery', () => {
    const selected = resolveReposForBoard('be180-ooh', 'visibilidade', [])
    expect(selected).toEqual([
      { owner: 'jrbj001', repo: 'image_brand_processing', label: 'Teste de Visibilidade' },
      { owner: 'Mavimarmara', repo: 'digital-branding', label: 'Teste de Visibilidade' },
    ])
  })

  it('resolve Colmeia e Banco de Ativos no repositório canônico', () => {
    const be180: RepoConfig[] = [
      { owner: 'jrbj001', repo: 'colmeia---meusroteirosdefault', label: 'Colmeia · Meus Roteiros' },
    ]
    expect(resolveReposForBoard('be180-ooh', 'colmeia', be180).map(r => r.repo)).toEqual([
      'colmeia---meusroteirosdefault',
    ])
    expect(resolveReposForBoard('be180-ooh', 'banco-ativos', be180).map(r => r.repo)).toEqual([
      'colmeia---meusroteirosdefault',
    ])
  })

  it('no Cadence WhatsApp da Be180 junta Colmeia e Teste de Visibilidade', () => {
    const be180: RepoConfig[] = [
      { owner: 'jrbj001', repo: 'colmeia---meusroteirosdefault', label: 'Colmeia · Meus Roteiros' },
      { owner: 'jrbj001', repo: 'image_brand_processing', label: 'Teste de Visibilidade · Backend' },
      { owner: 'Mavimarmara', repo: 'digital-branding', label: 'Teste de Visibilidade · Frontend' },
    ]
    expect(resolveReposForBoard('be180-ooh', 'cadence', be180).map(r => r.repo)).toEqual([
      'colmeia---meusroteirosdefault',
      'image_brand_processing',
      'digital-branding',
    ])
  })
})
