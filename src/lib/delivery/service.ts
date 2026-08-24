import { DEFAULT_EFFORT_CONFIG } from './config'
import { classifyProduct, classifyFixKind, classifyType, humanizeTitle, moduleKey, moduleName } from './classify'
import { computeEstimate, manualItemsInPeriod } from './effort'
import {
  CACHE_VERSION,
  isCacheFresh,
  isCacheUsableAsStale,
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
  FixKind,
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

/** Detalhe de PR é 1 request cada; em série 45 PRs levam minutos. */
const PR_DETAIL_CONCURRENCY = 8

interface RepoResult {
  prs: Omit<PrRow, 'estimatedHours'>[]
  commits: CachedCommit[]
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const out = new Array<R>(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      out[index] = await fn(items[index])
    }
  })
  await Promise.all(workers)
  return out
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

function fixKindOf(type: DeliveryType, title: string, branch: string, stored?: FixKind): FixKind | undefined {
  if (type !== 'fix') return undefined
  return stored ?? classifyFixKind(title, branch)
}

function enrichPr<T extends Omit<PrRow, 'estimatedHours'>>(pr: T): T {
  if (pr.type !== 'fix') return pr
  return { ...pr, fixKind: fixKindOf(pr.type, pr.title, pr.branch, pr.fixKind) }
}

async function fetchRepo(
  repo: RepoConfig,
  since: Date,
  until: Date,
  known: Map<string, Omit<PrRow, 'estimatedHours'>>
): Promise<RepoResult> {
  const { owner, repo: name } = repo
  const full = `${owner}/${name}`

  const [pulls, commits] = await Promise.all([
    listMergedPulls(owner, name, since, until),
    listCommitsSince(owner, name, since).catch(() => []),
  ])

  const rows = await mapWithConcurrency(pulls, PR_DETAIL_CONCURRENCY, async pr => {
    // PR mesclada não muda mais: se o detalhe já está em cache, não refazemos o request.
    const cached = known.get(`${full}#${pr.number}`)
    if (cached) return cached

    const detail = await getPullDetail(owner, name, pr.number)
    const branch = detail.head?.ref || pr.head.ref || ''
    const mergedAt = detail.merged_at || pr.merged_at
    if (!mergedAt) return null
    const mergedDate = new Date(mergedAt)
    if (mergedDate < since || mergedDate > until) return null

    const rawTitle = detail.title || pr.title
    const type = classifyType(rawTitle, branch)
    const fixKind = type === 'fix' ? classifyFixKind(rawTitle, branch) : undefined
    return {
      number: pr.number,
      repo: full,
      branch,
      title: humanizeTitle(rawTitle),
      type,
      fixKind,
      product: classifyProduct(repo, rawTitle, branch),
      mergedAt,
      additions: detail.additions,
      deletions: detail.deletions,
      changedFiles: detail.changed_files,
      commitCount: detail.commits,
    } satisfies Omit<PrRow, 'estimatedHours'>
  })

  const prs = rows.filter((row): row is Omit<PrRow, 'estimatedHours'> => row !== null)

  const cachedCommits: CachedCommit[] = []
  for (const c of commits) {
    if (c.parents.length > 1) continue
    const date = c.commit.author?.date || c.commit.committer?.date
    if (!date) continue
    const firstLine = c.commit.message.split('\n')[0]
    const type = classifyType(firstLine)
    cachedCommits.push({
      date,
      type,
      fixKind: type === 'fix' ? classifyFixKind(firstLine) : undefined,
    })
  }

  return { prs, commits: cachedCommits }
}

/**
 * Horas de cada PR derivadas apenas das próprias linhas inseridas.
 * Precisa ser independente das outras PRs da janela: se dependesse do pool,
 * a mesma PR mudaria de esforço entre 30/60/90 dias e um produto poderia
 * aparecer com mais horas em 30 dias do que em 90.
 */
