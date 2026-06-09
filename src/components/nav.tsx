'use client'

import { useEffect, useState } from 'react'
import { AnimatedMark } from './animated-mark'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_12px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6 h-[72px] flex items-center justify-between">

        {/* Logo: animated mark + wordmark */}
        <a href="#" className="flex items-center gap-3 group">
          <AnimatedMark className="w-7 h-auto flex-shrink-0" />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-white/90 group-hover:text-white transition-colors">
            PixelPulseLab
            <span className="text-white/30 font-normal">.dev</span>
          </span>
        </a>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/company/pixelpulselab"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-sm text-white/30 hover:text-white/70 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="#cta"
            className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
          >
            Work With Us
          </a>
        </div>
      </div>
    </nav>
  )
}
