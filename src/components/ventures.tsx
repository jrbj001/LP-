'use client'

import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const products = [
  {
    name: 'Credix',
    category: 'Tax Intelligence Platform',
    description:
      'Automating fiscal analysis, tax interpretation and compliance workflows.',
    status: 'Building',
  },
  {
    name: 'QA Agent',
    category: 'Engineering Intelligence Platform',
    description:
      'AI-powered software quality assurance and engineering insights.',
    status: 'Building',
  },
  {
    name: 'Project Monitoring',
    category: 'Delivery Intelligence Platform',
    description:
      'Operational visibility, project risk detection and engineering performance monitoring.',
    status: 'Building',
  },
  {
    name: 'Adaptive Core',
    category: 'Infrastructure Intelligence Platform',
    description:
      'The proprietary foundation behind every PixelPulse system.',
    status: 'Internal Platform',
  },
]

export function Ventures() {
  return (
    <section className="py-32 px-6 border-b border-white/[0.06]" id="ventures">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
            Venture Studio
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-3xl">
            Building the Next Generation of{' '}
            <span className="text-text-secondary">Intelligence Products</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-text-secondary text-lg max-w-xl mb-16 leading-relaxed">
            Our venture studio transforms operational expertise into scalable
            intelligence products.
          </p>
        </FadeIn>

        <FadeInStagger className="space-y-3">
          {products.map((product) => (
            <FadeInItem key={product.name}>
              <div className="group p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-surface hover:bg-card hover:border-white/[0.1] transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-white transition-colors">
                        {product.name}
                      </h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase border border-white/[0.1] rounded-full text-text-muted">
                        {product.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono tracking-wide uppercase text-text-muted mb-2">
                      {product.category}
                    </p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed md:max-w-sm md:text-right">
                    {product.description}
                  </p>
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
