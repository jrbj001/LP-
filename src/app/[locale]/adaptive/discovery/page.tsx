'use client'

import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { CLIENT } from '@/components/adaptive/data'
import { ArrowRight, Clock, MessageSquare, ShieldCheck, Calendar } from 'lucide-react'

const POINTS = [
  { icon: Clock,       title: '~20 min + 30 min',     text: 'Assessment online e depois sessão presencial de 30 minutos.' },
  { icon: MessageSquare,title: 'Uma pergunta por vez', text: 'Sem formulário longo. Você responde no seu ritmo.' },
  { icon: Calendar,    title: 'Agenda presencial',    text: `Escolha data e horário com ${CLIENT.meetingHost.name}.` },
  { icon: ShieldCheck, title: 'Não avaliamos pessoas', text: 'Entendemos como a tecnologia pode acelerar seus resultados.' },
]

export default function DiscoveryPage() {
  const locale = useLocale()
  const base = `/${locale}/adaptive`

  return (
    <PageShell>
      <PageHeader
        eyebrow="Discovery Sessions™"
        title={<>Sua sessão de<br />Discovery</>}
        subtitle={`Convite enviado por ${CLIENT.facilitator.name} (${CLIENT.facilitator.role}). Identifique-se, responda o assessment e escolha um horário presencial — Diego facilita o processo, mas não participa da reunião.`}
      />

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
            <p className="text-[15px] font-semibold text-neutral-900">Pronto para começar?</p>
            <p className="text-[13px] text-neutral-500 mt-1">
              Primeiro você se identifica e informa o WhatsApp. Depois: 11 perguntas e escolha do horário.
            </p>
          </div>
          <a
            href={`${base}/onboard`}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 transition-all flex-shrink-0"
          >
            Iniciar Onboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </a>
        </div>
      </Reveal>
    </PageShell>
  )
}
