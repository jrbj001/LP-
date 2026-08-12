'use client'

import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { PILLARS } from '@/components/adaptive/data'

export function FrameworkView() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Metodologia · Adaptive Enterprise™"
        title="Cinco pilares para alinhar negócio, tecnologia e IA."
        subtitle="O mesmo framework aplicado em todos os assessments. Cada pilar responde a uma pergunta e entrega resultados concretos."
      />

      <div className="space-y-3">
        {PILLARS.map((pillar, i) => {
          const Icon = pillar.icon
          return (
            <Reveal key={pillar.index} delay={i * 0.05}>
              <article className="rounded-2xl border border-black/[0.06] bg-white p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] font-mono text-neutral-300">{pillar.index}</span>
                      <h2 className="text-[17px] font-semibold text-neutral-900">{pillar.name}</h2>
                    </div>
                    <p className="text-[13px] text-emerald-700/80 italic mt-1">{pillar.question}</p>
                    <p className="text-[13px] text-neutral-600 mt-2 leading-relaxed">{pillar.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {pillar.outputs.map(o => (
                        <span key={o} className="text-[11px] font-medium text-neutral-500 bg-black/[0.04] rounded-full px-2.5 py-1">{o}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </PageShell>
  )
}
