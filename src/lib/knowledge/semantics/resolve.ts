import type { DataSourceCatalogEntry } from '@/lib/data-sources/types'
import { be180AtivosSemanticPack, be180ColmeiaSemanticPack } from './be180'
import { likemeSemanticPack } from './likeme'
import {
  findCatalogMatches,
  matchesTableRef,
  tableKey,
  type SemanticMetric,
  type SemanticPack,
} from './types'

const PACKS: SemanticPack[] = [
  likemeSemanticPack,
  be180ColmeiaSemanticPack,
  be180AtivosSemanticPack,
]

export function semanticPackFor(sourceName: string): SemanticPack | null {
  return PACKS.find(pack => pack.matchSource(sourceName)) ?? null
}

export function matchSemanticMetric(
  pack: SemanticPack,
  question: string
): SemanticMetric | null {
  const authExplicit = /\b(auth\.users|identidades? de login|supabase auth)\b/i.test(question)
  return (
    pack.metrics.find(metric => {
      if (metric.id === 'usuarios-produto' && authExplicit) return false
      return metric.match.test(question)
    }) ?? null
  )
}

export function applySemanticTables(
  sourceName: string,
  question: string,
  catalog: DataSourceCatalogEntry[],
  selected: DataSourceCatalogEntry[]
): DataSourceCatalogEntry[] {
  const pack = semanticPackFor(sourceName)
  if (!pack) return selected
  const metric = matchSemanticMetric(pack, question)
  if (!metric) return selected

  const required = findCatalogMatches(
    catalog,
    metric.canonical.filter(item => item.required)
  )
  const extra = findCatalogMatches(
    catalog,
    metric.canonical.filter(item => !item.required)
  )
  const forbidden = (entry: DataSourceCatalogEntry) =>
    metric.forbid.some(ref => matchesTableRef(entry, ref))

  const merged: DataSourceCatalogEntry[] = []
  const seen = new Set<string>()
  for (const entry of [...required, ...selected.filter(item => !forbidden(item)), ...extra]) {
    const key = tableKey(entry)
    if (seen.has(key) || forbidden(entry)) continue
    seen.add(key)
    merged.push(entry)
  }
  return merged.slice(0, 12)
}

export function semanticPromptHint(sourceName: string, question: string): string {
  const pack = semanticPackFor(sourceName)
  if (!pack) return ''
  const metric = matchSemanticMetric(pack, question)
  const lines = [
    `Semântica ${pack.id} (fuso ${pack.timeZone}):`,
    ...(metric
      ? [
          `Métrica: ${metric.label}.`,
          ...metric.notes,
          ...metric.defaultFilters,
          ...metric.joins.map(item => `JOIN oficial: ${item}`),
          metric.timeColumnHint ? `Coluna de tempo preferida: ${metric.timeColumnHint}.` : '',
        ]
      : ['Use o catálogo autorizado. Não invente tabelas.']),
  ]
  return lines.filter(Boolean).join('\n')
}
