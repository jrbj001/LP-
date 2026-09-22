const STACK_HINT = /\n\s+at\s|\/[\w.-]+\.(ts|js|tsx):/i

export function sanitizeSourceError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error)
  if (STACK_HINT.test(raw)) return 'falha na consulta'
  const text = raw.toLowerCase()
  if (/timeout|etimedout|timed out|statement_timeout/.test(text)) return 'timeout'
  if (/não encontrada|does not exist|invalid object name|undefined table/.test(text)) {
    return 'tabela não encontrada'
  }
  if (/não foi possível identificar tabelas/.test(text)) return 'nenhuma tabela relacionada'
  if (/econnrefused|enotfound|não foi possível conectar|connect/.test(text)) return 'falha de conexão'
  if (/authentication|password|login failed/.test(text)) return 'falha de autenticação'
  if (/permission|denied|not authorized/.test(text)) return 'permissão negada'
  if (/syntax|invalid column|column .* does not exist|consulta contém/.test(text)) {
    return 'consulta inválida'
  }
  return 'falha na consulta'
}
