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
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/') || '/')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#fbfbfa]/90 backdrop-blur-xl border-b border-black/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1120px] px-6 h-16 flex items-center justify-between">
        <a href={`/${locale}`} className="flex items-center gap-2.5 group">
          <AnimatedMark className="w-8 h-8 flex-shrink-0" />
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-neutral-900">
            PixelPulseLab
            <span className="font-mono font-normal text-neutral-400">.dev</span>
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`/${locale}/client`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono tracking-wider text-neutral-500 hover:text-neutral-900 border border-black/[0.08] hover:border-black/[0.14] rounded-md transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Área do Cliente
          </a>

          <div className="flex border border-black/[0.08] rounded-md overflow-hidden">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLocale(code)}
                className={`px-2.5 py-1.5 text-[11px] font-mono tracking-wide transition-colors ${
                  locale === code
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <a
            href="#cta"
            className="px-4 py-2 text-sm font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            {t('cta')}
          </a>
        </div>
      </div>
    </nav>
  )
}
