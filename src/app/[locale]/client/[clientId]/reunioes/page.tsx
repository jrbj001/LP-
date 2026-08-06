import { notFound } from 'next/navigation'
import { CalendarDays, ExternalLink, Users } from 'lucide-react'
import { getClient } from '@/lib/client/registry'
import { EmptyWorkspaceState, WorkspacePageHeader } from '@/components/client/workspace-page'
import { MeetingAiBrief } from '@/components/client/meeting-ai-brief'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function ClientMeetingsPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)
  if (!client) notFound()

  const base = `/${locale}/client/${client.slug}`
  const meetings = [...(client.meetings ?? [])].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${client.name} · Workspace`}
        title="Reuniões"
        description="Agenda e memória do projeto: participantes, sínteses, decisões e próximos passos."
        backHref={base}
      />

      {meetings.length === 0 ? (
        <EmptyWorkspaceState
          icon={CalendarDays}
          title="Nenhuma reunião publicada"
          description="As próximas reuniões e seus registros aparecerão aqui assim que forem adicionados ao workspace."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {meetings.map(meeting => (
            <article key={meeting.id} className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${client.accent}12`, color: client.accent }}
                >
                  <CalendarDays className="w-4.5 h-4.5" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-semibold text-neutral-900">{meeting.title}</h2>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                      {meeting.status === 'completed' ? 'Concluída' : 'Agendada'}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-neutral-400">
                    {formatDate(meeting.date)}{meeting.duration ? ` · ${meeting.duration}` : ''}
                  </p>
                  {meeting.summary && (
                    <p className="mt-3 text-[13px] text-neutral-600 leading-relaxed">{meeting.summary}</p>
                  )}
                  {(meeting.aiContext || meeting.summary) && meeting.status === 'completed' && (
                    <MeetingAiBrief
                      clientId={client.slug}
                      meetingId={meeting.id}
                      accent={client.accent}
                    />
                  )}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <Users className="w-3.5 h-3.5" />
                      {meeting.attendees.join(' · ')}
                    </span>
                    {meeting.href && (
                      <a
                        href={meeting.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Abrir registro
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
