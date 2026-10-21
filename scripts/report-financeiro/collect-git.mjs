import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(readFileSync(join(here, 'config.json'), 'utf8'))
const outDir = resolve(here, '../../docs/report-financeiro/data')
const root = resolve(here, '../..', config.reposRoot)

const ignore = config.effortModel.ignoreFilePatterns.map(p => new RegExp(p, 'i'))
const since = new Date(`${config.period.since}T00:00:00-03:00`)
const until = new Date(`${config.period.until}T23:59:59-03:00`)

function git(repoPath, args) {
  return execFileSync('git', ['-C', repoPath, ...args], { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 })
}

function inRange(iso) {
  const d = new Date(iso)
  return d >= since && d <= until
}

function collectCommits(repo, repoPath) {
  const raw = git(repoPath, [
    'log', '--all', '--no-merges', '--since=2025-12-01', '--numstat',
    '--format=@@%H\x1f%an\x1f%ae\x1f%aI\x1f%s',
  ])
  const commits = []
  let current = null
  for (const line of raw.split('\n')) {
    if (line.startsWith('@@')) {
      const [hash, author, email, date, subject] = line.slice(2).split('\x1f')
      current = { hash, author, email, date, subject, files: [] }
      commits.push(current)
      continue
    }
    if (!current || !line.trim()) continue
    const [add, del, file] = line.split('\t')
    if (add === '-' || !file) continue
    current.files.push({ file, add: Number(add), del: Number(del) })
  }

  return commits
    .filter(c => inRange(c.date))
    .map(c => {
      const maxLines = config.effortModel.maxLinesPerFile
      const codeFiles = c.files.filter(f => !ignore.some(rx => rx.test(f.file)))
      const scoped = repo.includePaths
        ? codeFiles.filter(f => repo.includePaths.some(p => f.file.startsWith(p)))
        : codeFiles
      const sum = list => list.reduce((acc, f) => acc + Math.min(f.add + f.del, maxLines), 0)
      const totalLines = sum(codeFiles)
      const scopedLines = sum(scoped)
      const weight = repo.includePaths ? (totalLines ? scopedLines / totalLines : 0) * (repo.share ?? 1) : 1
      return {
        repo: repo.name,
        project: repo.project,
        hash: c.hash.slice(0, 10),
        author: c.author,
        email: c.email,
        date: c.date,
        subject: c.subject,
        additions: scoped.reduce((a, f) => a + Math.min(f.add, maxLines), 0),
        deletions: scoped.reduce((a, f) => a + Math.min(f.del, maxLines), 0),
        files: scoped.length,
        weight,
      }
    })
    .filter(c => c.weight > 0)
}

function collectMerges(repo, repoPath) {
  const raw = git(repoPath, ['log', '--all', '--merges', '--since=2025-12-01', '--format=%H\x1f%aI\x1f%s'])
  return raw
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [hash, date, subject] = line.split('\x1f')
      const pr = subject.match(/Merge pull request #(\d+) from [^/]+\/(.+)$/)
      return { repo: repo.name, project: repo.project, hash: hash.slice(0, 10), date, subject, pr: pr ? Number(pr[1]) : null, branch: pr ? pr[2] : null }
    })
    .filter(m => m.pr && inRange(m.date))
}

const commits = []
const merges = []
const repoStatus = []
for (const repo of config.repos) {
  const repoPath = join(root, repo.name)
  if (!existsSync(join(repoPath, '.git'))) {
    repoStatus.push({ repo: repo.name, found: false })
    continue
  }
  const c = collectCommits(repo, repoPath)
  const m = repo.includePaths ? [] : collectMerges(repo, repoPath)
  commits.push(...c)
  merges.push(...m)
  repoStatus.push({ repo: repo.name, found: true, commits: c.length, merges: m.length })
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'git-data.json'), JSON.stringify({ generatedAt: new Date().toISOString(), repoStatus, commits, merges }, null, 2))
console.table(repoStatus)
console.log(`commits: ${commits.length} · merges: ${merges.length}`)
