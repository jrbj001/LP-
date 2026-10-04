'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Activity,
  Database,
  LayoutDashboard,
  Loader2,
  Network,
  RefreshCw,
  Settings2,
  Sparkles,
  Table2,
} from 'lucide-react'
import type { StoredDataModel } from '@/lib/data-sources/model/types'
import { formatDateTime } from './format'
import { ModelAi } from './model-ai'
import { ModelHealth } from './model-health'
import { ModelOverview } from './model-overview'
import { ModelTables } from './model-tables'

const ModelDiagram = dynamic(() => import('./model-diagram').then(mod => mod.ModelDiagram), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] items-center justify-center rounded-2xl border border-black/[0.08] bg-[#fafaf8]">
      <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
    </div>
  ),
})

type SourceSummary = {
  id: string
  name: string
  kind: 'postgresql' | 'sqlserver'
  enabled: boolean
  tableCount: number
}

type View = 'overview' | 'diagram' | 'tables' | 'health' | 'ai'

const VIEWS: Array<{ id: View; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'diagram', label: 'Diagrama', icon: Network },
  { id: 'tables', label: 'Tabelas', icon: Table2 },
  { id: 'health', label: 'Health check', icon: Activity },
  { id: 'ai', label: 'Visão de IA', icon: Sparkles },
]

