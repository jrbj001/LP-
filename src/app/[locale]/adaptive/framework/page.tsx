'use client'

import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { PILLARS } from '@/components/adaptive/data'
import { ArrowUpRight } from 'lucide-react'

export default function FrameworkPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Metodologia"
        title={<>The Adaptive Enterprise<br />Framework™</>}
        subtitle="Nossa metodologia está organizada em cinco pilares. Não avaliamos pessoas — entendemos como tecnologia, processos e inteligência artificial podem acelerar os resultados do negócio."
      />

      <div className="flex flex-col gap-4">
        {PILLARS.map((pillar, i) => {
          const Icon = pillar.icon
          return (
            <Reveal key={pillar.index} delay={i * 0.05}>
              <div className="group relative rounded-2xl border border-black/[0.06] bg-white p-7 lg:p-8 hover:border-black/[0.12] hover:shadow-[0_2px_24px_rgba(0,0,0,0.04)] transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">

                  {/* Left: index + icon */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:w-16">
                    <span className="text-[13px] font-mono font-medium text-neutral-300">{pillar.index}</span>
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                      <Icon className="w-[18px] h-[18px] text-white" strokeWidth={1.75} />
                    </div>
                  </div>

                  {/* Middle: content */}
                  <div className="flex-1">
                    <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-neutral-900">{pillar.name}</h3>
                    <p className="mt-2 text-[15px] font-medium text-neutral-500 italic">
                      &ldquo;{pillar.question}&rdquo;
                    </p>
                    <p className="mt-3 text-[14px] leading-relaxed text-neutral-500 max-w-xl">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Right: outputs */}
                  <div className="lg:w-56 flex-shrink-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-300 mb-3">Outputs</p>
                    <div className="flex flex-col gap-2">
                      {pillar.outputs.map(o => (
                        <div key={o} className="flex items-center gap-2 text-[13px] text-neutral-600">
                          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300" strokeWidth={2} />
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>

      {/* Closing statement */}
      <Reveal delay={0.1}>
        <div className="mt-12 rounded-2xl bg-black/[0.02] border border-black/[0.05] p-8 text-center">
          <p className="text-[16px] leading-relaxed text-neutral-600 max-w-xl mx-auto">
            Os cinco pilares se combinam em um único indicador executivo — o{' '}
            <span className="font-semibold text-neutral-900">Adaptive Index™</span> — que traduz maturidade
            tecnológica em decisões de negócio.
          </p>
        </div>
      </Reveal>
    </PageShell>
  )
}
