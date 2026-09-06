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

  it('inclui o backend público junto do Colmeia e do Banco de Ativos', () => {
    const be180: RepoConfig[] = [
      { owner: 'jrbj001', repo: 'colmeia---meusroteirosdefault', label: 'Colmeia · Meus Roteiros' },
      { owner: 'jrbj001', repo: 'be180_main_service', label: 'Colmeia · Backend (main service)' },
    ]
    expect(resolveReposForBoard('be180-ooh', 'colmeia', be180).map(r => r.repo)).toEqual([
      'colmeia---meusroteirosdefault',
      'be180_main_service',
    ])
    expect(resolveReposForBoard('be180-ooh', 'banco-ativos', be180).map(r => r.repo)).toEqual([
      'colmeia---meusroteirosdefault',
      'be180_main_service',
    ])
  })
})
