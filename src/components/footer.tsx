'use client'

import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="border-t border-black/[0.06] bg-[#f5f5f4]">
      <div className="mx-auto max-w-[1120px] px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <p className="text-base font-semibold tracking-[-0.02em] text-neutral-900 mb-4">
              PixelPulseLab
              <span className="font-mono font-normal text-neutral-400">.dev</span>
            </p>
            <p className="text-[11px] text-neutral-400 font-mono tracking-[0.14em] uppercase mb-4">{t('tagline')}</p>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-md">{t('description')}</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-1">{t('links')}</p>
            <a href="mailto:ze@pixelpulselab.dev" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-black/[0.06]">
          <p className="text-xs font-mono text-neutral-400">&copy; {new Date().getFullYear()} PixelPulseLab.dev</p>
        </div>
      </div>
    </footer>
  )
}
