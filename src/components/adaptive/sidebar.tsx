'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { NAV_ITEMS, CLIENT } from './data'
import { Lock, Menu, X } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  const base = `/${locale}/adaptive`

  const isActive = (href: string) => {
    const full = base + href
    if (href === '') return pathname === base || pathname === base + '/'
    return pathname.startsWith(full)
  }

  const main = NAV_ITEMS.filter(i => i.section === 'main')
  const workspace = NAV_ITEMS.filter(i => i.section === 'workspace')

  const NavList = () => (
    <>
      <BrandBlock />

      <nav className="flex flex-col gap-8 px-3 mt-2">
        <div className="flex flex-col gap-0.5">
          <SectionLabel>Metodologia</SectionLabel>
          {main.map(item => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} base={base} onNav={() => setOpen(false)} />
          ))}
        </div>

        <div className="flex flex-col gap-0.5">
          <SectionLabel>Workspace</SectionLabel>
          {workspace.map(item => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} base={base} onNav={() => setOpen(false)} />
          ))}
        </div>
      </nav>

      <div className="mt-auto p-4">
        {/* Client context */}
        <div className="mb-3 flex items-center gap-2.5 px-1">
          <div className="w-7 h-7 rounded-lg bg-black/[0.06] flex items-center justify-center text-[10px] font-semibold text-neutral-600">
            {CLIENT.champion.initials}
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-[12px] font-medium text-neutral-900 truncate">{CLIENT.name}</p>
            <p className="text-[10px] text-neutral-400 truncate">{CLIENT.champion.name} · {CLIENT.champion.role}</p>
          </div>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-black/[0.015] p-4">
          <p className="text-[11px] font-medium text-neutral-900">Precisa de ajuda?</p>
          <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            Fale com o time da PixelPulseLab durante o assessment.
          </p>
          <a
            href="mailto:hello@pixelpulselab.dev"
            className="mt-3 inline-flex text-[11px] font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            Contatar equipe →
          </a>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
        <span className="text-sm font-semibold tracking-tight text-neutral-900">Adaptive Enterprise™</span>
        <button onClick={() => setOpen(true)} className="p-2 text-neutral-600">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-72 h-full bg-white border-r border-black/[0.06] flex flex-col">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1.5 text-neutral-400">
              <X className="w-5 h-5" />
            </button>
            <NavList />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 flex-col bg-white border-r border-black/[0.06]">
        <NavList />
      </aside>
    </>
  )
}

function BrandBlock() {
  return (
    <div className="px-5 pt-6 pb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center">
          <div className="w-3 h-3 rounded-[3px] bg-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-semibold tracking-tight text-neutral-900">PixelPulseLab</span>
          <span className="text-[10px] text-neutral-400 mt-0.5">Adaptive Enterprise™</span>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 mb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-300">
      {children}
    </p>
  )
}

function NavLink({
  item, active, base, onNav,
}: {
  item: (typeof NAV_ITEMS)[number]
  active: boolean
  base: string
  onNav: () => void
}) {
  const Icon = item.icon
  return (
    <a
      href={base + item.href}
      onClick={onNav}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 ${
        active
          ? 'bg-neutral-900 text-white'
          : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.03]'
      }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-700'}`} strokeWidth={1.75} />
      <span className="font-medium">{item.label}</span>
      {item.locked && (
        <Lock className={`w-3 h-3 ml-auto ${active ? 'text-white/60' : 'text-neutral-300'}`} strokeWidth={2} />
      )}
    </a>
  )
}
