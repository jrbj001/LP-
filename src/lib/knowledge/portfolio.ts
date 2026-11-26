import { listClients } from '@/lib/client/registry'
import type { ClientProjectStatus, ClientWorkspace } from '@/lib/client/types'
import type { RepoConfig } from '@/lib/delivery/types'

/** Na reunião, "Cadence" é o nome do agente: não serve de pista para escolher workspace. */
const AGENT_NAME = /\bcad[eê]nce\b/gi

const STATUS_LABEL: Record<ClientProjectStatus, string> = {
  active: 'ativo',
  discovery: 'discovery',
  proposed: 'proposto',
  deferred: 'adiado',
  done: 'concluído',
}

export function isPortfolioWorkspace(client: ClientWorkspace): boolean {
  return client.knowledgeScope === 'portfolio'
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function clientCues(client: ClientWorkspace): string[] {
  const cues = [
    client.slug,
    client.id,
    client.name,
    ...(client.aliases ?? []),
    ...(client.knowledgeAliases ?? []),
    ...(client.projects ?? []).map(project => project.name),
  ]
  return [...new Set(cues.map(normalize).filter(cue => cue.length >= 2 && !/\bcadence\b/.test(cue)))]
}

function mentions(text: string, cue: string): boolean {
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(cue)}`).test(text)
}

/**
 * Workspaces que a pesquisa deve cobrir. Workspace de cliente enxerga só a si mesmo.
 * No portfólio, a pergunta que cita um cliente ou projeto fica restrita a ele;
 * sem pista, cobre todos os workspaces.
 */
export function knowledgeClients(client: ClientWorkspace, question: string): ClientWorkspace[] {
  if (!isPortfolioWorkspace(client)) return [client]
  const all = [client, ...listClients().filter(item => item.slug !== client.slug)]
  const text = normalize(question.replace(AGENT_NAME, ' '))
  const matched = all.filter(item => clientCues(item).some(cue => mentions(text, cue)))
  return matched.length > 0 ? matched : all
}

export function knowledgeRepos(clients: ClientWorkspace[]): RepoConfig[] {
  const seen = new Set<string>()
  const repos: RepoConfig[] = []
  for (const client of clients) {
    for (const repo of client.delivery?.repos ?? []) {
      const key = `${repo.owner}/${repo.repo}`.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      repos.push(repo)
    }
  }
  return repos
}

function clientBrief(client: ClientWorkspace): string {
  const lines = [`## ${client.name} (${client.sector})`, client.tagline]
  for (const project of client.projects ?? []) {
    const meta = [STATUS_LABEL[project.status], project.owner, project.priority && `prioridade ${project.priority}`]
      .filter(Boolean)
      .join(', ')
    lines.push(`- ${project.name} [${meta}]: ${project.description}`)
  }
  const repos = client.delivery?.repos ?? []
  if (repos.length > 0) {
    lines.push(`Repositórios: ${repos.map(repo => `${repo.owner}/${repo.repo} (${repo.label})`).join('; ')}`)
  }
  return lines.join('\n')
}

/** Cadastro dos projetos que o agente conhece sem pesquisar. Cliente vê só o próprio cadastro. */
export function projectsBrief(client: ClientWorkspace): string {
  const clients = isPortfolioWorkspace(client)
    ? [client, ...listClients().filter(item => item.slug !== client.slug)]
    : [client]
  return clients.map(clientBrief).join('\n\n')
}
