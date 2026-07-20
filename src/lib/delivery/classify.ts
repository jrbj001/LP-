import type { DeliveryType, FixKind, RepoConfig } from './types'

const CONVENTIONAL: [RegExp, DeliveryType][] = [
  [/^(feat|feature)[:(!/]/i, 'feature'],
  [/^(fix|hotfix|bugfix)[:(!/]/i, 'fix'],
  [/^(refactor|perf)[:(!/]/i, 'improvement'],
  [/^(chore|docs|ci|build|test|style)[:(!/]/i, 'maintenance'],
]

const KEYWORDS: [RegExp, DeliveryType][] = [
  [/\b(fix|hotfix|bug|corrig\w*|conserta\w*|erro|quebrad\w*)\b/i, 'fix'],
  [/\b(feat|feature|adiciona\w*|novo|nova|cria\w*|implementa\w*|lan[çc]a\w*)\b/i, 'feature'],
  [/\b(chore|docs|readme|depend[êe]nci\w*|deps|ci|build)\b/i, 'maintenance'],
  [/\b(refactor\w*|melhoria\w*|melhora\w*|otimiza\w*|perf|ajust\w*|atualiza\w*)\b/i, 'improvement'],
]

/** Classifica o tipo a partir do título da PR (ou mensagem de commit) e branch. */
export function classifyType(title: string, branch = ''): DeliveryType {
  for (const [re, type] of CONVENTIONAL) {
    if (re.test(title.trim())) return type
  }
  if (branch) {
    for (const [re, type] of CONVENTIONAL) {
      if (re.test(branch.trim())) return type
    }
  }
  const haystack = `${title} ${branch.replace(/[-_/]/g, ' ')}`
  for (const [re, type] of KEYWORDS) {
    if (re.test(haystack)) return type
  }
  return 'improvement'
}

const BUG_SIGNALS: RegExp[] = [
  /\b(bug|bugs|hotfix|bugfix)\b/i,
  /\b(erro|falha|crash|exception|regress\w*|quebrad\w*|incidente)\b/i,
  /\b(corrig\w+|conserta\w+)\b/i,
  /\b(null|undefined|500|404|502|timeout)\b/i,
  /\b(n[aã]o funciona|nao carrega|n[aã]o abre|nao abre)\b/i,
]

const EVOLUTION_SIGNALS: RegExp[] = [
  /\b(evolu\w+|evolui\w+|melhoria\w*|melhora\w*|aprimora\w*|enhance\w*)\b/i,
  /\b(ajust\w+|atualiza\w+|otimiza\w+|refactor\w*|\bperf\b)\b/i,
  /\b(ux|ui|layout|responsiv\w*|acessibil\w*|padroniza\w*|reorganiza\w*)\b/i,
  /\b(polish|refin\w*|limpeza|cleanup|upgrade)\b/i,
  /\b(novo fluxo|novo campo|expand\w*|increment\w*)\b/i,
]

/**
 * Separa entregas `fix` em bug (defeito/retrabalho) vs evolução (ajuste/melhoria incremental).
 * Usa título e branch — convenções `fix/` genéricas tendem a evolução quando não há sinal de bug.
 */
export function classifyFixKind(title: string, branch = ''): FixKind {
  const t = title.trim()
  const b = branch.trim()
  const haystack = `${t} ${b.replace(/[-_/]/g, ' ')}`

  if (/^(hotfix|bugfix)([/:(]|$)/i.test(b) || /^(hotfix|bugfix)[:(!/]/i.test(t)) {
    return 'bug'
  }

  const hasBug = BUG_SIGNALS.some(re => re.test(haystack))
  const hasEvo = EVOLUTION_SIGNALS.some(re => re.test(haystack))

  if (hasBug && !hasEvo) return 'bug'
  if (hasEvo && !hasBug) return 'evolution'
  if (hasBug && hasEvo) return 'bug'

  if (/^fix[/:]/i.test(b) || /^fix[:(!/]/i.test(t)) {
    return 'evolution'
  }

  return 'bug'
}

/** Atribui a entrega a um produto do repo (regras regex) ou ao produto padrão. */
export function classifyProduct(repo: RepoConfig, title: string, branch: string): string {
  const haystack = `${branch} ${title}`.toLowerCase()
  for (const rule of repo.products ?? []) {
    if (new RegExp(rule.pattern, 'i').test(haystack)) return rule.label
  }
  return repo.label
}

/** Remove prefixos conventional-commit do título para exibição ao cliente. */
export function humanizeTitle(title: string): string {
  const cleaned = title
    .replace(/^(feat|feature|fix|hotfix|bugfix|refactor|perf|chore|docs|ci|build|test|style)(\([^)]*\))?!?[:/]\s*/i, '')
    .trim()
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

/**
 * Chave de módulo a partir do nome da branch: agrupa PRs da mesma frente
 * de trabalho (ex.: feat/registro-ocorrencia e fix/registro-ocorrencia).
 */
export function moduleKey(branch: string): string {
  return branch
    .replace(/^(feat|feature|fix|hotfix|bugfix|refactor|perf|chore|docs|ci|build|test|style)\//i, '')
    .toLowerCase()
    .replace(/[_/]/g, '-')
    .replace(/-\d+$/, '')
}

/** Nome de exibição do módulo a partir da chave. */
export function moduleName(key: string): string {
  const words = key.split('-').filter(Boolean)
  return words
    .map(w => (w.length <= 3 && !/^(de|do|da|por|via)$/.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}
