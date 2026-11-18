interface AiErrorBody {
  error?: {
    message?: string
    type?: string
    code?: string
  }
}

/**
 * Traduz a resposta de erro do AI Gateway da Vercel em uma mensagem acionável.
 * Um 429 pode ser falta de créditos ou limite de requisições — causas com soluções
 * diferentes, por isso não podem virar a mesma mensagem genérica.
 */
export function describeAiError(status: number, rawBody: string): string {
  let parsed: AiErrorBody | null = null
  try {
    parsed = JSON.parse(rawBody) as AiErrorBody
  } catch {
    parsed = null
  }

  const code = parsed?.error?.code ?? ''
  const type = parsed?.error?.type ?? ''

  if (
    status === 402 ||
    type === 'insufficient_funds' ||
    code === 'credit_balance_exhausted' ||
    type === 'insufficient_quota'
  ) {
    return 'O AI Gateway da Vercel está sem créditos. Adicione créditos na aba AI Gateway do time na Vercel para liberar a análise.'
  }
  if (status === 429) {
    return 'Limite de requisições do AI Gateway atingido. Aguarde alguns instantes e gere novamente.'
  }
  if (status === 401) {
    return 'O AI Gateway recusou a credencial (401). Confira AI_GATEWAY_API_KEY ou renove o VERCEL_OIDC_TOKEN com `vercel env pull` (ele expira em 12 h).'
  }
  if (status === 403) {
    return 'A credencial não tem permissão para este modelo no AI Gateway (403). Verifique o time e o modelo configurado.'
  }
  if (status === 404) {
    return 'Modelo não encontrado no AI Gateway (404). Use o formato provedor/modelo em AI_MODEL, por exemplo openai/gpt-4.1.'
  }
  if (status >= 500) {
    return 'O AI Gateway ou o provedor do modelo está instável. Tente gerar novamente em alguns instantes.'
  }

  const detail = parsed?.error?.message?.trim() || (parsed ? '' : rawBody.trim().slice(0, 300))
  return detail
    ? `AI Gateway retornou ${status}: ${detail}`
    : `AI Gateway retornou ${status} ao gerar a análise.`
}

/** Normaliza erros do AI SDK e do gateway (`statusCode`, `type`, `responseBody`) em uma mensagem acionável. */
export function toAiError(error: unknown): Error {
  if (error && typeof error === 'object') {
    const rec = error as Record<string, unknown>
    const status =
      typeof rec.statusCode === 'number'
        ? rec.statusCode
        : typeof rec.status === 'number'
          ? rec.status
          : 0
    const message = typeof rec.message === 'string' ? rec.message : ''
    const body =
      typeof rec.responseBody === 'string'
        ? rec.responseBody
        : typeof rec.type === 'string'
          ? JSON.stringify({ error: { message, type: rec.type } })
          : message
    if (status >= 400) {
      return new Error(describeAiError(status, body))
    }
  }
  if (error instanceof Error) return error
  return new Error('Falha ao chamar o AI Gateway.')
}
