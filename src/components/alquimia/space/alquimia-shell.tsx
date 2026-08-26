'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Activity,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronDown,
  CircleGauge,
  ClipboardCheck,
  FileArchive,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu,
  Network,
  PanelLeftClose,
  Route,
  Target,
  Users,
  X,
} from 'lucide-react'
import type { AlquimiaSession } from '@/lib/alquimia/auth'
import { PARTNER_SPACE_SEGMENTS, getSpaceEngagement } from '@/lib/alquimia/engagements'

type Icon = typeof Activity

const partnerItems: Array<{ label: string; href: string; icon: Icon }> = [
  { label: 'Visão geral', href: '', icon: LayoutDashboard },
  { label: 'Clientes', href: '#clientes', icon: Users },
  { label: 'Metodologia', href: 'metodologia', icon: Network },
  { label: 'Práticas', href: 'praticas', icon: BookOpen },
  { label: 'Templates', href: 'templates', icon: LayoutTemplate },
  { label: 'Documentos', href: 'documentos', icon: FileText },
  { label: 'Agenda', href: 'agenda', icon: CalendarDays },
]

const engagementItems: Array<{ label: string; href: string; icon: Icon }> = [
  { label: 'Visão executiva', href: '', icon: CircleGauge },
  { label: 'Diagnóstico', href: 'diagnostico', icon: ClipboardCheck },
  { label: 'Plano', href: 'plano', icon: Target },
  { label: 'Ciclos', href: 'ciclos', icon: Route },
  { label: 'Rituais', href: 'rituais', icon: CalendarDays },
  { label: 'Scorecards', href: 'scorecards', icon: BarChart3 },
  { label: 'Evidências', href: 'evidencias', icon: FileArchive },
  { label: 'Documentos', href: 'documentos', icon: FileText },
  { label: 'Biblioteca', href: 'biblioteca', icon: FlaskConical },
]

export function AlquimiaShell({
  children,
  locale,
  session,
}: {
  children: React.ReactNode
  locale: string
  session: AlquimiaSession
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const base = `/${locale}/alquimia/space`
  const match = pathname.match(/\/space\/([^/]+)/)
  const engagementId = match && !PARTNER_SPACE_SEGMENTS.has(match[1])
    ? match[1]
    : null
  const engagement = engagementId ? getSpaceEngagement(engagementId) : null
  const items = engagementId ? engagementItems : partnerItems
  const navBase = engagementId ? `${base}/${engagementId}` : base

  async function logout() {
    await fetch('/api/alquimia/auth', { method: 'DELETE' })
    router.push(`${base}/login`)
    router.refresh()
  }

  function SidebarContent() {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <a href={`/${locale}/alquimia`} className="flex items-center gap-3">
            <AlquimiaMark />
            <div>
              <p className="text-[14px] tracking-[0.16em] text-white">ALQUEMIA</p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-white/35">
                transformation space
              </p>
            </div>
          </a>
        </div>

        {engagementId && (
          <div className="border-b border-white/10 p-3">
            <a
              href={base}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[11px] text-white/55 transition hover:bg-white/5 hover:text-white"
            >
              <span>Todos os clientes</span>
              <PanelLeftClose className="h-3.5 w-3.5" />
            </a>
            <div className="mt-1 rounded-lg bg-white/[0.06] px-3 py-3">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#E0CE7A]">Engagement</p>
              <p className="mt-1 text-[13px] font-medium text-white">{engagement?.name ?? engagementId}</p>
              <p className="mt-0.5 text-[10px] text-white/35">{engagement?.sector}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
            {engagementId ? 'Jornada' : 'Operação'}
          </p>
          {items.map(item => {
            const href = item.href.startsWith('#')
              ? `${base}${item.href}`
              : item.href
                ? `${navBase}/${item.href}`
                : navBase
            const active =
              item.href === ''
                ? pathname === navBase
                : !item.href.startsWith('#') && pathname.startsWith(href)
            return (
              <a
                key={item.label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] transition ${
                  active
                    ? 'bg-[#E0CE7A] text-[#002d3d]'
                    : 'text-white/50 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.7} />
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#AEADCC]/20 text-[10px] font-semibold text-[#AEADCC]">
              {session.name
                .split(' ')
                .map(part => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-white/75">{session.name}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/30">
                {session.role === 'client' ? 'Cliente' : 'Alquemia'}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Sair"
              className="rounded-md p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="alquimia-scope min-h-screen bg-[#F7F5ED] text-black">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 bg-[#002f42] lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          />
          <aside className="relative h-full w-[min(86vw,320px)] bg-[#002f42] shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg p-2 text-white/50 hover:bg-white/5"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black/[0.07] bg-[#F7F5ED]/90 px-4 backdrop-blur-xl sm:px-7 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-black/10 bg-white p-2"
            aria-label="Abrir menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-[12px] tracking-[0.16em] text-[#00435D]">ALQUEMIA</span>
          <ChevronDown className="h-4 w-4 text-black/30" />
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}

function AlquimiaMark() {
  return (
    <div className="relative h-8 w-8" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-[#E0CE7A]/60" />
      <div className="absolute left-1/2 top-1/2 h-px w-7 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#E0CE7A]" />
      <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#E0CE7A] bg-[#002f42]" />
    </div>
  )
}
