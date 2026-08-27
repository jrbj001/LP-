'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ArrowRight, ShieldAlert } from 'lucide-react'
import { Badge, PageHeader, PageShell, Reveal } from '@/components/adaptive/ui'
import {
  ANALOGIES,
  BOM,
  CURRENT_PILOT,
  DILIGENCE_FLAGS,
  DOCUMENTS,
  GTM,
  GOVERNANCE,
  HARDWARE_BOM,
  HARDWARE_CAVEAT,
  HARDWARE_TRACKS,
  HYBRID_LAYOUT,
  LAYER_EVENTS,
  META,
  MOAT,
  NEXT_STEPS,
  OCCUPANCY,
  OFFERS,
  POWER_BUDGET,
  RACK_A,
  RACK_B,
  ROADMAP,
  SCENARIOS,
  SEGMENTS,
  TEN_YEAR_TOTALS,
  VERDICT,
  brl,
  pct,
} from './data'
import {
  GtmFlowDiagram,
  HybridSiteDiagram,
  InferencePathDiagram,
  JvArchitectureDiagram,
  LayerStackDiagram,
  NetworkDiagram,
  PowerCoolingDiagram,
  RackIslandDiagram,
  ScenarioBarsDiagram,
  ServingStackDiagram,
  TwoSitesDiagram,
  CopyRoleDiagram,
} from './diagrams'