function allocateHours(prs: Omit<PrRow, 'estimatedHours'>[], locPerHour: number): PrRow[] {
  return prs.map(p => ({
    ...p,
    estimatedHours: Math.max(0.5, Math.round((p.additions / locPerHour) * 2) / 2),
  }))
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
      bugs: 0,
      evolutions: 0,
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
        bugs: 0,
        evolutions: 0,
        linesAdded: 0,
        hours: 0,
      } satisfies WeeklyBucket)
    bucket.prs++
    if (pr.type === 'feature') bucket.features++
    if (pr.type === 'fix') {
      bucket.fixes++
      if (pr.fixKind === 'evolution') bucket.evolutions++
      else bucket.bugs++
    }
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
  const bugPrs = prs.filter(p => p.type === 'fix' && p.fixKind !== 'evolution').length
  const evolutionPrs = prs.filter(p => p.type === 'fix' && p.fixKind === 'evolution').length
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
    bugToFeatureRatio: featPrs === 0 ? (bugPrs > 0 ? 9.9 : 0) : Number((bugPrs / featPrs).toFixed(2)),
    evolutionToFeatureRatio:
      featPrs === 0 ? (evolutionPrs > 0 ? 9.9 : 0) : Number((evolutionPrs / featPrs).toFixed(2)),
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

function buildByProduct(
  prs: PrRow[],
  manualEffort: ManualEffortItem[] = []
): ProductBreakdown[] {
  const map = new Map<string, ProductBreakdown>()
  for (const pr of prs) {
    const entry = map.get(pr.product) ?? { product: pr.product, prs: 0, hours: 0, linesAdded: 0 }
    entry.prs++
    entry.hours += pr.estimatedHours
    entry.linesAdded += pr.additions
    map.set(pr.product, entry)
  }

  const manualHours = manualEffort.reduce((sum, item) => sum + item.hours, 0)
  if (manualHours > 0) {
    map.set('Infraestrutura / esforço manual', {
      product: 'Infraestrutura / esforço manual',
      prs: 0,
      hours: manualHours,
      linesAdded: 0,
    })
  }

  return [...map.values()]
    .map(p => ({ ...p, hours: Number(p.hours.toFixed(1)) }))
    .sort((a, b) => b.hours - a.hours)
}

function repoErrorMessage(e: unknown): string {
  const status = e instanceof GitHubError ? e.status : 0
  const hasToken = hasGitHubToken()
  // Requisição anônima a repo privado responde 404; 401 só ocorre com credencial enviada e recusada.
  if (status === 401) return 'invalid-token'
  if (status === 403) return hasToken ? 'rate-authenticated' : 'rate'
  if (status === 404) return hasToken ? 'no-access' : 'token'
  return e instanceof Error ? e.message : 'Erro desconhecido'
}

