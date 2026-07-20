import { DEFAULT_EFFORT_CONFIG } from './config'
import { classifyProduct, classifyType, humanizeTitle } from './classify'
import { computeEffort } from './effort'
import {
  GitHubError,
  getPullDetail,
  hasGitHubToken,
  listMergedPulls,
  listProductionDeployments,
  listPullCommits,
  listPullReviews,
} from './github'
import type {
  DeliveriesData,
  DeliveryItem,
  DeliverySummary,
  DeliveryWeek,
  RepoConfig,
  RepoStatus,
} from './types'

function initials(login: string): string {
  return login.slice(0, 2).toUpperCase()
}

/** Segunda-feira (UTC) da semana da data. */
function weekStartOf(iso: string): string {
  const d = new Date(iso)
  const day = d.getUTCDay()
  const diff = day === 0 ? 6 : day - 1
  d.setUTCDate(d.getUTCDate() - diff)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

async function fetchRepoDeliveries(repo: RepoConfig, since: Date, maxPulls: number): Promise<DeliveryItem[]> {
  const { owner, repo: name } = repo

  const [pulls, deployments] = await Promise.all([
    listMergedPulls(owner, name, since, maxPulls),
    listProductionDeployments(owner, name).catch(() => []),
  ])

  const items: DeliveryItem[] = []

  for (const pr of pulls) {
    const [detail, reviews, commits] = await Promise.all([
      getPullDetail(owner, name, pr.number),
      listPullReviews(owner, name, pr.number).catch(() => []),
      listPullCommits(owner, name, pr.number).catch(() => []),
    ])

    const type = classifyType(pr.title, pr.head.ref)
    const reviewRounds = reviews.filter(r => r.state === 'APPROVED' || r.state === 'CHANGES_REQUESTED').length
    const reviewApproved = reviews.some(r => r.state === 'APPROVED')

    const commitDates = commits
      .map(c => c.commit.author?.date ?? c.commit.committer?.date)
      .filter((d): d is string => Boolean(d))
      .map(d => new Date(d))

    const mergedAt = pr.merged_at!
    const deployedToProduction = deployments.some(
      d => d.sha === pr.merge_commit_sha || new Date(d.created_at) >= new Date(mergedAt)
    )

    const effort = computeEffort({
      type,
      commitDates,
      linesChanged: detail.additions + detail.deletions,
      reviewRounds,
      cfg: DEFAULT_EFFORT_CONFIG,
    })

    items.push({
      id: `${owner}/${name}#${pr.number}`,
      repo: `${owner}/${name}`,
      prNumber: pr.number,
      product: classifyProduct(repo, pr.title, pr.head.ref),
      title: humanizeTitle(pr.title),
      type,
      mergedAt,
      authorInitials: pr.user ? initials(pr.user.login) : '—',
      filesChanged: detail.changed_files,
      additions: detail.additions,
      deletions: detail.deletions,
      reviewApproved,
      deployedToProduction,
      effort,
    })
  }

  return items
}

function buildSummary(items: DeliveryItem[], periodDays: number): DeliverySummary {
  const byProductMap = new Map<string, { deliveries: number; hours: number }>()
  for (const item of items) {
    const entry = byProductMap.get(item.product) ?? { deliveries: 0, hours: 0 }
    entry.deliveries++
    entry.hours += item.effort.billableHours
    byProductMap.set(item.product, entry)
  }

  return {
    periodDays,
    totalDeliveries: items.length,
    features: items.filter(i => i.type === 'feature').length,
    fixes: items.filter(i => i.type === 'fix').length,
    improvements: items.filter(i => i.type === 'improvement').length,
    maintenance: items.filter(i => i.type === 'maintenance').length,
    productionDeploys: items.filter(i => i.deployedToProduction).length,
    totalHours: Number(items.reduce((acc, i) => acc + i.effort.billableHours, 0).toFixed(1)),
    byProduct: [...byProductMap.entries()]
      .map(([product, v]) => ({ product, deliveries: v.deliveries, hours: Number(v.hours.toFixed(1)) }))
      .sort((a, b) => b.hours - a.hours),
  }
}

export async function getDeliveries(repos: RepoConfig[], periodDays: number): Promise<DeliveriesData> {
  const since = new Date(Date.now() - periodDays * 86_400_000)
  // Sem token o rate limit é 60 req/h — limita PRs processadas por repo
  const maxPulls = hasGitHubToken() ? 50 : 10

  const statuses: RepoStatus[] = []
  const allItems: DeliveryItem[] = []

  for (const repo of repos) {
    const full = `${repo.owner}/${repo.repo}`
    try {
      const items = await fetchRepoDeliveries(repo, since, maxPulls)
      allItems.push(...items)
      statuses.push({ repo: full, ok: true })
    } catch (e) {
      const status = e instanceof GitHubError ? e.status : 0
      const needsToken = (status === 404 || status === 401) && !hasGitHubToken()
      statuses.push({
        repo: full,
        ok: false,
        error: needsToken || status === 403 ? 'token' : e instanceof Error ? e.message : 'Erro desconhecido',
      })
    }
  }

  allItems.sort((a, b) => (b.mergedAt > a.mergedAt ? 1 : -1))

  const weekMap = new Map<string, DeliveryItem[]>()
  for (const item of allItems) {
    const key = weekStartOf(item.mergedAt)
    const list = weekMap.get(key) ?? []
    list.push(item)
    weekMap.set(key, list)
  }

  const weeks: DeliveryWeek[] = [...weekMap.entries()]
    .sort(([a], [b]) => (b > a ? 1 : -1))
    .map(([weekStart, items]) => ({ weekStart, items }))

  return {
    summary: buildSummary(allItems, periodDays),
    weeks,
    repos: statuses,
    generatedAt: new Date().toISOString(),
  }
}
