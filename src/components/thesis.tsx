'use client'

import { FadeIn } from './fade-in'

export function Thesis() {
  return (
    <section className="py-32 px-6 bg-surface border-b border-white/[0.06]" id="thesis">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-3xl">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
              Our Thesis
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 leading-[1.1]">
              The Future Is Not More AI Applications.
            </h2>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-12 text-text-secondary leading-[1.1]">
              It&apos;s Adaptive Operational Intelligence.
            </h2>
          </FadeIn>

          <div className="space-y-6 text-text-secondary leading-relaxed">
            <FadeIn delay={0.2}>
              <p>
                Most organizations are experimenting with language models. Few
                are building intelligence that compounds over time.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p>
                We believe AI should not live inside isolated chat interfaces.
                It should become part of the operational fabric of an
                organization.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-text-primary font-medium">
                Adaptive intelligence systems learn continuously. They
                accumulate knowledge. They understand context. They support
                decisions. They evolve alongside the business.
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <p className="text-text-muted text-sm font-mono tracking-wide">
                This is the future we are building.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
