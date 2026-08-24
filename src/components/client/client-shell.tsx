'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Menu,
  PanelTop,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { ClientWorkspace } from '@/lib/client/types'
import { isBacklogEnabled } from '@/lib/backlog/access'

const NAV_ITEMS = [
  { path: '', label: 'Visão geral', section: 'work', icon: LayoutDashboard },
  { path: '/backlog', label: 'Boards', section: 'work', icon: PanelTop },
  { path: '/projetos', label: 'Projetos', section: 'work', icon: FolderKanban },
  { path: '/reunioes', label: 'Reuniões', section: 'context', icon: CalendarDays },
  { path: '/documentos', label: 'Documentos', section: 'context', icon: FileText },
  { path: '/entregas', label: 'Entregas', section: 'context', icon: BarChart3 },
] as const

type NavItem = (typeof NAV_ITEMS)[number]

export function ClientShell({
  client,
  children,
}: {
  client: ClientWorkspace
  children: React.ReactNode
}) {
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const base = `/${locale}/client/${client.slug}`
  const wide = pathname.endsWith('/entregas') || pathname.includes('/backlog')
  const navItems = NAV_ITEMS.filter(item => item.path !== '/backlog' || isBacklogEnabled(client.slug))

  const isActive = (item: NavItem) => {
    const href = `${base}${item.path}`
    return item.path ? pathname.startsWith(href) : pathname === base || pathname === `${base}/`
  }

  const SidebarContent = () => (
    <>
      <div className="px-4 pb-4 pt-5">
        <Link href={`/${locale}/client`} className="flex items-center gap-2.5">
          <CadenceMark />
          <div className="leading-none">
            <p className="font-[family-name:var(--font-cadence-display)] text-[14px] font-semibold tracking-[-0.03em]">
              Cadence
            </p>
            <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.13em] text-neutral-400">
              Agent-ready Delivery™
            </p>
          </div>
        </Link>
      </div>

      <div className="mx-3 border-y border-black/[0.06] py-3">
        <Link
          href={base}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-black/[0.03]"
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-semibold text-white"
            style={{ backgroundColor: client.accent }}
          >
            {client.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('')}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold text-neutral-800">{client.name}</span>
            <span className="block truncate text-[10px] text-neutral-400">{client.sector}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-neutral-300" />
        </Link>
      </div>

      <nav className="mt-4 flex flex-col gap-6 px-3">
        <NavSection
          label="Trabalho"
          items={navItems.filter(item => item.section === 'work')}
          base={base}
          active={isActive}
          onNav={() => setOpen(false)}
        />
        <NavSection
          label="Contexto"
          items={navItems.filter(item => item.section === 'context')}
          base={base}
          active={isActive}
          onNav={() => setOpen(false)}
        />
      </nav>

      <div className="mt-auto p-3">
        <Link
          href={`${base}/backlog/copilot`}
          onClick={() => setOpen(false)}
          className="group flex items-start gap-3 rounded-xl border border-teal-950/10 bg-teal-50/70 p-3.5 transition-colors hover:bg-teal-50"
        >
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" strokeWidth={1.75} />
          <span>
            <span className="block text-[11px] font-semibold text-teal-950">Cadence Copilot</span>
            <span className="mt-0.5 block text-[10px] leading-relaxed text-teal-800/60">
              Transforme contexto em trabalho agent-ready.
            </span>
          </span>
        </Link>
        <div className="mt-3 flex items-center justify-between px-1 text-[10px] text-neutral-400">
          <span>PixelPulseLab</span>
          <a href={`mailto:${client.docs.supportEmail}`} className="hover:text-neutral-700">Suporte</a>
        </div>
      </div>
    </>
  )

  return (
    <div className="cadence-scope min-h-screen bg-[#f2f2f0] text-neutral-900 antialiased">
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-black/[0.06] bg-[#f2f2f0]/90 px-4 backdrop-blur-xl lg:hidden">
        <Link href={base} className="flex items-center gap-2.5">
          <CadenceMark />
          <span className="font-[family-name:var(--font-cadence-display)] text-[14px] font-semibold">Cadence</span>
          <span className="text-neutral-300">/</span>
          <span className="max-w-32 truncate text-[12px] text-neutral-500">{client.name}</span>
        </Link>
        <button
          type="button"
          aria-label="Abrir navegação"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-neutral-500 hover:bg-black/[0.04]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button type="button" aria-label="Fechar navegação" className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-[280px] flex-col border-r border-black/[0.06] bg-[#f7f7f5]">
            <button type="button" aria-label="Fechar navegação" onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 text-neutral-400 hover:bg-black/[0.04]">
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col border-r border-black/[0.06] bg-[#f7f7f5] lg:flex">
        <SidebarContent />
      </aside>

      <main className="min-h-screen pt-14 lg:pl-[244px] lg:pt-0">
        <div className={`mx-auto w-full ${wide ? '' : 'max-w-[1180px]'}`}>{children}</div>
      </main>
    </div>
  )
}

function CadenceMark() {
  return (
    <span className="flex h-7 w-7 items-end justify-center gap-[2px] rounded-lg bg-neutral-950 pb-[6px]">
      {[6, 11, 8, 14].map((height, index) => (
        <span key={index} className="w-[2px] rounded-full bg-teal-300" style={{ height }} />
      ))}
    </span>
  )
}

function NavSection({
  label,
  items,
  base,
  active,
  onNav,
}: {
  label: string
  items: NavItem[]
  base: string
  active: (item: NavItem) => boolean
  onNav: () => void
}) {
  return (
    <div>
      <p className="mb-1.5 px-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-300">{label}</p>
      <div className="space-y-0.5">
        {items.map(item => {
          const Icon: LucideIcon = item.icon
          const selected = active(item)
          return (
            <Link
              key={item.label}
              href={`${base}${item.path}`}
              onClick={onNav}
              className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium transition-colors ${
                selected ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-black/[0.035] hover:text-neutral-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${selected ? 'text-teal-300' : 'text-neutral-400 group-hover:text-neutral-700'}`} strokeWidth={1.75} />
              {item.label}
              {item.path === '/backlog' && <span className={`ml-auto h-1.5 w-1.5 rounded-full ${selected ? 'bg-teal-300' : 'bg-teal-500'}`} />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
