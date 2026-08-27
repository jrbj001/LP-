'use client'

import { ArrowDown, ArrowRight } from 'lucide-react'
import { GOVERNANCE, HARDWARE_TRACKS, HYBRID_LAYOUT, SCENARIOS } from './data'

function Frame({
  title,
  caption,
  children,
}: {
  title: string
  caption?: string
  children: React.ReactNode
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
      <figcaption className="px-5 pt-5 text-[13px] font-semibold text-neutral-900">{title}</figcaption>
      <div className="px-3 pb-4 pt-4 sm:px-5">{children}</div>
      {caption && (
        <p className="px-5 pb-5 text-[11px] leading-relaxed text-neutral-400">{caption}</p>
      )}
    </figure>
  )
}

function Chip({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={`rounded-lg px-3 py-2 text-center text-[11px] font-medium leading-snug ${
        dark ? 'bg-neutral-900 text-white' : 'border border-black/[0.08] bg-[#fafaf8] text-neutral-700'
      }`}
    >
      {children}
    </div>
  )
}

function FlowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <ArrowDown className="h-3.5 w-3.5 text-neutral-300" strokeWidth={2} />
      <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">{children}</span>
    </div>
  )
}

export function HybridSiteDiagram() {
  return (
    <Frame
      title="Planta do site piloto"
      caption="Um hall. Colo telco continua 5–8 kW a ar. A ilha fica em gaiola, com potência e líquido próprios. Meet-me Eletronet não muda."
    >
      <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
          Jundiaí ou Santos · {HYBRID_LAYOUT.coloRacks} colo + {HYBRID_LAYOUT.aiRacks} AI
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="flex h-7 items-center justify-center rounded-md border border-black/[0.06] bg-white text-[8px] text-neutral-400"
                title={`Colo ${i + 1}`}
              >
                {i < 12 ? 'E' : ''}
              </div>
            ))}
          </div>
          <div className="flex min-w-[140px] flex-col gap-1.5 rounded-xl border border-neutral-900 bg-neutral-900 p-3 text-white">
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/40">Gaiola AI</p>
            <div className="grid grid-cols-2 gap-1.5">
              {['GPU-1', 'GPU-2', 'CDU', 'Ctrl'].map(label => (
                <div key={label} className="rounded-md bg-white/10 px-2 py-2 text-center text-[10px] font-medium">
                  {label}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/45">16 GPUs · líquido</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-neutral-500">
          <span className="rounded-full border border-black/[0.06] bg-white px-2 py-1">E = Eletronet (12 racks)</span>
          <span className="rounded-full border border-black/[0.06] bg-white px-2 py-1">Meet-me · IX · NIC.BR</span>
          <span className="rounded-full border border-black/[0.06] bg-white px-2 py-1">&lt;10 ms capital</span>
        </div>
      </div>
    </Frame>
  )
}

const KIND_FILL: Record<string, string> = {
  gpu: '#171717',
  net: '#404040',
  cool: '#d97706',
  power: '#737373',
  ctrl: '#262626',
  storage: '#525252',
  ops: '#a3a3a3',
}

function RackSvg({
  name,
  slots,
  x,
}: {
  name: string
  slots: { u: string; label: string; y: number; h: number; kind: string }[]
  x: number
}) {
  return (
    <g>
      <rect x={x} y={8} width={150} height={404} rx={10} fill="#fff" stroke="#e5e5e5" />
      <rect x={x} y={8} width={150} height={28} rx={10} fill="#171717" />
      <rect x={x} y={24} width={150} height={12} fill="#171717" />
      <text x={x + 75} y={27} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
        {name}
      </text>
      {slots.map(slot => (
        <g key={`${name}-${slot.label}`}>
          <rect
            x={x + 10}
            y={slot.y}
            width={130}
            height={slot.h}
            rx={5}
            fill={KIND_FILL[slot.kind] ?? '#737373'}
          />
          <text x={x + 75} y={slot.y + slot.h / 2 + 4} textAnchor="middle" fill="#fff" fontSize="9">
            {slot.label}
          </text>
          <text x={x + 16} y={slot.y + 12} fill="rgba(255,255,255,0.55)" fontSize="7">
            U {slot.u}
          </text>
        </g>
      ))}
      <rect x={x} y={400} width={150} height={12} rx={4} fill="#f5f5f4" stroke="#e5e5e5" />
    </g>
  )
}

export function RackIslandDiagram() {
  const rackA = [
    { u: '41–42', label: 'PDU A+B', y: 46, h: 28, kind: 'power' },
    { u: '39–40', label: 'ToR 400G / IB', y: 80, h: 32, kind: 'net' },
    { u: '37–38', label: 'ToR 100G', y: 118, h: 28, kind: 'net' },
    { u: '27–34', label: 'GPU-2 · 8×', y: 156, h: 72, kind: 'gpu' },
    { u: '17–24', label: 'GPU-1 · 8×', y: 236, h: 72, kind: 'gpu' },
    { u: '09–12', label: 'Manifold DLC', y: 318, h: 36, kind: 'cool' },
    { u: '01–04', label: 'Leak + cabos', y: 362, h: 28, kind: 'ops' },
  ]
  const rackB = [
    { u: '41–42', label: 'PDU A+B', y: 46, h: 28, kind: 'power' },
    { u: '33–40', label: 'CDU', y: 80, h: 56, kind: 'cool' },
    { u: '29–32', label: 'Object store', y: 144, h: 40, kind: 'storage' },
    { u: '21–24', label: 'Control plane 2', y: 192, h: 40, kind: 'ctrl' },
    { u: '17–20', label: 'Control plane 1', y: 240, h: 40, kind: 'ctrl' },
    { u: '09–12', label: 'OOB / DCIM', y: 318, h: 36, kind: 'ops' },
    { u: '01–04', label: 'Spare (expansão)', y: 362, h: 28, kind: 'ops' },
  ]

  return (
    <Frame
      title="Elevação da ilha — todos os componentes"
      caption="Dois racks ativos no piloto. Dois U-space reservados no hall. GPU-1 e GPU-2 somam 16 placas. CDU só entra se a pista for DLC; na pista L40S o rear-door substitui o bloco âmbar."
    >
      <div className="overflow-x-auto">
        <svg viewBox="0 0 640 470" className="h-auto w-full min-w-[520px]" role="img" aria-label="Elevação dos dois racks da ilha de inferência">
          <RackSvg name="Rack A · GPU" slots={rackA} x={24} />
          <RackSvg name="Rack B · planta" slots={rackB} x={196} />

          <rect x={380} y={46} width={236} height={120} rx={10} fill="#fafaf8" stroke="#e5e5e5" />
          <text x={498} y={70} textAnchor="middle" fontSize="10" fill="#a3a3a3">FACILITY (NÃO É GPU)</text>
          <text x={498} y={96} textAnchor="middle" fontSize="12" fill="#171717" fontWeight="600">UPS N+1 · CRAH · meet-me</text>
          <text x={498} y={118} textAnchor="middle" fontSize="11" fill="#737373">Eletronet · IX · NIC.BR</text>
          <text x={498} y={140} textAnchor="middle" fontSize="11" fill="#737373">Estudo ≥500 kW IT</text>

          <path d="M174 96 H380" stroke="#a3a3a3" strokeWidth="1.2" fill="none" />
          <path d="M346 96 H380" stroke="#a3a3a3" strokeWidth="1.2" fill="none" />
          <text x={360} y={90} fontSize="8" fill="#a3a3a3">100G</text>

          <rect x={380} y={186} width={236} height={90} rx={10} fill="#171717" />
          <text x={498} y={214} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)">LOOP TÉRMICO</text>
          <text x={498} y={238} textAnchor="middle" fontSize="12" fill="#fff" fontWeight="600">CDU ⇄ cold plates</text>
          <text x={498} y={258} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)">ou rear-door ⇄ CRAH</text>
          <path d="M346 340 C 360 340, 360 230, 380 230" stroke="#d97706" strokeWidth="1.6" fill="none" />

          <rect x={380} y={292} width={236} height={108} rx={10} fill="#fff" stroke="#e5e5e5" />
          <text x={498} y={316} textAnchor="middle" fontSize="10" fill="#a3a3a3">SOFTWARE NO RACK</text>
          <text x={498} y={340} textAnchor="middle" fontSize="12" fill="#171717" fontWeight="600">K8s · vLLM/NIM · Layer</text>
          <text x={498} y={362} textAnchor="middle" fontSize="11" fill="#737373">Auth · tenant · LGPD · PUE</text>
          <text x={498} y={380} textAnchor="middle" fontSize="11" fill="#737373">R$/1k tokens — não GPU-hora</text>
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 px-1">
        {[
          ['GPU', '#171717'],
          ['Rede', '#404040'],
          ['Líquido', '#d97706'],
          ['Energia', '#737373'],
          ['Ctrl / storage', '#262626'],
        ].map(([label, color]) => (
          <span key={label} className="inline-flex items-center gap-1.5 text-[10px] text-neutral-500">
            <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </Frame>
  )
}

export function PowerCoolingDiagram() {
  return (
    <Frame
      title="Energia e térmico"
      caption="Quatro racks a 40–80 kW podem gastar mais que os 36 de colo. O dia 1 da pista L40S é ~20–27 kW de facility — ainda assim precisa de feed dedicado e N+1."
    >
      <div className="grid gap-2 sm:grid-cols-4">
        {['Utility / transformador', 'UPS N+1 + ATS', 'PDU 3φ A+B', 'IT 14–40 kW'].map((step, i) => (
          <div key={step} className="relative">
            <Chip dark={i === 3}>{step}</Chip>
            {i < 3 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-neutral-300 sm:block" strokeWidth={2} />
            )}
          </div>
        ))}
      </div>
      <FlowLabel>calor sai por um destes caminhos</FlowLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">Pista L40S</p>
          <p className="mt-2 text-[13px] font-semibold text-neutral-900">Rear-door ⇄ CRAH</p>
          <p className="mt-1 text-[12px] text-neutral-500">20–27 kW facility. Cabe em água gelada de colo se o estudo confirmar.</p>
        </div>
        <div className="rounded-xl bg-neutral-900 p-4 text-white">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">Pista H100</p>
          <p className="mt-2 text-[13px] font-semibold">DLC · CDU ⇄ cold plate</p>
          <p className="mt-1 text-[12px] text-white/55">40–60 kW facility. Sem líquido, não compra a placa.</p>
        </div>
      </div>
    </Frame>
  )
}

export function NetworkDiagram() {
  return (
    <Frame
      title="Rede: duas malhas, um meet-me"
      caption="East-west de GPU nunca mistura com o anel telco. O cliente continua no IX; o serving só usa a fabric para tensor parallel."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Cliente / telco</p>
          <div className="mt-3 space-y-1.5">
            {['Eletronet', 'ISPs / 5G', 'IX · NIC.BR', 'Anel do deck'].map(item => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">North-south</p>
          <div className="mt-3 space-y-1.5">
            <Chip>Leaf 100 GbE</Chip>
            <Chip>Firewall / LB</Chip>
            <Chip dark>Adaptive Layer</Chip>
          </div>
        </div>
        <div className="rounded-xl bg-neutral-900 p-4 text-white">
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">East-west · ilha</p>
          <div className="mt-3 space-y-1.5">
            {['Leaf 400G / IB', 'GPU-1 8×', 'GPU-2 8×', 'NVMe / object'].map(item => (
              <div key={item} className="rounded-lg bg-white/10 px-3 py-2 text-center text-[11px] font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  )
}

export function ServingStackDiagram() {
  return (
    <Frame
      title="Stack de serving"
      caption="Pixel opera da Layer para cima. Fundamentos opera da PDU para baixo. Kubernetes é a costura."
    >
      {[
        { label: 'Contrato B2B', items: ['R$/agente/mês', 'R$/1k tokens', 'SLA LGPD'] },
        { label: 'Adaptive Layer™', items: ['Auth / tenant', 'Auditoria', 'PUE · kW · °C'] },
        { label: 'Serving', items: ['vLLM / NIM', 'KServe', 'Fila por tenant'] },
        { label: 'Orquestração', items: ['Kubernetes', 'GPU operator', 'Observabilidade'] },
        { label: 'Hardware', items: ['16 GPU', 'NVMe', 'Fabric 400G'] },
      ].map((row, i) => (
        <div key={row.label}>
          <div className={`rounded-xl p-4 ${i === 1 ? 'bg-neutral-900 text-white' : 'border border-black/[0.06] bg-[#fafaf8]'}`}>
            <p className={`text-[10px] uppercase tracking-[0.14em] ${i === 1 ? 'text-white/40' : 'text-neutral-400'}`}>
              {row.label}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {row.items.map(item => (
                <span
                  key={item}
                  className={`rounded-md px-2 py-1 text-[11px] ${
                    i === 1 ? 'bg-white/10 text-white' : 'bg-white text-neutral-700'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          {i < 4 && <FlowLabel>{i === 3 ? 'COGS' : 'empilha'}</FlowLabel>}
        </div>
      ))}
    </Frame>
  )
}

export function LayerStackDiagram() {
  return (
    <Frame
      title="Adaptive Layer no rack"
      caption="O mesmo desenho QW → Layer → IA, agora com o data center como fonte. Facility emite eventos; o gateway isola tenant; o agente aponta para Jundiaí/Santos."
    >
      <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
        Fontes que a Layer já conecta
      </p>
      <div className="mb-1 flex flex-wrap justify-center gap-2">
        {['ERP', 'WMS', 'CRM', 'Facility PUE/kW/°C', 'Occupancy'].map(item => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>
      <FlowLabel>conectores · sem redigitação</FlowLabel>
      <div className="rounded-2xl bg-neutral-900 p-5 text-white">
        <p className="text-center text-[15px] font-semibold">Adaptive Layer™</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['Auth / tenant', 'Inference gateway', 'Auditoria LGPD', 'Cadence NOC'].map(item => (
            <div key={item} className="rounded-lg bg-white/[0.07] px-2 py-3 text-center text-[11px] text-white/80">
              {item}
            </div>
          ))}
        </div>
      </div>
      <FlowLabel>runtime no edge, não só API pública</FlowLabel>
      <div className="grid gap-2 sm:grid-cols-3">
        {['vLLM / NIM na ilha', 'Agente Orfeu / Banana', 'Contrato software'].map(item => (
          <Chip key={item} dark={item.startsWith('Contrato')}>{item}</Chip>
        ))}
      </div>
    </Frame>
  )
}

export function InferencePathDiagram() {
  const steps = [
    { n: '01', t: 'Cliente B2B', d: 'Prompt no produto Pixel' },
    { n: '02', t: 'Layer', d: 'Auth, tenant, política LGPD' },
    { n: '03', t: 'KServe / vLLM', d: 'Fila na ilha, 16 GPUs' },
    { n: '04', t: 'Resposta + log', d: 'Dado não sai do Brasil' },
  ]
  return (
    <Frame title="Caminho de uma inferência" caption="Latência do edge (<10 ms até a capital) + residência. GPU-hora não aparece na fatura.">
      <div className="grid gap-2 sm:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.n} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-3">
            <p className="font-mono text-[10px] text-neutral-400">{step.n}</p>
            <p className="mt-1 text-[13px] font-semibold text-neutral-900">{step.t}</p>
            <p className="mt-1 text-[11px] text-neutral-500">{step.d}</p>
            {i < steps.length - 1 && (
              <p className="mt-2 hidden text-[10px] text-neutral-300 sm:block">→</p>
            )}
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function JvArchitectureDiagram() {
  return (
    <Frame
      title="Quem opera o quê"
      caption="Pixel não compete em HVAC. Fundamentos não vende token. Bravo não opera GPU."
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {GOVERNANCE.entities.map(entity => (
          <div key={entity.name} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
            <p className="text-[13px] font-semibold text-neutral-900">{entity.name}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">{entity.role}</p>
          </div>
        ))}
      </div>
      <FlowLabel>um site, quatro contratos</FlowLabel>
      <div className="grid grid-cols-3 gap-2 text-center">
        <Chip>Imóvel + energia</Chip>
        <Chip>Facility + colo</Chip>
        <Chip dark>Runtime + SVA</Chip>
      </div>
    </Frame>
  )
}

export function GtmFlowDiagram() {
  return (
    <Frame title="Motion comercial" caption="Eletronet não se mexe. A ilha só liga depois do estudo. Site 2 é cópia, não aposta paralela.">
      <div className="grid gap-2 sm:grid-cols-4">
        {[
          ['Colo âncora', '12 racks Eletronet'],
          ['Estudo kW/HVAC', 'bloqueia o BOM'],
          ['1º workload Pixel', 'dado no Brasil'],
          ['Site 2', 'se ilha 1 >50% / 90d'],
        ].map(([t, d], i) => (
          <div key={t} className={`rounded-xl p-4 ${i === 2 ? 'bg-neutral-900 text-white' : 'border border-black/[0.06] bg-[#fafaf8]'}`}>
            <p className="font-mono text-[10px] opacity-50">{String(i + 1).padStart(2, '0')}</p>
            <p className="mt-1 text-[13px] font-semibold">{t}</p>
            <p className={`mt-1 text-[11px] ${i === 2 ? 'text-white/55' : 'text-neutral-500'}`}>{d}</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function ScenarioBarsDiagram() {
  const bars = [
    { id: 'A', w: '42%', capex: SCENARIOS[0].capex, name: SCENARIOS[0].name },
    { id: 'B', w: '78%', capex: SCENARIOS[1].capex, name: SCENARIOS[1].name },
    { id: 'C', w: '100%', capex: '>> piloto', name: SCENARIOS[2].name },
  ]
  return (
    <Frame title="CapEx relativo dos três cenários" caption="Híbrido é o único que entra no piloto. AI-first estoura a tese de R$ 17M.">
      <div className="space-y-3">
        {bars.map(bar => (
          <div key={bar.id}>
            <div className="mb-1 flex justify-between text-[11px] text-neutral-500">
              <span>{bar.id} · {bar.name}</span>
              <span className="font-medium text-neutral-800">{bar.capex}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className={`h-full rounded-full ${bar.id === 'B' ? 'bg-neutral-900' : 'bg-neutral-400'}`}
                style={{ width: bar.w }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-neutral-400">
        Pista {HARDWARE_TRACKS[0].name}: {HARDWARE_TRACKS[0].capex}
      </p>
    </Frame>
  )
}

export function CopyRoleDiagram() {
  return (
    <Frame
      title="O que copiar — e o que não copiar"
      caption="Papel, não escala. Sem moat de preço de H100 contra a AWS São Paulo."
    >
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { t: 'Copiar o híbrido', d: 'Equinix + NVIDIA · Scala', x: 'Colo + AI-ready' },
          { t: 'Copiar o SKU', d: 'CoreWeave · Lambda', x: 'Instância, não o capex' },
          { t: 'Copiar a fatura', d: 'Fireworks · Groq', x: 'Token / agente' },
        ].map(card => (
          <div key={card.t} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">{card.d}</p>
            <p className="mt-2 text-[13px] font-semibold text-neutral-900">{card.t}</p>
            <p className="mt-1 text-[12px] text-neutral-500">{card.x}</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function TwoSitesDiagram() {
  return (
    <Frame title="Dois sites, uma âncora" caption="Jundiaí (indústria/e-commerce) e Santos (porto). 20+20 racks. Eletronet 6+6.">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { city: 'Jundiaí', role: 'Polo industrial e e-commerce', extra: 'Ilha GPU no site 1' },
          { city: 'Santos', role: 'Corredor portuário', extra: 'Replica depois da utilização' },
        ].map(site => (
          <div key={site.city} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
            <p className="text-[15px] font-semibold text-neutral-900">{site.city}</p>
            <p className="mt-1 text-[12px] text-neutral-500">{site.role}</p>
            <p className="mt-3 text-[11px] text-neutral-400">20 racks · 6 Eletronet</p>
            <p className="mt-1 text-[12px] font-medium text-neutral-800">{site.extra}</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}
