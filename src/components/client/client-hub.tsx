'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import type { ClientWorkspace } from '@/lib/client/types'

const STATUS_LABEL: Record<ClientWorkspace['status'], string> = {
  pilot: 'Piloto',
  active: 'Ativo',
}

export function ClientHub({ clients }: { clients: ClientWorkspace[] }) {
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900">
      <header className="border-b border-black/[0.06] bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-[960px] px-6 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-[14px] font-semibold tracking-[-0.03em]">
            PixelPulseLab
            <span className="font-mono font-normal text-neutral-400">.dev</span>
          </Link>
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Área do Cliente
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-6 pt-16 pb-24">
        <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-4">
          Workspaces
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.04em] text-neutral-900 max-w-2xl leading-[1.08]">
          Portal do Cliente
        </h1>
        <p className="mt-4 text-[16px] text-neutral-500 max-w-xl leading-relaxed">
          Acesse o workspace do seu engajamento com a PixelPulseLab — onboarding, documentação e
          acompanhamento em um só lugar.
        </p>

        <div className="mt-12 grid gap-4">
          {clients.map(client => (
            <Link
              key={client.id}
              href={`/${locale}/client/${client.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white px-6 py-6 hover:border-black/[0.12] transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: client.accent }}
                  />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    {STATUS_LABEL[client.status]} · {client.sector}
                  </span>
                </div>
                <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-neutral-900">
                  {client.name}
                </h2>
                <p className="mt-1.5 text-[14px] text-neutral-500 leading-relaxed max-w-xl">
                  {client.tagline}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-full bg-neutral-900 text-white text-[13px] font-medium group-hover:bg-neutral-800 transition-colors">
                Entrar
              </span>
            </Link>
          ))}

          {clients.length === 0 && (
            <p className="text-[14px] text-neutral-400 py-10 text-center">
              Nenhum workspace disponível no momento.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
