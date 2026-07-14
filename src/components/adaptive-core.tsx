'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const LAYER_KEYS = ['l1', 'l2', 'l3', 'l4', 'l5'] as const

export function AdaptiveCore() {
  const t = useTranslations('adaptive')
  const caps: string[] = t.raw('capabilities') as string[]

  return (
    <section className="py-24 lg:py-28 px-6 bg-[#f5f5f4] border-b border-black/[0.06]" id="core">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-900 mb-4 max-w-3xl">
            {t('headline1')}{' '}<span className="text-neutral-500">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}><p className="text-neutral-500 text-lg max-w-xl mb-12 leading-relaxed">{t('description')}</p></FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeInStagger className="space-y-0">
            {LAYER_KEYS.map((key, i) => (
              <FadeInItem key={key}>
                <div className={`p-5 border-x border-t border-black/[0.06] bg-white ${i === LAYER_KEYS.length - 1 ? 'border-b rounded-b-xl' : ''} ${i === 0 ? 'rounded-t-xl' : ''} hover:bg-neutral-50 transition-colors group`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-neutral-400 w-5">{String(i).padStart(2, '0')}</span>
                      <span className="text-sm font-semibold text-neutral-900">{t(`layers.${key}.label`)}</span>
                    </div>
                    <span className="text-xs text-neutral-400 text-right">{t(`layers.${key}.description`)}</span>
                  </div>
                </div>
                {i < LAYER_KEYS.length - 1 && (
                  <div className="flex justify-center py-1"><span className="text-neutral-400 text-xs">↓</span></div>
                )}
              </FadeInItem>
            ))}
          </FadeInStagger>
          <FadeIn delay={0.3}>
            <div className="p-8 rounded-xl border border-black/[0.06] bg-white">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-6">{t('capabilities_label')}</p>
              <div className="space-y-4">
                {caps.map((cap) => (
                  <div key={cap} className="flex items-center gap-3 group">
                    <div className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-900 transition-colors" />
                    <span className="text-sm text-neutral-500 group-hover:text-neutral-900 transition-colors">{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
