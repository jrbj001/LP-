import { GitHubError, hasGitHubToken } from '@/lib/delivery/github'
import type { RepoConfig } from '@/lib/delivery/types'
import type { BacklogBoardId, BacklogCard } from './types'

const API = 'https://api.github.com'

export interface CodeSnippet {
  repo: string
  path: string
  url: string
  excerpt: string
}

export interface GithubContextBundle {
  repos: string[]
  snippets: CodeSnippet[]
  notes: string[]
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers(), cache: 'no-store' })
  if (!res.ok) throw new GitHubError(`GitHub ${res.status}: ${path}`, res.status)
  return res.json() as Promise<T>
}

function keywordsFromCard(card: BacklogCard): string[] {
  const raw = [
    card.title,
    card.want,
    card.persona,
    card.context,
    ...(card.acceptance ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const stop = new Set([
    'como', 'quero', 'para', 'que', 'com', 'sem', 'uma', 'um', 'de', 'da', 'do', 'das', 'dos',
    'no', 'na', 'em', 'ao', 'à', 'e', 'o', 'a', 'os', 'as', 'por', 'via', 'the', 'and', 'for',
  ])

  const tokens = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 4 && !stop.has(t))

  return [...new Set(tokens)].slice(0, 8)
}

function reposForBoard(boardId: BacklogBoardId, all: RepoConfig[]): RepoConfig[] {
  if (boardId === 'visibilidade') {
    return all.filter(
      r =>
        r.repo.includes('image_brand') ||
        r.repo.includes('digital-branding') ||
        /visibil/i.test(r.label)
    )
  }
  // Colmeia / Banco / Agentes → repo principal (+ satélites se existirem)
  const primary = all.filter(
    r => r.repo.includes('colmeia') || /meus\s*roteiros|banco/i.test(r.label)
  )
  return primary.length > 0 ? primary : all.slice(0, 1)
}

interface SearchItem {
  name: string
  path: string
  html_url: string
  repository: { full_name: string }
}

async function searchCode(owner: string, repo: string, query: string): Promise<SearchItem[]> {
  const q = encodeURIComponent(`${query} repo:${owner}/${repo}`)
  try {
    const data = await gh<{ items: SearchItem[] }>(`/search/code?q=${q}&per_page=5`)
    return data.items ?? []
  } catch {
    return []
  }
}

async function readFileExcerpt(owner: string, repo: string, filePath: string): Promise<string | null> {
  try {
    const data = await gh<{ content?: string; encoding?: string; size?: number }>(
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath).replace(/%2F/g, '/')}`
    )
    if (!data.content || data.encoding !== 'base64') return null
    const text = Buffer.from(data.content, 'base64').toString('utf8')
    return text.slice(0, 2500)
  } catch {
    return null
  }
}

async function readReadme(owner: string, repo: string): Promise<CodeSnippet | null> {
  for (const name of ['README.md', 'readme.md', 'README']) {
    const excerpt = await readFileExcerpt(owner, repo, name)
    if (excerpt) {
      return {
        repo: `${owner}/${repo}`,
        path: name,
        url: `https://github.com/${owner}/${repo}/blob/HEAD/${name}`,
        excerpt,
      }
    }
  }
  return null
}

/**
 * Monta contexto limitado do GitHub para o enrichment.
 * Falhas de token/rate não quebram o fluxo — retornam notes.
 */
export async function gatherGithubContext(
  card: BacklogCard,
  repos: RepoConfig[]
): Promise<GithubContextBundle> {
  const notes: string[] = []
  const selected = reposForBoard(card.boardId, repos)

  if (selected.length === 0) {
    return { repos: [], snippets: [], notes: ['Nenhum repositório configurado para este board.'] }
  }

  if (!hasGitHubToken()) {
    notes.push('GITHUB_TOKEN ausente — enrichment seguirá sem trechos de código.')
  }

  const snippets: CodeSnippet[] = []
  const keywords = keywordsFromCard(card)
  const query = keywords.slice(0, 4).join(' ') || card.title.split(/\s+/).slice(0, 3).join(' ')

  for (const repo of selected.slice(0, 2)) {
    const full = `${repo.owner}/${repo.repo}`
    const readme = await readReadme(repo.owner, repo.repo)
    if (readme) snippets.push(readme)

    if (query && hasGitHubToken()) {
      const hits = await searchCode(repo.owner, repo.repo, query)
      for (const hit of hits.slice(0, 4)) {
        if (snippets.some(s => s.repo === full && s.path === hit.path)) continue
        const excerpt = await readFileExcerpt(repo.owner, repo.repo, hit.path)
        if (!excerpt) continue
        snippets.push({
          repo: full,
          path: hit.path,
          url: hit.html_url,
          excerpt,
        })
        if (snippets.length >= 8) break
      }
    }
  }

  if (snippets.length === 0) {
    notes.push('Nenhum arquivo relevante encontrado; a IA usará só o texto do card e o domínio OOH.')
  }

  return {
    repos: selected.map(r => `${r.owner}/${r.repo}`),
    snippets: snippets.slice(0, 8),
    notes,
  }
}

export function formatGithubContextForPrompt(bundle: GithubContextBundle): string {
  const parts = [
    `Repositórios: ${bundle.repos.join(', ') || '—'}`,
    ...bundle.notes.map(n => `Nota: ${n}`),
  ]
  for (const s of bundle.snippets) {
    parts.push(`---\nArquivo: ${s.repo}:${s.path}\nURL: ${s.url}\n\`\`\`\n${s.excerpt}\n\`\`\``)
  }
  return parts.join('\n')
}
