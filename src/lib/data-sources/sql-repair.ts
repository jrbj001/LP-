export const MAX_SQL_REPAIRS = 2

export function sqlErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function isSqlRepairableError(error: unknown): boolean {
  const text = sqlErrorMessage(error).toLowerCase()
  return !/não foi possível conectar|econnrefused|enotfound|etimedout|authentication failed|password authentication|login failed|ssl|não configurado|database_url/.test(
    text
  )
}

export function sqlRepairContext(previousSql: string, error: string): string {
  return `A consulta anterior falhou no banco. Corrija gerando um único SELECT válido com o schema autorizado, sem inventar tabelas ou colunas.

SQL anterior:
${previousSql}

Erro do banco:
${error}`
}

export async function executeSqlWithRepair<TDraft extends { sql: string }, TResult>(input: {
  generate: (repair?: { sql: string; error: string }) => Promise<TDraft>
  validateAndExecute: (draft: TDraft) => Promise<{ sql: string; result: TResult }>
  maxRepairs?: number
}): Promise<{ draft: TDraft; sql: string; result: TResult; attempts: number }> {
  const maxRepairs = input.maxRepairs ?? MAX_SQL_REPAIRS
  let repair: { sql: string; error: string } | undefined

  for (let attempt = 0; attempt <= maxRepairs; attempt++) {
    const draft = await input.generate(repair)
    try {
      const executed = await input.validateAndExecute(draft)
      return { draft, sql: executed.sql, result: executed.result, attempts: attempt + 1 }
    } catch (error) {
      if (!isSqlRepairableError(error) || attempt >= maxRepairs) throw error
      repair = { sql: draft.sql, error: sqlErrorMessage(error) }
    }
  }

  throw new Error('A consulta SQL falhou.')
}
