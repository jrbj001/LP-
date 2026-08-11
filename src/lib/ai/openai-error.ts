interface OpenAiErrorBody {
  error?: {
    message?: string
    type?: string
    code?: string
  }
}

/**
 * Traduz a resposta de erro da OpenAI em uma mensagem acionável.
 * Um 429 pode ser saldo esgotado ou limite de requisições — causas com soluções
 * diferentes, por isso não podem virar a mesma mensagem genérica.
 */
export function describeOpenAiError(status: number, rawBody: string): string {
  let parsed: OpenAiErrorBody | null = null
  try {
    parsed = JSON.parse(rawBody) as OpenAiErrorBody
  } catch {
    parsed = null
  }

  const code = parsed?.error?.code ?? ''
  const type = parsed?.error?.type ?? ''

  if (code === 'credit_balance_exhausted' || type === 'insufficient_quota') {
    return 'A conta OpenAI está sem créditos. A chave é válida — adicione saldo em platform.openai.com/settings/organization/billing para liberar a análise.'
  }
  if (status === 429) {
    return 'Limite de requisições da OpenAI atingido. Aguarde alguns instantes e gere novamente.'
  }
  if (status === 401) {
    return 'A OpenAI recusou a credencial (401). Verifique OPENAI_API_KEY no ambiente.'
  }
  if (status === 403) {
    return 'A chave não tem permissão para este modelo ou projeto (403). Verifique o projeto e o modelo configurado.'
  }
  if (status === 404) {
    return `Modelo indisponível para esta chave (404). Ajuste OPENAI_MODEL.`
  }
  if (status >= 500) {
    return 'A OpenAI está instável neste momento. Tente gerar novamente em alguns instantes.'
  }

  const detail = parsed?.error?.message?.trim()
  return detail
    ? `OpenAI retornou ${status}: ${detail}`
    : `OpenAI retornou ${status} ao gerar a análise.`
}