function Table({
  columns,
  rows,
}: {
  columns: string[]
  rows: Array<Array<string>>
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white">
      <table className="w-full text-left text-[12px]">
        <thead>
          <tr className="border-b border-black/[0.06] text-[10px] uppercase tracking-[0.12em] text-neutral-400">
            {columns.map(col => (
              <th key={col} className="px-4 py-3 font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.join('-')} className={i % 2 ? 'bg-black/[0.015]' : ''}>
              {row.map((cell, j) => (
                <td key={`${i}-${j}`} className="px-4 py-2.5 text-neutral-700 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function HomeView() {
  const locale = useLocale()
  const base = `/${locale}/datacenter`

  return (
    <PageShell>
      <Reveal>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] text-[12px] font-medium text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            JV Fundamentos × PixelPulseLab × Bravo
          </span>
          <span className="text-[12px] text-neutral-400">Jundiaí + Santos</span>
        </div>
      </Reveal>

      <PageHeader
        eyebrow={META.product}
        title="Colo edge. Ilha de inferência. Adaptive Layer™ no meio."
        subtitle={META.tagline}
      />

      <Reveal className="mb-10 rounded-2xl border border-black/[0.06] bg-neutral-900 p-6 text-white sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">Veredito</p>
        <p className="mt-3 text-[20px] font-light leading-snug tracking-[-0.03em]">{VERDICT.headline}</p>
        <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-white/55">{VERDICT.body}</p>
      </Reveal>

      <Reveal className="mb-10 grid gap-3 sm:grid-cols-3">
        {OFFERS.map(offer => (
          <article key={offer.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <Badge tone={offer.verdict === 'O encaixe' ? 'green' : offer.verdict === 'Manter' ? 'muted' : 'amber'}>
              {offer.verdict}
            </Badge>
            <h2 className="mt-3 text-[15px] font-semibold text-neutral-900">{offer.name}</h2>
            <p className="mt-1 text-[11px] text-neutral-400">{offer.who}</p>
            <p className="mt-3 text-[12px] leading-relaxed text-neutral-500">{offer.detail}</p>
          </article>
        ))}
      </Reveal>

      <Reveal className="mb-10">
        <HybridSiteDiagram />
      </Reveal>

      <Reveal className="mb-10">
        <JvArchitectureDiagram />
      </Reveal>

      <Reveal className="flex flex-wrap gap-3">
        <Link
          href={`${base}/hardware`}
          className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-[14px] font-medium text-white hover:bg-neutral-800"
        >
          Ver hardware
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
        <Link
          href={`${base}/blueprint`}
          className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] px-6 py-3 text-[14px] font-medium text-neutral-700 hover:bg-black/[0.02]"
        >
          Blueprint AI
        </Link>
        <Link
          href={`${base}/proposta`}
          className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] px-6 py-3 text-[14px] font-medium text-neutral-700 hover:bg-black/[0.02]"
        >
          Números da proposta atual
        </Link>
      </Reveal>
    </PageShell>
  )
}

export function PropostaView() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Proposta atual · Edge DC BR"
        title="O que os PDFs vendem hoje."
        subtitle="Colo IaaS em imóvel Bravo, 40 racks, R$ 17M de facility. Não é data center de AI. O memo de viabilidade e o deck não contam o mesmo payback."
      />

      <Reveal className="mb-10">
        <TwoSitesDiagram />
      </Reveal>

      <Reveal className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['40 racks', '20 Jundiaí + 20 Santos'],
          [brl(CURRENT_PILOT.capexFacility), 'CapEx de facility'],
          [brl(CURRENT_PILOT.ticketEffective), 'Ticket efetivo / rack / mês'],
          [brl(CURRENT_PILOT.anchor.annual), `${CURRENT_PILOT.anchor.name} · 12 racks`],
        ].map(([value, label]) => (
          <div key={label} className="rounded-xl border border-black/[0.06] bg-white p-5">
            <p className="text-[20px] font-semibold tracking-tight text-neutral-900">{value}</p>
            <p className="mt-1 text-[11px] text-neutral-400">{label}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="mb-10">
        <h2 className="mb-4 text-[15px] font-semibold text-neutral-900">Due diligence — não endossar o deck cego</h2>
        <div className="space-y-3">
          {DILIGENCE_FLAGS.map(flag => (
            <article key={flag.id} className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" strokeWidth={1.75} />
              <div>
                <p className="text-[13px] font-semibold text-amber-950">{flag.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-amber-900/80">{flag.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="mb-10">
        <h2 className="mb-4 text-[15px] font-semibold text-neutral-900">Ocupação e receita (memo 09/06/2026)</h2>
        <Table
          columns={['Ano', 'Racks', 'Ocupação', 'Receita']}
          rows={OCCUPANCY.map(row => [String(row.year), String(row.racks), pct(row.occupancy), brl(row.revenue)])}
        />
        <p className="mt-3 text-[12px] text-neutral-400">
          Receita 10 anos {brl(TEN_YEAR_TOTALS.revenue)} · EBITDA {brl(TEN_YEAR_TOTALS.ebitda)} · FCF após CapEx {brl(TEN_YEAR_TOTALS.fcfAfterCapex)}.
        </p>
      </Reveal>

      <Reveal className="mb-10">
        <h2 className="mb-4 text-[15px] font-semibold text-neutral-900">Segmentos no memo (share)</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {SEGMENTS.map(item => (
            <div key={item.name} className="flex justify-between rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-[12px]">
              <span className="text-neutral-700">{item.name}</span>
              <span className="font-medium text-neutral-900">{item.share}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <h2 className="mb-4 text-[15px] font-semibold text-neutral-900">Roadmap nacional no deck</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map(step => (
            <article key={step.phase} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">{step.phase}</p>
              <p className="mt-2 text-[22px] font-semibold text-neutral-900">{step.racks}</p>
              <p className="text-[11px] text-neutral-400">racks</p>
              <p className="mt-3 text-[12px] text-neutral-600">{step.where}</p>
              <p className="mt-1 text-[11px] text-neutral-400">{step.note}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </PageShell>
  )
}

export function BlueprintView() {
  const locale = useLocale()
  const base = `/${locale}/datacenter`

  return (
    <PageShell>
      <PageHeader
        eyebrow="Blueprint AI"
        title="36 racks telco. 2 a 4 racks densos."
        subtitle="A ilha de inferência cabe no piloto se a energia aguentar. Treino de foundation model não cabe. GPU é COGS do runtime Pixel, não o produto."
      />

      <Reveal className="mb-10">
        <HybridSiteDiagram />
      </Reveal>

      <Reveal className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          [`${HYBRID_LAYOUT.coloRacks} colo`, HYBRID_LAYOUT.densityColo],
          [`${HYBRID_LAYOUT.aiRacks} AI`, HYBRID_LAYOUT.densityAi],
          [`${HYBRID_LAYOUT.gpuCount} GPUs`, 'L40S / H100 NVL · inferência'],
        ].map(([value, label]) => (
          <div key={label} className="rounded-xl border border-black/[0.06] bg-white p-5">
            <p className="text-[18px] font-semibold text-neutral-900">{value}</p>
            <p className="mt-1 text-[11px] text-neutral-400">{label}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="mb-10 rounded-2xl border border-black/[0.06] bg-white p-5">
        <p className="text-[12px] font-medium text-neutral-900">Comercial da ilha</p>
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{HYBRID_LAYOUT.commercial}</p>
      </Reveal>

      <Reveal className="mb-10">
        <NetworkDiagram />
      </Reveal>

      <Reveal className="mb-10">
        <ServingStackDiagram />
      </Reveal>

      <Reveal className="space-y-3">
        {BOM.map((item, i) => (
          <article key={item.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h2 className="mt-1 text-[15px] font-semibold text-neutral-900">{item.title}</h2>
            <p className="mt-2 text-[13px] text-neutral-800">{item.spec}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">{item.note}</p>
          </article>
        ))}
      </Reveal>

      <Reveal className="mt-10">
        <Link
          href={`${base}/hardware`}
          className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-[14px] font-medium text-white hover:bg-neutral-800"
        >
          Especificações e desenho do hardware
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </Reveal>
    </PageShell>
  )
}

export function HardwareView() {
  const groups = Array.from(new Set(HARDWARE_BOM.map(item => item.group)))

  return (
    <PageShell>
      <PageHeader
        eyebrow="Hardware · ilha de inferência"
        title="Dois racks densos. Dezesseis GPUs. O resto é facility."
        subtitle={HARDWARE_CAVEAT}
      />

      <Reveal className="mb-8 grid gap-3 sm:grid-cols-2">
        {HARDWARE_TRACKS.map(track => (
          <article
            key={track.id}
            className={`rounded-2xl border p-5 ${track.recommended ? 'border-neutral-900 bg-white' : 'border-black/[0.06] bg-white'}`}
          >
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">{track.name}</p>
              {track.recommended && <Badge>Piloto</Badge>}
            </div>
            <p className="mt-2 text-[15px] font-semibold text-neutral-900">{track.gpu}</p>
            <p className="mt-1 text-[12px] text-neutral-500">{track.racks}</p>
            <dl className="mt-4 space-y-1 text-[12px] text-neutral-600">
              <div className="flex justify-between gap-3"><dt>IT</dt><dd className="font-medium text-neutral-900">{track.itKw}</dd></div>
              <div className="flex justify-between gap-3"><dt>Facility</dt><dd className="font-medium text-neutral-900">{track.facilityKw}</dd></div>
              <div className="flex justify-between gap-3"><dt>Cooling</dt><dd className="text-right">{track.cooling}</dd></div>
            </dl>
            <p className="mt-3 text-[12px] text-neutral-500">{track.capex}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">{track.use}</p>
          </article>
        ))}
      </Reveal>

      <Reveal className="mb-10">
        <RackIslandDiagram />
      </Reveal>

      <Reveal className="mb-10">
        <h2 className="mb-4 text-[15px] font-semibold text-neutral-900">Mapa de U</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['Rack A · GPU', RACK_A],
            ['Rack B · planta', RACK_B],
          ].map(([title, rows]) => (
            <div key={title as string} className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
              <p className="border-b border-black/[0.06] px-4 py-3 text-[12px] font-semibold text-neutral-900">{title as string}</p>
              <ul>
                {(rows as typeof RACK_A).map(slot => (
                  <li key={slot.u} className="flex justify-between gap-3 border-b border-black/[0.04] px-4 py-2 text-[12px] last:border-0">
                    <span className="font-mono text-[11px] text-neutral-400">U {slot.u}</span>
                    <span className="text-right text-neutral-700">{slot.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mb-10">
        <h2 className="mb-4 text-[15px] font-semibold text-neutral-900">Lista de componentes</h2>
        {groups.map(group => (
          <div key={group} className="mb-6">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">{group}</p>
            <div className="space-y-2">
              {HARDWARE_BOM.filter(item => item.group === group).map(item => (
                <article key={item.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[14px] font-semibold text-neutral-900">{item.name}</h3>
                    <span className="text-[11px] text-neutral-400">{item.qty}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-neutral-800">{item.spec}</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">{item.note}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </Reveal>

      <Reveal className="mb-10">
        <h2 className="mb-4 text-[15px] font-semibold text-neutral-900">Orçamento de potência</h2>
        <Table
          columns={['Linha', 'Pista L40S', 'Pista H100']}
          rows={POWER_BUDGET.map(row => [row.line, row.l40s, row.h100])}
        />
        <p className="mt-3 text-[12px] text-neutral-400">
          Colo clássico 5–8 kW/rack. Quatro racks AI no teto (40–80 kW) podem superar os 36 de colo. Validar no imóvel.
        </p>
      </Reveal>

      <Reveal className="mb-10">
        <PowerCoolingDiagram />
      </Reveal>

      <Reveal className="mb-10">
        <NetworkDiagram />
      </Reveal>

      <Reveal>
        <ServingStackDiagram />
      </Reveal>
    </PageShell>
  )
}

export function InvestimentoView() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Investimento"
        title="Três cenários. Só o híbrido entra no piloto."
        subtitle="Faixas, não planilha fingida. Sem estudo elétrico dos imóveis, o BOM de GPU continua aberto."
      />

      <Reveal className="mb-10">
        <ScenarioBarsDiagram />
      </Reveal>

      <div className="space-y-4">
        {SCENARIOS.map(scenario => (
          <Reveal key={scenario.id}>
            <article className={`rounded-2xl border p-6 ${
              scenario.recommended ? 'border-neutral-900 bg-white' : 'border-black/[0.06] bg-white'
            }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                  Cenário {scenario.id}
                </span>
                {scenario.recommended && <Badge>Recomendado</Badge>}
              </div>
              <h2 className="mt-2 text-[20px] font-semibold tracking-tight text-neutral-900">{scenario.name}</h2>
              <p className="mt-1 text-[22px] font-light text-neutral-900">{scenario.capex}</p>
              <p className="mt-1 text-[12px] text-neutral-500">{scenario.capexNote}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <p className="text-[12px] leading-relaxed text-neutral-600"><span className="font-medium text-neutral-900">Receita. </span>{scenario.revenue}</p>
                <p className="text-[12px] leading-relaxed text-neutral-600"><span className="font-medium text-neutral-900">Payback. </span>{scenario.payback}</p>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-neutral-500">{scenario.use}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        <h2 className="mb-4 text-[15px] font-semibold text-neutral-900">Próximos passos (não comprar GPU ainda)</h2>
        <ol className="space-y-2">
          {NEXT_STEPS.map((step, i) => (
            <li key={step} className="flex gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-[13px] text-neutral-700">
              <span className="font-mono text-[11px] text-neutral-400">{String(i + 1).padStart(2, '0')}</span>
              {step}
            </li>
          ))}
        </ol>
      </Reveal>
    </PageShell>
  )
}

export function LayerView() {
  const locale = useLocale()
  const base = `/${locale}/datacenter`

  return (
    <PageShell>
      <PageHeader
        eyebrow="Adaptive Layer™ × hardware"
        title="O DC vira mais uma fonte. O gateway vende o runtime."
        subtitle="Hoje a Layer conecta ERP/WMS/CRM e só então sobe agentes (QW → Layer → IA). O data center entra na mesma fila de eventos — telemetria de facility e inferência no edge. Pixel não compete com Fundamentos em HVAC. Pixel compete no plano de controle e na venda B2B do software."
      />

      <Reveal className="mb-10">
        <LayerStackDiagram />
      </Reveal>

      <Reveal className="mb-10">
        <InferencePathDiagram />
      </Reveal>

      <Reveal className="mb-10 grid gap-3 sm:grid-cols-2">
        {LAYER_EVENTS.map(item => (
          <article key={item.name} className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <h2 className="text-[15px] font-semibold text-neutral-900">{item.name}</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">{item.detail}</p>
          </article>
        ))}
      </Reveal>

      <Reveal className="rounded-2xl border border-black/[0.06] bg-white p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">GTM B2B soberano</p>
        <p className="mt-3 text-[14px] leading-relaxed text-neutral-700">{GTM.sva}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">
          Primeiro workload: um cliente Pixel já em casa, dado residente no Brasil, SLA de latência do edge. Sem isso a ilha vira GPU ociosa.
        </p>
        <Link
          href={`${base}/gtm`}
          className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-neutral-900"
        >
          Ver motion comercial
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </Reveal>
    </PageShell>
  )
}

export function MercadoView() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Mercado"
        title="Copiar o papel, não a escala."
        subtitle="Moat local é latência, Eletronet e LGPD. Não há moat de preço de H100 contra a AWS São Paulo."
      />

      <Reveal className="mb-10">
        <CopyRoleDiagram />
      </Reveal>

      <Reveal className="mb-10 space-y-3">
        {ANALOGIES.map(item => (
          <article key={item.name} className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold text-neutral-900">{item.name}</h2>
              <Badge tone="muted">{item.copyWhat}</Badge>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{item.copy}</p>
          </article>
        ))}
      </Reveal>

      <Reveal className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">Moat</p>
          <ul className="mt-3 space-y-2 text-[13px] text-neutral-700">
            {MOAT.have.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">Sem moat</p>
          <ul className="mt-3 space-y-2 text-[13px] text-neutral-700">
            {MOAT.lack.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </Reveal>
    </PageShell>
  )
}

export function GtmView() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Go-to-market"
        title="Eletronet fica. O SVA deixa de ser 20% genérico."
        subtitle={GTM.keep}
      />

      <Reveal className="mb-8">
        <GtmFlowDiagram />
      </Reveal>

      <Reveal className="mb-8 rounded-2xl border border-black/[0.06] bg-white p-6">
        <p className="text-[13px] leading-relaxed text-neutral-600">{GTM.sva}</p>
      </Reveal>

      <Reveal>
        <ol className="space-y-3">
          {GTM.motion.map((step, i) => (
            <li key={step} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-800">{step}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </PageShell>
  )
}

export function GovernancaView() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Governança"
        title="Quatro papéis. Um piloto."
        subtitle="Bravo detém o imóvel. Fundamentos engenha. Edge DC BR opera colo. Pixel opera o runtime."
      />

      <Reveal className="mb-10">
        <JvArchitectureDiagram />
      </Reveal>

      <Reveal className="mb-10 grid gap-3 sm:grid-cols-2">
        {GOVERNANCE.entities.map(entity => (
          <article key={entity.name} className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <h2 className="text-[15px] font-semibold text-neutral-900">{entity.name}</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">{entity.role}</p>
          </article>
        ))}
      </Reveal>

      <Reveal className="mb-10">
        <h2 className="mb-4 text-[15px] font-semibold text-neutral-900">Sponsors no deck</h2>
        <div className="space-y-2">
          {GOVERNANCE.sponsors.map(person => (
            <div key={person.name} className="rounded-xl border border-black/[0.06] bg-white px-4 py-3">
              <p className="text-[13px] font-medium text-neutral-900">{person.name}</p>
              <p className="text-[12px] text-neutral-500">{person.detail}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {GOVERNANCE.org.map(seat => (
          <article key={seat.seat} className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <p className="text-[13px] font-semibold text-neutral-900">{seat.seat}</p>
            <ul className="mt-3 space-y-1 text-[12px] text-neutral-500">
              {seat.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </Reveal>
    </PageShell>
  )
}

export function DocumentosView() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Documentos"
        title="Os dois PDFs da tese original."
        subtitle={CURRENT_PILOT.sources.join(' · ')}
      />

      <div className="space-y-3">
        {DOCUMENTS.map(doc => (
          <a
            key={doc.href}
            href={doc.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-start justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 transition hover:border-neutral-900/20"
          >
            <div>
              <p className="text-[14px] font-semibold text-neutral-900">{doc.name}</p>
              <p className="mt-1 text-[12px] text-neutral-500">{doc.detail}</p>
            </div>
            <span className="shrink-0 text-[11px] text-neutral-400">{doc.date}</span>
          </a>
        ))}
      </div>
    </PageShell>
  )
}
