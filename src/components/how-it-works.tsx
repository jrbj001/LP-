'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const STEP_KEYS = ['s1', 's2', 's3', 's4', 's5'] as const

export function HowItWorks() {
  const t = useTranslations('how')
  return (
    <section className="py-24 lg:py-28 px-6 border-b border-black/[0.06]" id="how">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 mb-4 max-w-2xl">
            {t('headline1')}{' '}<span className="text-neutral-500">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}><p className="text-neutral-500 text-lg max-w-xl mb-12 leading-relaxed">{t('description')}</p></FadeIn>
        <FadeInStagger className="relative">
          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {STEP_KEYS.map((key, i) => (
              <FadeInItem key={key} className="flex-1 relative">
                <div className="p-6 md:p-8 border border-black/[0.06] bg-white hover:bg-neutral-50 transition-colors md:first:rounded-l-2xl md:last:rounded-r-2xl first:rounded-t-2xl last:rounded-b-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div className="w-8 h-8 rounded-full border border-black/[0.1] flex items-center justify-center text-xs font-mono text-neutral-400"
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}>
                      {String(i + 1).padStart(2, '0')}
                    </motion.div>
                    {i < STEP_KEYS.length - 1 && (
                      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-neutral-400 text-xs">→</div>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{t(`steps.${key}.label`)}</h3>
                  <p className="text-xs text-neutral-400">{t(`steps.${key}.sub`)}</p>
                </div>
              </FadeInItem>
            ))}
          </div>
          <FadeIn delay={0.6} className="mt-8 text-center">
            <p className="text-xs font-mono tracking-widest uppercase text-neutral-400">{t('loop')}</p>
          </FadeIn>
        </FadeInStagger>
        <div className="mt-16 space-y-4 text-neutral-500 leading-relaxed max-w-2xl">
          <FadeIn delay={0.3}><p>{t('p1')}</p></FadeIn>
          <FadeIn delay={0.35}><p className="text-neutral-400 text-sm font-mono tracking-wide">{t('p2')}</p></FadeIn>
        </div>
      </div>
    </section>
  )
}
