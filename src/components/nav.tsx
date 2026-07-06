'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { AnimatedMark } from './animated-mark'

const LOCALES = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
] as const

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('nav')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function switchLocale(next: string) {
    // Replace current locale prefix in path
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/') || '/')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_12px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6 h-[72px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
            <AnimatedMark className="w-7 h-7 flex-shrink-0" />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-white/90 group-hover:text-white transition-colors">
            PixelPulseLab
            <span className="text-white/30 font-normal">.dev</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          {/* Client portal link */}
          <a
            href={`/${locale}/client`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider text-white/40 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.18] rounded-lg transition-all duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Portal
          </a>

          {/* Language switcher */}
          <div className="flex border border-white/[0.1] rounded-lg overflow-hidden">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                className={`px-3 py-1.5 text-[11px] font-mono tracking-wide transition-colors ${
                  locale === code
                    ? 'bg-white/[0.1] text-white'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <a
            href="#cta"
            className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
          >
            {t('cta')}
          </a>
        </div>
      </div>
    </nav>
  )
}
