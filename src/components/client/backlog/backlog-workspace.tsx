'use client'

import { useMemo, useState } from 'react'
import type {
  BacklogBoard,
  BacklogBoardId,
  BacklogCard,
  BacklogColumnId,
  BacklogSnapshot,
  CardPatch,
} from '@/lib/backlog/types'
import { BacklogBoardView } from './backlog-board'
import { BacklogCardDrawer } from './backlog-card-drawer'

export function BacklogWorkspace({
  clientId,
  accent,
  detailBase,
  initial,
}: {
  clientId: string
  accent: string
  detailBase: string
  initial: BacklogSnapshot
}) {
  const [boards] = useState(initial.boards)
  const [columns] = useState(initial.columns)
  const [cards, setCards] = useState(initial.cards)
  const [activeBoardId, setActiveBoardId] = useState<BacklogBoardId>(
    initial.boards[0]?.id ?? 'banco-ativos'
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const activeBoard = boards.find(b => b.id === activeBoardId) ?? boards[0]
  const boardCards = useMemo(
    () => cards.filter(c => c.boardId === activeBoardId),
    [cards, activeBoardId]
  )
  const selected = cards.find(c => c.id === selectedId) ?? null

  function upsertLocal(card: BacklogCard) {
    setCards(prev => {
      const idx = prev.findIndex(c => c.id === card.id)
      if (idx === -1) return [...prev, card]
      const next = [...prev]
      next[idx] = card
      return next
    })
  }

  async function patchCard(cardId: string, patch: CardPatch) {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/client/${encodeURIComponent(clientId)}/backlog/cards/${encodeURIComponent(cardId)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        }
      )
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha ao atualizar card.')
      upsertLocal(data.card)
      return data.card as BacklogCard
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar.')
      return null
    } finally {
      setBusy(false)
    }
  }

  async function enrichCard(cardId: string, mode: 'story' | 'spec') {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/client/${encodeURIComponent(clientId)}/backlog/cards/${encodeURIComponent(cardId)}/enrich`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode }),
        }
      )
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha ao enriquecer.')
      upsertLocal(data.card)
      return data.card as BacklogCard
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao enriquecer.')
      return null
    } finally {
      setBusy(false)
    }
  }

  async function createRequirement() {
    const title = newTitle.trim()
    if (!title || !activeBoard) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch(`/api/client/${encodeURIComponent(clientId)}/backlog/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: activeBoard.id, title }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha ao criar requisito.')
      upsertLocal(data.card)
      setNewTitle('')
      setSelectedId(data.card.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao criar.')
    } finally {
      setCreating(false)
    }
  }

  async function moveCard(cardId: string, column: BacklogColumnId) {
    await patchCard(cardId, { column })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-sky-200/80 bg-sky-50/50 px-5 py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-sky-700 mb-1">
          Piloto Be180 · Backlog PM + AI
        </p>
        <p className="text-[13px] text-neutral-600 leading-relaxed max-w-4xl">
          Boards seeded pelas user stories e gaps dos documentos. Use a IA para transformar
          requisitos em user stories e depois em specs agent-ready com contexto do GitHub.
          O enrichment sugere — o PM revisa antes de mover para desenvolvimento.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {boards.map((board: BacklogBoard) => {
          const count = cards.filter(c => c.boardId === board.id).length
          const active = board.id === activeBoardId
          return (
            <button
              key={board.id}
              type="button"
              onClick={() => setActiveBoardId(board.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                active
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-black/[0.08] bg-white text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {board.title}
              <span className={`ml-1.5 tabular-nums ${active ? 'text-white/60' : 'text-neutral-400'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {activeBoard && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight text-neutral-900">
              {activeBoard.title}
            </h2>
            <p className="text-[13px] text-neutral-500 mt-0.5">{activeBoard.description}</p>
          </div>
          <form
            className="flex gap-2 w-full sm:w-auto"
            onSubmit={e => {
              e.preventDefault()
              void createRequirement()
            }}
          >
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Novo requisito…"
              className="flex-1 sm:w-64 rounded-full border border-black/[0.08] bg-white px-3.5 py-2 text-[13px] outline-none focus:border-neutral-400"
            />
            <button
              type="submit"
              disabled={creating || !newTitle.trim()}
              className="rounded-full bg-neutral-900 text-white text-[12px] font-medium px-4 py-2 disabled:opacity-50"
            >
              {creating ? '…' : 'Adicionar'}
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-800">
          {error}
        </div>
      )}

      <BacklogBoardView
        columns={columns}
        cards={boardCards}
        accent={accent}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onMove={(id, column) => void moveCard(id, column)}
      />

      {selected && (
        <BacklogCardDrawer
          card={selected}
          columns={columns}
          accent={accent}
          busy={busy}
          detailHref={`${detailBase}/${encodeURIComponent(selected.id)}`}
          onClose={() => setSelectedId(null)}
          onPatch={patch => patchCard(selected.id, patch)}
          onEnrich={mode => enrichCard(selected.id, mode)}
        />
      )}
    </div>
  )
}
