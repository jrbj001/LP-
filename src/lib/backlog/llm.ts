import { describeOpenAiError } from '@/lib/ai/openai-error'
import type { BacklogDiagram } from './types'

export function codingModel(): string {
  return process.env.OPENAI_CODING_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1'
}

export async function callOpenAiJson(
  system: string,
  user: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada no ambiente.')
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: codingModel(),
      temperature: options?.temperature ?? 0.2,
      max_tokens: options?.maxTokens ?? 2200,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(describeOpenAiError(res.status, errText))
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const raw = data.choices?.[0]?.message?.content?.trim()
  if (!raw) throw new Error('Resposta vazia da OpenAI.')
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('A IA retornou um JSON inválido.')
  }
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(v => String(v).trim()).filter(Boolean)
}

export function asDiagram(value: unknown): BacklogDiagram | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Record<string, unknown>
  if (typeof raw.title !== 'string' || !Array.isArray(raw.nodes) || !Array.isArray(raw.edges)) {
    return null
  }
  const nodes: BacklogDiagram['nodes'] = raw.nodes
    .filter(node => node && typeof node === 'object')
    .map(node => {
      const n = node as Record<string, unknown>
      const kind: BacklogDiagram['nodes'][number]['kind'] =
        n.kind === 'actor' ||
        n.kind === 'input' ||
        n.kind === 'process' ||
        n.kind === 'system' ||
        n.kind === 'output'
          ? n.kind
          : undefined
      return {
        id: String(n.id ?? '').trim(),
        label: String(n.label ?? '').trim(),
        detail: n.detail ? String(n.detail).trim() : undefined,
        kind,
      }
    })
    .filter(node => node.id && node.label)
    .slice(0, 8)
  const nodeIds = new Set(nodes.map(node => node.id))
  const edges = raw.edges
    .filter(edge => edge && typeof edge === 'object')
    .map(edge => {
      const e = edge as Record<string, unknown>
      return {
        from: String(e.from ?? '').trim(),
        to: String(e.to ?? '').trim(),
        label: e.label ? String(e.label).trim() : undefined,
      }
    })
    .filter(edge => nodeIds.has(edge.from) && nodeIds.has(edge.to))
    .slice(0, 10)
  if (nodes.length < 2) return null
  return { title: raw.title.trim(), nodes, edges }
}
