'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

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
        <a href="#" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="PixelPulseLab"
            width={140}
            height={32}
            className="h-7 w-auto brightness-0 invert"
            priority
          />
        </a>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/company/pixelpulselab"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="#cta"
            className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Work With Us
          </a>
        </div>
      </div>
    </nav>
  )
}
