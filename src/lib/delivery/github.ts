const API = 'https://api.github.com'

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = process.env.GITHUB_TOKEN
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

export function hasGitHubToken(): boolean {
  return Boolean(process.env.GITHUB_TOKEN)
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: headers(),
    next: { revalidate: 3600 },
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
  commit: { message: string }
  parents: { sha: string }[]
}

// ─── Chamadas ────────────────────────────────────────────────────────────────

export async function listMergedPulls(
  owner: string,
  repo: string,
  since: Date,
  maxPulls: number
): Promise<GhPullSummary[]> {
  const merged: GhPullSummary[] = []

  for (let page = 1; page <= 3 && merged.length < maxPulls; page++) {
    const batch = await gh<GhPullSummary[]>(
      `/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=100&page=${page}`
    )
    if (batch.length === 0) break

    for (const pr of batch) {
      if (pr.merged_at && new Date(pr.merged_at) >= since) merged.push(pr)
    }

    const oldest = batch[batch.length - 1]
    if (oldest?.merged_at && new Date(oldest.merged_at) < since) break
  }

  return merged
    .sort((a, b) => (b.merged_at! > a.merged_at! ? 1 : -1))
    .slice(0, maxPulls)
}

/** Detalhe da PR: linhas, arquivos e nº de commits (campo `commits`). */
export function getPullDetail(owner: string, repo: string, number: number): Promise<GhPullDetail> {
  return gh<GhPullDetail>(`/repos/${owner}/${repo}/pulls/${number}`)
}

/** Commits do branch padrão desde uma data (para stats do período). */
export async function listCommitsSince(owner: string, repo: string, since: Date): Promise<GhCommit[]> {
  const commits: GhCommit[] = []
  for (let page = 1; page <= 3; page++) {
    const batch = await gh<GhCommit[]>(
      `/repos/${owner}/${repo}/commits?since=${since.toISOString()}&per_page=100&page=${page}`
    )
    commits.push(...batch)
    if (batch.length < 100) break
  }
  return commits
}
