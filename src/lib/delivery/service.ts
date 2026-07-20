import { DEFAULT_EFFORT_CONFIG } from './config'
import { classifyProduct, classifyType, humanizeTitle, moduleKey, moduleName } from './classify'
import { computeEstimate, manualItemsInPeriod } from './effort'
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

interface RepoResult {
  prs: Omit<PrRow, 'estimatedHours'>[]
  commits: number
  featureCommits: number
  fixCommits: number
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

async function fetchRepo(repo: RepoConfig, since: Date, maxPulls: number): Promise<RepoResult> {
  const { owner, repo: name } = repo

  const [pulls, commits] = await Promise.all([
    listMergedPulls(owner, name, since, maxPulls),
    listCommitsSince(owner, name, since).catch(() => []),
  ])

  const prs: RepoResult['prs'] = []
  for (const pr of pulls) {
    const detail = await getPullDetail(owner, name, pr.number)
    const type = classifyType(pr.title, pr.head.ref)
    prs.push({
      number: pr.number,
      repo: `${owner}/${name}`,
      branch: pr.head.ref,
      title: humanizeTitle(pr.title),
      type,
      product: classifyProduct(repo, pr.title, pr.head.ref),
      mergedAt: pr.merged_at!,
      additions: detail.additions,
      deletions: detail.deletions,
      changedFiles: detail.changed_files,
      commitCount: detail.commits,
    })
  }

  const workCommits = commits.filter(c => c.parents.length <= 1)
  let featureCommits = 0
  let fixCommits = 0
  for (const c of workCommits) {
    const firstLine = c.commit.message.split('\n')[0]
    const type = classifyType(firstLine)
    if (type === 'feature') featureCommits++
    else if (type === 'fix') fixCommits++
  }

  return { prs, commits: workCommits.length, featureCommits, fixCommits }
}

function allocateHours(prs: Omit<PrRow, 'estimatedHours'>[], gitHours: number): PrRow[] {
  if (prs.length === 0) return []
  if (gitHours <= 0) return prs.map(p => ({ ...p, estimatedHours: 0 }))
  const totalLines = prs.reduce((acc, p) => acc + Math.max(1, p.additions), 0)
  return prs.map(p => {
    const weight = Math.max(1, p.additions) / totalLines
    const hours = Math.round(gitHours * weight * 2) / 2
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

function buildWeekly(prs: PrRow[]): WeeklyBucket[] {
  const map = new Map<string, WeeklyBucket>()
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

function buildKpis(stats: PeriodStats, prs: PrRow[], weeks: number, byProduct: ProductBreakdown[]): DeliveryKpis {
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

export async function getDeliveryReport(
  repos: RepoConfig[],
  periodDays: number,
  manualEffort: ManualEffortItem[] = []
): Promise<DeliveryReport> {
  const periodEnd = new Date()
  const periodStart = new Date(periodEnd.getTime() - periodDays * 86_400_000)
  const maxPulls = hasGitHubToken() ? 60 : 15

  const statuses: RepoStatus[] = []
  const rawPrs: Omit<PrRow, 'estimatedHours'>[] = []
  let commits = 0
  let featureCommits = 0
  let fixCommits = 0

  for (const repo of repos) {
    const full = `${repo.owner}/${repo.repo}`
    try {
      const result = await fetchRepo(repo, periodStart, maxPulls)
      rawPrs.push(...result.prs)
      commits += result.commits
      featureCommits += result.featureCommits
      fixCommits += result.fixCommits
      statuses.push({ repo: full, ok: true })
    } catch (e) {
      const status = e instanceof GitHubError ? e.status : 0
      let error: string
      if (status === 403 && !hasGitHubToken()) {
        error = 'rate'
      } else if ((status === 404 || status === 401) && !hasGitHubToken()) {
        error = 'token'
      } else {
        error = e instanceof Error ? e.message : 'Erro desconhecido'
      }
      statuses.push({ repo: full, ok: false, error })
    }
  }

  rawPrs.sort((a, b) => (b.mergedAt > a.mergedAt ? 1 : -1))

  const stats: PeriodStats = {
    commits,
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

  const weekly = buildWeekly(allPrs)
  const kpis = buildKpis(stats, allPrs, estimate.weeks, byProduct)
  const roadmap = buildRoadmap(modules)

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    periodDays,
    stats,
    estimate,
    kpis,
    weekly,
    roadmap,
    byProduct,
    modules,
    prs: allPrs,
    repos: statuses,
    generatedAt: new Date().toISOString(),
  }
}
