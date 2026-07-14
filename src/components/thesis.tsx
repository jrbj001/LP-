'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from './fade-in'

export function Thesis() {
  const t = useTranslations('thesis')
  return (
    <section className="py-24 lg:py-28 px-6 bg-[#f5f5f4] border-b border-black/[0.06]" id="thesis">
      <div className="mx-auto max-w-[1120px]">
        <div className="max-w-3xl">
          <FadeIn><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">{t('label')}</p></FadeIn>
          <FadeIn delay={0.1}><h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 mb-4 leading-[1.1]">{t('headline1')}</h2></FadeIn>
          <FadeIn delay={0.15}><h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] mb-12 text-neutral-500 leading-[1.1]">{t('headline2')}</h2></FadeIn>
          <div className="space-y-6 text-neutral-500 leading-relaxed">
            <FadeIn delay={0.2}><p>{t('p1')}</p></FadeIn>
            <FadeIn delay={0.25}><p>{t('p2')}</p></FadeIn>
            <FadeIn delay={0.3}><p className="text-neutral-900 font-medium">{t('p3')}</p></FadeIn>
            <FadeIn delay={0.35}><p className="text-neutral-400 text-sm font-mono tracking-wide">{t('p4')}</p></FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
