'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from './fade-in'

const ROW_KEYS = ['r1', 'r2', 'r3', 'r4', 'r5'] as const

export function WhyPixelPulse() {
  const t = useTranslations('why')
  return (
    <section className="py-32 px-6 border-b border-white/[0.06]" id="why">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn><p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-2xl">
            {t('headline1')}{' '}<span className="text-text-secondary">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2} className="mt-16">
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-2 border-b border-white/[0.06]">
              <div className="p-5 md:p-6"><p className="text-xs font-mono tracking-widest uppercase text-text-muted">{t('col_traditional')}</p></div>
              <div className="p-5 md:p-6 bg-surface"><p className="text-xs font-mono tracking-widest uppercase text-text-primary">{t('col_pixel')}</p></div>
            </div>
            {ROW_KEYS.map((key) => (
              <div key={key} className="grid grid-cols-2 border-b border-white/[0.06] last:border-b-0">
                <div className="p-5 md:p-6"><p className="text-sm text-text-muted">{t(`rows.${key}.traditional`)}</p></div>
                <div className="p-5 md:p-6 bg-surface"><p className="text-sm text-text-primary font-medium">{t(`rows.${key}.pixel`)}</p></div>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.3} className="mt-12">
          <p className="text-text-secondary leading-relaxed max-w-2xl">{t('closing')}</p>
        </FadeIn>
      </div>
    </section>
  )
}
