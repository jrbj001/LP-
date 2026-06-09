'use client'

import { motion } from 'framer-motion'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const platforms = [
  {
    name: 'LikeMe',
    category: 'Health Intelligence Platform',
    description:
      'A digital platform designed to connect people, communities and specialists through intelligent health-focused experiences.',
    capabilities: ['Communities', 'Engagement', 'Content', 'Health Ecosystem'],
    status: 'Production',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.4" />
        <path d="M12 8v2M12 14v2M8 12h2M14 12h2" strokeWidth="1.2" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: 'Colmeia',
    category: 'Territorial Intelligence Platform',
    description:
      'A platform designed to organize, visualize and analyze territorial and operational information at scale.',
    capabilities: ['Geographic Intelligence', 'Planning', 'Visualization', 'Analytics'],
    status: 'Production',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <polygon points="12 7 17 10 17 14 12 17 7 14 7 10 12 7" opacity="0.45" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: 'Asset Intelligence',
    category: 'Asset Intelligence Platform',
    description:
      'Built within the Colmeia ecosystem, helping organizations structure, monitor and extract intelligence from asset inventories and operational resources.',
    capabilities: ['Asset Mapping', 'Inventory Intelligence', 'Operational Visibility', 'Strategic Planning'],
    status: 'Production',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="15" width="20" height="6" rx="1.5" />
        <rect x="2" y="9" width="20" height="4" rx="1" opacity="0.6" />
        <rect x="2" y="3" width="20" height="4" rx="1" opacity="0.3" />
        <line x1="6" y1="18" x2="18" y2="18" strokeWidth="1" opacity="0.4" />
        <line x1="6" y1="11" x2="14" y2="11" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    name: 'Visibility Intelligence',
    category: 'Computer Vision Platform',
    description:
      'A visual intelligence system that analyzes images and field execution to evaluate visibility, exposure and operational performance.',
    capabilities: ['Computer Vision', 'Image Analysis', 'Brand Visibility', 'AI Insights'],
    status: 'Production',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 9v1M12 14v1M9 12h1M14 12h1" strokeWidth="1.2" opacity="0.45" />
        <rect x="3" y="3" width="5" height="5" rx="1" strokeWidth="1" opacity="0.3" />
        <rect x="16" y="3" width="5" height="5" rx="1" strokeWidth="1" opacity="0.3" />
        <rect x="3" y="16" width="5" height="5" rx="1" strokeWidth="1" opacity="0.3" />
        <rect x="16" y="16" width="5" height="5" rx="1" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
]

function PlatformCard({ platform, index }: { platform: typeof platforms[0]; index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover="hover"
      className="group relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8 flex flex-col gap-5 overflow-hidden transition-colors duration-300 hover:border-white/[0.12] hover:bg-[#111111]"
    >
      {/* Glow on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.025), transparent 60%)',
        }}
      />

      {/* Top row: icon + status */}
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-text-secondary group-hover:text-text-primary transition-colors duration-300">
          {platform.icon}
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] text-[10px] font-mono tracking-widest uppercase text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse" />
          {platform.status}
        </span>
      </div>

      {/* Platform name + category */}
      <div>
        <h3 className="text-base font-bold text-text-primary mb-1 group-hover:text-white transition-colors duration-200">
          {platform.name}
        </h3>
        <p className="text-[11px] font-mono tracking-[0.12em] uppercase text-text-muted">
          {platform.category}
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-text-muted leading-relaxed flex-1 group-hover:text-text-secondary transition-colors duration-300">
        {platform.description}
      </p>

      {/* Capability tags */}
      <div className="flex flex-wrap gap-2">
        {platform.capabilities.map((cap) => (
          <span
            key={cap}
            className="px-2.5 py-1 text-[10px] font-medium text-text-muted border border-white/[0.06] rounded-full group-hover:border-white/[0.1] transition-colors duration-300"
          >
            {cap}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function Platforms() {
  return (
    <section className="py-32 px-6 border-b border-white/[0.06]" id="platforms">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
            Intelligence Platforms in Production
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-3xl leading-[1.1]">
            Real-world platforms built across{' '}
            <span className="text-text-secondary">
              health, territories, assets and vision
            </span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.14}>
          <p className="text-text-secondary text-lg max-w-xl mb-16 leading-relaxed">
            Every deployment generates operational knowledge that contributes
            to the evolution of our Adaptive Core.
          </p>
        </FadeIn>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {platforms.map((platform, i) => (
            <PlatformCard key={platform.name} platform={platform} index={i} />
          ))}
        </motion.div>

        {/* Footer callout */}
        <FadeIn delay={0.2} className="mt-16">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8 md:p-12">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Built Through Real Operations
              </h3>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                Unlike companies that start with products and search for
                problems, PixelPulseLab develops intelligence platforms
                alongside real operational environments. The experience gained
                through these deployments helps strengthen our Adaptive Core
                and accelerate the creation of future intelligence products.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
