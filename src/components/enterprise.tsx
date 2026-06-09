'use client'

import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const capabilities = [
  {
    title: 'AI-Native Applications',
    description: 'Applications designed around intelligence from day one.',
  },
  {
    title: 'Computer Vision',
    description: 'Image understanding, visual analysis and operational monitoring.',
  },
  {
    title: 'Data Intelligence',
    description: 'Transforming complex datasets into actionable knowledge.',
  },
  {
    title: 'Operational Systems',
    description: 'Intelligent workflows, automation and decision support.',
  },
  {
    title: 'Enterprise Platforms',
    description: 'Modern architectures designed for scale and adaptability.',
  },
]

const domains = [
  'Retail Intelligence',
  'Health Platforms',
  'Asset Intelligence',
  'Territorial Intelligence',
  'Computer Vision',
  'Analytics Platforms',
]

export function Enterprise() {
  return (
    <section className="py-32 px-6 bg-surface border-b border-white/[0.06]" id="enterprise">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
            Enterprise Platforms
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-2xl">
            Building Systems for{' '}
            <span className="text-text-secondary">Complex Operations</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-text-secondary text-lg max-w-xl mb-16 leading-relaxed">
            We partner with organizations to design, develop and evolve
            intelligence platforms across multiple industries.
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {capabilities.map((cap) => (
            <FadeInItem key={cap.title}>
              <div className="p-6 rounded-xl border border-white/[0.06] bg-bg hover:border-white/[0.1] transition-all group">
                <h3 className="text-sm font-semibold text-text-primary mb-2 group-hover:text-white transition-colors">
                  {cap.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

        <FadeIn delay={0.3}>
          <div className="border-t border-white/[0.06] pt-8">
            <p className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted mb-4">
              Domains
            </p>
            <div className="flex flex-wrap gap-3">
              {domains.map((domain) => (
                <span
                  key={domain}
                  className="px-4 py-2 text-xs font-medium text-text-secondary border border-white/[0.08] rounded-full"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
