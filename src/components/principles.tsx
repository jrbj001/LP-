'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const PRINCIPLE_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] as const

export function Principles() {
  const t = useTranslations('principles')
  return (
    <section className="py-32 px-6 bg-surface border-b border-white/[0.06]" id="principles">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn><p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-16 max-w-2xl">
            {t('headline1')}{' '}<span className="text-text-secondary">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRINCIPLE_KEYS.map((key, i) => (
            <FadeInItem key={key}>
              <div className="group p-8 rounded-2xl border border-white/[0.06] bg-bg hover:border-white/[0.12] transition-all duration-300 h-full">
                <span className="text-[10px] font-mono text-text-muted mb-4 block">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-base font-semibold text-text-primary mb-3 group-hover:text-white transition-colors">{t(`items.${key}.title`)}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{t(`items.${key}.description`)}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
