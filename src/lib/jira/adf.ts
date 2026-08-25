/** Extrai texto plano de ADF (Atlassian Document Format) ou string legado. */

export function adfToPlainText(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value !== 'object') return ''

  const parts: string[] = []
  walk(value, parts)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function walk(node: unknown, parts: string[]): void {
  if (!node || typeof node !== 'object') return
  const item = node as { type?: string; text?: string; content?: unknown[] }
  if (item.type === 'text' && typeof item.text === 'string' && item.text.trim()) {
    parts.push(item.text.trim())
  }
  if (Array.isArray(item.content)) {
    for (const child of item.content) walk(child, parts)
  }
}
