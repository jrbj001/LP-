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
  merge_commit_sha: string | null
  user: { login: string } | null
  head: { ref: string }
}

export interface GhPullDetail extends GhPullSummary {
  additions: number
  deletions: number
  changed_files: number
}

export interface GhReview {
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING'
}

export interface GhPrCommit {
  commit: { author: { date: string } | null; committer: { date: string } | null }
}

export interface GhDeployment {
  environment: string
  created_at: string
  sha: string
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

    // Página já toda anterior ao período — não há mais o que buscar
    const oldest = batch[batch.length - 1]
    if (oldest?.merged_at && new Date(oldest.merged_at) < since) break
  }

  return merged
    .sort((a, b) => (b.merged_at! > a.merged_at! ? 1 : -1))
    .slice(0, maxPulls)
}

export function getPullDetail(owner: string, repo: string, number: number): Promise<GhPullDetail> {
  return gh<GhPullDetail>(`/repos/${owner}/${repo}/pulls/${number}`)
}

export function listPullReviews(owner: string, repo: string, number: number): Promise<GhReview[]> {
  return gh<GhReview[]>(`/repos/${owner}/${repo}/pulls/${number}/reviews?per_page=100`)
}

export function listPullCommits(owner: string, repo: string, number: number): Promise<GhPrCommit[]> {
  return gh<GhPrCommit[]>(`/repos/${owner}/${repo}/pulls/${number}/commits?per_page=100`)
}

/** Deployments de produção do repo (a Vercel registra deployments no GitHub). */
export async function listProductionDeployments(owner: string, repo: string): Promise<GhDeployment[]> {
  const all = await gh<GhDeployment[]>(`/repos/${owner}/${repo}/deployments?per_page=100`)
  return all.filter(d => /prod/i.test(d.environment))
}
