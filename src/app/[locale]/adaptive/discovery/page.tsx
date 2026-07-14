'use client'

import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { JourneyStrip } from '@/components/adaptive/journey-strip'
import { CLIENT } from '@/components/adaptive/data'
import { ArrowRight, Clock, MessageSquare, FolderKanban, Calendar } from 'lucide-react'

const POINTS = [
  { icon: FolderKanban, title: 'Ligado aos projetos', text: 'O assessment usa o portfólio do Comitê já mapeado na Minha Área.' },
  { icon: MessageSquare,title: '11 perguntas',        text: 'Objetivos, prioridades, desafios, tecnologia e IA da sua área.' },
  { icon: Clock,        title: '~20 minutos',         text: 'Online, no seu ritmo — uma pergunta por vez.' },
  { icon: Calendar,     title: 'Depois: 30 min',      text: `Agenda presencial com ${CLIENT.meetingHost.name}.` },
]

export default function DiscoveryPage() {
  const locale = useLocale()
  const base = `/${locale}/adaptive`

  return (
    <PageShell>
      <PageHeader
        eyebrow="Passo 3 · Assessment"
        title={<>Assessment ligado<br />aos seus projetos</>}
        subtitle={`Não é um formulário separado: você já tem projetos na Minha Área. As respostas alimentam o Adaptive Assessment™ do ${CLIENT.name}. Convite de ${CLIENT.facilitator.name}.`}
      />

      <JourneyStrip current="assessment" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        {POINTS.map((p, i) => {
          const Icon = p.icon
          return (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="rounded-xl border border-black/[0.06] bg-white p-6 h-full">
                <Icon className="w-5 h-5 text-neutral-300 mb-4" strokeWidth={1.75} />
                <p className="text-[14px] font-semibold text-neutral-900">{p.title}</p>
                <p className="text-[13px] text-neutral-500 mt-1.5 leading-relaxed">{p.text}</p>
              </div>
            </Reveal>
          )
        })}
      </div>

      <Reveal delay={0.15}>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-neutral-900">Fluxo recomendado</p>
            <p className="text-[13px] text-neutral-500 mt-1">
              Começar → Minha Área (projetos) → Assessment → Agendar 30 min.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`${base}/onboard`}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 transition-all"
            >
              Começar
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>
            <a
              href={`${base}/my-area`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-black/[0.1] text-neutral-700 text-[14px] font-medium"
            >
              Minha Área
            </a>
          </div>
        </div>
      </Reveal>
    </PageShell>
  )
}
