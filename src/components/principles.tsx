'use client'

import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const principles = [
  {
    title: 'AI-Native Thinking',
    description: 'We design systems around intelligence from the beginning.',
  },
  {
    title: 'Adaptive By Design',
    description: 'Systems should evolve through usage and feedback.',
  },
  {
    title: 'Infrastructure First',
    description: 'Reusable architecture creates long-term value.',
  },
  {
    title: 'Explainable Intelligence',
    description: 'Enterprise AI must remain understandable and auditable.',
  },
  {
    title: 'Enterprise Reliability',
    description: 'Operational systems require trust and resilience.',
  },
  {
    title: 'Small Elite Teams',
    description: 'Exceptional engineering over organizational complexity.',
  },
]

export function Principles() {
  return (
    <section className="py-32 px-6 bg-surface border-b border-white/[0.06]" id="principles">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
            Engineering Principles
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-16 max-w-2xl">
            Engineering for the{' '}
            <span className="text-text-secondary">Adaptive Era</span>
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {principles.map((p, i) => (
            <FadeInItem key={p.title}>
              <div className="group p-8 rounded-2xl border border-white/[0.06] bg-bg hover:border-white/[0.12] transition-all duration-300 h-full">
                <span className="text-[10px] font-mono text-text-muted mb-4 block">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold text-text-primary mb-3 group-hover:text-white transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {p.description}
                </p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
