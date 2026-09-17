'use client'

import { useLocale } from 'next-intl'
import { NAV_ITEMS } from './pixel-os-data'

export function PixelOSFooter() {
  const locale = useLocale()

  return (
    <footer className="border-t border-white/10 bg-[#080808] px-5 py-10 text-white md:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <a href={`/${locale}`} className="text-sm font-semibold tracking-tight">PIXEL</a>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/35">
            The AI Operating System for the Enterprise. Any model. One enterprise context.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={`/${locale}${item.href}`} className="text-[11px] text-white/42 transition-colors hover:text-white">
              {item.label}
            </a>
          ))}
          <a href={`/${locale}/guides/valor-hora`} className="text-[11px] text-white/42 transition-colors hover:text-white">2026 Value Guide</a>
          <a href="mailto:ze@pixelpulselab.dev" className="text-[11px] text-white/42 transition-colors hover:text-white">Email</a>
          <a href="https://wa.me/5511981058468" className="text-[11px] text-white/42 transition-colors hover:text-white">WhatsApp</a>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1200px] justify-between border-t border-white/8 pt-5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/22">
        <span>PixelPulseLab.dev</span>
        <span>Enterprise systems / 2026</span>
      </div>
    </footer>
  )
}
