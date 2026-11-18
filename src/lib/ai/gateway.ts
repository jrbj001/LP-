import { gateway } from 'ai'

export const MISSING_AI_CREDENTIAL =
  'AI Gateway da Vercel sem credencial. Configure AI_GATEWAY_API_KEY ou rode `vercel env pull` para obter o VERCEL_OIDC_TOKEN.'

/**
 * Em deploys da Vercel o token OIDC chega por requisição, sem variável de ambiente,
 * por isso `VERCEL` também conta como credencial.
 */
export function hasAiCredentials(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL)
}

export function requireAiCredentials(): void {
  if (!hasAiCredentials()) throw new Error(MISSING_AI_CREDENTIAL)
}

export function isMissingAiCredential(message: string): boolean {
  return message.includes('AI_GATEWAY_API_KEY')
}

/** O gateway exige `provedor/modelo`; ids antigos como `gpt-4.1` continuam valendo como OpenAI. */
export function gatewayModelId(id: string): string {
  const trimmed = id.trim()
  return trimmed.includes('/') ? trimmed : `openai/${trimmed}`
}

export function aiModel(id: string) {
  return gateway(gatewayModelId(id))
}

export function codingModel(): string {
  return gatewayModelId(
    process.env.AI_CODING_MODEL ||
      process.env.AI_MODEL ||
      process.env.OPENAI_CODING_MODEL ||
      process.env.OPENAI_MODEL ||
      'openai/gpt-4.1'
  )
}

export function chatModel(): string {
  return gatewayModelId(process.env.AI_MODEL || process.env.OPENAI_MODEL || 'openai/gpt-4o-mini')
}

export function visionModel(): string {
  return gatewayModelId(process.env.AI_VISION_MODEL || process.env.OPENAI_VISION_MODEL || codingModel())
}
