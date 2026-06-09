'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const CARD_KEYS = ['platforms', 'vision', 'operational', 'products'] as const

export function WhatWeBuild() {
  const t = useTranslations('build')
  return (
    <section className="py-32 px-6 border-b border-white/[0.06]" id="build">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn><p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-2xl">
            {t('headline1')}{' '}<span className="text-text-secondary">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-text-secondary text-lg max-w-xl mb-16 leading-relaxed">{t('description')}</p>
        </FadeIn>
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CARD_KEYS.map((key) => (
            <FadeInItem key={key}>
              <div className="group p-8 rounded-2xl border border-white/[0.06] bg-surface hover:bg-card hover:border-white/[0.1] transition-all duration-300">
                <h3 className="text-lg font-semibold mb-3 text-text-primary group-hover:text-white transition-colors">{t(`cards.${key}.title`)}</h3>
                <p className="text-sm text-text-muted leading-relaxed group-hover:text-text-secondary transition-colors">{t(`cards.${key}.description`)}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
