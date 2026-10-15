'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, CircleDashed, Loader2, Sparkles, XCircle } from 'lucide-react'
import type { BacklogColumnId } from '@/lib/backlog/types'
import type { Glp1TaskState } from '@/lib/plans/likeme-glp1'
import { MISSIONS, missionEffortDays, type Mission, type MissionTask } from './likeme-glp1-workplan-data'

type Phase = 'idle' | 'creating' | 'enriching' | 'ready' | 'error'

interface TaskRuntime {
  phase: Phase
  cardId?: string
  column?: BacklogColumnId
  message?: string
}

const COLUMN_LABEL: Record<BacklogColumnId, string> = {
  requirement: 'Requisito',
  story: 'User story',
  ready: 'Pronta p/ agent',
  dev: 'Em desenvolvimento',
  done: 'Done',
}

export function Glp1MissionBoard({
  clientId,
  base,
  accent,
  initialStates,
  backlogReady,
}: {
  clientId: string
  base: string
  accent: string
  initialStates: Glp1TaskState[]
  backlogReady: boolean
}) {
  const [runtime, setRuntime] = useState<Record<string, TaskRuntime>>(() => {
    const seed: Record<string, TaskRuntime> = {}
    for (const state of initialStates) {
      seed[state.taskId] = { phase: 'ready', cardId: state.cardId, column: state.column }
    }
    return seed
  })
  const [selected, setSelected] = useState<Set<string>>(() => {
    const first = MISSIONS[0]
    const already = new Set(initialStates.map(state => state.taskId))
    return new Set(first.tasks.filter(task => !already.has(task.id)).map(task => task.id))
  })
  const [autoEnrich, setAutoEnrich] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectable = useMemo(
    () => MISSIONS.flatMap(mission => mission.tasks).filter(task => runtime[task.id]?.phase !== 'ready'),
    [runtime]
  )
  const selectedTasks = selectable.filter(task => selected.has(task.id))
  const selectedDays = selectedTasks.reduce((total, task) => total + task.effort.days, 0)

  function toggle(taskId: string) {
    setSelected(current => {
      const next = new Set(current)
      if (next.has(taskId)) next.delete(taskId)
      else next.add(taskId)
      return next
    })
  }

  function selectMission(mission: Mission) {
    setSelected(current => {
      const next = new Set(current)
      const ids = mission.tasks.filter(task => runtime[task.id]?.phase !== 'ready').map(task => task.id)
      const allIn = ids.every(id => next.has(id))
      for (const id of ids) {
        if (allIn) next.delete(id)
        else next.add(id)
      }
      return next
    })
  }

  function patch(taskId: string, value: TaskRuntime) {
    setRuntime(current => ({ ...current, [taskId]: value }))
  }

  async function send() {
    const taskIds = selectedTasks.map(task => task.id)
    if (taskIds.length === 0 || busy) return
    setBusy(true)
    setError(null)
    for (const id of taskIds) patch(id, { phase: 'creating' })

    let created: { id: string; ref: string }[] = []
    try {
      const res = await fetch(`/api/client/${encodeURIComponent(clientId)}/plans/glp1/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIds }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Não foi possível enviar ao backlog.')
      created = data.created ?? []
      const skipped: { id: string; ref: string }[] = data.skipped ?? []
      for (const item of skipped) {
        patch(taskFromRef(item.ref), { phase: 'ready', cardId: item.id, column: 'story', message: 'Já estava no backlog.' })
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Falha ao enviar ao backlog.'
      setError(message)
      for (const id of taskIds) patch(id, { phase: 'error', message })
      setBusy(false)
      return
    }

    for (const item of created) {
      const taskId = taskFromRef(item.ref)
      if (!autoEnrich) {
        patch(taskId, { phase: 'ready', cardId: item.id, column: 'story' })
        continue
      }
      patch(taskId, { phase: 'enriching', cardId: item.id, column: 'story' })
      try {
        const res = await fetch(
          `/api/client/${encodeURIComponent(clientId)}/backlog/cards/${encodeURIComponent(item.id)}/enrich`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'spec' }),
          }
        )
        const data = await res.json().catch(() => null)
        if (!res.ok || !data?.ok) throw new Error(data?.error || 'O enriquecimento falhou.')
        patch(taskId, { phase: 'ready', cardId: item.id, column: data.card?.column ?? 'ready' })
      } catch (caught) {
        patch(taskId, {
          phase: 'ready',
          cardId: item.id,
          column: 'story',
          message: `Card criado; enriquecimento pendente. ${caught instanceof Error ? caught.message : ''}`.trim(),
        })
      }
    }

    setSelected(new Set())
    setBusy(false)
  }

  return (
    <div className="grid gap-5">
      <div className="sticky top-2 z-10 flex flex-col gap-3 rounded-2xl border border-black/[0.08] bg-white/95 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[13px] font-semibold text-neutral-950">
            {selectedTasks.length === 0
              ? 'Nenhuma user story selecionada'
              : `${selectedTasks.length} user ${selectedTasks.length === 1 ? 'story' : 'stories'} · ${selectedDays} dias de esforço`}
          </p>
          <label className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
            <input
              type="checkbox"
              checked={autoEnrich}
              onChange={event => setAutoEnrich(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-neutral-300"
            />
            Ao entrar no backlog, rodar o enriquecimento agent-ready com leitura dos repositórios
          </label>
        </div>
        <button
          type="button"
          onClick={() => void send()}
          disabled={!backlogReady || busy || selectedTasks.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: accent }}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {autoEnrich ? 'Enviar ao backlog e enriquecer' : 'Enviar ao backlog'}
        </button>
      </div>

      {!backlogReady && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-950">
          O backlog deste cliente não está habilitado neste ambiente. A seleção fica visível, mas o envio não roda.
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-900">{error}</p>
      )}

      {MISSIONS.map(mission => {
        const open = mission.tasks.filter(task => runtime[task.id]?.phase !== 'ready')
        const allSelected = open.length > 0 && open.every(task => selected.has(task.id))
        return (
          <article key={mission.id} className="rounded-2xl border border-black/[0.07] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-semibold text-neutral-950">
                  <span className="mr-2 font-mono text-[12px]" style={{ color: accent }}>
                    {mission.id}
                  </span>
                  {mission.name}
                </h3>
                <p className="mt-1 text-[11px] text-neutral-400">
                  {mission.stages} · {mission.window.label} · {missionEffortDays(mission)} dias de desenvolvimento
                </p>
              </div>
              {open.length > 0 && (
                <button
                  type="button"
                  onClick={() => selectMission(mission)}
                  className="rounded-lg border border-black/[0.08] px-3 py-1.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  {allSelected ? 'Desmarcar missão' : 'Selecionar missão'}
                </button>
              )}
            </div>
            <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-neutral-600">{mission.outcome}</p>

            <div className="mt-4 grid gap-3">
              {mission.tasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  base={base}
                  accent={accent}
                  checked={selected.has(task.id)}
                  state={runtime[task.id] ?? { phase: 'idle' }}
                  disabled={busy}
                  onToggle={() => toggle(task.id)}
                />
              ))}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function taskFromRef(ref: string): string {
  return ref.split(':').pop() ?? ref
}

function TaskRow({
  task,
  base,
  accent,
  checked,
  state,
  disabled,
  onToggle,
}: {
  task: MissionTask
  base: string
  accent: string
  checked: boolean
  state: TaskRuntime
  disabled: boolean
  onToggle: () => void
}) {
  const inBacklog = state.phase === 'ready' && state.cardId
  return (
    <div className={`rounded-xl p-4 ${inBacklog ? 'bg-emerald-50/60' : 'bg-neutral-50'}`}>
      <div className="flex items-start gap-3">
        {inBacklog ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        ) : state.phase === 'creating' || state.phase === 'enriching' ? (
          <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-neutral-500" />
        ) : state.phase === 'error' ? (
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
        ) : (
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onToggle}
            aria-label={`Selecionar ${task.title}`}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[10px] text-neutral-500">{task.board}</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold" style={{ color: accent }}>
              {task.effort.size} · {task.effort.days} dias
            </span>
            <h4 className="text-[13px] font-semibold text-neutral-900">{task.title}</h4>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-neutral-600">
            Como {task.persona}, quero {task.want}, para {task.soThat}.
          </p>
          <ul className="mt-2 grid gap-1">
            {task.acceptance.map(item => (
              <li key={item} className="text-[11px] leading-relaxed text-neutral-500">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] leading-relaxed text-neutral-400">{task.effort.note}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px]">
            {state.phase === 'creating' && <span className="text-neutral-500">Criando card…</span>}
            {state.phase === 'enriching' && (
              <span className="text-neutral-500">Enriquecendo com likeme-front-end e likeme-back-end…</span>
            )}
            {state.phase === 'error' && <span className="text-rose-700">{state.message}</span>}
            {inBacklog && (
              <>
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <CircleDashed className="h-3 w-3" />
                  No backlog · {COLUMN_LABEL[state.column ?? 'story']}
                </span>
                {state.message && <span className="text-neutral-500">{state.message}</span>}
                <Link
                  href={`${base}/backlog/${encodeURIComponent(state.cardId!)}`}
                  className="inline-flex items-center gap-1 font-medium text-neutral-800 underline-offset-2 hover:underline"
                >
                  Abrir card
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
