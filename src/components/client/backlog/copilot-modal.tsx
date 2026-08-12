'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, X } from 'lucide-react'
import type { BacklogBoard, BacklogBoardId, BacklogCard } from '@/lib/backlog/types'
import { CopilotChat } from './copilot-chat'

export function CopilotModal({
  clientId,
  boards,
  accent,
  detailBase,
  copilotHref,
  boardId,
  card,
  onClose,
}: {
  clientId: string
  boards: BacklogBoard[]
  accent: string
  detailBase: string
  copilotHref: string
  boardId: BacklogBoardId
  card?: Pick<BacklogCard, 'id' | 'title'> | null
  onClose: () => void
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar copiloto"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-3">
          <p className="text-[13px] font-semibold text-neutral-900">Copiloto de user stories</p>
          <div className="flex items-center gap-2">
            <Link
              href={copilotHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] px-3 py-1.5 text-[11px] text-neutral-600 hover:border-neutral-300"
            >
              Abrir em tela cheia
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.8} />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-400 hover:bg-black/[0.04] hover:text-neutral-800"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 p-3">
          <CopilotChat
            clientId={clientId}
            boards={boards}
            accent={accent}
            detailBase={detailBase}
            boardId={boardId}
            card={card}
            variant="modal"
          />
        </div>
      </div>
    </div>
  )
}
