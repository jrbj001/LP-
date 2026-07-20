import Link from 'next/link'
import type { DeliveryTeaser } from '@/lib/delivery/teaser'
import type { ClientWorkspace } from '@/lib/client/types'

type Props = {
  client: ClientWorkspace
  locale: string
  teaser?: DeliveryTeaser | null
}

function fmt(n: number): string {
  return n.toLocaleString('pt-BR')
}

export function DeliveryHighlight({ client, locale, teaser }: Props) {
  if (!client.delivery?.repos.length) return null

  const href = `/${locale}/client/${client.slug}/entregas?periodo=90`
  const accent = client.accent

  return (
    <section id="entregas" className="mt-10 sm:mt-12 scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-neutral-950 text-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.45)]">
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl opacity-40"
          style={{ backgroundColor: accent }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accent }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 p-7 sm:p-9 lg:p-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-white/70"
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                Relatório ao vivo
              </span>
              <span className="text-[11px] text-white/40">GitHub · 30 / 60 / 90 dias</span>
            </div>

            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-semibold tracking-[-0.03em] leading-[1.08] text-white max-w-2xl">
              Veja o que já entregamos{' '}
              <span className="text-white/55">com números, gráficos e roadmap.</span>
            </h2>
            <p className="mt-4 text-[15px] sm:text-[16px] text-white/60 leading-relaxed max-w-xl">
              Pull requests mescladas, estimativa de esforço, KPIs de negócio, mix feat/bug/evolução e
              linha do tempo — tudo atualizado a partir do histórico real dos repositórios.
            </p>

            {teaser && (
              <div className="mt-7 flex flex-wrap gap-3 sm:gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 min-w-[120px]">
                  <p className="text-[22px] font-bold tabular-nums leading-none">{fmt(teaser.prs)}</p>
                  <p className="mt-1.5 text-[10px] font-mono uppercase tracking-wider text-white/45">
                    PRs · 90 dias
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 min-w-[120px]">
                  <p className="text-[22px] font-bold tabular-nums leading-none">~{fmt(teaser.hours)}h</p>
                  <p className="mt-1.5 text-[10px] font-mono uppercase tracking-wider text-white/45">
                    Esforço estimado
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 min-w-[120px]">
                  <p className="text-[22px] font-bold tabular-nums leading-none">{teaser.repos}</p>
                  <p className="mt-1.5 text-[10px] font-mono uppercase tracking-wider text-white/45">
                    Repositórios
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {['KPIs', 'Gráficos', 'Roadmap', 'Análise IA'].map(label => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/55"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end lg:items-end gap-4 lg:min-w-[220px]">
            <Link
              href={href}
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-[15px] font-semibold text-neutral-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              Abrir relatório de entregas
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
            <p className="text-[12px] text-white/40 lg:text-right">
              Dados do git log · cache local · refresh sob demanda
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
