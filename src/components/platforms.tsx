'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FadeIn } from './fade-in'

const PLATFORM_KEYS = ['likeme', 'colmeia', 'asset', 'visibility'] as const

const ICONS: Record<string, React.ReactNode> = {
  likeme: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.4" />
      <path d="M12 8v2M12 14v2M8 12h2M14 12h2" strokeWidth="1.2" opacity="0.5" />
    </svg>
  ),
  colmeia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <polygon points="12 7 17 10 17 14 12 17 7 14 7 10 12 7" opacity="0.45" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  ),
  asset: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="2" y="15" width="20" height="6" rx="1.5" />
      <rect x="2" y="9" width="20" height="4" rx="1" opacity="0.6" />
      <rect x="2" y="3" width="20" height="4" rx="1" opacity="0.3" />
      <line x1="6" y1="18" x2="18" y2="18" strokeWidth="1" opacity="0.4" />
      <line x1="6" y1="11" x2="14" y2="11" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  visibility: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      <rect x="3" y="3" width="5" height="5" rx="1" strokeWidth="1" opacity="0.3" />
      <rect x="16" y="3" width="5" height="5" rx="1" strokeWidth="1" opacity="0.3" />
      <rect x="3" y="16" width="5" height="5" rx="1" strokeWidth="1" opacity="0.3" />
      <rect x="16" y="16" width="5" height="5" rx="1" strokeWidth="1" opacity="0.3" />
    </svg>
  ),
}

function PlatformCard({ platformKey, index }: { platformKey: typeof PLATFORM_KEYS[number]; index: number }) {
  const t = useTranslations('platforms')
  const caps: string[] = t.raw(`items.${platformKey}.capabilities`) as string[]

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative rounded-2xl border border-black/[0.06] bg-white p-8 flex flex-col gap-5 overflow-hidden transition-colors duration-300 hover:border-black/[0.1]"
    >
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl border border-black/[0.06] bg-neutral-50 flex items-center justify-center text-neutral-500 group-hover:text-neutral-900 transition-colors duration-300">
          {ICONS[platformKey]}
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black/[0.06] text-[10px] font-mono tracking-widest uppercase text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {t('status')}
        </span>
      </div>
      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-1">
          {t(`items.${platformKey}.name`)}
        </h3>
        <p className="text-[11px] font-mono tracking-[0.12em] uppercase text-neutral-400">
          {t(`items.${platformKey}.category`)}
        </p>
      </div>
      <p className="text-sm text-neutral-500 leading-relaxed flex-1">
        {t(`items.${platformKey}.description`)}
      </p>
      <div className="flex flex-wrap gap-2">
        {caps.map((cap) => (
          <span key={cap} className="px-2.5 py-1 text-[10px] font-medium text-neutral-500 border border-black/[0.06] rounded-full">
            {cap}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function Platforms() {
  const t = useTranslations('platforms')
  return (
    <section className="py-24 lg:py-28 px-6 border-b border-black/[0.06]" id="platforms">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 mb-4 max-w-3xl leading-[1.1]">
            {t('headline1')}{' '}<span className="text-neutral-500">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.14}><p className="text-neutral-500 text-lg max-w-xl mb-12 leading-relaxed">{t('description')}</p></FadeIn>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {PLATFORM_KEYS.map((key, i) => (
            <PlatformCard key={key} platformKey={key} index={i} />
          ))}
        </motion.div>
        <FadeIn delay={0.2} className="mt-16">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 md:p-12">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">{t('footer_title')}</h3>
              <p className="text-neutral-500 leading-relaxed text-sm md:text-base">{t('footer_body')}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
