import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(readFileSync(join(here, 'config.json'), 'utf8'))
const dataDir = resolve(here, '../../docs/report-financeiro/data')
const git = JSON.parse(readFileSync(join(dataDir, 'git-data.json'), 'utf8'))

const { rates, effortModel: em } = config
const months = config.payments.map(p => p.month)
const projectIds = config.projects.map(p => p.id)
const supportRx = new RegExp(config.supportPattern, 'i')
const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d
const zeros = () => Object.fromEntries(projectIds.map(k => [k, 0]))
const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0)

const aliasToAuthor = new Map()
for (const a of config.authors) for (const alias of a.aliases) aliasToAuthor.set(alias.toLowerCase(), a)
const authorOf = name => aliasToAuthor.get(name.toLowerCase()) ?? { id: 'outros', name, role: 'Outros' }

const localDay = iso => new Date(new Date(iso).getTime() - 3 * 3600e3).toISOString().slice(0, 10)

const commits = git.commits
  .map(c => {
    const author = authorOf(c.author)
    const operational = /^(fix|chore|hotfix|ci)\b/i.test(c.subject) && supportRx.test(c.subject)
    const project = c.project !== 'suporte' && operational ? 'suporte' : c.project
    return {
      ...c,
      authorId: author.id,
      automation: !!author.automation,
      project,
      month: localDay(c.date).slice(0, 7),
      day: localDay(c.date),
      ts: new Date(c.date).getTime(),
    }
  })
  .filter(c => months.includes(c.month))
  .sort((a, b) => a.ts - b.ts)

const byAuthor = new Map()
for (const c of commits) {
  if (!byAuthor.has(c.authorId)) byAuthor.set(c.authorId, [])
  byAuthor.get(c.authorId).push(c)
}
for (const list of byAuthor.values()) {
  let prev = null
  for (const c of list) {
    const gapMin = prev ? (c.ts - prev.ts) / 60000 : Infinity
    c.rawHours = (gapMin <= em.sessionGapMinutes ? gapMin : em.warmupMinutes) / 60
    prev = c
  }
  const perDay = new Map()
  for (const c of list) perDay.set(c.day, (perDay.get(c.day) ?? 0) + c.rawHours)
  for (const c of list) {
    const total = perDay.get(c.day)
    const scale = total > em.maxHoursPerDay ? em.maxHoursPerDay / total : 1
    c.hours = c.rawHours * scale * c.weight
  }
}

const human = commits.filter(c => !c.automation)
const automation = commits.filter(c => c.automation)

function capacityHours(id, month) {
  const row = config.capacity.filter(c => c.id === id && month >= c.from && (!c.until || month <= c.until)).at(-1)
  return row?.hoursPerMonth ?? 0
}

function gitShare(list) {
  const by = zeros()
  for (const c of list) by[c.project] += c.hours
  const total = sumValues(by)
  return { by, total }
}

function spread(hours, share) {
  const out = zeros()
  if (!share.total) return out
  for (const p of projectIds) out[p] = hours * (share.by[p] / share.total)
  return out
}