export function ModelagemWorkspace({
  clientId,
  accent,
  initialSourceId,
  consultarHref,
  sourcesHref,
}: {
  clientId: string
  accent: string
  initialSourceId: string | null
  consultarHref: string
  sourcesHref: string
}) {
  const base = `/api/client/${encodeURIComponent(clientId)}/data-sources`
  const [sources, setSources] = useState<SourceSummary[]>([])
  const [sourcesLoading, setSourcesLoading] = useState(true)
  const [sourceId, setSourceId] = useState<string | null>(initialSourceId)
  const [model, setModel] = useState<StoredDataModel | null>(null)
  const [modelLoading, setModelLoading] = useState(false)
  const [building, setBuilding] = useState(false)
  const [generatingAi, setGeneratingAi] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('overview')
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setSourcesLoading(true)
      try {
        const response = await fetch(base, { cache: 'no-store' })
        const data = (await response.json()) as { ok?: boolean; sources?: SourceSummary[]; error?: string }
        if (!response.ok || !data.ok) throw new Error(data.error || 'Não foi possível carregar as fontes.')
        if (cancelled) return
        const enabled = (data.sources ?? []).filter(source => source.enabled)
        setSources(enabled)
        setSourceId(current =>
          current && enabled.some(source => source.id === current) ? current : (enabled[0]?.id ?? null)
        )
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Não foi possível carregar as fontes.')
      } finally {
        if (!cancelled) setSourcesLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [base])

  useEffect(() => {
    if (!sourceId) {
      setModel(null)
      return
    }
    let cancelled = false
    ;(async () => {
      setModelLoading(true)
      setError(null)
      setSelectedTable(null)
      try {
        const response = await fetch(`${base}/${encodeURIComponent(sourceId)}/model`, { cache: 'no-store' })
        const data = (await response.json()) as { ok?: boolean; model?: StoredDataModel | null; error?: string }
        if (!response.ok || !data.ok) throw new Error(data.error || 'Não foi possível carregar a modelagem.')
        if (!cancelled) setModel(data.model ?? null)
      } catch (caught) {
        if (!cancelled) {
          setModel(null)
          setError(caught instanceof Error ? caught.message : 'Não foi possível carregar a modelagem.')
        }
      } finally {
        if (!cancelled) setModelLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [base, sourceId])

  const build = useCallback(async () => {
    if (!sourceId || building) return
    setBuilding(true)
    setError(null)
    try {
      const response = await fetch(`${base}/${encodeURIComponent(sourceId)}/model`, { method: 'POST' })
      const data = (await response.json()) as { ok?: boolean; model?: StoredDataModel; error?: string }
      if (!response.ok || !data.ok || !data.model) {
        throw new Error(data.error || 'Não foi possível gerar a modelagem.')
      }
      setModel(data.model)
      setSelectedTable(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível gerar a modelagem.')
    } finally {
      setBuilding(false)
    }
  }, [base, sourceId, building])

  const generateAi = useCallback(async () => {
    if (!sourceId || generatingAi) return
    setGeneratingAi(true)
    setError(null)
    try {
      const response = await fetch(`${base}/${encodeURIComponent(sourceId)}/model/ai`, { method: 'POST' })
      const data = (await response.json()) as { ok?: boolean; model?: StoredDataModel; error?: string }
      if (!response.ok || !data.ok || !data.model) {
        throw new Error(data.error || 'Não foi possível gerar a visão de IA.')
      }
      setModel(data.model)
      setView('ai')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível gerar a visão de IA.')
    } finally {
      setGeneratingAi(false)
    }
  }, [base, sourceId, generatingAi])

  const openTable = useCallback((key: string) => {
    setSelectedTable(key)
    setView(current => (current === 'diagram' ? current : 'tables'))
  }, [])

  const current = sources.find(source => source.id === sourceId) ?? null
  const busy = building || generatingAi

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-[#fbfbfa] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2">
            <Database className="h-4 w-4 shrink-0 text-neutral-400" strokeWidth={1.75} />
            <select
              value={sourceId ?? ''}
              onChange={event => setSourceId(event.target.value || null)}
              disabled={sourcesLoading || sources.length === 0 || busy}
              className="h-10 min-w-[240px] rounded-xl border border-black/[0.08] bg-white px-3 text-[12px] text-neutral-800 outline-none focus:border-neutral-400 disabled:opacity-60"
            >
              {sources.length === 0 && <option value="">{sourcesLoading ? 'Carregando fontes…' : 'Nenhuma fonte ativa'}</option>}
              {sources.map(source => (
                <option key={source.id} value={source.id}>
                  {source.name} · {source.kind === 'sqlserver' ? 'SQL Server' : 'PostgreSQL'} · {source.tableCount} tab
                </option>
              ))}
            </select>
          </label>
          {model && (
            <p className="text-[11px] text-neutral-500">
              Modelagem de {formatDateTime(model.generatedAt)}
              {model.aiGeneratedAt ? ` · IA de ${formatDateTime(model.aiGeneratedAt)}` : ' · sem visão de IA'}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={sourcesHref}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-black/[0.07] bg-white px-3 text-[11px] text-neutral-600 hover:border-neutral-300"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Fontes
          </Link>
          <button
            type="button"
            onClick={() => void build()}
            disabled={!sourceId || busy}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3.5 text-[12px] font-medium text-neutral-800 hover:border-neutral-300 disabled:opacity-50"
          >
            {building ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {model ? 'Atualizar modelagem' : 'Gerar modelagem'}
          </button>
          <button
            type="button"
            onClick={() => void generateAi()}
            disabled={!model || busy}
            className="inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-[12px] font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {generatingAi ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {model?.ai ? 'Regenerar IA' : 'Gerar visão de IA'}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-800">{error}</p>
      )}

      {building && (
        <p className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-[12px] text-teal-800">
          Lendo catálogo, colunas, chaves e estatísticas de {current?.name ?? 'fonte'}. Isso pode levar alguns segundos.
        </p>
      )}
      {generatingAi && (
        <p className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-[12px] text-teal-800">
          A IA está lendo o schema em lotes e escrevendo as descrições. Em bancos grandes pode levar mais de um minuto.
        </p>
      )}

      {!sourcesLoading && sources.length === 0 && (
        <EmptyState
          title="Nenhuma fonte de dados ativa"
          description="Cadastre ou ative uma fonte em Fontes de dados para gerar a modelagem."
          action={
            <Link
              href={sourcesHref}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[12px] font-semibold text-white"
              style={{ backgroundColor: accent }}
            >
              <Database className="h-4 w-4" /> Ir para Fontes de dados
            </Link>
          }
        />
      )}

      {sourceId && modelLoading && !model && (
        <div className="flex items-center justify-center rounded-2xl border border-black/[0.06] bg-white py-20">
          <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
        </div>
      )}

      {sourceId && !modelLoading && !model && !building && (
        <EmptyState
          title={`Modelagem de ${current?.name ?? 'fonte'} ainda não gerada`}
          description="Vamos ler o catálogo completo da fonte: tabelas, campos, tipos, chaves primárias e estrangeiras, descrições e estatísticas. Nada é escrito no banco de origem."
          action={
            <button
              type="button"
              onClick={() => void build()}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[12px] font-semibold text-white"
              style={{ backgroundColor: accent }}
            >
              <RefreshCw className="h-4 w-4" /> Gerar modelagem
            </button>
          }
        />
      )}

      {model && (
        <>
          <nav className="flex flex-wrap gap-1 border-b border-black/[0.06]">
            {VIEWS.map(item => {
              const Icon = item.icon
              const selected = item.id === view
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-medium transition-colors ${
                    selected
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${selected ? 'text-teal-600' : 'text-neutral-400'}`} strokeWidth={1.75} />
                  {item.label}
                  {item.id === 'ai' && !model.ai && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-400" aria-label="Não gerada" />
                  )}
                </button>
              )
            })}
          </nav>

          {view === 'overview' && (
            <ModelOverview snapshot={model.snapshot} ai={model.ai} onOpenTable={openTable} />
          )}
          {view === 'diagram' && (
            <ModelDiagram
              snapshot={model.snapshot}
              ai={model.ai}
              selectedKey={selectedTable}
              onSelect={setSelectedTable}
            />
          )}
          {view === 'tables' && (
            <ModelTables
              snapshot={model.snapshot}
              ai={model.ai}
              selectedKey={selectedTable}
              onSelect={setSelectedTable}
            />
          )}
          {view === 'health' && <ModelHealth health={model.snapshot.health} onOpenTable={openTable} />}
          {view === 'ai' && (
            <ModelAi
              snapshot={model.snapshot}
              ai={model.ai}
              generating={generatingAi}
              accent={accent}
              consultarHref={consultarHref}
              onGenerate={() => void generateAi()}
              onOpenTable={openTable}
            />
          )}
        </>
      )}
    </div>
  )
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-black/[0.1] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
        <Network className="h-5 w-5" strokeWidth={1.6} />
      </div>
      <h2 className="mt-4 text-[15px] font-semibold text-neutral-800">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-neutral-400">{description}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  )
}
