'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from './fade-in'

export function FinalCTA() {
  const t = useTranslations('cta')
  return (
    <section className="relative py-24 lg:py-28 px-6 overflow-hidden" id="cta">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neutral-900/[0.03] blur-[120px] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1120px] text-center">
        <FadeIn><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-6">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 mb-6 max-w-3xl mx-auto leading-[1.1]">
            {t('headline1')}{' '}<span className="text-neutral-500">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">{t('description')}</p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:ze@pixelpulselab.dev" className="px-8 py-4 text-sm font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all">
              {t('btn_primary')}
            </a>
            <a href="https://wa.me/5511981058468" target="_blank" rel="noopener noreferrer" className="px-8 py-4 text-sm font-medium border border-black/[0.1] rounded-full text-neutral-600 hover:text-neutral-900 hover:border-black/[0.2] transition-all">
              {t('btn_secondary')}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
