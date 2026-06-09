'use client'

import { useTranslations } from 'next-intl'
import { FadeIn, FadeInStagger, FadeInItem } from './fade-in'

const LAYER_KEYS = ['l1', 'l2', 'l3', 'l4', 'l5'] as const

export function AdaptiveCore() {
  const t = useTranslations('adaptive')
  const caps: string[] = t.raw('capabilities') as string[]

  return (
    <section className="py-32 px-6 bg-surface border-b border-white/[0.06]" id="core">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn><p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">{t('label')}</p></FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 max-w-3xl">
            {t('headline1')}{' '}<span className="text-text-secondary">{t('headline2')}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}><p className="text-text-secondary text-lg max-w-xl mb-16 leading-relaxed">{t('description')}</p></FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeInStagger className="space-y-0">
            {LAYER_KEYS.map((key, i) => (
              <FadeInItem key={key}>
                <div className={`p-5 border-x border-t border-white/[0.06] ${i === LAYER_KEYS.length - 1 ? 'border-b rounded-b-xl' : ''} ${i === 0 ? 'rounded-t-xl' : ''} hover:bg-card transition-colors group`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-text-muted w-5">{String(i).padStart(2, '0')}</span>
                      <span className="text-sm font-semibold text-text-primary group-hover:text-white transition-colors">{t(`layers.${key}.label`)}</span>
                    </div>
                    <span className="text-xs text-text-muted">{t(`layers.${key}.description`)}</span>
                  </div>
                </div>
                {i < LAYER_KEYS.length - 1 && (
                  <div className="flex justify-center py-1"><span className="text-text-muted text-xs">↓</span></div>
                )}
              </FadeInItem>
            ))}
          </FadeInStagger>
          <FadeIn delay={0.3}>
            <div className="p-8 rounded-xl border border-white/[0.06] bg-bg">
              <p className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted mb-6">{t('capabilities_label')}</p>
              <div className="space-y-4">
                {caps.map((cap) => (
                  <div key={cap} className="flex items-center gap-3 group">
                    <div className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-text-primary transition-colors" />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{cap}</span>
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
