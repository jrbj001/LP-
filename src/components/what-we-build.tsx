'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const CARD_KEYS = ['platforms', 'vision', 'operational', 'products'] as const

export function WhatWeBuild() {
  const t = useTranslations('build')
  return (
    <section className="py-24 lg:py-28 px-6 border-b border-black/[0.06]" id="build">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <FadeIn>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
                {t('label')}
              </p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 leading-[1.12] mb-5">
                {t('headline1')}{' '}
                <span className="text-neutral-500">{t('headline2')}</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="text-neutral-500 text-[17px] leading-relaxed max-w-md">
                {t('description')}
              </p>
            </FadeIn>
          </div>

          <FadeInStagger className="lg:col-span-7 divide-y divide-black/[0.06] border-y border-black/[0.06]">
            {CARD_KEYS.map((key, i) => (
              <FadeInItem key={key}>
                <div className="group flex gap-5 sm:gap-6 py-7 sm:py-8">
                  <span className="font-mono text-[11px] tracking-wider text-neutral-400 pt-1 w-7 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 tracking-[-0.02em] mb-2">
                      {t(`cards.${key}.title`)}
                    </h3>
                    <p className="text-[15px] text-neutral-500 leading-relaxed">
                      {t(`cards.${key}.description`)}
                    </p>
                    <p className="mt-3 text-[12px] font-mono tracking-wide text-neutral-400">
                      {t(`cards.${key}.outcome`)}
                    </p>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </div>
    </section>
  )
}