async function fetchWindowData(
  repos: RepoConfig[],
  windowDays: number,
  previous?: DeliveryCachePayload | null
): Promise<DeliveryCachePayload> {
  const windowEnd = new Date()
  const windowStart = new Date(windowEnd.getTime() - windowDays * 86_400_000)

  const known = new Map<string, Omit<PrRow, 'estimatedHours'>>()
  for (const pr of previous?.prs ?? []) known.set(`${pr.repo}#${pr.number}`, pr)

  const statuses: RepoStatus[] = []
  const rawPrs: Omit<PrRow, 'estimatedHours'>[] = []
  const allCommits: CachedCommit[] = []

  for (const repo of repos) {
    const full = `${repo.owner}/${repo.repo}`
    try {
      const result = await fetchRepo(repo, windowStart, windowEnd, known)
      rawPrs.push(...result.prs)
      allCommits.push(...result.commits)
      statuses.push({ repo: full, ok: true })
    } catch (e) {
      statuses.push({ repo: full, ok: false, error: repoErrorMessage(e) })
    }
  }

  rawPrs.sort((a, b) => (b.mergedAt > a.mergedAt ? 1 : -1))

  return {
    version: CACHE_VERSION,
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
  manualEffort: ManualEffortItem[],
  repos: RepoConfig[]
): DeliveryReport {
  const periodEnd = new Date()
  const periodStart = new Date(periodEnd.getTime() - periodDays * 86_400_000)

  const repoByFullName = new Map(repos.map(repo => [`${repo.owner}/${repo.repo}`.toLowerCase(), repo]))
  const rawPrs = cache.prs
    .filter(p => {
      const t = new Date(p.mergedAt)
      return t >= periodStart && t <= periodEnd
    })
    .map(pr => {
      const repo = repoByFullName.get(pr.repo.toLowerCase())
      return enrichPr({
        ...pr,
        // Reaplica as regras atuais mesmo quando o detalhe da PR veio do cache.
        product: repo ? classifyProduct(repo, pr.title, pr.branch) : pr.product,
      })
    })

  const periodCommits = cache.commits.filter(c => {
    const t = new Date(c.date)
    return t >= periodStart && t <= periodEnd
  })

  const featureCommits = periodCommits.filter(c => c.type === 'feature').length
  const bugFixCommits = periodCommits.filter(
    c => c.type === 'fix' && (c.fixKind ?? 'bug') !== 'evolution'
  ).length
  const evolutionFixCommits = periodCommits.filter(
    c => c.type === 'fix' && c.fixKind === 'evolution'
  ).length
  const fixCommits = bugFixCommits + evolutionFixCommits

  const stats: PeriodStats = {
    commits: periodCommits.length,
    pullRequests: rawPrs.length,
    featureCommits,
    fixCommits,
    bugFixCommits,
    evolutionFixCommits,
    filesChanged: rawPrs.reduce((acc, p) => acc + p.changedFiles, 0),
    linesAdded: rawPrs.reduce((acc, p) => acc + p.additions, 0),
    linesDeleted: rawPrs.reduce((acc, p) => acc + p.deletions, 0),
  }

  const manualInPeriod = manualItemsInPeriod(manualEffort, periodStart, periodEnd)
  const estimate = computeEstimate(stats, manualInPeriod, periodDays, DEFAULT_EFFORT_CONFIG)
  const allPrs = allocateHours(rawPrs, DEFAULT_EFFORT_CONFIG.effectiveLocPerHour)
  const byProduct = buildByProduct(allPrs, manualInPeriod)

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

/** Uma revalidação por cliente: visitas simultâneas não disparam N fetches no GitHub. */
const inFlight = new Map<string, Promise<DeliveryCachePayload>>()

function refreshCache(
  clientId: string,
  repos: RepoConfig[],
  previous: DeliveryCachePayload | null
): Promise<DeliveryCachePayload> {
  const running = inFlight.get(clientId)
  if (running) return running

  const task = fetchWindowData(repos, CACHE_WINDOW_DAYS, previous)
    .then(async fresh => {
      if (fresh.repos.some(r => r.ok) || fresh.prs.length > 0) {
        await writeDeliveryCache(clientId, fresh)
      }
      return fresh
    })
    .finally(() => {
      inFlight.delete(clientId)
    })

  inFlight.set(clientId, task)
  return task
}

export async function getDeliveryReport(
  clientId: string,
  repos: RepoConfig[],
  periodDays: number,
  manualEffort: ManualEffortItem[] = [],
  options?: { forceRefresh?: boolean }
): Promise<DeliveryReport & { cacheHit: boolean; cacheStale: boolean; cacheFetchedAt: string }> {
  const stored = await readDeliveryCache(clientId)
  const configuredRepoNames = repos.map(repo => `${repo.owner}/${repo.repo}`.toLowerCase()).sort()
  const cachedRepoNames = (stored?.repos ?? []).map(repo => repo.repo.toLowerCase()).sort()
  const cacheMatchesConfig =
    configuredRepoNames.length === cachedRepoNames.length &&
    configuredRepoNames.every((repo, index) => repo === cachedRepoNames[index])
  const usable =
    stored &&
    stored.version === CACHE_VERSION &&
    stored.windowDays >= CACHE_WINDOW_DAYS &&
    cacheMatchesConfig &&
    !(stored.repos.length > 0 && stored.repos.every(r => !r.ok))
      ? stored
      : null

  let cache: DeliveryCachePayload
  let cacheHit = false
  let cacheStale = false

  if (!usable || options?.forceRefresh) {
    cache = await refreshCache(clientId, repos, usable)
  } else if (isCacheFresh(usable)) {
    cache = usable
    cacheHit = true
  } else if (isCacheUsableAsStale(usable)) {
    // Entrega o relatório na hora e busca merges novos ao fundo.
    cache = usable
    cacheHit = true
    cacheStale = true
    void refreshCache(clientId, repos, usable).catch(() => undefined)
  } else {
    cache = await refreshCache(clientId, repos, usable)
  }

  const report = buildReportFromCache(cache, periodDays, manualEffort, repos)
  return {
    ...report,
    cacheHit,
    cacheStale,
    cacheFetchedAt: cache.fetchedAt,
  }
}
