'use client'

import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const cards = [
  {
    title: 'Intelligence Platforms',
    description:
      'AI-native platforms built around decision making and operational workflows.',
  },
  {
    title: 'Computer Vision Systems',
    description:
      'Visual intelligence platforms that transform images and environments into actionable insights.',
  },
  {
    title: 'Operational Intelligence',
    description:
      'Systems that convert complex operations into measurable, scalable and intelligent processes.',
  },
  {
    title: 'Intelligence Products',
    description:
      'Products born from patterns discovered through real-world deployments.',
  },
]

export function WhatWeBuild() {
  return (
    <section className="py-32 px-6 border-b border-white/[0.06]" id="build">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
            What We Build
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-2xl">
            We Build Intelligence,{' '}
            <span className="text-text-secondary">Not Just Software</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-text-secondary text-lg max-w-xl mb-16 leading-relaxed">
            PixelPulse combines software engineering, artificial intelligence
            and operational expertise to create systems that solve real-world
            problems.
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <FadeInItem key={card.title}>
              <div className="group p-8 rounded-2xl border border-white/[0.06] bg-surface hover:bg-card hover:border-white/[0.1] transition-all duration-300">
                <h3 className="text-lg font-semibold mb-3 text-text-primary group-hover:text-white transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed group-hover:text-text-secondary transition-colors">
                  {card.description}
                </p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
