'use client'

import { useCallback, useRef, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { LikeMeAnimatedAvatar } from './likeme-avatar-animado'
import { PHASES, type AvatarState } from './likeme-avatar-animado-data'

const MONTH = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())

export function LikeMeAvatarShareCard({ state, fileName }: { state: AvatarState; fileName: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  const exportPng = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 4, backgroundColor: '#F4F3EC' })
      const anchor = document.createElement('a')
      anchor.href = dataUrl
      anchor.download = `likeme-wrapped-${fileName}.png`
      anchor.click()
    } finally {
      setExporting(false)
    }
  }, [fileName])

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={cardRef}
        className="relative flex aspect-[9/16] w-[270px] flex-col overflow-hidden rounded-[28px] px-6 pb-6 pt-7 font-[family-name:var(--font-cadence-body)] shadow-[0_24px_60px_-28px_rgba(0,17,55,0.35)]"
        style={{ background: 'linear-gradient(180deg, #958AAA 0%, #D8E4D6 38%, #F4F3EC 72%)' }}
      >
        <div className="flex items-center justify-between text-[#001137]">
          <span className="text-[13px] font-semibold tracking-[-0.01em]">Like:Me</span>
          <span className="rounded-full bg-[#001137]/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#FBF7E5]">
            Wrapped · {MONTH}
          </span>
        </div>

        <LikeMeAnimatedAvatar state={state} className="mx-auto mt-3 w-[150px]" labelClassName="text-[#001137]/55 text-[11px]" />

        <div className="mt-auto text-[#001137]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#001137]/50">
            Fase {PHASES[state.phase].label}
          </p>
          <p className="mt-1.5 text-[19px] font-semibold leading-tight tracking-[-0.02em]">{state.headline}</p>
          <div className="mt-4 flex items-center justify-between text-[10px] text-[#001137]/60">
            <span>{state.streakDays > 0 ? `${state.streakDays} dias de ritmo` : 'Primeiro passo'}</span>
            <span className="rounded-full bg-[#EDEC80] px-2.5 py-1 font-semibold text-[#001137]">
              Qual é o seu formato?
            </span>
          </div>
          <p className="mt-3 text-center text-[9px] tracking-[0.08em] text-[#001137]/40">likeme.global/avatar</p>
        </div>
      </div>

      <button
        type="button"
        onClick={exportPng}
        disabled={exporting}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[11px] font-medium text-neutral-700 transition-colors hover:border-black/20 hover:text-neutral-950 disabled:opacity-60"
      >
        {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        Baixar card 1080×1920
      </button>
    </div>
  )
}
