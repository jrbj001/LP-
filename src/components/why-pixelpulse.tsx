'use client'

import { FadeIn } from './fade-in'

const comparison = [
  {
    traditional: 'Delivers projects',
    pixelpulse: 'Builds platforms',
  },
  {
    traditional: 'One-off engagements',
    pixelpulse: 'Creates reusable intelligence',
  },
  {
    traditional: 'Team scaling',
    pixelpulse: 'Infrastructure scaling',
  },
  {
    traditional: 'Custom code',
    pixelpulse: 'Product mindset',
  },
  {
    traditional: 'Knowledge remains inside projects',
    pixelpulse: 'Knowledge becomes assets',
  },
]

export function WhyPixelPulse() {
  return (
    <section className="py-32 px-6 border-b border-white/[0.06]" id="why">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
            Why PixelPulse
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-2xl">
            Built Like a Product Company.{' '}
            <span className="text-text-secondary">Not a Consultancy.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-16">
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-2 border-b border-white/[0.06]">
              <div className="p-5 md:p-6">
                <p className="text-xs font-mono tracking-widest uppercase text-text-muted">
                  Traditional Consulting
                </p>
              </div>
              <div className="p-5 md:p-6 bg-surface">
                <p className="text-xs font-mono tracking-widest uppercase text-text-primary">
                  PixelPulse
                </p>
              </div>
            </div>

            {/* Rows */}
            {comparison.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2 border-b border-white/[0.06] last:border-b-0"
              >
                <div className="p-5 md:p-6">
                  <p className="text-sm text-text-muted">{row.traditional}</p>
                </div>
                <div className="p-5 md:p-6 bg-surface">
                  <p className="text-sm text-text-primary font-medium">
                    {row.pixelpulse}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.3} className="mt-12">
          <p className="text-text-secondary leading-relaxed max-w-2xl">
            Every engagement strengthens our ecosystem. Every deployment
            improves our platform. Every solution contributes to a growing
            network of intelligence products and capabilities.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
