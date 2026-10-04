'use client'

import { AlertTriangle, Columns3, Database, GitFork, Layers, Table2 } from 'lucide-react'
import { healthScoreLabel } from '@/lib/data-sources/model/health'
import {
  modelTableKey,
  type DataModelAi,
  type DataModelSnapshot,
} from '@/lib/data-sources/model/types'
import { formatBytes, formatDateTime, formatNumber } from './format'
import { HealthScoreBadge } from './model-health'

export function ModelOverview({
  snapshot,
  ai,
  onOpenTable,
}: {
  snapshot: DataModelSnapshot
  ai: DataModelAi | null
  onOpenTable: (key: string) => void
}) {
  const baseTables = snapshot.tables.filter(table => table.type === 'table')
  const views = snapshot.tables.length - baseTables.length
  const columns = snapshot.tables.reduce((sum, table) => sum + table.columns.length, 0)
  const rows = snapshot.tables.reduce((sum, table) => sum + (table.estimatedRows ?? 0), 0)
  const size = snapshot.tables.reduce((sum, table) => sum + (table.sizeBytes ?? 0), 0)

  const bySchema = snapshot.schemas.map(schema => {
    const tables = snapshot.tables.filter(table => table.schema === schema)
    return {
      schema,
      tables: tables.length,
      columns: tables.reduce((sum, table) => sum + table.columns.length, 0),
    }
  })
  const maxTables = Math.max(1, ...bySchema.map(item => item.tables))

  const largest = [...snapshot.tables]
    .filter(table => table.estimatedRows != null)
    .sort((a, b) => (b.estimatedRows ?? 0) - (a.estimatedRows ?? 0))
    .slice(0, 8)

  const degree = new Map<string, number>()
  for (const rel of snapshot.relationships) {
    for (const key of [modelTableKey(rel.from), modelTableKey(rel.to)]) {
      degree.set(key, (degree.get(key) ?? 0) + 1)
    }
  }
  const hubs = [...degree.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)

  return (
    <div className="space-y-5">
      {snapshot.truncated && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-900">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          A fonte tem mais tabelas do que o limite modelado; views e tabelas excedentes foram omitidas.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Card icon={Layers} label="Schemas" value={String(snapshot.schemas.length)} />
        <Card icon={Table2} label="Tabelas" value={String(baseTables.length)} hint={views ? `${views} views` : undefined} />
        <Card icon={Columns3} label="Colunas" value={formatNumber(columns)} />
        <Card icon={GitFork} label="Relacionamentos" value={String(snapshot.relationships.length)} />
        <Card icon={Database} label="Linhas (est.)" value={formatNumber(rows)} hint={formatBytes(size)} />
        <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Saúde</p>
          <div className="mt-1.5 flex items-center gap-2">
            <HealthScoreBadge score={snapshot.health.score} />
            <span className="text-[12px] text-neutral-700">{healthScoreLabel(snapshot.health.score)}</span>
          </div>
        </div>
      </div>

      {ai?.overview && (
        <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-700">Leitura da IA</p>
          <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-neutral-800">
            {ai.overview.split('\n').slice(0, 2).join('\n')}
          </p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Por schema</p>
          <ul className="mt-3 space-y-2.5">
            {bySchema.map(item => (
              <li key={item.schema}>
                <div className="flex items-center justify-between gap-3 text-[11px]">
                  <span className="truncate font-mono text-neutral-800">{item.schema}</span>
                  <span className="shrink-0 text-neutral-500">
                    {item.tables} tab · {item.columns} col
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${Math.max(4, (item.tables / maxTables) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <RankedList
          title="Maiores tabelas"
          empty="Sem estimativas de linhas disponíveis."
          items={largest.map(table => ({
            key: modelTableKey(table),
            value: `${formatNumber(table.estimatedRows)} linhas`,
          }))}
          onOpen={onOpenTable}
        />

        <RankedList
          title="Tabelas mais conectadas"
          empty="Nenhuma chave estrangeira declarada."
          items={hubs.map(([key, count]) => ({
            key,
            value: `${count} ${count === 1 ? 'relação' : 'relações'}`,
          }))}
          onOpen={onOpenTable}
        />
      </div>

      <p className="text-[11px] text-neutral-400">
        Modelagem gerada em {formatDateTime(snapshot.generatedAt)}
        {ai?.generatedAt ? ` · visão de IA em ${formatDateTime(ai.generatedAt)}` : ''}
      </p>
    </div>
  )
}

function Card({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">{label}</p>
        <Icon className="h-3.5 w-3.5 text-neutral-300" strokeWidth={1.75} />
      </div>
      <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.02em] text-neutral-900">{value}</p>
      {hint && <p className="text-[10px] text-neutral-400">{hint}</p>}
    </div>
  )
}

function RankedList({
  title,
  items,
  empty,
  onOpen,
}: {
  title: string
  items: Array<{ key: string; value: string }>
  empty: string
  onOpen: (key: string) => void
}) {
  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{title}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-[11px] text-neutral-400">{empty}</p>
      ) : (
        <ul className="mt-3 divide-y divide-black/[0.05]">
          {items.map(item => (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onOpen(item.key)}
                className="flex w-full items-center justify-between gap-3 py-1.5 text-left text-[11px] hover:text-teal-700"
              >
                <span className="truncate font-mono text-neutral-800">{item.key}</span>
                <span className="shrink-0 text-neutral-500">{item.value}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
