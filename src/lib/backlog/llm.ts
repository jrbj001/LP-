import { generateObject, generateText } from 'ai'
import { toAiError } from '@/lib/ai/ai-error'
import { aiModel, chatModel, codingModel, gatewayModelId, requireAiCredentials } from '@/lib/ai/gateway'
import type { BacklogDiagram } from './types'

export { chatModel, codingModel }

function samplingOptions(model: string, temperature: number): { temperature?: number } {
  const name = gatewayModelId(model).split('/').pop() ?? ''
  return name === 'gpt-6-astra' || name.startsWith('gpt-6-astra-') ? {} : { temperature }
}

export async function callOpenAiJson(
  system: string,
  user: string,
  options?: { temperature?: number; maxTokens?: number; model?: string }
): Promise<unknown> {
  requireAiCredentials()
  try {
    const model = options?.model || codingModel()
    const result = await generateObject({
      model: aiModel(model),
      output: 'no-schema',
      system,
      prompt: user,
      ...samplingOptions(model, options?.temperature ?? 0.2),
      maxOutputTokens: options?.maxTokens ?? 2200,
    })
    if (result.object == null) {
      throw new Error('Resposta vazia do modelo.')
    }
    return result.object
  } catch (error) {
    throw toAiError(error)
  }
}

export async function callOpenAiText(
  system: string,
  user: string,
  options?: { temperature?: number; maxTokens?: number; model?: string }
): Promise<string> {
  requireAiCredentials()
  try {
    const model = options?.model || chatModel()
    const result = await generateText({
      model: aiModel(model),
      system,
      prompt: user,
      ...samplingOptions(model, options?.temperature ?? 0.4),
      maxOutputTokens: options?.maxTokens ?? 900,
    })
    const text = result.text.trim()
    if (!text) throw new Error('Resposta vazia do modelo.')
    return text
  } catch (error) {
    throw toAiError(error)
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
