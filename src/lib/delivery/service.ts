import { DEFAULT_EFFORT_CONFIG } from './config'
import { classifyProduct, classifyType, humanizeTitle, moduleKey, moduleName } from './classify'
import { computeEstimate, manualItemsInPeriod } from './effort'
import {
  isCacheFresh,
  readDeliveryCache,
  writeDeliveryCache,
  type CachedCommit,
  type DeliveryCachePayload,
} from './cache'
import {
  GitHubError,
  getPullDetail,
  hasGitHubToken,
  listCommitsSince,
  listMergedPulls,
} from './github'
import type {
  DeliveryKpis,
  DeliveryReport,
  DeliveryType,
  ManualEffortItem,
  ModuleGroup,
  PeriodStats,
  ProductBreakdown,
  PrRow,
  RepoConfig,
  RepoStatus,
  RoadmapMilestone,
  WeeklyBucket,
} from './types'

/** Sempre buscamos esta janela e filtramos 30/60/90 em cima do cache. */
export const CACHE_WINDOW_DAYS = 90

interface RepoResult {
  prs: Omit<PrRow, 'estimatedHours'>[]
  commits: CachedCommit[]
}

function weekStartOf(iso: string): string {
  const d = new Date(iso)
  const day = d.getUTCDay()
  const diff = day === 0 ? 6 : day - 1
  d.setUTCDate(d.getUTCDate() - diff)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

function weekLabel(weekStart: string): string {
  const d = new Date(`${weekStart}T00:00:00Z`)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' })
}

async function fetchRepo(repo: RepoConfig, since: Date, until: Date): Promise<RepoResult> {
  const { owner, repo: name } = repo

  const [pulls, commits] = await Promise.all([
    listMergedPulls(owner, name, since, until),
    listCommitsSince(owner, name, since).catch(() => []),
  ])

  const prs: RepoResult['prs'] = []
  for (const pr of pulls) {
    const detail = await getPullDetail(owner, name, pr.number)
    const branch = detail.head?.ref || pr.head.ref || ''
    const mergedAt = detail.merged_at || pr.merged_at
    if (!mergedAt) continue
    const mergedDate = new Date(mergedAt)
    if (mergedDate < since || mergedDate > until) continue

    const type = classifyType(detail.title || pr.title, branch)
    prs.push({
      number: pr.number,
      repo: `${owner}/${name}`,
      branch,
      title: humanizeTitle(detail.title || pr.title),
      type,
      product: classifyProduct(repo, detail.title || pr.title, branch),
      mergedAt,
      additions: detail.additions,
      deletions: detail.deletions,
      changedFiles: detail.changed_files,
      commitCount: detail.commits,
    })
  }

  const cachedCommits: CachedCommit[] = []
  for (const c of commits) {
    if (c.parents.length > 1) continue
    const date = c.commit.author?.date || c.commit.committer?.date
    if (!date) continue
    const firstLine = c.commit.message.split('\n')[0]
    cachedCommits.push({ date, type: classifyType(firstLine) })
  }

  return { prs, commits: cachedCommits }
}

function allocateHours(prs: Omit<PrRow, 'estimatedHours'>[], gitHours: number): PrRow[] {
  if (prs.length === 0) return []
  if (gitHours <= 0) return prs.map(p => ({ ...p, estimatedHours: 0 }))
  const weights = prs.map(p => Math.log2(1 + Math.max(1, p.additions)))
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  return prs.map((p, i) => {
    const hours = Math.round(((gitHours * weights[i]) / totalWeight) * 2) / 2
    return { ...p, estimatedHours: Math.max(0.5, hours) }
  })
}

function buildModules(prs: PrRow[]): ModuleGroup[] {
  const map = new Map<string, PrRow[]>()
  for (const pr of prs) {
    const key = moduleKey(pr.branch)
    const list = map.get(key) ?? []
    list.push(pr)
    map.set(key, list)
  }

  const groups: ModuleGroup[] = []
  for (const [key, items] of map) {
    const typePriority: DeliveryType[] = ['feature', 'improvement', 'fix', 'maintenance']
    const type = typePriority.find(t => items.some(i => i.type === t)) ?? 'improvement'
    const titles = [...new Set(items.map(i => i.title))]
    const dates = items.map(i => i.mergedAt).sort()

    groups.push({
      key,
      name: moduleName(key),
      type,
      product: items[0].product,
      commitCount: items.reduce((acc, i) => acc + i.commitCount, 0),
      prNumbers: items.map(i => i.number).sort((a, b) => b - a),
      description: titles.join('. ') + '.',
      estimatedHours: Number(items.reduce((acc, i) => acc + i.estimatedHours, 0).toFixed(1)),
      linesAdded: items.reduce((acc, i) => acc + i.additions, 0),
      linesDeleted: items.reduce((acc, i) => acc + i.deletions, 0),
      firstMergedAt: dates[0],
      lastMergedAt: dates[dates.length - 1],
    })
  }

  return groups.sort((a, b) => b.estimatedHours - a.estimatedHours || b.commitCount - a.commitCount)
}

function buildWeekly(prs: PrRow[], periodStart: Date, periodEnd: Date): WeeklyBucket[] {
  const map = new Map<string, WeeklyBucket>()

  const cursor = new Date(`${weekStartOf(periodStart.toISOString())}T00:00:00Z`)
  const end = periodEnd.getTime()
  while (cursor.getTime() <= end) {
    const key = cursor.toISOString().slice(0, 10)
    map.set(key, {
      weekStart: key,
      label: weekLabel(key),
      prs: 0,
      features: 0,
      fixes: 0,
      linesAdded: 0,
      hours: 0,
    })
    cursor.setUTCDate(cursor.getUTCDate() + 7)
  }

  for (const pr of prs) {
    const key = weekStartOf(pr.mergedAt)
    const bucket =
      map.get(key) ??
      ({
        weekStart: key,
        label: weekLabel(key),
        prs: 0,
        features: 0,
        fixes: 0,
        linesAdded: 0,
        hours: 0,
      } satisfies WeeklyBucket)
    bucket.prs++
    if (pr.type === 'feature') bucket.features++
    if (pr.type === 'fix') bucket.fixes++
    bucket.linesAdded += pr.additions
    bucket.hours += pr.estimatedHours
    map.set(key, bucket)
  }
  return [...map.values()].sort((a, b) => (a.weekStart > b.weekStart ? 1 : -1))
}

function buildKpis(
  stats: PeriodStats,
  prs: PrRow[],
  weeks: number,
  byProduct: ProductBreakdown[]
): DeliveryKpis {
  const n = prs.length || 1
  const featPrs = prs.filter(p => p.type === 'feature').length
  const fixPrs = prs.filter(p => p.type === 'fix').length
  const top = byProduct[0]
  const totalHours = byProduct.reduce((acc, p) => acc + p.hours, 0)

  return {
    velocityPrPerWeek: Number((prs.length / Math.max(1, weeks)).toFixed(1)),
    featureRatioPct: stats.featureCommits + stats.fixCommits
      ? Math.round((stats.featureCommits / (stats.featureCommits + stats.fixCommits)) * 100)
      : featPrs + fixPrs
        ? Math.round((featPrs / (featPrs + fixPrs)) * 100)
        : 0,
    fixToFeatureRatio: featPrs === 0 ? (fixPrs > 0 ? 9.9 : 0) : Number((fixPrs / featPrs).toFixed(2)),
    avgLinesPerPr: Math.round(prs.reduce((acc, p) => acc + p.additions + p.deletions, 0) / n),
    avgFilesPerPr: Number((prs.reduce((acc, p) => acc + p.changedFiles, 0) / n).toFixed(1)),
    avgHoursPerPr: Number((prs.reduce((acc, p) => acc + p.estimatedHours, 0) / n).toFixed(1)),
    topProduct: top && totalHours > 0 ? { name: top.product, pct: Math.round((top.hours / totalHours) * 100) } : null,
    netLines: stats.linesAdded - stats.linesDeleted,
  }
}

function buildRoadmap(modules: ModuleGroup[]): RoadmapMilestone[] {
  return modules
    .filter(m => m.firstMergedAt || m.manualHours)
    .map(m => ({
      id: m.key,
      date: m.firstMergedAt ?? m.lastMergedAt ?? new Date().toISOString(),
      title: m.name,
      type: m.type,
      product: m.product,
      hours: m.manualHours ?? m.estimatedHours,
      prNumbers: m.prNumbers,
      status: 'done' as const,
    }))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
}

function buildByProduct(prs: PrRow[]): ProductBreakdown[] {
  const map = new Map<string, ProductBreakdown>()
  for (const pr of prs) {
    const entry = map.get(pr.product) ?? { product: pr.product, prs: 0, hours: 0, linesAdded: 0 }
    entry.prs++
    entry.hours += pr.estimatedHours
    entry.linesAdded += pr.additions
    map.set(pr.product, entry)
  }
  return [...map.values()]
    .map(p => ({ ...p, hours: Number(p.hours.toFixed(1)) }))
    .sort((a, b) => b.hours - a.hours)
}

function repoErrorMessage(e: unknown): string {
  const status = e instanceof GitHubError ? e.status : 0
  if (status === 403 && !hasGitHubToken()) return 'rate'
  if ((status === 404 || status === 401) && !hasGitHubToken()) return 'token'
  return e instanceof Error ? e.message : 'Erro desconhecido'
}

async function fetchWindowData(
  repos: RepoConfig[],
  windowDays: number
): Promise<DeliveryCachePayload> {
  const windowEnd = new Date()
  const windowStart = new Date(windowEnd.getTime() - windowDays * 86_400_000)

  const statuses: RepoStatus[] = []
  const rawPrs: Omit<PrRow, 'estimatedHours'>[] = []
  const allCommits: CachedCommit[] = []

  for (const repo of repos) {
    const full = `${repo.owner}/${repo.repo}`
    try {
      const result = await fetchRepo(repo, windowStart, windowEnd)
      rawPrs.push(...result.prs)
      allCommits.push(...result.commits)
      statuses.push({ repo: full, ok: true })
    } catch (e) {
      statuses.push({ repo: full, ok: false, error: repoErrorMessage(e) })
    }
  }

  rawPrs.sort((a, b) => (b.mergedAt > a.mergedAt ? 1 : -1))

  return {
    fetchedAt: new Date().toISOString(),
    windowDays,
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    repos: statuses,
    prs: rawPrs,
    commits: allCommits,
  }
}

function buildReportFromCache(
  cache: DeliveryCachePayload,
  periodDays: number,
  manualEffort: ManualEffortItem[]
): DeliveryReport {
  const periodEnd = new Date()
  const periodStart = new Date(periodEnd.getTime() - periodDays * 86_400_000)

  const rawPrs = cache.prs.filter(p => {
    const t = new Date(p.mergedAt)
    return t >= periodStart && t <= periodEnd
  })

  const periodCommits = cache.commits.filter(c => {
    const t = new Date(c.date)
    return t >= periodStart && t <= periodEnd
  })

  const featureCommits = periodCommits.filter(c => c.type === 'feature').length
  const fixCommits = periodCommits.filter(c => c.type === 'fix').length

  const stats: PeriodStats = {
    commits: periodCommits.length,
    pullRequests: rawPrs.length,
    featureCommits,
    fixCommits,
    filesChanged: rawPrs.reduce((acc, p) => acc + p.changedFiles, 0),
    linesAdded: rawPrs.reduce((acc, p) => acc + p.additions, 0),
    linesDeleted: rawPrs.reduce((acc, p) => acc + p.deletions, 0),
  }

  const manualInPeriod = manualItemsInPeriod(manualEffort, periodStart, periodEnd)
  const estimate = computeEstimate(stats, manualInPeriod, periodDays, DEFAULT_EFFORT_CONFIG)
  const allPrs = allocateHours(rawPrs, estimate.gitHours)
  const byProduct = buildByProduct(allPrs)

  const modules: ModuleGroup[] = [
    ...buildModules(allPrs),
    ...manualInPeriod.map(item => ({
      key: `manual-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
      name: item.label,
      type: 'infra' as const,
      product: '—',
      commitCount: 0,
      prNumbers: [],
      description: item.description ?? '',
      manualHours: item.hours,
      estimatedHours: item.hours,
      linesAdded: 0,
      linesDeleted: 0,
      firstMergedAt: item.from ? `${item.from}T12:00:00.000Z` : undefined,
      lastMergedAt: item.to ? `${item.to}T12:00:00.000Z` : undefined,
    })),
  ]

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    periodDays,
    stats,
    estimate,
    kpis: buildKpis(stats, allPrs, estimate.weeks, byProduct),
    weekly: buildWeekly(allPrs, periodStart, periodEnd),
    roadmap: buildRoadmap(modules),
    byProduct,
    modules,
    prs: allPrs,
    repos: cache.repos,
    generatedAt: cache.fetchedAt,
  }
}

export async function getDeliveryReport(
  clientId: string,
  repos: RepoConfig[],
  periodDays: number,
  manualEffort: ManualEffortItem[] = [],
  options?: { forceRefresh?: boolean }
): Promise<DeliveryReport & { cacheHit: boolean; cacheFetchedAt: string }> {
  let cache = await readDeliveryCache(clientId)
  const allFailed = Boolean(cache && cache.repos.length > 0 && cache.repos.every(r => !r.ok))
  const fresh = Boolean(
    cache &&
      isCacheFresh(cache) &&
      cache.windowDays >= CACHE_WINDOW_DAYS &&
      !allFailed &&
      !options?.forceRefresh
  )

  let cacheHit = false
  if (fresh && cache) {
    cacheHit = true
  } else {
    cache = await fetchWindowData(repos, CACHE_WINDOW_DAYS)
    if (cache.repos.some(r => r.ok) || cache.prs.length > 0) {
      await writeDeliveryCache(clientId, cache)
    }
  }

  const report = buildReportFromCache(cache, periodDays, manualEffort)
  return {
    ...report,
    cacheHit,
    cacheFetchedAt: cache.fetchedAt,
  }
}
