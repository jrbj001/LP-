import type { DataSourceCatalogEntry } from './types'
import { applySemanticTables, semanticPromptHint } from '@/lib/knowledge/semantics/resolve'

export function sourceSemanticHint(sourceName: string, question = ''): string {
  return semanticPromptHint(sourceName, question)
}

export function applySourceTableSemantics(
  sourceName: string,
  question: string,
  catalog: DataSourceCatalogEntry[],
  selected: DataSourceCatalogEntry[]
): DataSourceCatalogEntry[] {
  return applySemanticTables(sourceName, question, catalog, selected)
}
