import { GitHubError, hasGitHubToken, listCommitsSince, listMergedPulls } from '@/lib/delivery/github'
import type { RepoConfig } from '@/lib/delivery/types'
import { getBacklogBoards } from './boards'
import type { BacklogBoardId, BacklogCard } from './types'

const API = 'https://api.github.com'
const CACHE_TTL_MS = 4 * 60 * 1000

export type GithubGatherMode = 'quick' | 'spec'

export interface CodeSnippet {
  repo: string
  path: string
  url: string
  excerpt: string
}

export interface RepoActivity {
  repo: string
  pulls: { number: number; title: string; mergedAt: string }[]
  commits: { sha: string; message: string; date: string }[]
}

export interface GithubContextBundle {
  repos: string[]
  snippets: CodeSnippet[]
  activity: RepoActivity[]
  notes: string[]
}

export interface GithubGatherOptions {
  mode?: GithubGatherMode
  allRepos?: boolean
}

interface GhJsonOk<T> {
  ok: true
  data: T
}
interface GhJsonErr {
  ok: false
  status: number
  message: string
}

interface CacheEntry {
  at: number
  bundle: GithubContextBundle
}

const contextCache = new Map<string, CacheEntry>()

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'PixelPulseLab-Cadence',
  }
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

async function ghJson<T>(path: string): Promise<GhJsonOk<T> | GhJsonErr> {
  const res = await fetch(`${API}${path}`, { headers: headers(), cache: 'no-store' })
  if (!res.ok) {
    let message = `GitHub ${res.status}`
    try {
      const body = (await res.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      /* ignore */
    }
    return { ok: false, status: res.status, message }
  }
  return { ok: true, data: (await res.json()) as T }
}

function accessNote(full: string, status: number, message: string): string {
  if (status === 401) {
    return `${full}: token recusado (expirado ou revogado). Gere um novo GITHUB_PAT.`
  }
  if (status === 403 && /rate|limit/i.test(message)) {
    return `${full}: limite da API do GitHub atingido. Aguarde e tente de novo.`
  }
  if (status === 403) {
    return `${full}: token sem permissão de Contents: Read. Ajuste o fine-grained PAT.`
  }
  if (status === 404) {
    return `${full}: sem acesso a este repositório. Inclua-o no fine-grained PAT (Contents: Read) e aprove o acesso na org, se houver.`
  }
  return `${full}: ${message}`
}

export function keywordsFromText(text: string): string[] {
  const raw = text.toLowerCase()

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

function keywordsFromCard(card: BacklogCard): string[] {
  return keywordsFromText(
    [card.title, card.want, card.persona, card.context, ...(card.acceptance ?? [])]
      .filter(Boolean)
      .join(' ')
  )
}

function parseRepository(value?: string): { owner: string; repo: string } | null {
  if (!value) return null
  const [owner, repo] = value.split('/')
  if (!owner || !repo) return null
  return { owner, repo }
}

function matchRepo(all: RepoConfig[], owner: string, repo: string): RepoConfig | undefined {
  return all.find(
    item =>
      item.owner.toLowerCase() === owner.toLowerCase() && item.repo.toLowerCase() === repo.toLowerCase()
  )
}

function uniqueRepos(repos: RepoConfig[]): RepoConfig[] {
  const seen = new Set<string>()
  const out: RepoConfig[] = []
  for (const repo of repos) {
    const key = `${repo.owner}/${repo.repo}`.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(repo)
  }
  return out
}

function reposFromBoardNames(
  names: string[],
  all: RepoConfig[],
  fallbackLabel?: string
): RepoConfig[] {
  const resolved: RepoConfig[] = []
  for (const name of names) {
    const parsed = parseRepository(name)
    if (!parsed) continue
    resolved.push(
      matchRepo(all, parsed.owner, parsed.repo) ?? {
        owner: parsed.owner,
        repo: parsed.repo,
        label: fallbackLabel ?? parsed.repo,
      }
    )
  }
  return uniqueRepos(resolved)
}

/** Board.repository (+ repositories) é a fonte canônica; o mapping antigo só entra como fallback. */
export function resolveReposForBoard(
  clientId: string,
  boardId: BacklogBoardId,
  all: RepoConfig[]
): RepoConfig[] {
  const board = getBacklogBoards(clientId).find(item => item.id === boardId)
  const names = [board?.repository, ...(board?.repositories ?? [])].filter((value): value is string =>
    Boolean(value)
  )
  const fromBoard = reposFromBoardNames(names, all, board?.productLabel)
  if (fromBoard.length > 0) return fromBoard

  if (clientId === 'likeme') {
    const repoByBoard: Partial<Record<BacklogBoardId, string>> = {
      'likeme-landing': 'LP-LikeMe',
      'likeme-app': 'likeme-front-end',
      'likeme-backend': 'likeme-back-end',
    }
    const expectedRepo = repoByBoard[boardId]
    if (expectedRepo) {
      const selected = all.filter(repo => repo.repo === expectedRepo)
      if (selected.length > 0) return selected
    }
    return all
  }

  if (boardId === 'visibilidade') {
    return all.filter(
      r =>
        r.repo.includes('image_brand') ||
        r.repo.includes('digital-branding') ||
        /visibil/i.test(r.label)
    )
  }
  const primary = all.filter(
    r => r.repo.includes('colmeia') || /meus\s*roteiros|banco/i.test(r.label)
  )
  return primary.length > 0 ? primary : all
}

function decodeContent(content?: string, encoding?: string): string | null {
  if (!content || encoding !== 'base64') return null
  return Buffer.from(content.replace(/\n/g, ''), 'base64').toString('utf8')
}

async function readReadme(owner: string, repo: string, excerptChars: number): Promise<CodeSnippet | GhJsonErr> {
  const res = await ghJson<{ content?: string; encoding?: string; path?: string }>(
    `/repos/${owner}/${repo}/readme`
  )
  if (!res.ok) return res
  const excerpt = decodeContent(res.data.content, res.data.encoding)
  if (!excerpt) return { ok: false, status: 422, message: 'README sem conteúdo legível' }
  const path = res.data.path || 'README.md'
  return {
    repo: `${owner}/${repo}`,
    path,
    url: `https://github.com/${owner}/${repo}/blob/HEAD/${path}`,
    excerpt: excerpt.slice(0, excerptChars),
  }
}

async function readFileExcerpt(
  owner: string,
  repo: string,
  filePath: string,
  excerptChars: number
): Promise<string | null> {
  const encoded = filePath
    .split('/')
    .map(part => encodeURIComponent(part))
    .join('/')
  const res = await ghJson<{ content?: string; encoding?: string }>(
    `/repos/${owner}/${repo}/contents/${encoded}`
  )
  if (!res.ok) return null
  const text = decodeContent(res.data.content, res.data.encoding)
  return text ? text.slice(0, excerptChars) : null
}

interface TreeItem {
  path: string
  type: string
  size?: number
}

function interestingPath(path: string): boolean {
  if (/node_modules|dist\/|\.next\/|coverage\/|__pycache__|\.lock$|\.min\./i.test(path)) return false
  if (/\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?|mp4|pdf)$/i.test(path)) return false
  return /\.(ts|tsx|js|jsx|py|md|json|yml|yaml)$/i.test(path)
}

function scorePath(path: string, keywords: string[]): number {
  const p = path.toLowerCase()
  let score = 0
  for (const k of keywords) {
    if (k && p.includes(k)) score += 4
  }
  if (/(^|\/)src\//.test(p)) score += 1
  if (/readme|package\.json|route|page|controller|service|schema/i.test(p)) score += 1
  return score
}

async function listCandidatePaths(
  owner: string,
  repo: string,
  defaultBranch: string,
  keywords: string[],
  limit: number
): Promise<string[]> {
  const tree = await ghJson<{ tree?: TreeItem[]; truncated?: boolean }>(
    `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`
  )
  if (!tree.ok || !tree.data.tree) return []

  return tree.data.tree
    .filter(item => item.type === 'blob' && item.path && interestingPath(item.path) && (item.size ?? 0) < 80_000)
    .map(item => ({ path: item.path, score: scorePath(item.path, keywords) }))
    .sort((a, b) => b.score - a.score)
    .filter((item, index) => item.score > 0 || index < 4)
    .slice(0, limit)
    .map(item => item.path)
}

async function searchCode(owner: string, repo: string, query: string): Promise<string[]> {
  const q = encodeURIComponent(`${query} repo:${owner}/${repo}`)
  const res = await ghJson<{ items?: { path: string }[] }>(`/search/code?q=${q}&per_page=5`)
  if (!res.ok) return []
  return (res.data.items ?? []).map(item => item.path).filter(Boolean)
}

async function collectRepoActivity(repo: RepoConfig, notes: string[]): Promise<RepoActivity> {
  const full = `${repo.owner}/${repo.repo}`
  const since = new Date(Date.now() - 42 * 24 * 60 * 60 * 1000)
  const empty: RepoActivity = { repo: full, pulls: [], commits: [] }
  try {
    const [pulls, commits] = await Promise.all([
      listMergedPulls(repo.owner, repo.repo, since),
      listCommitsSince(repo.owner, repo.repo, since),
    ])
    return {
      repo: full,
      pulls: pulls.slice(0, 8).map(pr => ({
        number: pr.number,
        title: pr.title,
        mergedAt: pr.merged_at ?? '',
      })),
      commits: commits.slice(0, 8).map(commit => ({
        sha: commit.sha.slice(0, 7),
        message: commit.commit.message.split('\n')[0]?.slice(0, 140) ?? '',
        date: commit.commit.author?.date ?? commit.commit.committer?.date ?? '',
      })),
    }
  } catch (error) {
    const status = error instanceof GitHubError ? error.status : 0
    notes.push(
      status
        ? accessNote(`${full} (histórico)`, status, error instanceof Error ? error.message : 'falha ao ler PRs/commits')
        : `${full}: não foi possível ler PRs e commits recentes.`
    )
    return empty
  }
}

async function collectRepoContext(
  repo: RepoConfig,
  query: string,
  keywords: string[],
  notes: string[],
  mode: GithubGatherMode
): Promise<{ snippets: CodeSnippet[]; activity: RepoActivity }> {
  const full = `${repo.owner}/${repo.repo}`
  const excerptChars = mode === 'spec' ? 6000 : 2500
  const pathLimit = mode === 'spec' ? 16 : 8
  const fileLimit = mode === 'spec' ? 6 : 6

  const meta = await ghJson<{ default_branch?: string; private?: boolean }>(
    `/repos/${repo.owner}/${repo.repo}`
  )
  if (!meta.ok) {
    notes.push(accessNote(full, meta.status, meta.message))
    return { snippets: [], activity: { repo: full, pulls: [], commits: [] } }
  }

  const snippets: CodeSnippet[] = []
  const readme = await readReadme(repo.owner, repo.repo, excerptChars)
  if ('ok' in readme && readme.ok === false) {
    if (readme.status === 404) {
      notes.push(`${full}: README não encontrado; seguindo pelos arquivos do repo.`)
    } else {
      notes.push(accessNote(`${full} (README)`, readme.status, readme.message))
    }
  } else if (!('ok' in readme)) {
    snippets.push(readme)
  }

  const fromSearch = query && hasGitHubToken() ? await searchCode(repo.owner, repo.repo, query) : []
  const fromTree = await listCandidatePaths(
    repo.owner,
    repo.repo,
    meta.data.default_branch || 'main',
    keywords,
    pathLimit
  )
  const candidates = [...new Set([...fromSearch, ...fromTree])].slice(0, pathLimit)

  // Spec em dois passos: primeiro os paths candidatos; depois só esses arquivos, com trecho maior.
  const pathsToRead = mode === 'spec' ? candidates.slice(0, fileLimit) : candidates.slice(0, 8)

  for (const path of pathsToRead) {
    if (snippets.some(s => s.path === path)) continue
    const excerpt = await readFileExcerpt(repo.owner, repo.repo, path, excerptChars)
    if (!excerpt) continue
    snippets.push({
      repo: full,
      path,
      url: `https://github.com/${repo.owner}/${repo.repo}/blob/HEAD/${path}`,
      excerpt,
    })
    if (snippets.length >= fileLimit) break
  }

  if (snippets.length === 0) {
    notes.push(`${full}: acessível, mas nenhum arquivo relevante foi lido para esta história.`)
  }

  const activity = await collectRepoActivity(repo, notes)
  return { snippets, activity }
}

function cacheKey(
  input: { clientId: string; boardId?: BacklogBoardId; query: string; mode: GithubGatherMode; allRepos?: boolean },
  repos: RepoConfig[]
): string {
  const repoKey = repos.map(r => `${r.owner}/${r.repo}`).sort().join(',')
  const query = keywordsFromText(input.query).join(' ') || input.query.slice(0, 80)
  return [input.clientId, input.boardId ?? 'all', input.mode, input.allRepos ? 'all' : 'board', repoKey, query].join('|')
}

function readCache(key: string): GithubContextBundle | null {
  const entry = contextCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.at > CACHE_TTL_MS) {
    contextCache.delete(key)
    return null
  }
  return entry.bundle
}

/**
 * Monta contexto limitado do GitHub a partir de um texto livre (pergunta do PM,
 * título de card, etc). Falhas de token/rate não quebram o fluxo — retornam notes.
 */
export async function gatherGithubContextForQuery(
  input: { clientId: string; boardId?: BacklogBoardId; query: string },
  repos: RepoConfig[],
  options?: GithubGatherOptions
): Promise<GithubContextBundle> {
  const mode = options?.mode ?? 'quick'
  const notes: string[] = []
  const selected = options?.allRepos || !input.boardId
    ? repos
    : resolveReposForBoard(input.clientId, input.boardId, repos)

  const key = cacheKey({ ...input, mode, allRepos: options?.allRepos }, selected)
  const cached = readCache(key)
  if (cached) return cached

  if (selected.length === 0) {
    return { repos: [], snippets: [], activity: [], notes: ['Nenhum repositório configurado para este board.'] }
  }

  if (!hasGitHubToken()) {
    const bundle: GithubContextBundle = {
      repos: selected.map(r => `${r.owner}/${r.repo}`),
      snippets: [],
      activity: [],
      notes: ['GITHUB_PAT ausente — a IA segue sem trechos de código. Configure o token com Contents: Read.'],
    }
    contextCache.set(key, { at: Date.now(), bundle })
    return bundle
  }

  const snippets: CodeSnippet[] = []
  const activity: RepoActivity[] = []
  const keywords = keywordsFromText(input.query)
  const query = keywords.slice(0, 4).join(' ') || input.query.split(/\s+/).slice(0, 3).join(' ')

  for (const repo of selected.slice(0, 3)) {
    const found = await collectRepoContext(repo, query, keywords, notes, mode)
    snippets.push(...found.snippets)
    activity.push(found.activity)
    if (snippets.length >= (mode === 'spec' ? 8 : 8)) break
  }

  if (snippets.length === 0 && notes.length === 0) {
    notes.push('Nenhum arquivo relevante encontrado; a IA usará só o texto do card.')
  }

  const bundle: GithubContextBundle = {
    repos: selected.map(r => `${r.owner}/${r.repo}`),
    snippets: snippets.slice(0, 8),
    activity,
    notes,
  }
  contextCache.set(key, { at: Date.now(), bundle })
  return bundle
}

/** Contexto do GitHub para o enrichment de um card. */
export async function gatherGithubContext(
  clientId: string,
  card: BacklogCard,
  repos: RepoConfig[],
  options?: GithubGatherOptions
): Promise<GithubContextBundle> {
  const keywords = keywordsFromCard(card)
  return gatherGithubContextForQuery(
    {
      clientId,
      boardId: card.boardId,
      query: keywords.length > 0 ? keywords.join(' ') : card.title,
    },
    repos,
    options
  )
}

export function formatGithubContextForPrompt(bundle: GithubContextBundle): string {
  const parts = [
    `Repositórios: ${bundle.repos.join(', ') || '—'}`,
    ...bundle.notes.map(n => `Nota: ${n}`),
  ]
  for (const activity of bundle.activity) {
    if (activity.pulls.length === 0 && activity.commits.length === 0) continue
    const pulls = activity.pulls
      .map(pr => `#${pr.number} ${pr.title}${pr.mergedAt ? ` (${pr.mergedAt.slice(0, 10)})` : ''}`)
      .join('; ')
    const commits = activity.commits.map(commit => `${commit.sha} ${commit.message}`).join('; ')
    parts.push(
      `---\nHistórico recente ${activity.repo}:\nPRs mescladas (6 semanas): ${pulls || '—'}\nCommits recentes: ${commits || '—'}`
    )
  }
  for (const s of bundle.snippets) {
    parts.push(`---\nArquivo: ${s.repo}:${s.path}\nURL: ${s.url}\n\`\`\`\n${s.excerpt}\n\`\`\``)
  }
  return parts.join('\n')
}

export { GitHubError }
