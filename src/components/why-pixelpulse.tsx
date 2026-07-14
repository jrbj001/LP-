'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from './fade-in'

const ROW_KEYS = ['r1', 'r2', 'r3', 'r4', 'r5'] as const

export function WhyPixelPulse() {
  const t = useTranslations('why')
  return (
    <section className="py-24 lg:py-28 px-6 border-b border-black/[0.06]" id="why">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 mb-4 max-w-2xl">
            {t('headline1')}{' '}<span className="text-neutral-500">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2} className="mt-16">
          <div className="rounded-2xl border border-black/[0.06] overflow-hidden bg-white">
            <div className="grid grid-cols-2 border-b border-black/[0.06]">
              <div className="p-5 md:p-6"><p className="text-xs font-mono tracking-widest uppercase text-neutral-400">{t('col_traditional')}</p></div>
              <div className="p-5 md:p-6 bg-neutral-50"><p className="text-xs font-mono tracking-widest uppercase text-neutral-900">{t('col_pixel')}</p></div>
            </div>
            {ROW_KEYS.map((key) => (
              <div key={key} className="grid grid-cols-2 border-b border-black/[0.06] last:border-b-0">
                <div className="p-5 md:p-6"><p className="text-sm text-neutral-400">{t(`rows.${key}.traditional`)}</p></div>
                <div className="p-5 md:p-6 bg-neutral-50"><p className="text-sm text-neutral-900 font-medium">{t(`rows.${key}.pixel`)}</p></div>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.3} className="mt-12">
          <p className="text-neutral-500 leading-relaxed max-w-2xl">{t('closing')}</p>
        </FadeIn>
      </div>
    </section>
  )
}
