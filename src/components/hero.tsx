'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('hero')
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="relative z-10 mx-auto max-w-[1120px] px-6 w-full">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-8">
          {t('eyebrow')}
        </p>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-semibold leading-[1.08] tracking-[-0.03em] text-neutral-900 max-w-3xl mb-6"
          initial={{ opacity: 0.01, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {t('headline1')}{' '}
          <span className="text-neutral-500">{t('headline2')}</span>
        </motion.h1>

        <p className="text-[17px] text-neutral-500 max-w-xl leading-relaxed mb-10">
          {t('description')}
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="#cta"
            className="px-6 py-3 text-sm font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            {t('cta_primary')}
          </a>
          <a
            href="#ventures"
            className="px-6 py-3 text-sm font-medium border border-black/[0.1] rounded-full text-neutral-600 hover:text-neutral-900 hover:border-black/[0.2] transition-colors"
          >
            {t('cta_secondary')}
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
    </section>
  )
}