const monthly = months.map(month => {
  const payment = config.payments.find(p => p.month === month)
  const amount = payment.parts.reduce((a, b) => a + b, 0)
  const mc = human.filter(c => c.month === month)
  const hoursByProject = zeros()
  const hoursByAuthor = {}

  for (const person of config.authors.filter(a => !a.automation)) {
    const cap = capacityHours(person.id, month)
    if (!cap) continue
    const monthShare = gitShare(mc.filter(c => c.authorId === person.id))
    const share = monthShare.total >= 8 ? monthShare : gitShare(human.filter(c => c.authorId === person.id))
    const split = spread(cap, share)
    for (const p of projectIds) hoursByProject[p] += split[p]
    hoursByAuthor[person.id] = cap
  }

  for (const ext of config.externalProfessionals) {
    if (month < ext.from) continue
    hoursByAuthor[ext.id] = ext.hoursPerMonth
    for (const [p, share] of Object.entries(ext.projectSplit)) hoursByProject[p] += ext.hoursPerMonth * share
  }

  const unversioned = zeros()
  const monthGit = gitShare(mc)
  const supportSlice = config.unversionedHoursPerMonth * config.unversionedToSupport
  const gitSlice = config.unversionedHoursPerMonth - supportSlice
  unversioned.suporte += supportSlice
  const rest = spread(gitSlice, monthGit.total ? monthGit : { by: Object.fromEntries(projectIds.map(p => [p, 1])), total: projectIds.length })
  for (const p of projectIds) unversioned[p] += rest[p]
  for (const p of projectIds) hoursByProject[p] += unversioned[p]

  const manual = zeros()
  for (const item of config.manualEffort) {
    if (!item.months.includes(month)) continue
    manual[item.project] += item.hours
    hoursByProject[item.project] += item.hours
  }

  const deliveredHours = sumValues(hoursByProject)
  const paidHours = { min: amount / rates.max, mid: amount / rates.mid, max: amount / rates.min }
  const allocation = Object.fromEntries(projectIds.map(p => [p, deliveredHours ? (amount * hoursByProject[p]) / deliveredHours : 0]))
  const lines = mc.reduce((a, c) => a + (c.additions + c.deletions) * c.weight, 0)

  return {
    month,
    date: payment.date,
    channel: payment.channel,
    parts: payment.parts,
    amount,
    netEstimate: amount - config.monthlyTaxDiscount,
    commits: mc.length,
    automationCommits: automation.filter(c => c.month === month).length,
    lines: Math.round(lines),
    additions: Math.round(mc.reduce((a, c) => a + c.additions * c.weight, 0)),
    gitHours: round(monthGit.total),
    unversioned: Object.fromEntries(Object.entries(unversioned).map(([k, v]) => [k, round(v)])),
    manual: Object.fromEntries(Object.entries(manual).map(([k, v]) => [k, round(v)])),
    hoursByProject: Object.fromEntries(Object.entries(hoursByProject).map(([k, v]) => [k, round(v)])),
    hoursByAuthor: Object.fromEntries(Object.entries(hoursByAuthor).map(([k, v]) => [k, round(v)])),
    deliveredHours: round(deliveredHours),
    paidHours: { min: round(paidHours.min), mid: round(paidHours.mid), max: round(paidHours.max) },
    bank: {
      at240: round(deliveredHours - paidHours.min),
      at210: round(deliveredHours - paidHours.mid),
      at180: round(deliveredHours - paidHours.max),
    },
    allocation: (() => {
      const rounded = Object.fromEntries(projectIds.map(p => [p, Math.round(allocation[p])]))
      const drift = amount - sumValues(rounded)
      const biggest = projectIds.reduce((a, b) => (allocation[b] > allocation[a] ? b : a))
      rounded[biggest] += drift
      return rounded
    })(),
    allocationPct: Object.fromEntries(projectIds.map(p => [p, deliveredHours ? round((hoursByProject[p] / deliveredHours) * 100) : 0])),
    deliveredValueMid: Math.round(deliveredHours * rates.mid),
  }
})

let acc = { at240: 0, at210: 0, at180: 0 }
for (const m of monthly) {
  acc = { at240: acc.at240 + m.bank.at240, at210: acc.at210 + m.bank.at210, at180: acc.at180 + m.bank.at180 }
  m.bankAccumulated = { at240: round(acc.at240), at210: round(acc.at210), at180: round(acc.at180) }
}

const sum = (list, f) => list.reduce((a, x) => a + f(x), 0)
const totalPaid = sum(monthly, m => m.amount)
const totalDelivered = sum(monthly, m => m.deliveredHours)
const totalPaidHours = {
  min: sum(monthly, m => m.paidHours.min),
  mid: sum(monthly, m => m.paidHours.mid),
  max: sum(monthly, m => m.paidHours.max),
}

const projects = config.projects.map(p => {
  const pc = human.filter(c => c.project === p.id)
  const hours = sum(monthly, m => m.hoursByProject[p.id])
  const authors = {}
  for (const c of pc) authors[c.authorId] = (authors[c.authorId] ?? 0) + c.hours
  const totalAuthorHours = sumValues(authors) || 1
  const topAuthor = Object.entries(authors).sort((a, b) => b[1] - a[1])[0]
  return {
    ...p,
    commits: pc.length,
    hours: round(hours),
    allocation: sum(monthly, m => m.allocation[p.id]),
    pct: round((hours / totalDelivered) * 100),
    lines: Math.round(sum(pc, c => (c.additions + c.deletions) * c.weight)),
    repos: config.repos.filter(r => r.project === p.id || pc.some(c => c.repo === r.name)).map(r => r.label),
    authorShare: Object.fromEntries(Object.entries(authors).map(([k, v]) => [k, round((v / totalAuthorHours) * 100)])),
    busFactorRisk: topAuthor ? round((topAuthor[1] / totalAuthorHours) * 100) : 0,
    topAuthor: topAuthor?.[0] ?? null,
    hoursByMonth: Object.fromEntries(monthly.map(m => [m.month, m.hoursByProject[p.id]])),
  }
})

