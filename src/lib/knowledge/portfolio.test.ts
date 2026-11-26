import { describe, expect, it } from 'vitest'
import { getClientOrThrow, listClients } from '@/lib/client/registry'
import { knowledgeClients, knowledgeRepos, projectsBrief } from './portfolio'

const cadence = getClientOrThrow('cadence')
const likeme = getClientOrThrow('likeme')

function slugs(question: string): string[] {
  return knowledgeClients(cadence, question).map(client => client.slug)
}

describe('knowledgeClients', () => {
  it('workspace de cliente enxerga só a si mesmo', () => {
    expect(knowledgeClients(likeme, 'quantos exibidores a Be180 tem?').map(client => client.slug)).toEqual([
      'likeme',
    ])
  })

  it('no portfólio, pergunta sem pista cobre todos os workspaces', () => {
    expect(slugs('quais projetos estão ativos?')).toHaveLength(listClients().length)
  })

  it('o nome Cadence sozinho não restringe ao workspace Cadence', () => {
    expect(slugs('Cadence, quais projetos estão ativos?')).toHaveLength(listClients().length)
  })

  it('pergunta que cita um cliente ou projeto fica restrita a ele', () => {
    expect(slugs('Cadence, como está o Colmeia?')).toEqual(['be180-ooh'])
    expect(slugs('quantos usuários a Like:Me tem?')).toEqual(['likeme'])
    expect(slugs('o que mudou na LP essa semana?')).toEqual(['cadence'])
  })

  it('pergunta que cita dois clientes cobre os dois', () => {
    expect(slugs('compare o Colmeia com a Like Me').sort()).toEqual(['be180-ooh', 'likeme'])
  })
})

describe('knowledgeRepos', () => {
  it('junta os repositórios do portfólio sem repetir', () => {
    const repos = knowledgeRepos(listClients()).map(repo => `${repo.owner}/${repo.repo}`)
    expect(new Set(repos).size).toBe(repos.length)
    expect(repos).toContain('jrbj001/LP-')
    expect(repos).toContain('PixelPulseLab/likeme-back-end')
  })
})

describe('projectsBrief', () => {
  it('cliente recebe só o próprio cadastro', () => {
    const brief = projectsBrief(likeme)
    expect(brief).toContain('Like:Me')
    expect(brief).not.toContain('Be180')
  })

  it('portfólio recebe o cadastro de todos os workspaces', () => {
    const brief = projectsBrief(cadence)
    for (const client of listClients()) expect(brief).toContain(`## ${client.name}`)
  })
})
