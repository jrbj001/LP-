'use client'

import { useLocale } from 'next-intl'
import { AnimatedMark } from '@/components/animated-mark'
import { ExplainerVideo } from './explainer-video'
import { VIDEO } from './lp-data'

type FilmProps = {
  eyebrow: string
  headline: string
  body: string
  durationLabel: string
  src?: string
  poster?: string
  fallbackDuration?: number
}

export function AdaptiveLayerVideoPage({ film }: { film?: FilmProps } = {}) {
  const locale = useLocale()
  const copy = film ?? VIDEO

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <a href={`/${locale}/pixel`} className="flex items-center gap-2.5">
          <AnimatedMark className="h-7 w-7 flex-shrink-0" />
          <span className="text-[14px] font-semibold tracking-[-0.03em]">
            Adaptive Layer™
            <span className="ml-1.5 font-normal text-white/35">vídeo</span>
          </span>
        </a>
        <a href={`/${locale}/pixel`} className="text-[13px] text-white/50 hover:text-white">
          Voltar à LP
        </a>
      </nav>
      <main className="mx-auto max-w-[1120px] px-6 pb-16 pt-8">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">{copy.eyebrow}</p>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] sm:text-[36px]">{copy.headline}</h1>
        <p className="mt-3 max-w-xl text-[15px] text-white/45">{copy.body}</p>
        <div className="mt-8">
          <ExplainerVideo
            src={film?.src}
            poster={film?.poster}
            durationLabel={copy.durationLabel}
            fallbackDuration={film?.fallbackDuration}
          />
        </div>
      </main>
    </div>
  )
}
