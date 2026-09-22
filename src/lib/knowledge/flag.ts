export function isKnowledgePipelineEnabled(
  clientId: string,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const slug = clientId.trim().toLowerCase()
  const raw = env.KNOWLEDGE_PIPELINE_CLIENTS?.trim()
  if (raw === '0' || raw === 'off' || raw === 'false') return false
  if (!raw) {
    if (env.NODE_ENV === 'production') return slug === 'likeme'
    return true
  }
  const allowed = raw
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(Boolean)
  if (allowed.includes('*')) return true
  return allowed.includes(slug)
}
