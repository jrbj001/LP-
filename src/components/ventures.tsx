'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const PRODUCT_KEYS = ['credix', 'qa', 'monitoring', 'core'] as const

export function Ventures() {
  const t = useTranslations('ventures')
  return (
    <section className="py-24 lg:py-28 px-6 border-b border-black/[0.06]" id="ventures">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 mb-4 max-w-3xl">
            {t('headline1')}{' '}<span className="text-neutral-500">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}><p className="text-neutral-500 text-lg max-w-xl mb-12 leading-relaxed">{t('description')}</p></FadeIn>
        <FadeInStagger className="space-y-3">
          {PRODUCT_KEYS.map((key) => (
            <FadeInItem key={key}>
              <div className="group p-6 md:p-8 rounded-2xl border border-black/[0.06] bg-white hover:border-black/[0.1] transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-900">{t(`items.${key}.name`)}</h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase border border-black/[0.08] rounded-full text-neutral-400">{t(`items.${key}.status`)}</span>
                    </div>
                    <p className="text-xs font-mono tracking-wide uppercase text-neutral-400">{t(`items.${key}.category`)}</p>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed md:max-w-sm md:text-right">{t(`items.${key}.description`)}</p>
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
