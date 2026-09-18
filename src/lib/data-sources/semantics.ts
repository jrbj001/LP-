import type { DataSourceCatalogEntry } from './types'

export function sourceSemanticHint(sourceName: string): string {
  if (/like:?me|supabase/i.test(sourceName)) {
    return `Semântica Like:Me:
- "usuários da base", "usuários do produto" e contagem geral usam public.user.
- auth.users representa identidades do Supabase Auth e não é a contagem canônica do produto.
- Não aplique deleted_at, status ou outro filtro se a pergunta pedir apenas o total e não definir "ativos".`
  }
  return ''
}

export function applySourceTableSemantics(
  sourceName: string,
  question: string,
  catalog: DataSourceCatalogEntry[],
  selected: DataSourceCatalogEntry[]
): DataSourceCatalogEntry[] {
  const isLikeMeUsers =
    /like:?me|supabase/i.test(sourceName) &&
    /\b(usu[aá]rios?|pessoas?|base)\b/i.test(question)
  if (!isLikeMeUsers) return selected

  const canonical = catalog.find(
    entry => entry.schema.toLowerCase() === 'public' && entry.table.toLowerCase() === 'user'
  )
  if (!canonical) return selected
  return [
    canonical,
    ...selected.filter(
      entry =>
        !(entry.schema.toLowerCase() === 'auth' && entry.table.toLowerCase() === 'users') &&
        !(entry.schema.toLowerCase() === 'public' && entry.table.toLowerCase() === 'user')
    ),
  ].slice(0, 12)
}
