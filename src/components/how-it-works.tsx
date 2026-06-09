'use client'

import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'
import { motion } from 'framer-motion'

const steps = [
  { label: 'Enterprise Platforms', sub: 'Real-world challenges' },
  { label: 'Operational Knowledge', sub: 'Patterns & insights' },
  { label: 'Adaptive Core', sub: 'Reusable intelligence' },
  { label: 'Intelligence Products', sub: 'Scalable solutions' },
  { label: 'New Opportunities', sub: 'Continuous growth' },
]

export function HowItWorks() {
  return (
    <section className="py-32 px-6 border-b border-white/[0.06]" id="how">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
            How PixelPulse Works
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-2xl">
            From Operational Challenges{' '}
            <span className="text-text-secondary">
              to Intelligence Platforms
            </span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-text-secondary text-lg max-w-xl mb-20 leading-relaxed">
            We don&apos;t invent problems in a lab. We build products from
            challenges we solve in the real world.
          </p>
        </FadeIn>

        {/* Flywheel */}
        <FadeInStagger className="relative">
          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {steps.map((step, i) => (
              <FadeInItem key={step.label} className="flex-1 relative">
                <div className="p-6 md:p-8 border border-white/[0.06] bg-surface hover:bg-card transition-colors md:first:rounded-l-2xl md:last:rounded-r-2xl first:rounded-t-2xl last:rounded-b-2xl md:first:rounded-t-none md:last:rounded-b-none md:first:rounded-l-2xl md:last:rounded-r-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      className="w-8 h-8 rounded-full border border-white/[0.14] flex items-center justify-center text-xs font-mono text-text-muted"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </motion.div>
                    {i < steps.length - 1 && (
                      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-text-muted text-xs">
                        →
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    {step.label}
                  </h3>
                  <p className="text-xs text-text-muted">{step.sub}</p>
                </div>
              </FadeInItem>
            ))}
          </div>

          <FadeIn delay={0.6} className="mt-8 text-center">
            <p className="text-xs font-mono tracking-widest uppercase text-text-muted">
              ↻ Loop continuously
            </p>
          </FadeIn>
        </FadeInStagger>

        <div className="mt-16 space-y-4 text-text-secondary leading-relaxed max-w-2xl">
          <FadeIn delay={0.3}>
            <p>
              Every project exposes us to real operational challenges. The most
              valuable patterns become reusable intelligence. That intelligence
              strengthens our Adaptive Core. The strongest capabilities become
              products. The products create new opportunities.
            </p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <p className="text-text-muted text-sm font-mono tracking-wide">
              This cycle continuously improves everything we build.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
