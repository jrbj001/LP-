/**
 * Coeficientes da estimativa de esforço — calibráveis por cliente.
 *
 * Metodologia: heurística de mercado de 10–18 LOC/h para código produtivo
 * TypeScript/React em produção. Sobre linhas brutas inseridas (que incluem
 * boilerplate, código gerado e markup), o fator efetivo calibrado é
 * ~50 LOC brutas/h — validado contra o relatório Colmeia Jun/Jul 2026
 * (11.998 linhas → ~240h).
 */
export interface EffortConfig {
  /** Linhas brutas inseridas por hora de trabalho (fator efetivo calibrado). */
  effectiveLocPerHour: number
  /** Variação exibida na estimativa (± %). */
  variancePct: number
  /** Horas de uma pessoa-mês para o equivalente de equipe. */
  hoursPerPersonMonth: number
  /** Arredondamento das horas totais (ex.: 10 → "~240 h"). */
  roundingHours: number
}

export const DEFAULT_EFFORT_CONFIG: EffortConfig = {
  effectiveLocPerHour: 50,
  variancePct: 20,
  hoursPerPersonMonth: 160,
  roundingHours: 10,
}