const people = [
  ...config.authors.filter(a => !a.automation).map(a => {
    const pc = human.filter(c => c.authorId === a.id)
    const capByProject = zeros()
    for (const m of monthly) {
      const cap = m.hoursByAuthor[a.id] ?? 0
      const monthShare = gitShare(pc.filter(c => c.month === m.month))
      const share = monthShare.total >= 8 ? monthShare : gitShare(pc)
      const split = spread(cap, share)
      for (const p of projectIds) capByProject[p] += split[p]
    }
    return {
      id: a.id,
      name: a.name,
      role: a.role,
      company: 'PixelPulseLab',
      commits: pc.length,
      hours: round(sum(monthly, m => m.hoursByAuthor[a.id] ?? 0)),
      gitHours: round(sum(pc, c => c.hours)),
      activeDays: new Set(pc.map(c => c.day)).size,
      projects: Object.fromEntries(Object.entries(capByProject).map(([k, v]) => [k, round(v)])),
      hoursByMonth: Object.fromEntries(monthly.map(m => [m.month, m.hoursByAuthor[a.id] ?? 0])),
    }
  }),
  ...config.externalProfessionals.map(e => ({
    id: e.id,
    name: e.name,
    role: e.role,
    company: e.company,
    commits: 0,
    hours: round(sum(monthly, m => m.hoursByAuthor[e.id] ?? 0)),
    gitHours: 0,
    activeDays: null,
    estimated: true,
    projects: Object.fromEntries(projectIds.map(p => [p, round(sum(monthly, m => (m.hoursByAuthor[e.id] ?? 0) * (e.projectSplit[p] ?? 0)))])),
    hoursByMonth: Object.fromEntries(monthly.map(m => [m.month, m.hoursByAuthor[e.id] ?? 0])),
  })),
]

const totalAdditions = sum(monthly, m => m.additions)
const equivalentHoursRaw = totalAdditions / config.roi.traditionalLocPerHour
const rawMultiplier = equivalentHoursRaw / totalDelivered
const multiplier = Math.min(rawMultiplier, config.roi.conservativeMultiplierCap)
const equivalentHours = totalDelivered * multiplier
const valueGenerated = equivalentHours * rates.mid
const roi = {
  totalAdditions,
  equivalentHoursRaw: round(equivalentHoursRaw),
  rawMultiplier: round(rawMultiplier, 2),
  multiplier: round(multiplier, 2),
  equivalentHours: round(equivalentHours),
  valueGenerated: Math.round(valueGenerated),
  valueDeliveredHours: Math.round(totalDelivered * rates.mid),
  roiPct: round(((valueGenerated - totalPaid) / totalPaid) * 100),
  roiDeliveredPct: round(((totalDelivered * rates.mid - totalPaid) / totalPaid) * 100),
  automationCommits: automation.length,
  costPerDeliveredHour: round(totalPaid / totalDelivered, 2),
  costPerEquivalentHour: round(totalPaid / equivalentHours, 2),
}

const scopeOf = s => s.match(/^[a-z]+\(([^)]+)\)/i)?.[1] ?? null
const roadmap = config.projects.map(p => ({
  id: p.id,
  label: p.label,
  color: p.color,
  months: monthly.map(m => {
    const mc = human.filter(c => c.project === p.id && c.month === m.month)
    const scopes = {}
    for (const c of mc) {
      const s = scopeOf(c.subject)
      if (s) scopes[s] = (scopes[s] ?? 0) + 1
    }
    const prs = git.merges.filter(x => x.project === p.id && localDay(x.date).slice(0, 7) === m.month)
    return {
      month: m.month,
      commits: mc.length,
      hours: m.hoursByProject[p.id],
      feats: mc.filter(c => /^feat/i.test(c.subject)).length,
      fixes: mc.filter(c => /^(fix|hotfix)/i.test(c.subject)).length,
      topScopes: Object.entries(scopes).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([s, n]) => ({ scope: s, n })),
      prs: prs.slice(0, 6).map(x => ({ pr: x.pr, branch: x.branch })),
      samples: mc.filter(c => /^feat/i.test(c.subject)).slice(-4).map(c => c.subject),
    }
  }),
}))

