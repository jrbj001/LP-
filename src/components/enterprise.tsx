'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const CAP_KEYS = ['c1', 'c2', 'c3', 'c4', 'c5'] as const
const DOMAINS = ['Retail Intelligence', 'Health Platforms', 'Asset Intelligence', 'Territorial Intelligence', 'Computer Vision', 'Analytics Platforms']

export function Enterprise() {
  const t = useTranslations('enterprise')
  return (
    <section className="py-24 lg:py-28 px-6 bg-[#f5f5f4] border-b border-black/[0.06]" id="enterprise">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 mb-4 max-w-2xl">
            {t('headline1')}{' '}<span className="text-neutral-500">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}><p className="text-neutral-500 text-lg max-w-xl mb-12 leading-relaxed">{t('description')}</p></FadeIn>
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {CAP_KEYS.map((key) => (
            <FadeInItem key={key}>
              <div className="p-6 rounded-xl border border-black/[0.06] bg-white hover:border-black/[0.1] transition-all group">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">{t(`capabilities.${key}.title`)}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{t(`capabilities.${key}.description`)}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
        <FadeIn delay={0.3}>
          <div className="border-t border-black/[0.06] pt-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-4">{t('domains_label')}</p>
            <div className="flex flex-wrap gap-3">
              {DOMAINS.map((domain) => (
                <span key={domain} className="px-4 py-2 text-xs font-medium text-neutral-600 border border-black/[0.08] rounded-full bg-white">{domain}</span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
