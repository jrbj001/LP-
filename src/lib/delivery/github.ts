const API = 'https://api.github.com'

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}

function githubToken(): string | undefined {
  return process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || undefined
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = githubToken()
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

export function hasGitHubToken(): boolean {
  return Boolean(githubToken())
}

/** Sem cache Next — o período (30/60/90) muda a query e não pode reaproveitar resposta. */
async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: headers(),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new GitHubError(`GitHub ${res.status}: ${path}`, res.status)
  }
  return res.json() as Promise<T>
}

// ─── Tipos mínimos da API ────────────────────────────────────────────────────

export interface GhPullSummary {
  number: number
  title: string
  merged_at: string | null
  created_at?: string
  user: { login: string } | null
  head: { ref: string }
}

export interface GhPullDetail extends GhPullSummary {
  additions: number
  deletions: number
  changed_files: number
  commits: number
}

export interface GhCommit {
  sha: string
  commit: {
    message: string
    author: { date: string } | null
    committer: { date: string } | null
  }
  parents: { sha: string }[]
}

interface GhSearchIssue {
  number: number
  title: string
  closed_at: string | null
  user: { login: string } | null
  pull_request?: { url: string }
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/**
 * PRs mescladas no intervalo [since, until], via Search API
 * (respeita merged:YYYY-MM-DD..YYYY-MM-DD — não corta no limite de “últimas N”).
 */
async function listMergedPullsViaSearch(
  owner: string,
  repo: string,
  since: Date,
  until: Date
): Promise<GhPullSummary[]> {
  const q = encodeURIComponent(
    `repo:${owner}/${repo} is:pr is:merged merged:${isoDay(since)}..${isoDay(until)}`
  )
  const merged: GhPullSummary[] = []

  for (let page = 1; page <= 10; page++) {
    const data = await gh<{ items: GhSearchIssue[]; incomplete_results: boolean }>(
      `/search/issues?q=${q}&per_page=100&page=${page}`
    )
    for (const item of data.items) {
      if (!item.pull_request) continue
      merged.push({
        number: item.number,
        title: item.title,
        merged_at: item.closed_at,
        user: item.user,
        head: { ref: '' },
      })
    }
    if (data.items.length < 100) break
  }

  return merged.sort((a, b) => (b.merged_at! > a.merged_at! ? 1 : -1))
}

/**
 * Fallback: pagina pulls fechadas até passar do período.
 * NÃO para ao atingir um max artificial no meio da paginação.
 */
async function listMergedPullsViaPullsApi(
  owner: string,
  repo: string,
  since: Date,
  until: Date
): Promise<GhPullSummary[]> {
  const merged: GhPullSummary[] = []

  for (let page = 1; page <= 10; page++) {
    const batch = await gh<GhPullSummary[]>(
      `/repos/${owner}/${repo}/pulls?state=closed&sort=created&direction=desc&per_page=100&page=${page}`
    )
    if (batch.length === 0) break

    let sawNewerOrInRange = false
    for (const pr of batch) {
      if (!pr.merged_at) continue
      const t = new Date(pr.merged_at)
      if (t >= since && t <= until) {
        merged.push(pr)
        sawNewerOrInRange = true
      } else if (t > until) {
        sawNewerOrInRange = true
      }
    }

    const oldestCreated = batch[batch.length - 1]?.created_at
    if (oldestCreated && new Date(oldestCreated) < since && !sawNewerOrInRange) break
    if (batch.length < 100) break

    // Se o item mais antigo da página já foi criado antes de `since` e
    // nenhum merge da página cai no intervalo, paramos.
    const anyInRange = batch.some(
      pr => pr.merged_at && new Date(pr.merged_at) >= since && new Date(pr.merged_at) <= until
    )
    if (oldestCreated && new Date(oldestCreated) < since && !anyInRange) break
  }

  return merged.sort((a, b) => (b.merged_at! > a.merged_at! ? 1 : -1))
}

export async function listMergedPulls(
  owner: string,
  repo: string,
  since: Date,
  until: Date = new Date()
): Promise<GhPullSummary[]> {
  try {
    return await listMergedPullsViaSearch(owner, repo, since, until)
  } catch (e) {
    // Search exige auth em alguns casos / rate limit secundário — cai no pulls API
    if (e instanceof GitHubError && (e.status === 403 || e.status === 422)) {
      return listMergedPullsViaPullsApi(owner, repo, since, until)
    }
    throw e
  }
}

/** Detalhe da PR: linhas, arquivos, branch e nº de commits. */
export function getPullDetail(owner: string, repo: string, number: number): Promise<GhPullDetail> {
  return gh<GhPullDetail>(`/repos/${owner}/${repo}/pulls/${number}`)
}

/** Commits do branch padrão desde uma data (stats do período). */
export async function listCommitsSince(owner: string, repo: string, since: Date): Promise<GhCommit[]> {
  const commits: GhCommit[] = []
  for (let page = 1; page <= 10; page++) {
    const batch = await gh<GhCommit[]>(
      `/repos/${owner}/${repo}/commits?since=${encodeURIComponent(since.toISOString())}&per_page=100&page=${page}`
    )
    commits.push(...batch)
    if (batch.length < 100) break
  }
  return commits
}
