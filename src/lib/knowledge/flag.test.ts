import { describe, expect, it } from 'vitest'
import { isKnowledgePipelineEnabled } from './flag'

describe('isKnowledgePipelineEnabled', () => {
  it('em produção, liga só Like:Me quando a env está vazia', () => {
    expect(isKnowledgePipelineEnabled('likeme', { NODE_ENV: 'production' })).toBe(true)
    expect(isKnowledgePipelineEnabled('be180-ooh', { NODE_ENV: 'production' })).toBe(false)
  })

  it('em desenvolvimento, liga todos os tenants', () => {
    expect(isKnowledgePipelineEnabled('be180-ooh', { NODE_ENV: 'development' })).toBe(true)
  })

  it('respeita allowlist e desliga explícito', () => {
    expect(
      isKnowledgePipelineEnabled('be180-ooh', {
        NODE_ENV: 'production',
        KNOWLEDGE_PIPELINE_CLIENTS: 'likeme,be180-ooh',
      })
    ).toBe(true)
    expect(
      isKnowledgePipelineEnabled('likeme', { NODE_ENV: 'production', KNOWLEDGE_PIPELINE_CLIENTS: 'off' })
    ).toBe(false)
    expect(
      isKnowledgePipelineEnabled('cafe-orfeu', { NODE_ENV: 'production', KNOWLEDGE_PIPELINE_CLIENTS: '*' })
    ).toBe(true)
  })
})
