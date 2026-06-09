'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from './fade-in'

export function FinalCTA() {
  const t = useTranslations('cta')
  return (
    <section className="relative py-32 px-6 overflow-hidden" id="cta">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1200px] text-center">
        <FadeIn><p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-6">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6 max-w-3xl mx-auto leading-[1.1]">
            {t('headline1')}{' '}<span className="text-text-secondary">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-12 leading-relaxed">{t('description')}</p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:ze@pixelpulselab.dev" className="px-8 py-4 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]">
              {t('btn_primary')}
            </a>
            <a href="https://wa.me/5511981058468" target="_blank" rel="noopener noreferrer" className="px-8 py-4 text-sm font-medium border border-white/[0.14] rounded-full text-text-secondary hover:text-text-primary hover:border-white/30 transition-all">
              {t('btn_secondary')}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
