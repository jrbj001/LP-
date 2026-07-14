'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const PRINCIPLE_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] as const

export function Principles() {
  const t = useTranslations('principles')
  return (
    <section className="py-24 lg:py-28 px-6 bg-[#f5f5f4] border-b border-black/[0.06]" id="principles">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 mb-12 max-w-2xl">
            {t('headline1')}{' '}<span className="text-neutral-500">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRINCIPLE_KEYS.map((key, i) => (
            <FadeInItem key={key}>
              <div className="group p-8 rounded-2xl border border-black/[0.06] bg-white hover:border-black/[0.1] transition-all duration-300 h-full">
                <span className="text-[10px] font-mono text-neutral-400 mb-4 block">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-base font-semibold text-neutral-900 mb-3">{t(`items.${key}.title`)}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{t(`items.${key}.description`)}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
