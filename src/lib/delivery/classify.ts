import type { DeliveryType, RepoConfig } from './types'

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
