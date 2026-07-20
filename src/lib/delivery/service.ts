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
  DeliveryReport,
  DeliveryType,
  ManualEffortItem,
  ModuleGroup,
  PeriodStats,
  PrRow,
  RepoConfig,
  RepoStatus,
} from './types'

interface RepoResult {
  prs: PrRow[]
  commits: number
  featureCommits: number
  fixCommits: number
}

async function fetchRepo(repo: RepoConfig, since: Date, maxPulls: number): Promise<RepoResult> {
  const { owner, repo: name } = repo

  const [pulls, commits] = await Promise.all([
    listMergedPulls(owner, name, since, maxPulls),
    listCommitsSince(owner, name, since).catch(() => []),
  ])

  const prs: PrRow[] = []
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

  // Commits do período (sem merges) classificados pela mensagem
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

    groups.push({
      key,
      name: moduleName(key),
      type,
      product: items[0].product,
      commitCount: items.reduce((acc, i) => acc + i.commitCount, 0),
      prNumbers: items.map(i => i.number).sort((a, b) => b - a),
      description: titles.join('. ') + '.',
    })
  }

  return groups.sort((a, b) => b.commitCount - a.commitCount)
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
  const allPrs: PrRow[] = []
  let commits = 0
  let featureCommits = 0
  let fixCommits = 0

  for (const repo of repos) {
    const full = `${repo.owner}/${repo.repo}`
    try {
      const result = await fetchRepo(repo, periodStart, maxPulls)
      allPrs.push(...result.prs)
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

  allPrs.sort((a, b) => (b.mergedAt > a.mergedAt ? 1 : -1))

  const stats: PeriodStats = {
    commits,
    pullRequests: allPrs.length,
    featureCommits,
    fixCommits,
    filesChanged: allPrs.reduce((acc, p) => acc + p.changedFiles, 0),
    linesAdded: allPrs.reduce((acc, p) => acc + p.additions, 0),
    linesDeleted: allPrs.reduce((acc, p) => acc + p.deletions, 0),
  }

  const manualInPeriod = manualItemsInPeriod(manualEffort, periodStart, periodEnd)
  const estimate = computeEstimate(stats, manualInPeriod, periodDays, DEFAULT_EFFORT_CONFIG)

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
    })),
  ]

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    periodDays,
    stats,
    estimate,
    modules,
    prs: allPrs,
    repos: statuses,
    generatedAt: new Date().toISOString(),
  }
}
