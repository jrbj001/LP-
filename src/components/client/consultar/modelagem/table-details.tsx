'use client'

import { ArrowRight, KeyRound, Link2, X } from 'lucide-react'
import {
  modelTableKey,
  type DataModelAiTable,
  type DataModelRelationship,
  type DataModelTable,
} from '@/lib/data-sources/model/types'
import { formatBytes, formatDateTime, formatNumber, tableTypeLabel } from './format'

export function TableDetails({
  table,
  ai,
  relationships,
  onClose,
  onNavigate,
}: {
  table: DataModelTable
  ai?: DataModelAiTable
  relationships: DataModelRelationship[]
  onClose?: () => void
  onNavigate?: (key: string) => void
}) {
  const key = modelTableKey(table)
  const outgoing = relationships.filter(rel => modelTableKey(rel.from) === key)
  const incoming = relationships.filter(rel => modelTableKey(rel.to) === key)
  const keyColumns = new Set((ai?.keyColumns ?? []).map(column => column.toLowerCase()))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-black/[0.06] px-5 py-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            {table.schema} · {tableTypeLabel(table.type)}
          </p>
          <h3 className="mt-1 truncate font-mono text-[15px] font-semibold text-neutral-900">{table.table}</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-black/[0.04] hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {(ai?.description || table.description) && (
          <div className="space-y-2">
            {ai?.description && (
              <p className="text-[13px] leading-relaxed text-neutral-800">{ai.description}</p>
            )}
            {ai?.purpose && <p className="text-[12px] leading-relaxed text-neutral-500">{ai.purpose}</p>}
            {table.description && (
              <p className="rounded-lg bg-[#fbfbfa] px-3 py-2 text-[11px] leading-relaxed text-neutral-600">
                <span className="font-semibold text-neutral-500">Descrição no banco: </span>
                {table.description}
              </p>
            )}
          </div>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] sm:grid-cols-4">
          <Stat label="Colunas" value={String(table.columns.length)} />
          <Stat label="Linhas (est.)" value={formatNumber(table.estimatedRows)} />
          <Stat label="Tamanho" value={formatBytes(table.sizeBytes)} />
          <Stat label="Estatísticas" value={formatDateTime(table.lastAnalyzedAt)} />
        </dl>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Campos ({table.columns.length})
          </p>
          <div className="mt-2 overflow-hidden rounded-xl border border-black/[0.06]">
            <table className="min-w-full text-left text-[11px]">
              <thead className="bg-[#fbfbfa] text-[9px] uppercase tracking-[0.08em] text-neutral-400">
                <tr>
                  <th className="px-3 py-2 font-semibold">Campo</th>
                  <th className="px-3 py-2 font-semibold">Tipo</th>
                  <th className="px-3 py-2 font-semibold">Nulo</th>
                  <th className="px-3 py-2 font-semibold">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map(column => {
                  const highlighted = keyColumns.has(column.column.toLowerCase())
                  return (
                    <tr key={column.column} className="border-t border-black/[0.05] align-top">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          {column.primaryKey && (
                            <KeyRound className="h-3 w-3 shrink-0 text-amber-500" aria-label="Chave primária" />
                          )}
                          {column.foreignKey && (
                            <Link2 className="h-3 w-3 shrink-0 text-sky-500" aria-label="Chave estrangeira" />
                          )}
                          <span
                            className={`font-mono ${highlighted ? 'font-semibold text-neutral-900' : 'text-neutral-800'}`}
                          >
                            {column.column}
                          </span>
                        </div>
                        {column.foreignKey && (
                          <button
                            type="button"
                            onClick={() => {
                              const parts = column.foreignKey!.split('.')
                              parts.pop()
                              onNavigate?.(parts.join('.'))
                            }}
                            className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] text-sky-700 hover:underline"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {column.foreignKey}
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono text-neutral-500">{column.dataType}</td>
                      <td className="px-3 py-2 text-neutral-500">{column.nullable ? 'sim' : 'não'}</td>
                      <td className="px-3 py-2 text-neutral-600">{column.comment || <span className="text-neutral-300">—</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {(outgoing.length > 0 || incoming.length > 0) && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <RelationList
              title={`Referencia (${outgoing.length})`}
              items={outgoing.map(rel => ({
                key: modelTableKey(rel.to),
                label: `${rel.from.column} → ${modelTableKey(rel.to)}.${rel.to.column}`,
              }))}
              onNavigate={onNavigate}
            />
            <RelationList
              title={`Referenciada por (${incoming.length})`}
              items={incoming.map(rel => ({
                key: modelTableKey(rel.from),
                label: `${modelTableKey(rel.from)}.${rel.from.column} → ${rel.to.column}`,
              }))}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] font-semibold uppercase tracking-[0.1em] text-neutral-400">{label}</dt>
      <dd className="mt-0.5 text-neutral-800">{value}</dd>
    </div>
  )
}

function RelationList({
  title,
  items,
  onNavigate,
}: {
  title: string
  items: Array<{ key: string; label: string }>
  onNavigate?: (key: string) => void
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{title}</p>
      {items.length === 0 ? (
        <p className="mt-2 text-[11px] text-neutral-300">Nenhum</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {items.map((item, index) => (
            <li key={`${item.key}-${index}`}>
              <button
                type="button"
                onClick={() => onNavigate?.(item.key)}
                className="w-full truncate rounded-lg bg-[#fbfbfa] px-2.5 py-1.5 text-left font-mono text-[10px] text-neutral-700 hover:bg-black/[0.04]"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
