'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Database, Loader2, PlugZap, RefreshCw, Trash2 } from 'lucide-react'

type DataSourceSummary = {
  id: string
  name: string
  kind: 'postgresql' | 'sqlserver'
  schemas: string[]
  tableCount: number
  enabled: boolean
  lastTestedAt?: string | null
}

type FormState = {
  name: string
  url: string
  host: string
  port: string
  database: string
  username: string
  password: string
  sslMode: 'require' | 'prefer' | 'disable'
  schemas: string
}

const EMPTY_FORM: FormState = {
  name: '',
  url: '',
  host: '',
  port: '5432',
  database: '',
  username: '',
  password: '',
  sslMode: 'prefer',
  schemas: '',
}

const ADMIN_KEY_STORAGE = 'cadence.data-source-admin-key'

export function DataSourcesWorkspace({
  clientId,
  accent,
}: {
  clientId: string
  accent: string
}) {
  const base = `/api/client/${encodeURIComponent(clientId)}/data-sources`
  const [adminKey, setAdminKey] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [sources, setSources] = useState<DataSourceSummary[]>([])
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const saved = window.sessionStorage.getItem(ADMIN_KEY_STORAGE)
    if (saved) setAdminKey(saved)
  }, [])

  async function loadSources(key = adminKey) {
    if (!key.trim()) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(base, {
        cache: 'no-store',
        headers: { 'x-data-source-admin-key': key.trim() },
      })
      const data = (await response.json()) as {
        ok?: boolean
        sources?: DataSourceSummary[]
        error?: string
      }
      if (!response.ok || !data.ok) throw new Error(data.error || 'Acesso não autorizado.')
      window.sessionStorage.setItem(ADMIN_KEY_STORAGE, key.trim())
      setUnlocked(true)
      setSources(data.sources ?? [])
    } catch (caught) {
      setUnlocked(false)
      setError(caught instanceof Error ? caught.message : 'Não foi possível carregar as fontes.')
    } finally {
      setLoading(false)
    }
  }

  async function createSource() {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(base, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-data-source-admin-key': adminKey.trim(),
        },
        body: JSON.stringify({
          name: form.name,
          config: {
            url: form.url.trim() || undefined,
            host: form.host,
            port: Number(form.port) || 5432,
            database: form.database,
            username: form.username,
            password: form.password,
            sslMode: form.sslMode,
            schemas: form.schemas
              .split(',')
              .map(item => item.trim())
              .filter(Boolean),
          },
        }),
      })
      const data = (await response.json()) as {
        ok?: boolean
        source?: DataSourceSummary
        error?: string
      }
      if (!response.ok || !data.ok || !data.source) {
        throw new Error(data.error || 'Não foi possível cadastrar a fonte.')
      }
      setSources(current => [data.source!, ...current])
      setForm(EMPTY_FORM)
      setSuccess(`Conexão validada. ${data.source.tableCount} tabelas encontradas.`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Falha ao cadastrar a fonte.')
    } finally {
      setLoading(false)
    }
  }

  async function sourceAction(sourceId: string, method: 'POST' | 'DELETE') {
    setActionId(sourceId)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(`${base}/${encodeURIComponent(sourceId)}`, {
        method,
        headers: { 'x-data-source-admin-key': adminKey.trim() },
      })
      const data = (await response.json()) as {
        ok?: boolean
        source?: DataSourceSummary
        error?: string
      }
      if (!response.ok || !data.ok) throw new Error(data.error || 'Operação não concluída.')
      if (method === 'DELETE') {
        setSources(current => current.filter(source => source.id !== sourceId))
        setSuccess('Fonte removida.')
      } else if (data.source) {
        setSources(current => current.map(source => (source.id === sourceId ? data.source! : source)))
        setSuccess(`Conexão validada. ${data.source.tableCount} tabelas encontradas.`)
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Operação não concluída.')
    } finally {
      setActionId(null)
    }
  }

  if (!unlocked) {
    return (
      <section className="max-w-xl rounded-2xl border border-black/[0.06] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-neutral-900">Área administrativa</h2>
            <p className="mt-0.5 text-[12px] text-neutral-500">
              Informe a chave configurada em <code>DATA_SOURCE_ADMIN_SECRET</code>.
            </p>
          </div>
        </div>
        <form
          className="mt-5 flex gap-2"
          onSubmit={event => {
            event.preventDefault()
            void loadSources()
          }}
        >
          <input
            type="password"
            value={adminKey}
            onChange={event => setAdminKey(event.target.value)}
            placeholder="Chave administrativa"
            autoComplete="off"
            className="h-11 flex-1 rounded-xl border border-black/[0.08] px-3.5 text-[13px] outline-none focus:border-neutral-400"
          />
          <button
            type="submit"
            disabled={loading || !adminKey.trim()}
            className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[12px] font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
            Acessar
          </button>
        </form>
        {error && <ErrorMessage text={error} />}
      </section>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.7fr)]">
      <section className="rounded-2xl border border-black/[0.06] bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-semibold text-neutral-900">Conexões cadastradas</h2>
            <p className="mt-1 text-[12px] text-neutral-500">
              Credenciais criptografadas; senhas nunca são devolvidas pela API.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadSources()}
            disabled={loading}
            className="rounded-lg border border-black/[0.07] p-2 text-neutral-500 hover:border-neutral-300"
            aria-label="Atualizar fontes"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {sources.length === 0 && (
            <div className="rounded-xl border border-dashed border-black/[0.1] px-4 py-10 text-center text-[12px] text-neutral-400">
              Nenhuma fonte cadastrada.
            </div>
          )}
          {sources.map(source => (
            <article key={source.id} className="rounded-xl border border-black/[0.07] bg-[#fbfbfa] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                    <h3 className="truncate text-[13px] font-semibold text-neutral-900">{source.name}</h3>
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-neutral-500">
                    {source.kind === 'sqlserver' ? 'SQL Server' : 'PostgreSQL'}
                  </p>
                  <p className="mt-2 text-[11px] text-neutral-500">
                    {source.tableCount} tabelas · schemas{' '}
                    {source.schemas.length > 0 ? source.schemas.join(', ') : 'todos os não-sistema'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => void sourceAction(source.id, 'POST')}
                    disabled={actionId === source.id}
                    className="rounded-lg border border-black/[0.07] p-2 text-neutral-500 hover:border-neutral-300 disabled:opacity-50"
                    aria-label="Testar conexão"
                  >
                    {actionId === source.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <PlugZap className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => void sourceAction(source.id, 'DELETE')}
                    disabled={actionId === source.id}
                    className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:border-rose-300 disabled:opacity-50"
                    aria-label="Remover fonte"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/[0.06] bg-[#fbfbfa] p-5">
        <h2 className="text-[15px] font-semibold text-neutral-900">Nova fonte PostgreSQL</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
          Use um usuário exclusivo com permissão somente de leitura.
        </p>
        <form
          className="mt-5 space-y-3"
          onSubmit={event => {
            event.preventDefault()
            void createSource()
          }}
        >
          <Field label="Nome" value={form.name} onChange={value => setForm(current => ({ ...current, name: value }))} placeholder="Colmeia · Produção" />
          <Field
            label="Connection string (opcional)"
            value={form.url}
            onChange={value => setForm(current => ({ ...current, url: value }))}
            placeholder="postgresql://usuario:senha@host:5432/banco"
            required={false}
          />
          <div className="grid grid-cols-[1fr_100px] gap-3">
            <Field label="Host" value={form.host} onChange={value => setForm(current => ({ ...current, host: value }))} placeholder="db.exemplo.com" />
            <Field label="Porta" value={form.port} onChange={value => setForm(current => ({ ...current, port: value }))} inputMode="numeric" />
          </div>
          <Field label="Banco" value={form.database} onChange={value => setForm(current => ({ ...current, database: value }))} placeholder="colmeia" />
          <Field label="Usuário" value={form.username} onChange={value => setForm(current => ({ ...current, username: value }))} placeholder="cadence_readonly" />
          <Field label="Senha" type="password" value={form.password} onChange={value => setForm(current => ({ ...current, password: value }))} autoComplete="new-password" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">SSL</span>
              <select
                value={form.sslMode}
                onChange={event => setForm(current => ({ ...current, sslMode: event.target.value as FormState['sslMode'] }))}
                className="h-10 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-[12px] text-neutral-700 outline-none"
              >
                <option value="require">Obrigatório</option>
                <option value="prefer">Preferir</option>
                <option value="disable">Desabilitado</option>
              </select>
            </label>
            <Field label="Schemas (opcional)" value={form.schemas} onChange={value => setForm(current => ({ ...current, schemas: value }))} placeholder="public, analytics" required={false} />
          </div>
          <button
            type="submit"
            disabled={
              loading ||
              !form.name ||
              (!form.url.trim() && (!form.host || !form.database || !form.username || !form.password))
            }
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[12px] font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
            Testar e cadastrar
          </button>
        </form>
        {error && <ErrorMessage text={error} />}
        {success && (
          <p className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-3 text-[12px] text-teal-800">
            {success}
          </p>
        )}
      </section>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = true,
  ...inputProps
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
        {label}
      </span>
      <input
        {...inputProps}
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        required={required}
        className="h-10 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-[12px] text-neutral-800 outline-none placeholder:text-neutral-300 focus:border-neutral-400"
      />
    </label>
  )
}

function ErrorMessage({ text }: { text: string }) {
  return (
    <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[12px] text-rose-800">
      {text}
    </p>
  )
}
