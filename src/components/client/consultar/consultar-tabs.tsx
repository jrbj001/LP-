import Link from 'next/link'
import { Network, Search } from 'lucide-react'

export type ConsultarTab = 'perguntar' | 'modelagem'

export function ConsultarTabs({ base, active }: { base: string; active: ConsultarTab }) {
  const tabs = [
    { id: 'perguntar' as const, label: 'Perguntar', href: `${base}/consultar`, icon: Search },
    {
      id: 'modelagem' as const,
      label: 'Modelagem de dados',
      href: `${base}/consultar/modelagem`,
      icon: Network,
    },
  ]
  return (
    <nav
      aria-label="Seções do Consultar"
      className="mb-6 inline-flex rounded-xl border border-black/[0.06] bg-[#fbfbfa] p-1"
    >
      {tabs.map(tab => {
        const selected = tab.id === active
        const Icon = tab.icon
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={selected ? 'page' : undefined}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12px] font-medium transition-colors ${
              selected
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-500 hover:bg-black/[0.035] hover:text-neutral-900'
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${selected ? 'text-teal-300' : 'text-neutral-400'}`} strokeWidth={1.75} />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
