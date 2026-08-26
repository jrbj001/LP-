'use client'

import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'

export function QuickUpdate({
  engagementId = 'orfeu',
  label = 'Registrar atualização',
  kind = 'update',
}: {
  engagementId?: string
  label?: string
  kind?: 'update' | 'initiative' | 'assessment' | 'ritual' | 'measurement'
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setState('saving')
    try {
      const response = await fetch(`/api/alquimia/engagements/${engagementId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, title, notes }),
      })
      if (!response.ok) throw new Error('request failed')
      setState('saved')
      window.dispatchEvent(new Event('alquimia:update-saved'))
      window.setTimeout(() => {
        setOpen(false)
        setTitle('')
        setNotes('')
        setState('idle')
      }, 900)
    } catch {
      setState('error')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00435D] px-4 py-3 text-[12px] font-semibold text-white transition hover:bg-[#003449]"
      >
        <Plus className="h-4 w-4" />
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#002f42]/55 backdrop-blur-sm"
          />
          <form
            onSubmit={submit}
            className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#F7F5ED] p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-black/35 hover:bg-black/5"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3A5976]">
              Registro de transformação
            </p>
            <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#003b52]">
              {label}
            </h2>
            <label className="mt-6 block">
              <span className="text-[10px] font-medium text-black/45">Título</span>
              <input
                value={title}
                onChange={event => setTitle(event.target.value)}
                required
                maxLength={160}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] outline-none focus:border-[#00435D]/40"
                placeholder="O que mudou ou precisa acontecer?"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-[10px] font-medium text-black/45">Contexto e evidência</span>
              <textarea
                value={notes}
                onChange={event => setNotes(event.target.value)}
                rows={5}
                maxLength={2000}
                className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] leading-relaxed outline-none focus:border-[#00435D]/40"
                placeholder="Registre a decisão, o aprendizado ou a evidência observada."
              />
            </label>
            {state === 'error' && (
              <p className="mt-3 text-[11px] text-red-700">
                Não foi possível salvar. Verifique a configuração do banco e tente novamente.
              </p>
            )}
            <button
              type="submit"
              disabled={state === 'saving' || state === 'saved'}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00435D] px-4 py-3.5 text-[12px] font-semibold text-white disabled:opacity-65"
            >
              {state === 'saved' ? (
                <>
                  <Check className="h-4 w-4" /> Atualização registrada
                </>
              ) : state === 'saving' ? (
                'Salvando…'
              ) : (
                'Salvar no engagement'
              )}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
