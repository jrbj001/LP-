'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import type { ClientWorkspace } from '@/lib/client/types'
import { isBacklogEnabled } from '@/lib/backlog/access'

const NAV_ITEMS = [
  { path: '', label: 'Visão geral' },
  { path: '/reunioes', label: 'Reuniões' },
  { path: '/documentos', label: 'Documentos' },
  { path: '/projetos', label: 'Projetos' },
  { path: '/backlog', label: 'Backlog' },
  { path: '/entregas', label: 'Entregas' },
] as const

const SHELL_X = 'px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14'
const SHELL_MAX = 'max-w-[1120px]'
const SHELL_WIDE = 'max-w-none w-full'

export function ClientShell({
  client,
  children,
}: {
  client: ClientWorkspace
  children: React.ReactNode
}) {
  const locale = useLocale()
  const pathname = usePathname()
  const base = `/${locale}/client/${client.slug}`
  const wide = pathname.endsWith('/entregas') || pathname.includes('/backlog')
  const shellWidth = wide ? SHELL_WIDE : `${SHELL_MAX} mx-auto w-full`
  const navItems = NAV_ITEMS.filter(item => item.path !== '/backlog' || isBacklogEnabled(client.slug))

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900 antialiased">
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#fbfbfa]/90 backdrop-blur-xl">
        <div className={`${shellWidth} ${SHELL_X} h-14 flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/${locale}/client`}
              className="text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
            >
              Portal
            </Link>
            <span className="text-neutral-300">/</span>
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: client.accent }}
              />
              <span className="text-[14px] font-semibold tracking-[-0.02em] truncate">
                {client.name}
              </span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(a => {
              const href = `${base}${a.path}`
              const active = a.path ? pathname.startsWith(href) : pathname === base || pathname === `${base}/`
              return (
                <Link
                  key={a.label}
                  href={href}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors ${
                    active
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.04]'
                  }`}
                >
                  {a.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <nav className="sm:hidden flex gap-1 px-4 pb-3 overflow-x-auto">
          {navItems.map(a => {
            const href = `${base}${a.path}`
            const active = a.path ? pathname.startsWith(href) : pathname === base || pathname === `${base}/`
            return (
              <Link
                key={a.label}
                href={href}
                className={`shrink-0 px-3 py-1.5 text-[12px] font-medium rounded-full ${
                  active
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 border border-black/[0.06] bg-white'
                }`}
              >
                {a.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className={`${shellWidth} w-full ${wide ? SHELL_X : ''}`}>{children}</main>

      <footer className="border-t border-black/[0.06] mt-8">
        <div className={`${shellWidth} ${SHELL_X} py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
          <p className="text-[12px] text-neutral-400">
            PixelPulseLab · workspace {client.name}
          </p>
          <a
            href={`mailto:${client.docs.supportEmail}`}
            className="text-[12px] text-neutral-500 hover:text-neutral-800 underline underline-offset-2"
          >
            {client.docs.supportEmail}
          </a>
        </div>
      </footer>
    </div>
  )
}
