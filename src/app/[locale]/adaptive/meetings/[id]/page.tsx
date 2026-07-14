'use client'

import { use } from 'react'
import { useLocale } from 'next-intl'
import { PageShell, Reveal } from '@/components/adaptive/ui'
import { findMeeting, formatMeetingDate } from '@/components/adaptive/meetings-data'
import { ArrowLeft, Check, ExternalLink, Mic2 } from 'lucide-react'

export default function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const locale = useLocale()
  const base = `/${locale}/adaptive`
  const meeting = findMeeting(id)

  if (!meeting) {
    return (
      <PageShell>
        <p className="text-[14px] text-neutral-500">Reunião não encontrada.</p>
        <a href={`${base}/meetings`} className="mt-4 inline-flex text-[13px] text-neutral-700 underline">
          Voltar para Reuniões
        </a>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <a
        href={`${base}/meetings`}
        className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-700 mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        Todas as reuniões
      </a>

      <Reveal>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
            <Mic2 className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full">
                {meeting.source}
              </span>
              {meeting.duration && (
                <span className="text-[11px] text-neutral-400">{meeting.duration}</span>
              )}
            </div>
            <h1 className="text-[28px] lg:text-[34px] font-semibold tracking-[-0.02em] text-neutral-900">
              {meeting.title}
            </h1>
            <p className="mt-2 text-[14px] text-neutral-500">
              {formatMeetingDate(meeting.date)}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-7 mb-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-3">
            Sinopse
          </p>
          <p className="text-[15px] text-neutral-700 leading-relaxed">
            {meeting.synopsis}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Reveal delay={0.08}>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-7 h-full">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">
              Tópicos
            </p>
            <ul className="flex flex-col gap-2.5">
              {meeting.topics.map(t => (
                <li key={t} className="flex items-start gap-2 text-[13px] text-neutral-700">
                  <span className="w-1 h-1 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-7 h-full">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">
              Participantes
            </p>
            <div className="flex flex-wrap gap-2">
              {meeting.attendees.map(a => (
                <span
                  key={a}
                  className="text-[12px] text-neutral-600 bg-neutral-50 border border-neutral-100 px-3 py-1.5 rounded-full"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-7 mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">
            Tarefas
          </p>
          <div className="flex flex-col gap-3">
            {meeting.tasks.map(task => (
              <div
                key={task.title}
                className="flex items-start gap-3 rounded-xl border border-black/[0.04] bg-neutral-50/80 px-4 py-3"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  task.done ? 'bg-emerald-500 text-white' : 'bg-white border border-neutral-200'
                }`}>
                  {task.done && <Check className="w-3 h-3" strokeWidth={2.5} />}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-neutral-900">{task.title}</p>
                  {task.owner && (
                    <p className="text-[11px] text-neutral-400 mt-0.5">{task.owner}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {meeting.reportUrl && (
        <a
          href={meeting.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800"
        >
          Ver relatório completo (Read AI)
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
        </a>
      )}
    </PageShell>
  )
}
