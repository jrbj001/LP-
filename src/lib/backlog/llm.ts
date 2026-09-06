import { generateObject, generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { describeOpenAiError } from '@/lib/ai/openai-error'
import type { BacklogDiagram } from './types'

export function codingModel(): string {
  return process.env.OPENAI_CODING_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1'
}

export function chatModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini'
}

function requireApiKey(): void {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada no ambiente.')
  }
}

function mapAiError(error: unknown): Error {
  if (error && typeof error === 'object') {
    const rec = error as Record<string, unknown>
    const status =
      typeof rec.statusCode === 'number'
        ? rec.statusCode
        : typeof rec.status === 'number'
          ? rec.status
          : 0
    const body =
      typeof rec.responseBody === 'string'
        ? rec.responseBody
        : typeof rec.message === 'string'
          ? rec.message
          : ''
    if (status >= 400) {
      return new Error(describeOpenAiError(status, body))
    }
  }
  if (error instanceof Error) return error
  return new Error('Falha ao chamar a OpenAI.')
}

export async function callOpenAiJson(
  system: string,
  user: string,
  options?: { temperature?: number; maxTokens?: number; model?: string }
): Promise<unknown> {
  requireApiKey()
  try {
    const result = await generateObject({
      model: openai(options?.model || codingModel()),
      output: 'no-schema',
      system,
      prompt: user,
      temperature: options?.temperature ?? 0.2,
      maxOutputTokens: options?.maxTokens ?? 2200,
    })
    if (result.object == null) {
      throw new Error('Resposta vazia da OpenAI.')
    }
    return result.object
  } catch (error) {
    throw mapAiError(error)
  }
}

export async function callOpenAiText(
  system: string,
  user: string,
  options?: { temperature?: number; maxTokens?: number; model?: string }
): Promise<string> {
  requireApiKey()
  try {
    const result = await generateText({
      model: openai(options?.model || chatModel()),
      system,
      prompt: user,
      temperature: options?.temperature ?? 0.4,
      maxOutputTokens: options?.maxTokens ?? 900,
    })
    const text = result.text.trim()
    if (!text) throw new Error('Resposta vazia da OpenAI.')
    return text
  } catch (error) {
    throw mapAiError(error)
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
