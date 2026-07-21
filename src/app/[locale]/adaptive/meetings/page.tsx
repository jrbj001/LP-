'use client'

import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { CLIENT } from '@/components/adaptive/data'
import { MEETINGS, formatMeetingDate } from '@/components/adaptive/meetings-data'
import { ArrowRight, Mic2, ExternalLink } from 'lucide-react'

export default function MeetingsPage() {
  const locale = useLocale()
  const base = `/${locale}/adaptive/meetings`

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Reuniões transcritas"
        subtitle={`Relatórios e sínteses das sessões do assessment do ${CLIENT.name} — a partir de Read AI e anotações da PixelPulseLab.`}
      />

      <div className="flex flex-col gap-3">
        {MEETINGS.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.04}>
            <a
              href={`${base}/${m.id}`}
              className="group block rounded-2xl border border-black/[0.06] bg-white p-6 hover:border-black/[0.12] hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                  <Mic2 className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-[16px] font-semibold text-neutral-900">{m.title}</h2>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full">
                      {m.source}
                    </span>
                  </div>
                  <p className="text-[12px] text-neutral-400 mb-3">
                    {formatMeetingDate(m.date)}
                    {m.duration ? ` · ${m.duration}` : ''}
                  </p>
                  <p className="text-[13px] text-neutral-600 leading-relaxed line-clamp-2">
                    {m.synopsis}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-[12px] text-neutral-400">
                      {m.tasks.length} tarefa{m.tasks.length === 1 ? '' : 's'} · {m.topics.length} tópicos
                    </span>
                    <span className="inline-flex items-center gap-3">
                      {m.reportUrl && (
                        <a
                          href={m.reportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[12px] text-neutral-500 hover:text-neutral-800 underline underline-offset-2"
                        >
                          Notion
                          <ExternalLink className="w-3 h-3" strokeWidth={2} />
                        </a>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-700 group-hover:text-neutral-900">
                        Abrir relatório
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      {MEETINGS.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/[0.08] p-10 text-center text-[13px] text-neutral-400">
          Nenhuma reunião publicada ainda.
        </div>
      )}

      <p className="mt-8 text-[12px] text-neutral-400 flex items-start gap-2">
        <ExternalLink className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
        Novas sessões do Assessment e kickoffs entram aqui após a transcrição (Read AI).
      </p>
    </PageShell>
  )
}
