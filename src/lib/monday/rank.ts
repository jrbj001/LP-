/** Palavras da pergunta usadas para achar itens pelo nome. Ignora "monday". */
export function mondaySearchWords(query: string): string[] {
  return [
    ...new Set(
      query
        .toLowerCase()
        .replace(/[^a-z0-9à-ÿ\s]/gi, ' ')
        .split(/\s+/)
        .filter(word => word.length >= 4 && word !== 'monday')
    ),
  ].slice(0, 3)
}

/** Mantém os itens cujo nome ou texto casa com a pergunta. Sem palavra útil, devolve os primeiros. */
export function rankMondayItems<T extends { name: string; excerpt: string }>(
  query: string,
  items: T[],
  limit = 8
): T[] {
  const words = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 4 && word !== 'monday')
  if (words.length === 0) return items.slice(0, limit)
  return items
    .map(item => {
      const haystack = `${item.name} ${item.excerpt}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const score = words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0)
      return { item, score }
    })
    .filter(entry => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(entry => entry.item)
}
