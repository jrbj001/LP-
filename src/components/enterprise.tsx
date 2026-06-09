'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const CAP_KEYS = ['c1', 'c2', 'c3', 'c4', 'c5'] as const
const DOMAINS = ['Retail Intelligence', 'Health Platforms', 'Asset Intelligence', 'Territorial Intelligence', 'Computer Vision', 'Analytics Platforms']

export function Enterprise() {
  const t = useTranslations('enterprise')
  return (
    <section className="py-32 px-6 bg-surface border-b border-white/[0.06]" id="enterprise">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn><p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-2xl">
            {t('headline1')}{' '}<span className="text-text-secondary">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}><p className="text-text-secondary text-lg max-w-xl mb-16 leading-relaxed">{t('description')}</p></FadeIn>
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {CAP_KEYS.map((key) => (
            <FadeInItem key={key}>
              <div className="p-6 rounded-xl border border-white/[0.06] bg-bg hover:border-white/[0.1] transition-all group">
                <h3 className="text-sm font-semibold text-text-primary mb-2 group-hover:text-white transition-colors">{t(`capabilities.${key}.title`)}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{t(`capabilities.${key}.description`)}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
        <FadeIn delay={0.3}>
          <div className="border-t border-white/[0.06] pt-8">
            <p className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted mb-4">{t('domains_label')}</p>
            <div className="flex flex-wrap gap-3">
              {DOMAINS.map((domain) => (
                <span key={domain} className="px-4 py-2 text-xs font-medium text-text-secondary border border-white/[0.08] rounded-full">{domain}</span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
