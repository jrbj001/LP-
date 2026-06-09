'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const PRODUCT_KEYS = ['credix', 'qa', 'monitoring', 'core'] as const

export function Ventures() {
  const t = useTranslations('ventures')
  return (
    <section className="py-32 px-6 border-b border-white/[0.06]" id="ventures">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn><p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-3xl">
            {t('headline1')}{' '}<span className="text-text-secondary">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}><p className="text-text-secondary text-lg max-w-xl mb-16 leading-relaxed">{t('description')}</p></FadeIn>
        <FadeInStagger className="space-y-3">
          {PRODUCT_KEYS.map((key) => (
            <FadeInItem key={key}>
              <div className="group p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-surface hover:bg-card hover:border-white/[0.1] transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-white transition-colors">{t(`items.${key}.name`)}</h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase border border-white/[0.1] rounded-full text-text-muted">{t(`items.${key}.status`)}</span>
                    </div>
                    <p className="text-xs font-mono tracking-wide uppercase text-text-muted">{t(`items.${key}.category`)}</p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed md:max-w-sm md:text-right">{t(`items.${key}.description`)}</p>
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
