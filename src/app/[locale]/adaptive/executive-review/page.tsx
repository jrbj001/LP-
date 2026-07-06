'use client'

import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { Lock, Radar, Map, ListChecks, Zap, Sparkles } from 'lucide-react'

const PREVIEW = [
  { icon: Radar,      title: 'Adaptive Index™',        text: 'Score consolidado de maturidade adaptativa.' },
  { icon: Map,        title: 'Radar de Maturidade',    text: 'Visão dos cinco pilares em um único gráfico.' },
  { icon: ListChecks, title: 'Recommendations',        text: 'Recomendações executivas priorizadas.' },
  { icon: Zap,        title: 'Quick Wins',             text: 'Ganhos rápidos de alto impacto e baixo esforço.' },
  { icon: Sparkles,   title: 'AI Opportunities',       text: 'Onde a IA gera maior valor para o negócio.' },
]

export default function ExecutiveReviewPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Executive Technology Review™"
        title="Executive Review"
        subtitle="A visão executiva completa fica disponível ao final do assessment, consolidando todos os pilares em um único relatório de decisão."
      />

      {/* Locked banner */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 flex items-center gap-5 mb-8">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[15px] font-semibold">Available after Assessment</p>
            <p className="text-[13px] text-white/50 mt-1">
              Complete as Discovery Sessions para desbloquear o Executive Technology Review™.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Preview grid (blurred/locked) */}
      <p className="text-[13px] font-medium text-neutral-400 mb-4">Prévia do que será entregue</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PREVIEW.map((item, i) => {
          const Icon = item.icon
          return (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="relative rounded-xl border border-black/[0.06] bg-white p-6 overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-black/[0.03] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-[18px] h-[18px] text-neutral-400" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-neutral-900">{item.title}</p>
                    <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">{item.text}</p>
                  </div>
                </div>
                {/* Lock corner */}
                <Lock className="absolute top-4 right-4 w-3.5 h-3.5 text-neutral-300" strokeWidth={2} />
              </div>
            </Reveal>
          )
        })}
      </div>
    </PageShell>
  )
}