const recent = monthly.slice(-3)
const avgDelivered = totalDelivered / monthly.length
const avgRecent = sum(recent, m => m.deliveredHours) / recent.length
const scenario = (label, hours, note) => ({
  label,
  monthlyHours: round(hours),
  monthlyAt180: Math.round(hours * rates.min),
  monthlyAt210: Math.round(hours * rates.mid),
  monthlyAt240: Math.round(hours * rates.max),
  note,
})
const budget2027 = {
  avgDelivered: round(avgDelivered),
  avgRecent: round(avgRecent),
  scenarios: [
    scenario('Manter o retainer', 80000 / rates.mid, 'O contrato segue em R$ 80 mil. As horas cobertas ficam abaixo da dedicação atual e o banco de horas continua crescendo.'),
    scenario('Equilibrar', avgDelivered, 'O retainer passa a cobrir a dedicação média de 2026, na taxa de referência. O banco para de crescer.'),
    scenario('Crescer', avgDelivered + 176, 'Soma uma engenharia sênior em tempo integral na Like:Me à dedicação média, para reduzir a concentração em uma pessoa.'),
  ],
}

const report = {
  generatedAt: new Date().toISOString(),
  client: config.client,
  vendor: config.vendor,
  period: config.period,
  rates,
  monthlyTaxDiscount: config.monthlyTaxDiscount,
  effortModel: {
    sessionGapMinutes: em.sessionGapMinutes,
    warmupMinutes: em.warmupMinutes,
    maxHoursPerDay: em.maxHoursPerDay,
    unversionedHoursPerMonth: config.unversionedHoursPerMonth,
    unversionedNote: config.unversionedNote,
    capacity: config.capacity,
    manualEffort: config.manualEffort,
  },
  roiConfig: config.roi,
  stakeholders: config.stakeholders,
  repoStatus: git.repoStatus,
  totals: {
    paid: totalPaid,
    netEstimate: totalPaid - config.monthlyTaxDiscount * monthly.length,
    commits: human.length,
    prs: git.merges.length,
    lines: sum(monthly, m => m.lines),
    deliveredHours: round(totalDelivered),
    paidHours: { min: round(totalPaidHours.min), mid: round(totalPaidHours.mid), max: round(totalPaidHours.max) },
    bank: monthly.at(-1).bankAccumulated,
    bankValue: {
      at240: Math.round(monthly.at(-1).bankAccumulated.at240 * rates.max),
      at210: Math.round(monthly.at(-1).bankAccumulated.at210 * rates.mid),
      at180: Math.round(monthly.at(-1).bankAccumulated.at180 * rates.min),
    },
  },
  monthly,
  projects,
  people,
  roi,
  roadmap,
  budget2027,
}

const allocationGap = monthly.map(m => m.amount - sumValues(m.allocation))
const problems = []
if (totalPaid !== 671241) problems.push(`total pago ${totalPaid}`)
if (allocationGap.some(g => Math.abs(g) > 5)) problems.push(`rateio não fecha: ${allocationGap.join(', ')}`)
if (monthly.some(m => m.bank.at180 < 0)) problems.push('banco negativo no cenário de R$ 180')
if (problems.length) {
  console.error(problems.join('\n'))
  process.exitCode = 1
}

writeFileSync(join(dataDir, 'report-data.json'), JSON.stringify(report, null, 2))
console.log('pago', totalPaid, '| entregue', round(totalDelivered), '| pagas', report.totals.paidHours, '| banco', report.totals.bank)
console.table(monthly.map(m => ({ mes: m.month, valor: m.amount, entregue: m.deliveredHours, pagas180: m.paidHours.max, banco180: m.bank.at180, acc210: m.bankAccumulated.at210, ...m.allocationPct })))
console.table(projects.map(p => ({ p: p.id, commits: p.commits, horas: p.hours, pct: p.pct, rateio: p.allocation, risco: p.busFactorRisk, top: p.topAuthor })))
console.table(people.map(p => ({ p: p.name, commits: p.commits, horas: p.hours, git: p.gitHours, dias: p.activeDays })))
console.log(roi)
console.log(budget2027.scenarios)
