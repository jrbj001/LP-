import { describe, expect, it } from 'vitest'
import { interleaveByRepo, resolveReposForBoard } from './github-context'
import type { RepoConfig } from '@/lib/delivery/types'

const repos: RepoConfig[] = [
  { owner: 'PixelPulseLab', repo: 'LP-LikeMe', label: 'Landing' },
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
      { owner: 'PixelPulseLab', repo: 'image_brand_processing', label: 'Teste de Visibilidade' },
      { owner: 'PixelPulseLab', repo: 'visibilidade-front', label: 'Teste de Visibilidade' },
    ])
  })

  it('resolve Colmeia e Banco de Ativos no repositório canônico', () => {
    const be180: RepoConfig[] = [
      { owner: 'PixelPulseLab', repo: 'colmeia---meusroteirosdefault', label: 'Colmeia · Meus Roteiros' },
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
      { owner: 'PixelPulseLab', repo: 'colmeia---meusroteirosdefault', label: 'Colmeia · Meus Roteiros' },
      { owner: 'PixelPulseLab', repo: 'image_brand_processing', label: 'Teste de Visibilidade · Backend' },
      { owner: 'PixelPulseLab', repo: 'visibilidade-front', label: 'Teste de Visibilidade · Frontend' },
    ]
    expect(resolveReposForBoard('be180-ooh', 'cadence', be180).map(r => r.repo)).toEqual([
      'colmeia---meusroteirosdefault',
      'image_brand_processing',
      'visibilidade-front',
    ])
  })
})

describe('interleaveByRepo', () => {
  const snippet = (repo: string, path: string) => ({
    repo,
    path,
    url: `https://github.com/${repo}/blob/HEAD/${path}`,
    excerpt: '',
  })

  it('garante espaço para todos os repositórios dentro do limite', () => {
    const merged = interleaveByRepo(
      [
        [snippet('a', 'a1'), snippet('a', 'a2'), snippet('a', 'a3')],
        [snippet('b', 'b1'), snippet('b', 'b2')],
        [snippet('c', 'c1')],
      ],
      4
    )
    expect(merged.map(item => item.path)).toEqual(['a1', 'b1', 'c1', 'a2'])
  })

  it('não quebra quando um repositório não devolve nada', () => {
    const merged = interleaveByRepo([[], [snippet('b', 'b1')]], 5)
    expect(merged.map(item => item.path)).toEqual(['b1'])
  })
})
