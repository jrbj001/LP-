'use client'

import { useMemo, useState } from 'react'
import { KeyRound, Search, Table2 } from 'lucide-react'
import {
  modelTableKey,
  type DataModelAi,
  type DataModelSnapshot,
} from '@/lib/data-sources/model/types'
import { formatNumber, tableTypeLabel } from './format'
import { TableDetails } from './table-details'

export function ModelTables({
  snapshot,
  ai,
  selectedKey,
  onSelect,
}: {
  snapshot: DataModelSnapshot
  ai: DataModelAi | null
  selectedKey: string | null
  onSelect: (key: string | null) => void
}) {
  const [query, setQuery] = useState('')
  const [schema, setSchema] = useState<string>('all')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return snapshot.tables.filter(table => {
      if (schema !== 'all' && table.schema !== schema) return false
      if (!needle) return true
      const key = modelTableKey(table).toLowerCase()
      if (key.includes(needle)) return true
      if (ai?.tables[modelTableKey(table)]?.description.toLowerCase().includes(needle)) return true
      return table.columns.some(column => column.column.toLowerCase().includes(needle))
    })
  }, [snapshot.tables, schema, query, ai])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const table of filtered) {
      const list = map.get(table.schema)
      if (list) list.push(table)
      else map.set(table.schema, [table])
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  const selected = selectedKey
    ? snapshot.tables.find(table => modelTableKey(table) === selectedKey) ?? null
    : null

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.6fr)]">
      <section className="flex max-h-[calc(100vh-14rem)] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
        <div className="space-y-2 border-b border-black/[0.06] px-4 py-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Buscar tabela, coluna ou descrição"
              className="h-9 w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-8 pr-3 text-[12px] text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </label>
          {snapshot.schemas.length > 1 && (
            <select
              value={schema}
              onChange={event => setSchema(event.target.value)}
              className="h-8 w-full rounded-lg border border-black/[0.08] bg-white px-2 text-[11px] text-neutral-700 outline-none"
            >
              <option value="all">Todos os schemas</option>
              {snapshot.schemas.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
          <p className="text-[10px] text-neutral-400">
            {filtered.length} de {snapshot.tables.length} tabelas
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {grouped.length === 0 && (
            <p className="px-4 py-10 text-center text-[12px] text-neutral-400">Nenhuma tabela encontrada.</p>
          )}
          {grouped.map(([schemaName, tables]) => (
            <div key={schemaName}>
              <p className="sticky top-0 border-b border-black/[0.05] bg-[#fbfbfa] px-4 py-1.5 font-mono text-[10px] font-semibold text-neutral-500">
                {schemaName}
              </p>
              <ul>
                {tables.map(table => {
                  const key = modelTableKey(table)
                  const active = key === selectedKey
                  const description = ai?.tables[key]?.description || table.description
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => onSelect(active ? null : key)}
                        className={`flex w-full items-start gap-2.5 border-b border-black/[0.04] px-4 py-2.5 text-left transition-colors ${
                          active ? 'bg-neutral-900 text-white' : 'hover:bg-black/[0.03]'
                        }`}
                      >
                        <Table2
                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${active ? 'text-teal-300' : 'text-neutral-300'}`}
                          strokeWidth={1.75}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="truncate font-mono text-[12px] font-medium">{table.table}</span>
                            {!table.hasPrimaryKey && table.type === 'table' && (
                              <KeyRound
                                className={`h-3 w-3 shrink-0 ${active ? 'text-amber-300' : 'text-amber-500'}`}
                                aria-label="Sem chave primária"
                              />
                            )}
                          </span>
                          <span className={`block text-[10px] ${active ? 'text-neutral-300' : 'text-neutral-400'}`}>
                            {tableTypeLabel(table.type)} · {table.columns.length} col
                            {table.estimatedRows != null ? ` · ${formatNumber(table.estimatedRows)} linhas` : ''}
                          </span>
                          {description && (
                            <span
                              className={`mt-0.5 line-clamp-2 block text-[10px] leading-snug ${
                                active ? 'text-neutral-200' : 'text-neutral-500'
                              }`}
                            >
                              {description}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="max-h-[calc(100vh-14rem)] min-h-[420px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
        {selected ? (
          <TableDetails
            table={selected}
            ai={ai?.tables[modelTableKey(selected)]}
            relationships={snapshot.relationships}
            onNavigate={onSelect}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
              <Table2 className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <p className="mt-4 text-[14px] font-semibold text-neutral-800">Selecione uma tabela</p>
            <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-neutral-400">
              Veja todos os campos, tipos, chaves, descrições do banco e da IA, além dos relacionamentos de entrada e
              saída.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
