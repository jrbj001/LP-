'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from './fade-in'

export function Thesis() {
  const t = useTranslations('thesis')
  return (
    <section className="py-32 px-6 bg-surface border-b border-white/[0.06]" id="thesis">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-3xl">
          <FadeIn><p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">{t('label')}</p></FadeIn>
          <FadeIn delay={0.1}><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 leading-[1.1]">{t('headline1')}</h2></FadeIn>
          <FadeIn delay={0.15}><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-12 text-text-secondary leading-[1.1]">{t('headline2')}</h2></FadeIn>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <FadeIn delay={0.2}><p>{t('p1')}</p></FadeIn>
            <FadeIn delay={0.25}><p>{t('p2')}</p></FadeIn>
            <FadeIn delay={0.3}><p className="text-text-primary font-medium">{t('p3')}</p></FadeIn>
            <FadeIn delay={0.35}><p className="text-text-muted text-sm font-mono tracking-wide">{t('p4')}</p></FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
