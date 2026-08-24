'use client'

import { useCallback, useEffect, useState } from 'react'
import { Activity, FileText } from 'lucide-react'

type Update = {
  id: string
  title: string
  kind: string
  notes: string
  createdBy: string
  createdAt: string
}

export function RecentUpdates({ engagementId }: { engagementId: string }) {
  const [updates, setUpdates] = useState<Update[]>([])

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/alquimia/engagements/${engagementId}/updates`)
      if (!response.ok) return
      const result = (await response.json()) as { updates?: Update[] }
      setUpdates(result.updates || [])
    } catch {
      // A visão continua útil com os dados metodológicos mesmo sem conectividade.
    }
  }, [engagementId])

  useEffect(() => {
    load()
    window.addEventListener('alquimia:update-saved', load)
    return () => window.removeEventListener('alquimia:update-saved', load)
  }, [load])

  if (updates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/15 bg-white/40 px-6 py-8 text-center">
        <Activity className="mx-auto h-4 w-4 text-[#3A5976]" />
        <p className="mt-3 text-[12px] font-medium text-[#003b52]">Nenhuma atualização registrada</p>
        <p className="mt-1 text-[10px] text-black/35">
          Use “Registrar atualização” para iniciar a memória viva do engagement.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-black/[0.06] overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
      {updates.slice(0, 5).map(update => (
        <article key={update.id} className="flex items-start gap-4 px-5 py-4">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00435D]/7">
            <FileText className="h-3.5 w-3.5 text-[#00435D]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[12px] font-medium text-[#003b52]">{update.title}</p>
              <time className="text-[9px] text-black/30">
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(update.createdAt))}
              </time>
            </div>
            {update.notes && (
              <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-black/40">
                {update.notes}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
