import type { ClientWorkspace } from '@/lib/client/types'
import type { DeliveryTeaser } from '@/lib/delivery/teaser'
import { DeliveryHighlight } from '@/components/client/delivery-highlight'
import { Onboarding } from '@/components/client/onboarding'
import { DocsPortal } from '@/components/client/docs-portal'

type Props = {
  client: ClientWorkspace
  locale: string
  deliveryTeaser?: DeliveryTeaser | null
}

export function ClientHome({ client, locale, deliveryTeaser }: Props) {
  const hasDelivery = Boolean(client.delivery?.repos.length)
  const entregasHref = `/${locale}/client/${client.slug}/entregas?periodo=90`

  return (
    <>
      <section id="inicio" className="scroll-mt-20">
        <div className="mx-auto max-w-[1120px] px-6 pt-14 sm:pt-20 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: client.accent }}
            />
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-neutral-400">
              {client.status === 'pilot' ? 'Piloto' : 'Ativo'} · {client.sector}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.04em] max-w-3xl leading-[1.05] text-neutral-900">
            {client.name}
          </h1>
          <p className="mt-5 text-[16px] sm:text-[17px] text-neutral-500 max-w-xl leading-relaxed">
            {client.tagline}
          </p>

          {hasDelivery && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={entregasHref}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: client.accent }}
              >
                Ver entregas
                <span aria-hidden>→</span>
              </a>
              <a
                href="#onboarding"
                className="inline-flex items-center rounded-full border border-black/[0.08] bg-white px-5 py-2.5 text-[14px] font-medium text-neutral-700 hover:border-black/[0.14] transition-colors"
              >
                Onboarding
              </a>
            </div>
          )}

          <DeliveryHighlight client={client} locale={locale} teaser={deliveryTeaser} />

          <div className="flex flex-wrap gap-8 mt-10">
            {client.stats.map(stat => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-2xl font-semibold tracking-tight text-neutral-900">
                  {stat.value}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {client.contacts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-black/[0.05]">
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-4">
                Contatos
              </p>
              <div className="flex flex-wrap gap-6">
                {client.contacts.map(c => (
                  <div key={c.name}>
                    <p className="text-[14px] font-medium text-neutral-900">{c.name}</p>
                    <p className="text-[12px] text-neutral-500 mt-0.5">{c.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Onboarding client={client} />
      <DocsPortal client={client} />
    </>
  )
}
