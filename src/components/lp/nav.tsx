'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'

export function NavLight() {
  const [scrolled, setScrolled] = useState(false)
  const locale = useLocale()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl border-b border-neutral-100 shadow-sm'
        : 'bg-white'
    }`}>
      <div className="mx-auto max-w-[1200px] px-6 h-[68px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center">
            <span className="text-white text-[11px] font-bold">PP</span>
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-neutral-900">
            PixelPulseLab
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-[14px] text-neutral-500">
          <a href="#services" className="hover:text-neutral-900 transition-colors">Serviços</a>
          <a href="#cases" className="hover:text-neutral-900 transition-colors">Cases</a>
          <a href="#framework" className="hover:text-neutral-900 transition-colors">Framework</a>
          <a href="#team" className="hover:text-neutral-900 transition-colors">Time</a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/${locale}/client`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-400 rounded-lg transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Portal
          </a>
          <a
            href="#cta"
            className="px-5 py-2.5 text-[13px] font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-700 transition-all"
          >
            Fale conosco
          </a>
        </div>
      </div>
    </nav>
  )
}
