import {
  modelTableKey,
  type DataModelHealth,
  type DataModelRelationship,
  type DataModelTable,
  type HealthCheck,
  type HealthSeverity,
} from './types'

const MAX_AFFECTED = 50

interface CheckSpec {
  id: string
  label: string
  /** Penalidade máxima no score quando 100% dos itens estão afetados. */
  weight: number
  /** Limiares de proporção para severidade (low, medium, high). */
  thresholds: readonly [number, number, number]
  okSummary: string
  summary: (count: number, total: number) => string
}

function severityFor(ratio: number, thresholds: CheckSpec['thresholds']): HealthSeverity {
  if (ratio <= 0) return 'ok'
  if (ratio >= thresholds[2]) return 'high'
  if (ratio >= thresholds[1]) return 'medium'
  if (ratio >= thresholds[0]) return 'low'
  return 'info'
}

function buildCheck(spec: CheckSpec, affected: string[], total: number): HealthCheck {
  const ratio = total > 0 ? affected.length / total : 0
  return {
    id: spec.id,
    label: spec.label,
    severity: severityFor(ratio, spec.thresholds),
    summary: affected.length === 0 ? spec.okSummary : spec.summary(affected.length, total),
    affected: affected.slice(0, MAX_AFFECTED),
    affectedCount: affected.length,
    ratio,
  }
}

function penalty(spec: CheckSpec, check: HealthCheck): number {
  return spec.weight * check.ratio
}

const SPECS = {
  withoutPk: {
    id: 'tables-without-pk',
    label: 'Tabelas sem chave primária',
    weight: 30,
    thresholds: [0.05, 0.2, 0.4],
    okSummary: 'Todas as tabelas têm chave primária.',
    summary: (count, total) =>
      `${count} de ${total} tabelas não têm chave primária, o que dificulta joins e deduplicação.`,
  },
  isolated: {
    id: 'isolated-tables',
    label: 'Tabelas sem relacionamentos',
    weight: 20,
    thresholds: [0.2, 0.5, 0.8],
    okSummary: 'Todas as tabelas participam de pelo menos um relacionamento.',
    summary: (count, total) =>
      `${count} de ${total} tabelas não têm chaves estrangeiras de entrada nem de saída.`,
  },
  tablesWithoutDescription: {
    id: 'tables-without-description',
    label: 'Tabelas sem descrição',
    weight: 15,
    thresholds: [0.3, 0.6, 0.9],
    okSummary: 'Todas as tabelas estão documentadas no banco.',
    summary: (count, total) => `${count} de ${total} tabelas não têm comentário/descrição no banco.`,
  },
  columnsWithoutDescription: {
    id: 'columns-without-description',
    label: 'Colunas sem descrição',
    weight: 10,
    thresholds: [0.5, 0.8, 0.95],
    okSummary: 'Todas as colunas estão documentadas no banco.',
    summary: (count, total) => `${count} de ${total} colunas não têm comentário/descrição no banco.`,
  },
  neverAnalyzed: {
    id: 'never-analyzed',
    label: 'Estatísticas nunca coletadas',
    weight: 15,
    thresholds: [0.2, 0.5, 0.8],
    okSummary: 'Todas as tabelas têm estatísticas recentes.',
    summary: (count, total) =>
      `${count} de ${total} tabelas nunca passaram por ANALYZE/estatísticas; contagens são estimativas fracas.`,
  },
  empty: {
    id: 'empty-tables',
    label: 'Tabelas vazias',
    weight: 10,
    thresholds: [0.2, 0.4, 0.7],
    okSummary: 'Nenhuma tabela vazia detectada.',
    summary: (count, total) => `${count} de ${total} tabelas aparentam estar vazias (0 linhas estimadas).`,
  },
} satisfies Record<string, CheckSpec>

export function computeModelHealth(
  tables: DataModelTable[],
  relationships: DataModelRelationship[],
  now: Date = new Date()
): DataModelHealth {
  const baseTables = tables.filter(table => table.type === 'table')
  const related = new Set<string>()
  for (const rel of relationships) {
    related.add(modelTableKey(rel.from))
    related.add(modelTableKey(rel.to))
  }

  const checks: Array<[CheckSpec, HealthCheck]> = []

  checks.push([
    SPECS.withoutPk,
    buildCheck(
      SPECS.withoutPk,
      baseTables.filter(table => !table.hasPrimaryKey).map(modelTableKey),
      baseTables.length
    ),
  ])

  if (baseTables.length >= 2) {
    checks.push([
      SPECS.isolated,
      buildCheck(
        SPECS.isolated,
        baseTables.filter(table => !related.has(modelTableKey(table))).map(modelTableKey),
        baseTables.length
      ),
    ])
  }

  checks.push([
    SPECS.tablesWithoutDescription,
    buildCheck(
      SPECS.tablesWithoutDescription,
      tables.filter(table => !table.description?.trim()).map(modelTableKey),
      tables.length
    ),
  ])

  const allColumns = tables.flatMap(table => table.columns)
  const columnsWithoutDescription = allColumns.filter(column => !column.comment?.trim())
  const tablesWithUndocumentedColumns = [
    ...new Set(columnsWithoutDescription.map(column => `${column.schema}.${column.table}`)),
  ]
  const columnRatio =
    allColumns.length > 0 ? columnsWithoutDescription.length / allColumns.length : 0
  const columnSpec = SPECS.columnsWithoutDescription
  checks.push([
    columnSpec,
    {
      id: columnSpec.id,
      label: columnSpec.label,
      severity: severityFor(columnRatio, columnSpec.thresholds),
      summary:
        columnsWithoutDescription.length === 0
          ? columnSpec.okSummary
          : columnSpec.summary(columnsWithoutDescription.length, allColumns.length),
      affected: tablesWithUndocumentedColumns.slice(0, MAX_AFFECTED),
      affectedCount: columnsWithoutDescription.length,
      ratio: columnRatio,
    },
  ])

  checks.push([
    SPECS.neverAnalyzed,
    buildCheck(
      SPECS.neverAnalyzed,
      baseTables.filter(table => !table.lastAnalyzedAt).map(modelTableKey),
      baseTables.length
    ),
  ])

  checks.push([
    SPECS.empty,
    buildCheck(
      SPECS.empty,
      baseTables.filter(table => table.estimatedRows === 0).map(modelTableKey),
      baseTables.length
    ),
  ])

  const totalPenalty = checks.reduce((sum, [spec, check]) => sum + penalty(spec, check), 0)
  const score = Math.max(0, Math.min(100, Math.round(100 - totalPenalty)))

  return {
    score,
    checks: checks.map(([, check]) => check),
    computedAt: now.toISOString(),
  }
}

export function healthScoreLabel(score: number): string {
  if (score >= 85) return 'Saudável'
  if (score >= 65) return 'Atenção'
  if (score >= 40) return 'Frágil'
  return 'Crítico'
}
