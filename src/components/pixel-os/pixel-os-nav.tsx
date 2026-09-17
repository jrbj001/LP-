'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatedMark } from '@/components/animated-mark'
import { NAV_ITEMS } from './pixel-os-data'

const LOCALES = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
] as const

export function PixelOSNav() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(nextLocale: string) {
    const segments = pathname.split('/')
    segments[1] = nextLocale
    router.push(segments.join('/') || `/${nextLocale}`)
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#080808]/88 backdrop-blur-xl" aria-label="Primary navigation">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-6">
        <a href={`/${locale}`} className="group flex items-center gap-2.5" aria-label="Pixel home">
          <AnimatedMark className="h-7 w-7 shrink-0" />
          <span className="text-sm font-semibold tracking-[-0.02em] text-white">PIXEL</span>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-white/28 sm:inline">by PixelPulseLab</span>
        </a>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden items-center gap-5 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={`/${locale}${item.href}`}
                className="text-[11px] text-white/45 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
              >
                {item.label}
              </a>
            ))}
          </div>
          <label className="relative hidden sm:block">
            <span className="sr-only">Language</span>
            <select
              value={locale}
              onChange={(event) => switchLocale(event.target.value)}
              className="appearance-none border-0 bg-transparent py-2 pr-4 font-mono text-[9px] uppercase tracking-[0.12em] text-white/38 outline-none transition-colors hover:text-white focus-visible:text-white"
              aria-label="Language"
            >
              {LOCALES.map(({ code, label }) => <option key={code} value={code} className="bg-neutral-950">{label}</option>)}
            </select>
          </label>
          <a
            href="mailto:ze@pixelpulselab.dev?subject=Build%20with%20Pixel"
            className="border border-emerald-300/35 px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-200 transition-colors hover:bg-emerald-300 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 sm:px-4"
          >
            Talk to us
          </a>
        </div>
      </div>
    </nav>
  )
}
